import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { cx } from 'react-emotion';
import Button from '@academysports/fusion-components/dist/Button';
import { get } from '@react-nitro/error-boundary';
import { Overlay, Container, Common, ModalStyles, BtnAdjustWidth, ModalCloseRow, ViewCartCTA } from './styles';
import { getLinkAsButtonStyleForModal } from '../../apps/productDetailsGeneric/emo/linkAsButton';
import ErrorModal from './ErrorModal';
import { QUANTITY_LABEL, VIEW_CART, CHECKOUT, CONTINUE_SHOPPING, SELECTED_OPTIONS, SHOW_FUMBLED, COLON } from './constants';
import { BAIT_ADD_TO_CART_PRESET } from '../../utils/dynamicMediaUtils';
import { initiateCheckout, initiateTaxService } from './../../utils/productDetailsUtils';
import { setCheckoutCookie } from '../../utils/helpers';
import { ITEM_NOT_AVAILABLE, ERR_KEY_MISSING } from '../../utils/constants';
import { MAP_EXTRA_MESSAGE, MAP_VIEW_CART_LINK, MAP_MESSAGE } from '../productActionItems/constants';

const linkAsButtonPrimaryStyle = getLinkAsButtonStyleForModal({ btntype: 'primary', isLink: true });
const linkAsButtonSecondaryStyle = getLinkAsButtonStyleForModal({ btntype: 'secondary', isLink: true });

class ModalContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkoutErrMsg: ''
    };
    this.onClickCheckout = this.onClickCheckout.bind(this);
    this.onClickViewCart = this.onClickViewCart.bind(this);
    this.redirectToCart = this.redirectToCart.bind(this);
  }

  /**
   * Method will redirect on click of checkout CTA
   */
  onClickCheckout() {
    this.showAnalytics('checkout');
    const { labels, atcResponse, authMsgs } = this.props;
    const { orderId = [] } = atcResponse;
    const id = orderId.length && orderId[0];
    setCheckoutCookie(id);
    initiateCheckout(labels.checkoutURL, id).then(
      res => {
        window.location.href = res.redirectUrl;
      },
      res => {
        const errorKey = get(res, 'data.errors[0].errorKey', ERR_KEY_MISSING);
        this.setState({ checkoutErrMsg: authMsgs[errorKey] || ITEM_NOT_AVAILABLE });
      }
    );
  }

  /**
   * Initiate tax service before redirecting to cart page
   * @param {string} orderId OrderId
   */
  onClickViewCart() {
    this.showAnalytics('view cart');
    const { atcResponse: { orderId } = [] } = this.props || {};
    const id = orderId.length && orderId[0];
    // We should not stop user, so for negative fallback also we are redirecting to cart page. Requirement.
    initiateTaxService(id).then(this.redirectToCart, this.redirectToCart);
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
   * Function to update analytics
   */
  showAnalytics = eventName => {
    this.props.gtmDataLayer.push({
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'mini cart action',
      eventLabel: eventName,
      minicartimpressions: 0
    });
  };
  /**
   * Method to render error message from product level or root level
   */
  renderErrorMessage(product) {
    const { errorMessage } = this.props.atcResponse;
    const message = (product && product.ErrorMessage) || errorMessage;
    return message && <Common.Alert className="mb-1">{message}</Common.Alert>;
  }
  /**
   * Function to update rendered price
   */
  renderPrice = (product = {}) => {
    const { labels: lbl, cartURL } = this.props;
    if (product.priceInCart) {
      return (
        <div>
          <div className="o-copy__14reg">{lbl.MAP_EXTRA_MESSAGE || MAP_EXTRA_MESSAGE}</div>
          <a href={cartURL} className={ViewCartCTA} aria-label="go to cart page">
            <span className="o-copy__14reg">{lbl.MAP_VIEW_CART_LINK || MAP_VIEW_CART_LINK}</span>
          </a>
          <span className="o-copy__14reg"> {lbl.MAP_MESSAGE || MAP_MESSAGE}</span>
        </div>
      );
    }
    return (
      <Fragment>
        <small>$</small>
        {product.price && product.price.toString().split('.')[0]}
        <small>{product.price && product.price.toString().split('.')[1]}</small>
      </Fragment>
    );
  };

  render() {
    const { atcResponse, closeModal, auidModifier, labels = {}, modalIsOpen } = this.props;
    const { exceptionCode, items, itemCount, totalCartQuantity } = atcResponse;
    const { checkoutErrMsg } = this.state;

    return (
      <Modal isOpen={modalIsOpen} overlayClassName={Overlay.backdrop} onRequestClose={closeModal} className={Container.Content}>
        <ModalCloseRow>
          <ModalStyles.CloseModalClick data-auid={`ContinueShopping${auidModifier}`} onClick={this.props.closeModal}>
            <span className={`pt-quarter academyicon icon-chevron-left pr-quarter ${ModalStyles.ContinueShoppingIconStyle}`} />
            <span className="o-copy__14reg">{labels[CONTINUE_SHOPPING] || CONTINUE_SHOPPING}</span>
          </ModalStyles.CloseModalClick>
          <Overlay.CloseModal onClick={closeModal} role="button">
            <span className="academyicon icon-close" />
          </Overlay.CloseModal>
        </ModalCloseRow>
        {exceptionCode && exceptionCode === SHOW_FUMBLED && <ErrorModal {...atcResponse} />}
        {items && (
          <div className="container">
            <Fragment>
              <ModalStyles.TextAlign>
                <ModalStyles.H4 className="pt-md-2">
                  {`${labels.SELECTED_OPTIONS || SELECTED_OPTIONS} (${atcResponse && itemCount}) `}{' '}
                </ModalStyles.H4>
              </ModalStyles.TextAlign>
              {atcResponse &&
                items.map((product, index) => (
                  <div className="row">
                    {checkoutErrMsg && <Common.Alert className="mb-1">{checkoutErrMsg}</Common.Alert>}
                    {this.renderErrorMessage(product)}
                    <div className="col-3 col-md-2 text-right">
                      <img src={`${product.productImageURL}${BAIT_ADD_TO_CART_PRESET}`} alt={product.productName} />
                    </div>
                    <div className="col-9 col-md-10">
                      <ModalStyles.Name className="o-copy__14reg text-uppercase">{product && product.productName}</ModalStyles.Name>
                      {product.diff &&
                        product.diff.map(
                          d =>
                            d.key !== 'size' && (
                              <ModalStyles.Attributes>
                                <span className="o-copy__12bold">{d.key}</span>
                                {labels.COLON || COLON}
                                <span className="pl-half o-copy__12reg">{d.value}</span>
                              </ModalStyles.Attributes>
                            )
                        )}
                      <ModalStyles.Attributes>
                        <span className="o-copy__12bold pr-half">{labels.QUANTITY_LABEL || QUANTITY_LABEL}</span>
                        <span className="o-copy__12reg">{Math.floor(product.addedItemQty)} </span>
                      </ModalStyles.Attributes>
                      <ModalStyles.Price>{this.renderPrice(product)}</ModalStyles.Price>
                    </div>
                    {index !== items.length - 1 ? (
                      <div className="col-12 pb-2 pt-2">
                        <ModalStyles.Divider />
                      </div>
                    ) : null}
                  </div>
                ))}
              <ModalStyles.Row className="col-12 pb-1 pt-2 text-center">
                <Button className={cx(linkAsButtonSecondaryStyle, BtnAdjustWidth)} auid={`viewCart${auidModifier}`} onClick={this.onClickViewCart}>
                  {labels.VIEW_CART || VIEW_CART} ({parseInt(totalCartQuantity, 10)})
                </Button>
              </ModalStyles.Row>
              <ModalStyles.Row className="col-12 pb-1 text-center">
                <Button className={cx(linkAsButtonPrimaryStyle, BtnAdjustWidth)} auid={`checkout${auidModifier}`} onClick={this.onClickCheckout}>
                  {labels.CHECKOUT || CHECKOUT}
                </Button>
              </ModalStyles.Row>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div id="addToCartRecommendations" />
                </div>
              </div>
            </Fragment>
          </div>
        )}
      </Modal>
    );
  }
}

ModalContent.propTypes = {
  atcResponse: PropTypes.object,
  closeModal: PropTypes.func,
  auidModifier: PropTypes.string,
  itemCount: PropTypes.number,
  modalIsOpen: PropTypes.bool,
  cartURL: PropTypes.string,
  checkoutURL: PropTypes.string,
  labels: PropTypes.object,
  itemTotalQty: PropTypes.number,
  authMsgs: PropTypes.object,
  gtmDataLayer: PropTypes.array
};

export default ModalContent;
