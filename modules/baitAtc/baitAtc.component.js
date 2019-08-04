import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Button from '@academysports/fusion-components/dist/Button';
import axios from 'axios';
import { get } from '@react-nitro/error-boundary';
import { isMobile } from '../../utils/navigator';
import Modal from './ModalContent';
import { addToCartHolder, flexItem, widthAdjust, bodyOverrides } from './styles';
import { ADD_SELECTIONS_TO_CART, ADD_TO_CART, ITEMS, YOU_HAVE_SELECTED, SUBTOTAL, CREATE_PASSWORD_URL } from './constants';
import * as actions from './actions';
import { initializeEvergageRecommendations } from '../../utils/productDetailsUtils';
import { cartURL } from '../../environments/environment';
import { printBreadCrumbAndName } from '../../utils/breadCrumb';
import { hasItemsInCart } from '../../utils/UserSession';
import { createEnhancedAnalyticsProductItem } from '../../utils/analytics';
import { naFallback } from '../../utils/analytics/generic';
import StorageManager from '../../utils/StorageManager';

class BaitAtc extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      hasItemsInCart: hasItemsInCart(),
      modalIsOpen: false,
      exceptionOccured: false,
      cartURL: '/cart',
      checkoutURL: '/checkout',
      itemCount: 0,
      itemTotalQty: 0
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createOnClickAddToCart = this.createOnClickAddToCart.bind(this);
    this.processATCResponse = this.processATCResponse.bind(this);
    this.updateAnalytics = this.updateAnalytics.bind(this);
    this.onClickAddToCartErrorLogGA = this.onClickAddToCartErrorLogGA.bind(this);
    this.updateAnalyticsEnhanced = this.updateAnalyticsEnhanced.bind(this);
    this.mutlipleBaitEnhancedAnalytics = this.mutlipleBaitEnhancedAnalytics.bind(this);
    this.addBodyOverrides();
  }
  /* Add To cart Analytics new implementation error message */
  onClickAddToCartErrorLogGA(errorMessage) {
    this.updateAnalytics({
      event: 'errormessage',
      eventCategory: 'error message',
      eventAction: `cart modal error|${this.props.productItem.name}`,
      eventLabel: errorMessage
    });
  }
  /* Set the auid for desktop and mobile */
  setAuid = () => (isMobile() ? '_m' : '');
  /**
   * Method to add overrides to body on mobile screen.
   * This is to avoid footer links being hidden by Add to Cart
   */
  addBodyOverrides = () => {
    if (ExecutionEnvironment.canUseDOM) {
      document.body.classList.add(bodyOverrides);
    }
  };

  /* Add To cart Analytics new implementation error message  ended */
  updateAnalytics(analytics = {}) {
    const { productItem: product } = this.props;
    const breadCrumbData = product.breadCrumb || '';
    const defaultAnalytics = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventLabel: printBreadCrumbAndName(breadCrumbData, product.name, { printEmptyValues: false }).toLowerCase()
    };
    this.props.gtmDataLayer.push({
      ...defaultAnalytics,
      ...analytics
    });
  }
  mutlipleBaitEnhancedAnalytics() {
    const { atcResponse } = this.state;
    const { items = [] } = atcResponse;
    const { productItem, gtmDataLayer } = this.props;
    const isFirstProduct = !this.state.hasItemsInCart && hasItemsInCart();
    if (items.length) {
      for (let i = 0; i < items.length; i += 1) {
        const product = {
          ...productItem,
          skuId: items[i].skuId,
          itemId: items[i].itemId,
          defaultSku: items[i].skuId
        };
        const analyticsProductItem = createEnhancedAnalyticsProductItem(product);
        gtmDataLayer.push({
          event: 'shoppingcart',
          eventCategory: 'shopping cart',
          eventAction: 'add to cart',
          eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name, { printEmptyValues: false }).toLowerCase(),
          ecommerce: {
            currencyCode: 'US',
            add: {
              products: [
                {
                  name: analyticsProductItem.name,
                  id: analyticsProductItem.parentSku,
                  price: items[i].price,
                  brand: analyticsProductItem.brand,
                  category: analyticsProductItem.category,
                  variant: analyticsProductItem.childSku,
                  quantity: parseInt(items[i].addedItemQty, 10),
                  dimension4: analyticsProductItem.isAvailableInStore,
                  dimension5: naFallback(atcResponse.orderId[0]),
                  dimension25: analyticsProductItem.promoText,
                  dimension29: analyticsProductItem.productFindingMethod,
                  dimension72: analyticsProductItem.childSku,
                  dimension74: analyticsProductItem.parentSkuProductName,
                  dimension68: items[i].diff[0] && items[i].diff[0].value && items[i].diff[0].value.toLowerCase(),
                  dimension70: analyticsProductItem.team,
                  dimension77: analyticsProductItem.isSpecialOrder,
                  metric22: analyticsProductItem.salePrice,
                  metric46: isFirstProduct ? '1' : '0'
                }
              ]
            }
          },
          dimension76: analyticsProductItem.isSpecialOrder,
          dimension24: analyticsProductItem.promoText,
          dimension28: analyticsProductItem.productFindingMethod,
          metric21: analyticsProductItem.salePrice,
          metric45: isFirstProduct ? '1' : '0'
        });
      }
    }
  }
  updateAnalyticsEnhanced() {
    try {
      const { atcResponse } = this.state;
      if (!atcResponse || !atcResponse.orderId) return false;
      const isFirstProduct = !this.state.hasItemsInCart && hasItemsInCart();
      if (isFirstProduct) {
        this.setState({ hasItemsInCart: hasItemsInCart() });
      }
      return this.mutlipleBaitEnhancedAnalytics();
    } catch (e) {
      return null;
    }
  }

  createOnClickAddToCart() {
    const passwordExpired = StorageManager.getCookie('PASSWORD_EXPIRED_FLAG');
    const pQty = [];
    const { itemDetails } = this.props;
    const itemLength = itemDetails.length;
    if (passwordExpired) {
      window.location.href = CREATE_PASSWORD_URL;
    } else if (itemLength > 0) {
      itemDetails.forEach(i => {
        const { totalQty, skuId } = i;
        if (totalQty > 0) {
          pQty.push({
            id: skuId,
            quantity: totalQty,
            type: 'REGULAR'
          });
        }
      });
      const postData = {
        skus: pQty,
        giftAmout: '',
        inventoryCheck: true
      };
      if (pQty.length > 1) {
        postData.isMultiSku = true;
      }
      axios
        .post(`${cartURL}`, postData)
        .then(this.processATCResponse)
        .catch(() => {
          this.openModal();
        });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true, atcResponse: { exceptionCode: 'SHOW_FUMBLED' } });
  }
  processATCResponse(response) {
    if (response.status === 200) {
      const obj = {
        quantity: {
          totalCartQuantity: response.data && response.data.addToCart && response.data.addToCart.totalCartQuantity
        }
      };
      const orderId = get(response, 'data.addToCart.orderId[0]', '000000');
      this.props.fnFetchMiniCartSuccess({ ...obj, orderId });
      const { data } = response;
      if (Object.prototype.hasOwnProperty.call(data, 'addToCart')) {
        const { errorMessage, exceptionMessage, cartURL: cartUrl, checkoutURL, message, totalCartQuantity, totalQuantityAdded } = data.addToCart;
        this.setState(
          {
            atcResponse: data.addToCart,
            modalIsOpen: true,
            exceptionOccured: exceptionMessage,
            cartURL: cartUrl,
            checkoutURL,
            itemCount: totalCartQuantity,
            itemTotalQty: totalQuantityAdded ? parseInt(totalQuantityAdded, 10) : 0
          },
          () => {
            // update analytics for view mini cart event
            this.updateAnalytics({ eventAction: 'view mini cart', minicartimpressions: 1 });
            // call enhanced  analytics
            this.updateAnalyticsEnhanced();
          }
        );
        if (errorMessage) {
          this.onClickAddToCartErrorLogGA(errorMessage);
        }
        this.props.handleResetFields(message && !exceptionMessage);
      }
      initializeEvergageRecommendations();
    }
  }
  closeModal() {
    this.setState({ modalIsOpen: false }, () => {
      this.updateAnalytics({ eventAction: 'mini cart action', eventLabel: 'close modal', minicartimpressions: 0 });
    });
  }
  render() {
    const { atcResponse, itemCount, itemTotalQty, exceptionOccured, modalIsOpen } = this.state;
    const { resetFields, authMsgs } = this.props;
    const auidModifier = this.setAuid();
    let isDisabled = false;
    const baitvariant = this.props.itemDetails;
    let baitDetails = null;
    let qty = 0;
    let totalPrice = 0;
    if (baitvariant !== undefined) {
      baitDetails = baitvariant;
      baitDetails.forEach(ele => {
        if (ele.totalQty) {
          qty += ele.totalQty;
          totalPrice += ele.totalPrice;
        }
      });
      isDisabled = qty > 0;
    }
    // reset quantity and totalPrice for successful case
    if (resetFields) {
      qty = 0;
      totalPrice = 0;
      isDisabled = false;
    }
    const { shouldSuppressSubTotal, labels, gtmDataLayer } = this.props;
    return (
      <div className={`${addToCartHolder} row px-1`}>
        {baitvariant && (
          <div className={`col-12 align-items-center ${flexItem}`}>
            <div className="d-flex justify-content-between pb-md-half">
              <span className="d-md-none o-copy__14bold">{ITEMS}</span>
              <span className="d-none d-md-block">{YOU_HAVE_SELECTED}</span>
              <span className="d-md-none">{`${qty || 0}`}</span>
              <span className="d-none d-md-block">{`${qty || 0} ${ITEMS}`}</span>
            </div>
            {!shouldSuppressSubTotal && (
              <div className="pb-md-2 d-flex justify-content-between">
                <span className="d-md-none o-copy__14bold">{SUBTOTAL}</span>
                <span className="d-none d-md-block">{SUBTOTAL}</span>
                <span>${(totalPrice && totalPrice.toFixed(2)) || 0}</span>
              </div>
            )}
          </div>
        )}
        <div className={`col-12 align-items-center px-0 px-sm-1 ${flexItem}`}>
          <Button disabled={!isDisabled} onClick={this.createOnClickAddToCart} className={`col-6 col-md-12 w-md-100 ${widthAdjust} ${flexItem}`}>
            <span className="d-lg-none">{ADD_TO_CART}</span>
            <span className="d-none d-lg-block">{ADD_SELECTIONS_TO_CART}</span>
          </Button>
        </div>
        {modalIsOpen ? (
          <Modal
            atcResponse={atcResponse}
            itemCount={itemCount}
            itemTotalQty={itemTotalQty}
            auidModifier={auidModifier}
            exceptionOccured={exceptionOccured}
            closeModal={this.closeModal}
            modalIsOpen={this.state.modalIsOpen}
            cartURL={this.state.cartURL}
            checkoutURL={this.state.checkoutURL}
            authMsgs={authMsgs}
            labels={labels}
            gtmDataLayer={gtmDataLayer}
          />
        ) : null}
      </div>
    );
  }
}

BaitAtc.propTypes = {
  itemDetails: PropTypes.array,
  labels: PropTypes.object,
  fnFetchMiniCartSuccess: PropTypes.func,
  shouldSuppressSubTotal: PropTypes.bool,
  handleResetFields: PropTypes.func,
  resetFields: PropTypes.bool,
  authMsgs: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  productItem: PropTypes.object
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const mapDispatchToProps = dispatch => ({
  fnFetchMiniCartSuccess: data => dispatch(actions.fetchMiniCartSuccess(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaitAtc);
