import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Anchor from '@academysports/fusion-components/dist/Anchor';
import Button from '@academysports/fusion-components/dist/Button';
import { get } from '@react-nitro/error-boundary';
import { isMobile } from '../../../../utils/navigator';
import { GREAT_GEAR_ADDED_TO_YOUR_CART, QUANTITY } from '../constants';
import { C, atc } from '../style';
import { getLinkAsButtonStyleForModal } from '../../../../apps/productDetailsGeneric/emo/linkAsButton';
import { Price, Img, Attributes } from './common';
import { initiateCheckout, initiateTaxService } from './../../../../utils/productDetailsUtils';
import { setCheckoutCookie } from '../../../../utils/helpers';
import { ITEM_NOT_AVAILABLE, ERR_KEY_MISSING } from '../../../../utils/constants';

const VIEW_CART = 'VIEW CART';
const CHECKOUT = 'CHECKOUT';
const CONTINUE_SHOPPING = 'Continue Shopping';

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
    this.onClickCheckout = this.onClickCheckout.bind(this);
    this.onClickContinueShopping = this.onClickContinueShopping.bind(this);
  }

  /**
   * Method to trigger on click of checkout CTA
   */
  onClickCheckout() {
    const { orderId, labels, authMsgs } = this.props;
    const orderNum = orderId[0] || '';
    setCheckoutCookie(orderNum);
    initiateCheckout(labels.checkoutURL, orderNum).then(
      res => {
        window.location.href = res.redirectUrl;
      },
      res => {
        const errorKey = get(res, 'data.errors[0].errorKey', ERR_KEY_MISSING);
        this.setState({ checkoutErrMsg: authMsgs[errorKey] || ITEM_NOT_AVAILABLE });
      }
    );
    this.updateAnalytics(CHECKOUT, 0);
  }

  /**
   * Initiate tax service before redirecting to cart page
   * @param {string} orderId OrderId
   */
  onClickViewCart() {
    const { orderId } = this.props;
    const orderNum = orderId[0] || '';
    // We should not stop user, so for negative fallback also we are redirecting to cart page. Requirement.
    initiateTaxService(orderNum).then(this.redirectToCart, this.redirectToCart);
  }

  /**
   * Method to redirect to back page
   * @param {object} e event
   * @param {string} seoURL
   * @param {string} ctaName
   */
  onClickContinueShopping(e, seoURL, ctaName) {
    e.preventDefault();
    this.updateAnalytics(ctaName, 0);
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = seoURL;
    }
  }

  /**
   * Method to redirect to Cart page
   */
  redirectToCart() {
    const { labels } = this.props;
    this.updateAnalytics(VIEW_CART, 1);
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = labels.cartURL;
    }
  }

  /**
   * Method to create attribute object
   * @param {objetct} diff
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

  updateAnalytics(ctaName, impression) {
    if (!this.props.gtmDataLayer) {
      return;
    }
    this.props.gtmDataLayer.push({
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'mini cart action',
      eventLabel: ctaName && ctaName.toLowerCase(),
      minicartimpressions: impression
    });
  }

  renderErrorMessages(errorMessage, exceptionMessage) {
    return errorMessage || exceptionMessage ? <atc.Alert>{errorMessage || exceptionMessage}</atc.Alert> : <section className={C.NoError} />;
  }

  render() {
    const { labels = {}, displayPrice, seoURL, totalQuantityAdded, totalCartQuantity, errorMessage, exceptionMessage, name, items } = this.props;
    const auidModifier = isMobile() ? '_m' : '';
    const { checkoutErrMsg } = this.state;

    // TODO - Clean up
    const itemCount = totalQuantityAdded ? parseInt(totalQuantityAdded, 10) : 0;
    const cartCount = totalCartQuantity ? parseInt(totalCartQuantity, 10) : 0;

    return (
      <Fragment>
        <C.Row className={`pl-1 ${C.overrideArrow} o-copy__14reg`}>
          <Anchor
            href={seoURL}
            atype="icontext"
            aria-label={CONTINUE_SHOPPING}
            onClick={e => this.onClickContinueShopping(e, seoURL, CONTINUE_SHOPPING)}
          >
            <span className="academyicon icon-chevron-left" />
            {labels[CONTINUE_SHOPPING] || CONTINUE_SHOPPING}
          </Anchor>
        </C.Row>
        {this.renderErrorMessages(errorMessage, exceptionMessage)}
        {checkoutErrMsg && <atc.Alert>{checkoutErrMsg}</atc.Alert>}
        <div className="container">
          <div>
            <h4 className={`col-12 ${C.Headline}`}>{labels.GREAT_GEAR_ADDED_TO_YOUR_CART || GREAT_GEAR_ADDED_TO_YOUR_CART}</h4>
          </div>
          <div className={`container ${C.containerWidth}`}>
            <div className="row">
              <C.Row className={`${C.responsiveButtons} col-12 text-center d-md-flex justify-content-center`}>
                <Button auid={`viewCart${auidModifier}`} className={cx(linkAsButtonSecondaryStyle, 'cart-btn')} onClick={this.onClickViewCart}>
                  {labels.VIEW_CART || VIEW_CART} ({cartCount})
                </Button>
                <Button auid={`checkout${auidModifier}`} className={linkAsButtonPrimaryStyle} onClick={this.onClickCheckout}>
                  {labels.CHECKOUT || CHECKOUT}
                </Button>
              </C.Row>
            </div>
            <div className={`container ${C.containerWidth}`}>
              <div className="row">
                <div className={`col-12 pt-1 pl-0 mt-1 ${C.nameStyle}`}>{name}</div>
                <div className="col-12 pt-1 p-md-0 d-flex justify-content-between">
                  <div className="mt-md-1">
                    <span className="o-copy__14bold">{labels.QUANTITY || QUANTITY}</span>
                    <span className="o-copy__14reg">{itemCount}</span>
                  </div>
                  <Price amount={displayPrice} />
                </div>
              </div>
              {items.map(item => (
                <div className="row pt-1">
                  <hr className={C.ruleWidth} />
                  <Img src={item.productImageURL} />
                  <div className="col-8 pl-1">
                    <C.Row className="pb-2">{item.productName}</C.Row>
                    <Attributes attrs={this.createAttributes(item.diff)} />
                  </div>
                </div>
              ))}
            </div>
            <C.Row>&#160;</C.Row>
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div id="addToCartRecommendations" />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

ModalContent.propTypes = {
  errorMessage: PropTypes.string,
  items: PropTypes.array,
  labels: PropTypes.object,
  name: PropTypes.string,
  totalQuantityAdded: PropTypes.string,
  totalCartQuantity: PropTypes.string,
  displayPrice: PropTypes.string,
  seoURL: PropTypes.string,
  orderId: PropTypes.array,
  authMsgs: PropTypes.array,
  gtmDataLayer: PropTypes.array,
  exceptionMessage: PropTypes.string
};

ModalContent.defaultProps = {
  errorMessage: ''
};

export default ModalContent;
