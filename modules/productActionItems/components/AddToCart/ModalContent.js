/* eslint complexity: 0 */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import { get } from '@react-nitro/error-boundary';
import { cx } from 'react-emotion';
import Button from '@academysports/fusion-components/dist/Button';
import { isMobile } from '../../../../utils/navigator';
import { initiateCheckout, initiateTaxService } from './../../../../utils/productDetailsUtils';
import { C } from '../styles';
import { getLinkAsButtonStyleForModal } from '../../../../apps/productDetailsGeneric/emo/linkAsButton';
import Price from '../../../productPrice/price';
import { Img, Attributes } from '../common';
import { ITEM_NOT_AVAILABLE, ERR_KEY_MISSING } from '../../../../utils/constants';

import {
  VIEW_CART,
  CHECKOUT,
  CONTINUE_SHOPPING,
  MAP_EXTRA_MESSAGE,
  MAP_MULTI_MESSAGE,
  MAP_VIEW_CART_LINK,
  MAP_MESSAGE,
  SINGLE_ITEM_ADDED,
  MULTIPLE_ITEMS_ADDED,
  KEY_PRICE_IN_CART
} from '../../constants';
import { setCheckoutCookie } from '../../../../utils/helpers';

const linkAsButtonPrimaryStyle = getLinkAsButtonStyleForModal({ btntype: 'primary', isLink: true });
const linkAsButtonSecondaryStyle = getLinkAsButtonStyleForModal({ btntype: 'secondary', isLink: true });

class ModalContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkoutErrMsg: ''
    };
    this.onClickViewCart = this.onClickViewCart.bind(this);
    this.redirectToCart = this.redirectToCart.bind(this);
  }

  /**
   * Initiate Checkout
   * @param {string} orderId Current OrderId
   */
  onClickCheckout(orderId) {
    const { labels, authMsgs } = this.props;
    initiateCheckout(labels.checkoutURL, orderId).then(
      res => {
        window.location.href = res.redirectUrl;
      },
      res => {
        const errorKey = get(res, 'data.errors[0].errorKey', ERR_KEY_MISSING);
        this.setState({ checkoutErrMsg: authMsgs[errorKey] || ITEM_NOT_AVAILABLE });
      }
    );
    setCheckoutCookie(orderId); // set checkout cookie
    this.showAnalytics('checkout');
  }

  /**
   * Initiate tax service before redirecting to cart page
   * @param {string} orderId OrderId
   */
  onClickViewCart(orderId) {
    // We should not stop user, so for negative fallback also we are redirecting to cart page. Requirement.
    initiateTaxService(orderId).then(this.onClickViewCartSuccess, this.onClickViewCartFail);
    this.showAnalytics('view cart');
  }

  onClickViewCartSuccess = response => {
    const { status } = response;
    if (status >= 200 && status < 300) {
      this.redirectToCart();
    } else {
      this.onClickViewCartFail(response);
    }
  };

  onClickViewCartFail = response => {
    if (response.status !== 401 && response.status !== 403) {
      this.redirectToCart(response);
    }
  };

  /**
   * Method to trigger on click of continue shopping link
   */
  onContinueShoppingClick() {
    this.showAnalytics('continue shopping');
    this.props.closeModal();
  }

  /**
   * Method will trigger on click of Enter
   * @param {object} e
   * @param {func} onClick
   */
  onEnterFireOnClick(e, onClick) {
    if (onClick && e.nativeEvent.keyCode === 13) {
      onClick();
    }
  }

  /**
   * Method to redirect to Cart page
   */
  redirectToCart() {
    const { labels } = this.props;
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = labels.cartURL;
    }
  }

  /**
   * Method to push object to analystics array
   * @param {string} eventName
   */
  showAnalytics(eventName) {
    this.props.gtmDataLayer.push({
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'mini cart action',
      eventLabel: eventName,
      minicartimpressions: 0
    });
  }

  /**
   * gets the list of error messages, giving higher preference to error message over expection message
   * @param
   * @returns {} undefined
   */
  renderMessages() {
    const { errorMessage, exceptionMessage } = this.props;
    return <Fragment>{this.renderErrorMessage(errorMessage || exceptionMessage)}</Fragment>;
  }

  /**
   * Method to render message coming from ATC response
   * @param {string} strMessage
   */
  renderErrorMessage(strMessage) {
    if (!strMessage) {
      return '';
    }
    return (
      <div className="container pb-1">
        <C.Alert dangerouslySetInnerHTML={{ __html: strMessage }} />
      </div>
    );
  }

  render() {
    const { checkoutErrMsg = '' } = this.state;
    const { priceMessage } = this.props.price || '';
    const { labels = {}, items = [], totalQuantityAdded, totalCartQuantity, displayPrice, isNoDiffBundle } = this.props;
    const auidModifier = isMobile() ? '_m' : '';
    let saveOrderId;
    if (this.props.orderId && !this.props.storedOrderId) {
      [saveOrderId] = this.props.orderId;
      this.props.persistOrderId(saveOrderId);
    } else {
      saveOrderId = this.props.storedOrderId;
    }
    const itemCount = totalQuantityAdded ? parseInt(totalQuantityAdded, 10) : 0;
    const cartCount = totalCartQuantity ? parseInt(totalCartQuantity, 10) : 0;
    const attributes = {};
    const message = itemCount === 1 ? labels.SINGLE_ITEM_ADDED || SINGLE_ITEM_ADDED : labels.MULTIPLE_ITEMS_ADDED || MULTIPLE_ITEMS_ADDED;

    const item = items[0] || {};
    if (item.diff) {
      // eslint-disable-next-line
      for (const i in item.diff) {
        attributes[item.diff[i].key] = item.diff[i].value;
      }
    }

    return (
      <Fragment>
        <Responsive minWidth={768}>
          <C.Row className="pl-half pt-1">
            <C.ContinueShopping
              tabIndex="0"
              data-auid={`ContinueShopping${auidModifier}`}
              className={C.AnchorColor}
              onClick={() => this.onContinueShoppingClick()}
            >
              <span className={`academyicon icon-chevron-left  pr-1 ${C.ContinueShoppingIconStyle}`} aria-label="Close" />
              <span className={cx(C.spanAsLink, 'pt-2 o-copy__14reg')}>{labels.CONTINUE_SHOPPING || CONTINUE_SHOPPING}</span>
            </C.ContinueShopping>
          </C.Row>
          {checkoutErrMsg && (
            <div className="container pb-1">
              <C.Alert dangerouslySetInnerHTML={{ __html: checkoutErrMsg }} />
            </div>
          )}
          {this.renderMessages()}
          {items &&
            items.length > 0 && (
              <div className="container">
                <div className="row">
                  <Img src={`${item.productImageURL}`} alt={item.productName} />
                  <div className="col-12 col-md-8 p-md-0">
                    <h5 className={C.Headline} aria-label={message || this.props.message}>{`${itemCount} ${message || this.props.message}`}</h5>
                    <C.Row className={`o-copy__20reg ${C.FontSize}`} aria-label={item.productName}>
                      {item.productName}
                    </C.Row>
                    <C.Row className="o-copy__14reg">
                      <Attributes attrs={attributes} />
                    </C.Row>
                    <C.Row>
                      {priceMessage && priceMessage === KEY_PRICE_IN_CART ? (
                        <div>
                          {items[0].addedItemQty && parseInt(items[0].addedItemQty, 10) === 1 ? (
                            <div className="o-copy__14reg">{labels.MAP_EXTRA_MESSAGE || MAP_EXTRA_MESSAGE}</div>
                          ) : (
                            <div className="o-copy__14reg">{labels.MAP_MULTI_MESSAGE || MAP_MULTI_MESSAGE}</div>
                          )}
                          <C.linkSpan
                            onClick={this.redirectToCart}
                            onKeyPress={e => this.onEnterFireOnClick(e, this.redirectToCart)}
                            role="link"
                            tabIndex="0"
                          >
                            <span className="o-copy__14reg">{labels.MAP_VIEW_CART_LINK || MAP_VIEW_CART_LINK}</span>
                          </C.linkSpan>{' '}
                          <span className="o-copy__14reg"> {labels.MAP_MESSAGE || MAP_MESSAGE}</span>
                        </div>
                      ) : (
                        <C.PriceStyle>
                          <Price price={isNoDiffBundle ? displayPrice : item.price} />
                        </C.PriceStyle>
                      )}
                    </C.Row>
                    <C.Row className={`col-12 px-0 ${C.responsiveButtons} d-flex`}>
                      <Button
                        aria-label={labels.VIEW_CART}
                        className={cx(linkAsButtonSecondaryStyle, 'mr-1', 'o-copy__14reg', C.viewCartStyle)}
                        auid={`viewCart${auidModifier}`}
                        onClick={() => this.onClickViewCart(saveOrderId)}
                      >
                        {labels.VIEW_CART || VIEW_CART} ({cartCount})
                      </Button>
                      <Button
                        aria-label={labels.CHECKOUT}
                        className={cx(linkAsButtonPrimaryStyle, 'o-copy__14reg', C.checkoutStyle)}
                        auid={`checkout${auidModifier}`}
                        onClick={() => this.onClickCheckout(saveOrderId)}
                      >
                        {labels.CHECKOUT || CHECKOUT}
                      </Button>
                    </C.Row>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div id="addToCartRecommendations" />
                  </div>
                </div>
              </div>
            )}
        </Responsive>
        <Responsive maxWidth={767}>
          <C.linkRow className="pt-half">
            <C.ContinueShopping
              data-auid={`ContinueShopping${auidModifier}`}
              className={C.AnchorColor}
              onClick={() => this.onContinueShoppingClick()}
            >
              <span className={`academyicon icon-chevron-left pr-half ${C.ContinueShoppingIconStyle}`} />
              <span className="o-copy__14reg">{labels.CONTINUE_SHOPPING || CONTINUE_SHOPPING}</span>
            </C.ContinueShopping>
          </C.linkRow>
          {checkoutErrMsg && (
            <div className="container pb-1">
              <C.Alert dangerouslySetInnerHTML={{ __html: checkoutErrMsg }} />
            </div>
          )}
          {this.renderMessages()}
          {items &&
            items.length > 0 && (
              <Fragment>
                <h5 className={`col-12 col-md-8 offset-md-4 p-0 ${C.Headline}`}>{`${itemCount} ${message || this.props.message}`}</h5>
                <div className="container">
                  <div className="row">
                    <C.Row className={`col-12 o-copy__20reg ${C.FontSize}`}>{item.productName}</C.Row>
                    <C.Row className="col-12">
                      {priceMessage && priceMessage === KEY_PRICE_IN_CART ? (
                        <div>
                          <div className="o-copy__14reg">{labels.MAP_EXTRA_MESSAGE || MAP_EXTRA_MESSAGE}</div>
                          <C.linkSpan
                            onClick={this.redirectToCart}
                            onKeyPress={e => this.onEnterFireOnClick(e, this.redirectToCart)}
                            role="link"
                            tabIndex="0"
                          >
                            <span className="o-copy__14reg">{labels.MAP_VIEW_CART_LINK || MAP_VIEW_CART_LINK}</span>
                          </C.linkSpan>{' '}
                          <span className="o-copy__14reg"> {labels.MAP_MESSAGE || MAP_MESSAGE}</span>
                        </div>
                      ) : (
                        <C.PriceStyle>
                          <Price price={isNoDiffBundle ? displayPrice : item.price} />
                        </C.PriceStyle>
                      )}
                    </C.Row>
                    <Img src={item.productImageURL} alt="productImage" />
                    <C.Row className="col-12 o-copy__14reg">
                      <Attributes attrs={attributes} />
                    </C.Row>
                    <C.Row className={`col-12 ${C.responsiveButtons}`}>
                      <Button
                        className={cx(linkAsButtonPrimaryStyle, 'o-copy__14reg')}
                        auid={`checkout${auidModifier}`}
                        onClick={() => this.onClickCheckout(saveOrderId)}
                      >
                        {labels.CHECKOUT || CHECKOUT}
                      </Button>
                      <Button
                        aria-label={labels.VIEW_CART}
                        className={linkAsButtonSecondaryStyle}
                        auid={`viewCart${auidModifier}`}
                        onClick={() => this.onClickViewCart(saveOrderId)}
                      >
                        {labels.VIEW_CART || VIEW_CART} ({cartCount})
                      </Button>
                    </C.Row>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div id="addToCartRecommendations" />
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
        </Responsive>
      </Fragment>
    );
  }
}

ModalContent.propTypes = {
  errorMessage: PropTypes.string,
  exceptionMessage: PropTypes.string,
  items: PropTypes.array,
  message: PropTypes.string,
  labels: PropTypes.object,
  totalQuantityAdded: PropTypes.number,
  totalCartQuantity: PropTypes.number,
  price: PropTypes.object,
  closeModal: PropTypes.func,
  displayPrice: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  isNoDiffBundle: PropTypes.bool,
  orderId: PropTypes.array,
  storedOrderId: PropTypes.number,
  persistOrderId: PropTypes.func,
  authMsgs: PropTypes.object
};

ModalContent.defaultProps = {
  errorMessage: '',
  message: ''
};

export default ModalContent;
