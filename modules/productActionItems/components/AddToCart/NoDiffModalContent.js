import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import { cx } from 'react-emotion';
import { get } from '@react-nitro/error-boundary';
import Button from '@academysports/fusion-components/dist/Button';
import { isMobile } from '../../../../utils/navigator';
import { C } from '../styles';
import { initiateCheckout, initiateTaxService } from './../../../../utils/productDetailsUtils';
import { getLinkAsButtonStyleForModal } from '../../../../apps/productDetailsGeneric/emo/linkAsButton';
// import { printBreadCrumb } from '../../../utils/breadCrumb';
import { Price, Img, Attributes } from '../common';
import {
  VIEW_CART,
  CHECKOUT,
  CONTINUE_SHOPPING,
  MAP_EXTRA_MESSAGE,
  MAP_VIEW_CART_LINK,
  MAP_MESSAGE,
  SINGLE_BUNDLE_ADDED,
  MULTIPLE_BUNDLE_ADDED,
  KEY_PRICE_IN_CART
} from '../../constants';
import { ADD_TO_CART_PRESET } from '../../../../utils/dynamicMediaUtils';
import { setCheckoutCookie } from '../../../../utils/helpers';
import { ITEM_NOT_AVAILABLE, ERR_KEY_MISSING } from '../../../../utils/constants';

const linkAsButtonPrimaryStyle = getLinkAsButtonStyleForModal({ btntype: 'primary', isLink: true });
const linkAsButtonSecondaryStyle = getLinkAsButtonStyleForModal({ btntype: 'secondary', isLink: true });

class ModalContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkoutErrorMsg: ''
    };
    this.redirectToCart = this.redirectToCart.bind(this);
    this.onContinueShoppingClick = this.onContinueShoppingClick.bind(this);
    this.onEnterFireOnClick = this.onEnterFireOnClick.bind(this);
    this.onClickCheckout = this.onClickCheckout.bind(this);
    this.onClickViewCart = this.onClickViewCart.bind(this);
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
   * Method to trigger the function call on enter
   * @param {object} e
   * @param {func} onClick
   */
  onEnterFireOnClick(e, onClick) {
    if (onClick && e.nativeEvent.keyCode === 13) {
      onClick();
    }
  }

  /**
   * Method to close modal on click of continue shopping
   * @param {object} e
   */
  onContinueShoppingClick(e) {
    this.showAnalytics('continue shopping');
    this.props.closeModal(e);
  }

  /**
   * Method to push analytics changes into array
   * @param {string} eventName
   */
  showAnalytics(eventName) {
    this.props.gtmDataLayer.push({
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'mini cart action',
      eventLabel: { eventName },
      minicartimpressions: 0
    });
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
   * Method to display list of attributes
   * @param {object} diff
   */
  createAttributes(diff) {
    const attributes = {};
    for (const i in diff) {
      if (attributes[diff[i].key] !== null) {
        attributes[diff[i].key] = diff[i].value;
      }
    }
    return attributes;
  }

  render() {
    const { labels = {}, items, price = {}, errorMessage, totalQuantityAdded, totalCartQuantity, displayPrice, orderId = [] } = this.props;
    const { checkoutErrMsg } = this.state;
    const { priceMessage = '' } = price;
    const saveOrderId = orderId.length > 0 ? orderId[0] : 0;
    const auidModifier = isMobile() ? '_m' : '';
    // TODO - Clean up
    const itemCount = totalQuantityAdded ? parseInt(totalQuantityAdded, 10) : 0;
    const cartCount = totalCartQuantity ? parseInt(totalCartQuantity, 10) : 0;
    const message = itemCount === 1 ? labels.SINGLE_BUNDLE_ADDED || SINGLE_BUNDLE_ADDED : labels.MULTIPLE_BUNDLE_ADDED || MULTIPLE_BUNDLE_ADDED;
    // const attributes = {};
    return (
      <Fragment>
        <Responsive minWidth={768}>
          <C.Row className="pl-half pt-1">
            <C.ContinueShopping
              data-auid={`ContinueShopping${auidModifier}`}
              className={C.AnchorColor}
              onClick={e => this.onContinueShoppingClick(e)}
            >
              <span className={`academyicon icon-chevron-left  pr-1 ${C.ContinueShoppingIconStyle}`} />
              <span className="pt-2 o-copy__14reg">{labels.CONTINUE_SHOPPING || CONTINUE_SHOPPING}</span>
            </C.ContinueShopping>
          </C.Row>
          {errorMessage !== '' ? <C.Alert>{errorMessage}</C.Alert> : <section className={C.NoError} />}
          {checkoutErrMsg && (
            <div className="container pb-1">
              <C.Alert dangerouslySetInnerHTML={{ __html: checkoutErrMsg }} />
            </div>
          )}
          <div className="container">
            <div className="row">
              <Img src={`${items[0].productImageURL}${ADD_TO_CART_PRESET}`} alt={items[0].productName} />
              <div className="col-12 col-md-8 p-md-0">
                <h5 className={C.Headline}>{`${itemCount} ${message || this.props.message}`}</h5>
                <C.Row className={`o-copy__20reg ${C.FontSize}`}>{items[0].productName}</C.Row>
                <C.Row className="o-copy__14reg">
                  {items.map(item => (
                    <Fragment>
                      <Attributes attrs={this.createAttributes(item.diff)} componentName={item.componentName} />
                    </Fragment>
                  ))}
                </C.Row>
                <C.Row>
                  {priceMessage === KEY_PRICE_IN_CART ? (
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
                    <Price amount={displayPrice} />
                  )}
                </C.Row>
                <C.Row className={`col-12 px-0 ${C.responsiveButtons} d-flex`}>
                  <Button
                    aria-label={labels.VIEW_CART}
                    className={cx(linkAsButtonSecondaryStyle, 'mr-1', 'o-copy__14reg')}
                    auid={`viewCart${auidModifier}`}
                    onClick={() => this.onClickViewCart(saveOrderId)}
                  >
                    {labels.VIEW_CART || VIEW_CART} ({cartCount})
                  </Button>
                  <Button
                    aria-label={labels.CHECKOUT}
                    className={cx(linkAsButtonPrimaryStyle, 'o-copy__14reg')}
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
        </Responsive>
        <Responsive maxWidth={767}>
          <C.Row className="pt-half col-6">
            <C.ContinueShopping
              data-auid={`ContinueShopping${auidModifier}`}
              className={C.AnchorColor}
              onClick={e => this.onContinueShoppingClick(e)}
            >
              <span className={`academyicon icon-chevron-left pr-half ${C.ContinueShoppingIconStyle}`} />
              <span className="o-copy__14reg">{labels.CONTINUE_SHOPPING || CONTINUE_SHOPPING}</span>
            </C.ContinueShopping>
          </C.Row>
          {errorMessage !== '' ? <C.Alert>{errorMessage}</C.Alert> : <section className={C.NoError} />}
          <h5 className={`col-12 col-md-8 offset-md-4 p-0 ${C.Headline}`}>{`${itemCount} ${message || this.props.message}`}</h5>
          <div className="container">
            <div className="row">
              <C.Row className={`col-12 o-copy__20reg ${C.FontSize}`}>{items[0].productName}</C.Row>
              <C.Row className="col-12">
                {priceMessage === KEY_PRICE_IN_CART ? (
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
                  <Price amount={displayPrice} />
                )}
              </C.Row>
              <Img src={items[0].productImageURL} alt="productImage" />
              <C.Row className="col-12 o-copy__14reg">
                {items.map(item => (
                  <Fragment>
                    <Attributes attrs={this.createAttributes(item.diff)} componentName={item.componentName} />
                  </Fragment>
                ))}
              </C.Row>
              <C.Row className={`col-12 ${C.responsiveButtons}`}>
                <Button
                  aria-label={labels.VIEW_CART}
                  className={cx(linkAsButtonSecondaryStyle, 'mr-1', 'o-copy__14reg')}
                  auid={`viewCart${auidModifier}`}
                  onClick={() => this.onClickViewCart(saveOrderId)}
                >
                  {labels.VIEW_CART || VIEW_CART} ({cartCount})
                </Button>
                <Button
                  aria-label={labels.CHECKOUT}
                  className={cx(linkAsButtonPrimaryStyle, 'o-copy__14reg')}
                  auid={`checkout${auidModifier}`}
                  onClick={() => this.onClickCheckout(saveOrderId)}
                >
                  {labels.CHECKOUT || CHECKOUT}
                </Button>
              </C.Row>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div id="addToCartRecommendations" />
              </div>
            </div>
          </div>
        </Responsive>
      </Fragment>
    );
  }
}

ModalContent.propTypes = {
  errorMessage: PropTypes.string,
  items: PropTypes.array,
  message: PropTypes.string,
  labels: PropTypes.object,
  totalQuantityAdded: PropTypes.number,
  totalCartQuantity: PropTypes.number,
  price: PropTypes.object,
  closeModal: PropTypes.func,
  displayPrice: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  authMsgs: PropTypes.object,
  orderId: PropTypes.array
};

ModalContent.defaultProps = {
  errorMessage: '',
  message: ''
};

export default ModalContent;
