// import { ordersAPI } from '@academysports/aso-env';
import Button from '@academysports/fusion-components/dist/Button';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { signOutURL } from '@academysports/aso-env';
import { fetchProfile } from '../../../../utils/buyNow/buyNow.api';
// import {
//   showBuyNowButton as utilsShowBuyNowButton,
//   showEnableBuyNowButton as utilsShowEnableBuyNowButton
// } from '../../../../utils/buyNow/buyNow.utils';
// import {getBopisStoreIdFromWindowLocation } from '../../../../utils/productDetailsUtils';
import { initializeEvergageRecommendations } from '../../../../utils/productDetailsUtils';
import { getProfileId, isLoggedIn, hasItemsInCart } from '../../../../utils/UserSession';
// import EnableBuyNow from '../../../enableBuyNow';
import * as actions from '../../../productActionItems/actions';
import { SKU_LABEL } from '../constants';
import { CREATE_PASSWORD_URL } from './../../constants';
import { atc, product, adjustButton, disabledStyle } from '../style';
// import ErrorBuyNow from './ErrorBuyNow';
import ErrorModal from './ErrorModal';
import ModalContent from './ModalContent';
import QuantityCounter from './QuantityCounter';
import { createEnhancedAnalyticsProductItem } from '../../../../utils/analytics';
import { naFallback } from '../../../../utils/analytics/generic';
import StorageManager from '../../../../utils/StorageManager';
class AddToCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      quantity: 1,
      modalIsOpen: false,
      exceptionOccured: false,
      hasItemsInCart: hasItemsInCart(),
      atcResponse: null
    };
    this.updateQuantity = this.updateQuantity.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.processATCResponse = this.processATCResponse.bind(this);
    // this.processBuyNowResponse = this.processBuyNowResponse.bind(this);
    // this.handleBuyNowResponseError = this.handleBuyNowResponseError.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.atcClickHandler = this.atcClickHandler.bind(this);

    // this.createBuyNowRequestObject = this.createBuyNowRequestObject.bind(this);
    // this.createOnClickBuyNow = this.createOnClickBuyNow.bind(this);

    // this.clearBuyNowErrorMessage = this.clearBuyNowErrorMessage.bind(this);

    // this.onEnableBuyNowClose = this.onEnableBuyNowClose.bind(this);
    // this.onFetchProfileSuccess = this.onFetchProfileSuccess.bind(this);
    // this.onFetchProfileFail = this.onFetchProfileFail.bind(this);

    // this.showEnableBuyNowButton = this.showEnableBuyNowButton.bind(this);
    // this.showBuyNowButton = this.showBuyNowButton.bind(this);
  }

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM && isLoggedIn() && getProfileId() && !this.state.profile) {
      fetchProfile(getProfileId(), this.onFetchProfileSuccess, this.onFetchProfileFail);
    }
  }

  componentDidUpdate() {
    /* eslint-disable */
    const { selectedSkus, expanded, products } = this.props;
    const { disabled } = this.state;
    const allSelected = Object.keys(selectedSkus).every(product => selectedSkus[product] !== null);
    const isNotEditMode = expanded === products[products.length - 1];
    if ((disabled && allSelected && isNotEditMode) || (!disabled && !allSelected) || (!disabled && !isNotEditMode)) {
      this.setState({
        disabled: !disabled
      });
    }
    /* eslint-enable */
  }

  /**
   * @description fetches latest profile data once enable buy now modal has closed.
   * @returns {undefined}
   */
  // onEnableBuyNowClose() {
  //   if (ExecutionEnvironment.canUseDOM && isLoggedIn() && getProfileId()) {
  //     fetchProfile(getProfileId(), this.onFetchProfileSuccess, this.onFetchProfileFail);
  //   }
  // }

  /**
   * @description Sets state.profile upon successful fetchProfile request
   * @param  {Object} response
   * @returns {undefined}
   */
  // onFetchProfileSuccess(response = {}) {
  //   const { status, data } = response;
  //   if (status >= 200 && status < 300 && data) {
  //     const { profile } = data;
  //     this.setState({ profile });
  //   } else {
  //     this.onFetchProfileFail();
  //   }
  // }

  /**
   * @description A placeholder function to be execute upon failed fetchProfile request
   * @param  {Object} response
   * @returns {undefined}
   */
  // onFetchProfileFail() {
  //   // response
  //   // do nothing for now
  // }

  /**
   * @description getter which pulls storeId from props.storeInfo
   * @returns {string} selected store id.
   */
  getStoreId() {
    const { myStoreDetails } = this.props;
    return !myStoreDetails ? null : myStoreDetails.storeId;
  }

  updateQuantity(qty) {
    this.setState({
      quantity: qty
    });
  }

  addToCart() {
    const { selectedSkus, products } = this.props;
    const skuItems = products.map(sku => ({
      id: selectedSkus[sku].skuId,
      quantity: this.state.quantity,
      type: 'REGULAR'
    }));
    const requestObj = {
      skus: skuItems,
      giftAmout: null,
      inventoryCheck: true,
      isBundle: true,
      isGCItem: false,
      bundleId: this.props.bundleId
    };
    this.setState({ buyNowErrorMessage: undefined });
    axios
      .post('/api/cart/sku', requestObj, {
        validateStatus: status => {
          if (status === 503 && ExecutionEnvironment.canUseDOM) {
            window.location = `${signOutURL}`;
          } else if (status !== 200) {
            return this.constructErrorScenario();
          }
          return true;
        }
      })
      .then(this.processATCResponse)
      .catch(() => {
        this.constructErrorScenario();
      });
  }

  constructErrorScenario() {
    this.setState({
      exceptionOccured: true,
      modalIsOpen: true,
      atcResponse: { exceptionCode: 'SHOW_FUMBLED' }
    });
  }
  processATCResponse(response) {
    if (response.status === 200) {
      const { data } = response;
      if (Object.prototype.hasOwnProperty.call(data, 'addToCart')) {
        const { exceptionMessage } = data.addToCart;

        if (Object.prototype.hasOwnProperty.call(data.addToCart, 'totalCartQuantity')) {
          this.props.fnFetchMiniCartSuccess({
            quantity: {
              totalCartQuantity: data.addToCart.totalCartQuantity
            }
          });
        }
        this.setState(
          {
            atcResponse: data.addToCart,
            modalIsOpen: true,
            exceptionOccured: exceptionMessage && exceptionMessage !== ''
          },
          () => {
            this.updateAnalytics({ eventAction: 'add to cart' });
            this.enhancedAnalyticsATC();
          }
        );
      }
      initializeEvergageRecommendations();
    }
  }
  updateAnalytics(analytics = {}) {
    const { gtmDataLayer, bundleClickLabel } = this.props;
    const defaultAnalytics = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventLabel: bundleClickLabel && bundleClickLabel.toLowerCase()
    };
    gtmDataLayer.push({
      ...defaultAnalytics,
      ...analytics
    });
  }
  enhancedAnalyticsATC() {
    try {
      const { atcResponse } = this.state;
      const { productinfo, gtmDataLayer, bundleClickLabel } = this.props;
      if (!atcResponse || !atcResponse.orderId || !gtmDataLayer) return false;
      const analyticsProductItem = createEnhancedAnalyticsProductItem(productinfo);
      const isFirstProduct = !this.state.hasItemsInCart && hasItemsInCart();
      if (isFirstProduct) {
        this.setState({ hasItemsInCart: hasItemsInCart() });
      }
      return gtmDataLayer.push({
        event: 'shoppingcart',
        eventCategory: 'shopping cart',
        eventAction: 'add to cart',
        eventLabel: (bundleClickLabel || 'n/a').toLowerCase(),
        ecommerce: {
          currencyCode: 'USD',
          add: {
            products: [
              {
                name: analyticsProductItem.name,
                id: analyticsProductItem.parentSku,
                price: analyticsProductItem.salePrice,
                brand: analyticsProductItem.brand,
                category: analyticsProductItem.category,
                variant: analyticsProductItem.childSku,
                quantity: naFallback(atcResponse.totalQuantityAdded),
                dimension4: analyticsProductItem.isAvailableInStore,
                dimension5: naFallback(atcResponse.orderId[0]),
                dimension25: analyticsProductItem.promoText,
                dimension29: analyticsProductItem.productFindingMethod,
                dimension72: analyticsProductItem.childSku,
                dimension74: analyticsProductItem.parentSkuProductName,
                dimension68: analyticsProductItem.color,
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
    } catch (e) {
      return null;
    }
  }

  /**
   * @description method to be executed upon successful ajax request for "BUY NOW".
   * @param  {Object} response - object returned from ajax request "BUY NOW"
   * @returns {undefined}
   */
  // processBuyNowResponse(response = {}) {
  //   if (ExecutionEnvironment.canUseDOM) {
  //     if (response.status === 503) {
  //       window.location = '/shop/Logoff?debug=aso&rememberMe=true';
  //     }

  //     if (response.status >= 200 && response.status < 300) {
  //       const { buyNow } = response.data || {};
  //       const { orderId } = buyNow || {};
  //       if (orderId) {
  //         window.location = `/shop/OrderConfirmation?orderId=${orderId}`;
  //       }
  //     }

  //     this.handleBuyNowResponseError(response);
  //   }
  // }

  /**
   * @description method to be executed upon failed ajax request for "BUY NOW".
   * @param  {Object} response - object returned from ajax request "BUY NOW"
   * @returns {undefined}
   */
  // handleBuyNowResponseError(response) {
  //   if (response.data && response.data.errors) {
  //     const { errorMessage } = response.data.errors[0]; // , errorCode, errorKey
  //     this.setState({ buyNowErrorMessage: errorMessage });
  //   }
  // }

  /**
   * @description determines if "Enable Buy Now" button should be shown
   * @returns {boolean} True if "Enable Buy Now" button should be shown, else it returns false
   */
  // showEnableBuyNowButton() {
  //   const { item } = this.props;
  //   const { profile } = this.state;

  //   return utilsShowEnableBuyNowButton(item, profile);
  // }

  /**
   * @description determines if "Buy Now" button should be shown
   * @returns {boolean} True if "Buy Now" button should be shown, else it returns false
   */
  // showBuyNowButton() {
  //   const { item } = this.props;
  //   const { profile } = this.state;

  //   return utilsShowBuyNowButton(item, profile);
  // }

  /**
   * @description clears Buy Now Error Message from state
   * @returns {undefined}
   */
  // clearBuyNowErrorMessage() {
  //   this.setState({ buyNowErrorMessage: undefined });
  // }

  /**
   * @description Creates the function for BUY NOW product.
   * @param  {function} onClickLogGA - analytics method to be executed when user clicks BUY NOW.
   * @returns  {undefined}
   */
  // createOnClickBuyNow(onClickLogGA = () => null) {
  //   const requestObj = this.createBuyNowRequestObject();
  //   return () => {
  //     this.setState({ buyNowErrorMessage: undefined });
  //     onClickLogGA();
  //     axios
  //       .post(ordersAPI, requestObj)
  //       .then(this.processBuyNowResponse)
  //       .catch(response => {
  //         this.handleBuyNowResponseError(response);
  //       });
  //   };
  // }

  /**
   * @description creates the request object to be used for ajax calls "add to cart" and "buy now".
   * @returns {Object} the request object to be used for ajax calls "add to cart" and "buy now".
   */
  // createBuyNowRequestObject() {
  //   const { products, bundleId, selectedSkus } = this.props;
  //   const { quantity } = this.state;
  //   const skuItems = products.map(productId => ({
  //     id: selectedSkus[productId] && selectedSkus[productId].skuId, // check to prevent breakage in case selectedSku for given id is undefined.
  //     quantity,
  //     type: 'REGULAR'
  //   }));

  //   const requestObj = {
  //     skus: skuItems,
  //     isBundle: true,
  //     bundleId,
  //     giftAmout: null,
  //     inventoryCheck: true,
  //     calculationUsages: [-1],
  //     isGCItem: false,
  //     isItemDetails: false
  //   };

  //   const bopisStoreId = getBopisStoreIdFromWindowLocation();
  //   if (bopisStoreId) {
  //     requestObj.isPickUpInStore = true;
  //     requestObj.selectedStoreId = bopisStoreId;
  //   }

  //   return requestObj;
  // }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
    this.updateAnalytics({ eventAction: 'mini cart action', eventLabel: 'close modal', minicartimpressions: 0 });
  }

  atcClickHandler() {
    const passwordExpired = StorageManager.getCookie('PASSWORD_EXPIRED_FLAG');
    if (this.state.disabled) {
      if (this.props.dref.current && ExecutionEnvironment.canUseDOM) {
        window.scrollTo(0, this.props.dref.current.offsetTop);
      }
    } else if (passwordExpired) {
      window.location.href = CREATE_PASSWORD_URL;
    } else {
      this.addToCart();
    }
  }

  /**
   * @description helper method which renders EnableBuyNow button
   * @returns {JSX} the rendered EnableBuyNow button
   */
  // renderEnableBuyNowButton() {
  //   const { profile, disabled } = this.state;
  //   return (
  //     this.showEnableBuyNowButton() && (
  //       <EnableBuyNow
  //         auid="btnEnableBuyNow"
  //         className={adjustButton}
  //         profile={profile}
  //         onRequestClose={this.onEnableBuyNowClose}
  //         handleBuyNowResponseError={this.handleBuyNowResponseError}
  //         disabled={disabled}
  //         createAddToCartRequestObject={this.createBuyNowRequestObject}
  //       />
  //     )
  //   );
  // }

  /**
   * @description helper method which renders BuyNow button
   * @returns {JSX} the rendered BuyNow button
   */
  // renderBuyNowButton() {
  //   const { disabled } = this.state;
  //   return (
  //     this.showBuyNowButton() && (
  //       <Button disabled={disabled} className={adjustButton} btntype="primary" onClick={this.createOnClickBuyNow()}>
  //         Buy Now
  //       </Button>
  //     )
  //   );
  // }

  /**
   * @description helper method which renders AddToCart button
   * @returns {JSX} the rendered BuyNow button
   */
  renderAddToCartButton() {
    const { disabled } = this.state;
    const buttonVariant = 'primary';
    // const buttonVariant = this.showBuyNowButton() ? 'secondary' : 'primary';
    return (
      <Button onClick={this.atcClickHandler} className={`${adjustButton} ${disabled && disabledStyle}`} auid="add-to-cart" btntype={buttonVariant}>
        ADD TO CART
      </Button>
    );
  }

  render() {
    return (
      <div className="container pdx-16">
        <div className="row py-1">
          <div className="col-12">
            <strong className="o-copy__14bold mr-half" data-auid={`sku_${this.props.id}`}>
              {SKU_LABEL}
            </strong>
            <span className="o-copy__14reg pr-3">{this.props.id}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className={`${atc.hr} mb-2`}>&#160;</div>
          </div>
        </div>

        {/* {!this.showBuyNowButton() &&
          !this.showEnableBuyNowButton() && ( */}
        <Fragment>
          <div className="row mb-half">
            <div className="quantity-lbl col-lg-1 offset-5 o-copy__14bold">Quantity:</div>
          </div>

          <div className="row">
            <div className={`col-lg-4 o-copy__14light ${product.showDesktop}`}>{this.props.shippingMessage}</div>
            <div className="col-lg-1" />
            <div className="col-lg-3">
              <QuantityCounter
                {...this.state}
                updateQuantity={this.updateQuantity}
                gtmDataLayer={this.props.gtmDataLayer}
                bundleClickLabel={this.props.bundleClickLabel}
              />
            </div>
            <div className="col-lg-4 add-to-cart-btn-container">{this.renderAddToCartButton()}</div>
          </div>
        </Fragment>
        {/* )} */}

        {/* {(this.showEnableBuyNowButton() || this.showBuyNowButton()) && (
          <Fragment>
            <div className="row mb-half">
              <div className="quantity-lbl col-lg-1 offset-4 o-copy__14bold">Quantity:</div>
            </div>

            <div className="row">
              <div className={`col-lg-4 o-copy__14light ${product.showDesktop}`}>{this.props.shippingMessage}</div>
              <div className="col-lg-4">
                <QuantityCounter
                  {...this.state}
                  updateQuantity={this.updateQuantity}
                  gtmDataLayer={this.props.gtmDataLayer}
                  bundleClickLabel={this.props.bundleClickLabel}
                />
              </div>
            </div>

            <div className="row mt-2">
              {!!this.state.buyNowErrorMessage && (
                <div className="col-lg-8 offset-4">
                  <ErrorBuyNow className="mb-2" message={this.state.buyNowErrorMessage} onRequestClose={this.clearBuyNowErrorMessage} />
                </div>
              )}

              {this.showEnableBuyNowButton() && (
                <Fragment>
                  <div className="col-lg-4 offset-md-4 mb-1 mb-md-none">{this.renderEnableBuyNowButton()}</div>
                  <div className="col-lg-4">{this.renderAddToCartButton()}</div>
                </Fragment>
              )}

              {this.showBuyNowButton() && (
                <Fragment>
                  <div className="col-lg-4 offset-md-4 mb-1 mb-md-none">{this.renderAddToCartButton()}</div>
                  <div className="col-lg-4">{this.renderBuyNowButton()}</div>
                </Fragment>
              )}
            </div>
          </Fragment>
        )} */}

        <div className={`row ${product.showMobile} mt-2`}>{this.props.shippingMessage}</div>
        <Modal
          isOpen={this.state.modalIsOpen}
          overlayClassName={atc.backdrop}
          className={atc.container}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick
        >
          <atc.CloseModal onClick={this.closeModal} data-auid="close-addtocart-modal">
            &#10761;
          </atc.CloseModal>
          {this.state.atcResponse && this.state.atcResponse.exceptionCode === 'SHOW_FUMBLED' ? (
            <ErrorModal labels={this.props.labels} {...this.state.atcResponse} />
          ) : (
            <ModalContent
              labels={this.props.labels}
              gtmDataLayer={this.props.gtmDataLayer}
              seoURL={this.props.seoURL}
              name={this.props.name}
              {...this.state.atcResponse}
              authMsgs={this.props.authMsgs}
            />
          )}
        </Modal>
      </div>
    );
  }
}

AddToCart.propTypes = {
  id: PropTypes.string,
  selectedSkus: PropTypes.object,
  shippingMessage: PropTypes.string,
  seoURL: PropTypes.string,
  name: PropTypes.string,
  labels: PropTypes.object,
  fnFetchMiniCartSuccess: PropTypes.func,
  products: PropTypes.array,
  dref: PropTypes.object,
  expanded: PropTypes.string,
  bundleId: PropTypes.string,
  authMsgs: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  bundleClickLabel: PropTypes.string
};

// export default AddToCart;
const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer,
  myStoreDetails: state.findAStoreModalRTwo.getMystoreDetails
});

const mapDispatchToProps = dispatch => ({
  fnFetchMiniCartSuccess: data => dispatch(actions.fetchMiniCartSuccess(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToCart);
