/* eslint complexity: ['warn', 60] */
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import axios from 'axios';
import Link from '@academysports/fusion-components/dist/Link';
import { productAPI } from '@academysports/aso-env';
import { get } from '@react-nitro/error-boundary';
import Responsive from 'react-responsive';
import { cx } from 'react-emotion';
import Json from './productActionItems.component.json';
import Atc from './components/AddToCart/Atc';
import { Quantity } from './components/styles';
import ShippingMessage from './components/shippingMessage';
import BopisMessage from './components/BopisMessage';
import { printBreadCrumb } from '../../utils/breadCrumb';
import { generatePDPLink } from '../../utils/productDetailsUtils';
import BackInStock from './components/BackInStockNotification';
import * as actions from './actions';
import WishList from '../wishListPopover';
import { fade, showLink, font, addToCartHolder, Divider, link, bgTransparent, seeDetailsAdjustWidth, msg, borderRightNotMobile } from './styles';
import { getLinkAsButtonStyle } from '../../apps/productDetailsGeneric/emo/linkAsButton';
import { toggleFindAStore } from '../findAStoreModalRTwo/actions';
import StorageManager from './../../utils/StorageManager';
import { pickupDayInfo } from './../../utils/dateUtils';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  QUANTITY_LABEL,
  SEE_MORE,
  SEE_LESS,
  SEE_DETAILS,
  CHOOSE_A_PICKUP_MESSAGE_1,
  CHOOSE_A_PICKUP_MESSAGE_2,
  CHOOSE_A_PICKUP_MESSAGE_3,
  OUT_OF_STOCK,
  ECOM_CODE_STORE
} from './constants';
import GiftCard from './components/GiftCard';
import { getSwatchProps, getUpdatedGcAmount } from './utils/gcUtils';
import NotSoldOnlineMessage from './components/NotSoldOnlineMessage';
import { fetchProfile } from '../../utils/buyNow/buyNow.api';
import { getProfileId, isLoggedIn } from '../../utils/UserSession';
import { showBuyNowButton as utilsShowBuyNowButton } from '../../utils/buyNow/buyNow.utils';

const CUSTOM_CARD_VALUE = 'Other';

// sonarqube fixes - Removed earlier check as we are returning from previous line in case productItem is undefined.
const changeToBoolean = {
  true: true,
  false: false
};

class ProductActionItems extends React.PureComponent {
  constructor(props) {
    super(props);

    // DO NOT REMOVE - prevents wrapping components from breaking when productItem is null during ProductActionItems instantiation
    // const { productItem } = props || {}; // eslint-disable-line

    this.state = {
      suppressAtc: false,
      isAddToCartDisabled: false,
      isOutOfStock: false,
      isNoDiffOOS: false,
      showMsg: true,
      displayLink: false,
      giftCardAmount: '',
      errorMessage: '',
      gcMaxAmount: props.productItem && props.productItem.isGiftCard && props.productItem.gcMaxAmount ? props.productItem.gcMaxAmount : '',
      selectedItem: props.productItem && props.productItem.isGiftCard && props.productItem.gcAmounts ? `$${props.productItem.gcAmounts[0]}` : '',
      profile: undefined,
      shippingInfo: {}
    };

    this.onFetchProfileSuccess = this.onFetchProfileSuccess.bind(this);
    this.onFetchProfileFail = this.onFetchProfileFail.bind(this);

    this.disableAddToCart = this.disableAddToCart.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.updateAnalytics = this.updateAnalytics.bind(this);
    this.enableBackInStock = this.enableBackInStock.bind(this);
    this.updateGiftCardAmount = this.updateGiftCardAmount.bind(this);
    this.openFindAStoreModal = this.openFindAStoreModal.bind(this);
    this.onClickSeeDetailsQuickViewGA = this.onClickSeeDetailsQuickViewGA.bind(this);
    this.getShippingInfo = this.getShippingInfo.bind(this);
    this.seeDetailsLinkStyle = getLinkAsButtonStyle({ btntype: 'primary', isLink: true });
  }
  componentDidMount() {
    const { productItem } = this.props;
    const { itemId } = productItem;
    this.checkHeight();
    this.fetchProfile();
    this.getPickUpSLA(productItem.sKUs, itemId);
  }

  componentWillReceiveProps(nextProps) {
    const {
      productItem: { itemId }
    } = this.props;
    if (itemId !== nextProps.productItem.itemId) {
      this.getPickUpSLA(nextProps.productItem.sKUs, itemId);
    }
  }

  onEnterFireOnClick(onClick) {
    return e => {
      if (onClick && e.nativeEvent.keyCode === 13) {
        onClick(e);
      }
    };
  }
  onClickSeeDetailsQuickViewGA(product) {
    this.props.gtmDataLayer.push({
      event: 'plpPageClicks',
      eventCategory: 'plp interactions',
      eventAction: 'plp|quickview|see Details',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }

  /**
   * @description Sets state.profile upon successful fetchProfile request
   * @param  {Object} response
   * @returns {undefined}
   */
  onFetchProfileSuccess(response = {}) {
    const { status, data } = response;
    if (status >= 200 && status < 300 && data) {
      const { profile } = data;
      this.setState({ profile });
    } else {
      this.onFetchProfileFail();
    }
  }
  /**
   * @description A placeholder function to be execute upon failed fetchProfile request
   * @param  {Object} response
   * @returns {undefined}
   */
  onFetchProfileFail() {
    // response
    // do nothing for now
  }
  getPickUpSLA(sKUs, itemId) {
    const storeLocation = StorageManager.getCookie('WC_StLocId');
    const currentSku = this.getSelectedSku(sKUs, itemId);
    const storeId = currentSku ? storeLocation : '';
    if (currentSku) {
      this.getShippingInfo(currentSku.skuId, storeId);
    }
  }

  /**
   * Get selected sku based on the itemId
   * @param skuList
   * @param itemId
   */
  getSelectedSku(skuList = [], itemId) {
    return skuList.find(item => item.itemId === itemId);
  }

  /**
   * Get shipping info
   * @param productId
   * @param storeParam
   */
  getShippingInfo(productId, storeParam) {
    axios({
      method: 'get',
      url: `${productAPI}${productId}/shipping`,
      params: {
        selectedStore: storeParam ? `store-${storeParam}` : ''
      }
    })
      .then(res => {
        this.setState({ shippingInfo: res.data });
      })
      .catch(err => {
        console.error(err);
      });
  }

  getDisableStatus() {
    if (this.state.selectedItem === CUSTOM_CARD_VALUE && (this.state.errorMessage !== '' || !this.state.giftCardAmount)) {
      return true;
    }
    return this.state.isAddToCartDisabled;
  }

  /**
   * Get estimated shipping SLA
   * @returns {string}
   */
  getEstimatedShippingSLA() {
    const { shippingInfo } = this.state;
    const estimatedFromDate = get(shippingInfo, 'shippingSLA.estimatedFromDate', null);
    const estimatedToDate = get(shippingInfo, 'shippingSLA.estimatedToDate', null);
    const estimatedArrivalStr = [];
    if (estimatedFromDate) {
      const fromDate = pickupDayInfo(estimatedFromDate);
      estimatedArrivalStr.push(fromDate);
    }
    if (estimatedToDate) {
      const toDate = pickupDayInfo(estimatedToDate);
      estimatedArrivalStr.push(toDate);
    }
    if (estimatedArrivalStr.length) {
      return estimatedArrivalStr.join(' - ');
    }
    return '';
  }

  checkHeight() {
    const productMsgContainer = document.getElementById('PMC');

    if (productMsgContainer) {
      const currentHeight = productMsgContainer.clientHeight;
      if (currentHeight >= 93) {
        this.setState({
          displayLink: true
        });
      }
    }
  }

  openFindAStoreModal(productItem, isSof, message) {
    this.props.fnGetProductItemId({
      itemId: productItem.partNumber,
      skuItemId: productItem.itemId,
      categoryId: productItem.categoryId,
      productId: productItem.id,
      skuId: productItem.skuId,
      isSof,
      ecomCode: message.ecomCode,
      inventoryStatus: message && message.inventoryStatus,
      thumbnail: productItem.imageURL
    });
    this.props.fnToggleFindAStore({ status: true, isBopisEligible: false });
  }

  disableAddToCart = (bool, bool2 = false) => {
    this.setState({
      isAddToCartDisabled: bool,
      suppressAtc: bool2
    });
  };

  checkStockAvailability(inv = {}) {
    const { inventoryStatus, ecomCode, deliveryMessage: { storeDeliveryMessage = {} } = {} } = inv;
    const { showTick, storeInvType } = storeDeliveryMessage;
    const { isNoDiffBundle, isStoreSelected } = this.props;
    let isAddToCartDisabled;
    const suppressAtc = false;

    // addToCart should be disabled only if both online inventory and bopis inventory are out of stock
    if (inventoryStatus) {
      isAddToCartDisabled = !(inventoryStatus !== 'OUT_OF_STOCK' || (isStoreSelected && showTick === 'true' && storeInvType === 'BOPIS'));
    } else {
      isAddToCartDisabled = true;
    }

    let isBackInStock = false;
    let isNoDiffBIS = false;

    if (inventoryStatus === 'OUT_OF_STOCK') {
      isBackInStock = true;
      isNoDiffBIS = isNoDiffBundle;
    }

    if (ecomCode === ECOM_CODE_STORE) {
      isBackInStock = false;
    }

    this.disableAddToCart(isAddToCartDisabled, suppressAtc);
    this.enableBackInStock(isBackInStock);
    this.enableNoDiffOOS(isNoDiffBIS);
  }

  checkStoreStockAvailability(storeMessage, inventoryStatus, showTick, storeInvType) {
    let isBackInStock = false;
    let isAddToCartDisabled;
    const suppressAtc = false;
    const { isStoreSelected } = this.props;

    if (inventoryStatus) {
      isAddToCartDisabled = !(storeMessage === 'AVAILABLE_IN_STORE_SOF' || (isStoreSelected && showTick && storeInvType === 'BOPIS'));
    } else {
      isAddToCartDisabled = true;
    }

    if ((storeMessage && storeMessage === 'OUT_OF_STOCK_STORE_SOF') || inventoryStatus === 'OUT_OF_STOCK') {
      isBackInStock = true;
    }
    this.disableAddToCart(isAddToCartDisabled, suppressAtc);
    this.enableBackInStock(isBackInStock);
  }

  // Function to update the selected swatch for giftCard Amount
  handleOnClick(e) {
    const { productItem, gtmDataLayer } = this.props;
    this.setState({
      selectedItem: e.text
    });
    if (gtmDataLayer) {
      gtmDataLayer.push({
        event: 'pdpDetailClick',
        eventCategory: 'pdp interactions',
        eventAction: `pdp|attribute|card amount|${e.text}`.toLowerCase(),
        eventLabel: `${productItem.breadCrumb ? printBreadCrumb(productItem.breadCrumb) : 'academy'} > ${productItem.name}`.toLowerCase()
      });
    }
  }

  // Hardcoding comparison (1500) to be removed after API changes comes in
  /**
   * To update gift card Amount
   * @param  {e} event passed to the function to fetch the amount entered
   */

  updateGiftCardAmount(e, productItem) {
    const gcAmt = parseInt(e.target.value, 10);
    const state = getUpdatedGcAmount(productItem, gcAmt, this.state.gcMaxAmount);

    this.setState(state);
  }

  enableBackInStock = bool => {
    this.setState({
      isOutOfStock: bool
    });
  };

  enableNoDiffOOS = bool => {
    this.setState({
      isNoDiffOOS: bool
    });
  };

  toggleMsg = () => {
    this.setState(previousState => ({
      showMsg: !previousState.showMsg
    }));
  };

  checkIfSpecialOrder(type) {
    return type === 'specialorder';
  }

  // checkClearance(adBug) {
  //   return adBug === 'Clearance';
  // }

  updateAnalytics({ event, analyticsObject = {} }) {
    const dataLayerObj = {
      event: analyticsObject.event || 'pdpDetailClick',
      eventCategory: analyticsObject.eventCategory || 'PDP Detail Clicks',
      eventAction: analyticsObject.eventAction || 'click',
      eventLabel: `${analyticsObject.eventLabel || (event && event.currentTarget.textContent) || 'Action item'}`
    };
    this.props.store.gtmDataLayer.push(dataLayerObj);
  }

  generateSeeDetailsLink(productItem) {
    return productItem ? generatePDPLink(productItem) : '#';
  }

  shouldRenderAddToCart() {
    const { forceSeeDetails } = this.props;
    const { suppressAtc, isAddToCartDisabled } = this.state;
    return !forceSeeDetails && !suppressAtc && !isAddToCartDisabled && !this.shouldRenderSeeDetails();
  }

  /**
   * Display only products
   * Items that can't be purchased online (e.g. Firearms that are not eligible for Ships to Store)
   */
  isProductDisplayOnly() {
    const { ecomCode } = this.createOnlineMessage();
    return ecomCode === ECOM_CODE_STORE;
  }

  shouldRenderSeeDetails() {
    const { forceSeeDetails, showSeeDetailsOnDisableAddToCart } = this.props;
    const { suppressAtc, isAddToCartDisabled } = this.state;
    return forceSeeDetails || (showSeeDetailsOnDisableAddToCart && (suppressAtc || isAddToCartDisabled || this.isProductDisplayOnly()));
  }

  /**
   * @description Helper method to construct productData from productItem.
   * @returns {Object} productData
   */
  createProductData() {
    const { productItem } = this.props;
    return { skuId: productItem.skuId, productId: productItem.productId };
  }
  /**
   * @description Helper method to extract inventoryMessage object from productItem
   * @returns {Object} onlineMessage
   */
  createOnlineMessage() {
    const { productItem } = this.props;
    const { inventoryMessage = {} } = productItem;
    return inventoryMessage;
  }

  /**
   * @description Helper method to extract storeInventory object from productItem
   * @returns {Object} storeMessage
   */
  createStoreMessage() {
    const { productItem } = this.props;
    const { storeInventory } = productItem;
    return storeInventory;
  }

  fnSetSelectedQuantity = selectedQuantity => this.setState({ selectedQuantity });
  /**
   * @description Initiates API call to retrive profile info
   * @returns {undefined}
   */
  fetchProfile = () => {
    if (ExecutionEnvironment.canUseDOM && isLoggedIn() && getProfileId()) {
      fetchProfile(getProfileId(), this.onFetchProfileSuccess, this.onFetchProfileFail);
    }
  };
  /**
   * @description Determins if <WishList/> should be rendered befor <BIS/>
   * @returns {boolean}
   */
  showWishListBeforeBIS() {
    const { productItem } = this.props;
    const { profile } = this.state;

    return utilsShowBuyNowButton(productItem, profile);
  }

  /**
   * Method to show hide see more message toggle based on available message values
   */
  renderSeeMoreLessMessageToggle = prMsgBottom => {
    if (prMsgBottom && prMsgBottom.length > 0) {
      const filtered = prMsgBottom.filter(item => item.value);
      return filtered && filtered.length > 0;
    }
    return false;
  };

  renderDivider = () => {
    const {
      productItem: { isGiftCard },
      isNoDiffBundle
    } = this.props;
    return (
      isGiftCard !== 'Y' &&
      !isNoDiffBundle && (
        <div className="col-12 mt-md-2">
          <Divider />
        </div>
      )
    );
  };

  /**
   * @description Renders Desktop version of <BackInStock/>
   * @returns {JSX}
   */
  renderDesktopBackInStock() {
    const { productItem } = this.props;
    const { showBIS } = productItem;
    const { isOutOfStock, isNoDiffOOS, isAddToCartDisabled } = this.state;
    const productData = this.createProductData();
    const onlineMessage = this.createOnlineMessage();
    const { inventoryStatus, ecomCode } = onlineMessage;

    return (
      <div className={`${font} col-12 col-md-6`}>
        {isOutOfStock &&
          !isNoDiffOOS && (
            <BackInStock
              cms={Json.context.data.cms}
              productData={productData}
              productItem={productItem}
              isNoDiffBundle={this.props.isNoDiffBundle}
              showBis={changeToBoolean[showBIS]}
            />
          )}
        <NotSoldOnlineMessage isAddToCartDisabled={isAddToCartDisabled} inventoryStatus={inventoryStatus} ecomCode={ecomCode} />
      </div>
    );
  }

  /**
   * @description Renders Desktop version of <WishList/>
   * @returns {JSX}
   */
  renderDesktopWishList() {
    const { productItem, gtmDataLayer } = this.props;
    const storeMessage = this.createStoreMessage();
    return (
      productItem.isGiftCard !== 'Y' &&
      storeMessage &&
      storeMessage.skuId && (
        <div className="col-12 col-md-6 px-0">
          <WishList productItem={productItem} gtmDataLayer={gtmDataLayer} />
        </div>
      )
    );
  }

  /**
   * @description Renders <Atc/>
   * @returns {JSX}
   */
  renderAtc() {
    const {
      productItem,
      labels = {},
      store = {},
      isNoDiffBundle,
      onClickAddToCartLogGA,
      onClickIncrementQuantityLogGA,
      onClickDecrementQuantityLogGA,
      authMsgs
    } = this.props;
    const { price } = productItem;
    const isSof = this.checkIfSpecialOrder(productItem.productType);
    const { findAStoreModalRTwo } = store;
    const selectedSwatchAmount = this.state.selectedItem && this.state.selectedItem.split('$')[1];

    return (
      <Atc
        {...{
          disabled: this.getDisableStatus(),
          item: productItem,
          onClickAddToCartLogGA,
          onClickIncrementQuantityLogGA,
          onClickDecrementQuantityLogGA,
          selectedSwatchAmount,
          gcAmount: this.state.giftCardAmount,
          onRequestOpenAddToCartModal: this.props.onRequestOpenAddToCartModal,
          onRequestCloseAddToCartModal: this.props.onRequestCloseAddToCartModal,
          isQuickView: this.props.isQuickView,
          profile: this.state.profile,
          fetchProfile: this.fetchProfile,
          shippingInfo: this.state.shippingInfo
        }}
        price={price}
        isNoDiffBundle={isNoDiffBundle}
        labels={labels}
        authMsgs={authMsgs}
        storeInfo={findAStoreModalRTwo}
        isSof={isSof}
        fnSetSelectedQuantity={this.fnSetSelectedQuantity}
      />
    );
  }

  render() {
    const { productItem, labels = {}, authMsgs = {}, isNoDiffBundle, myStoreDetails, store } = this.props;
    if (!productItem) {
      return null;
    }
    const { isGiftCard, gcAmounts, identifiersMap, showBIS } = productItem;

    const onlineMessage = this.createOnlineMessage();
    const storeMessage = this.createStoreMessage();

    const { displayLink, showMsg } = this.state;
    const gcSwatchProps = isGiftCard === 'Y' && gcAmounts ? getSwatchProps(identifiersMap, gcAmounts, CUSTOM_CARD_VALUE) : {};

    const prMsgTop = [];
    const prMsgBottom = [];
    const productData = this.createProductData();
    const isSof = this.checkIfSpecialOrder(productItem.productType);
    // const isAdBug = this.checkClearance(productItem.adBug && productItem.adBug[0]);

    const { productMessage, categoryLevelMessage, skuProductMessage } = productItem;
    const prMsg = [];
    const hasHotMarketMessage = changeToBoolean[productItem.hotMarketMessaging];
    if (hasHotMarketMessage) {
      prMsg.push({ hotMarketMessaging: true });
    } else {
      if (skuProductMessage) {
        prMsg.push(...skuProductMessage);
      } else if (productMessage) {
        prMsg.push(...productMessage);
      }
      if (categoryLevelMessage) {
        prMsg.push(categoryLevelMessage);
      }
    }
    if (prMsg.length) {
      if (hasHotMarketMessage) {
        prMsgTop.push({ key: authMsgs.hotMarketShippingMessage, value: authMsgs.hotMarketShippingMessage });
      } else {
        for (let i = 0; i < prMsg.length; i += 1) {
          if (prMsg[i].key === 'specialOrder' || prMsg[i].key === 'hazmat') {
            prMsgBottom.push({ key: [prMsg[i].key], value: authMsgs[prMsg[i].key] || '' });
          } else if (prMsg[i].key === 'quantityLimit') {
            let value = authMsgs[prMsg[i].key] || '';
            value = value.replace(/\{0\}/g, parseInt(prMsg[i].quantityLimit, 10));
            prMsgTop.unshift({ key: [prMsg[i].key], value });
          } else {
            prMsgTop.push({ key: [prMsg[i].key], value: authMsgs[prMsg[i].key] || '' });
          }
        }
      }
    }

    if (isSof) {
      if (this.props.isStoreSelected) {
        const onlineDeliveryMessage = get(onlineMessage, 'deliveryMessage.onlineDeliveryMessage.key', '');
        const inventoryStatus = get(storeMessage, 'inventoryStatus', '');
        const showTick = changeToBoolean[storeMessage.showTick];
        const { storeInvType } = storeMessage;
        // Unlike previously, we are now dependent on online delivery message to check store availability for SOF items
        this.checkStoreStockAvailability(onlineDeliveryMessage, inventoryStatus, showTick, storeInvType);
      } else {
        this.disableAddToCart(true);
        this.enableBackInStock(false);
      }
    } else {
      this.checkStockAvailability(onlineMessage);
    }

    const { isAddToCartDisabled, selectedQuantity } = this.state;
    const { inventoryStatus: onlineInventoryStatus, ecomCode } = onlineMessage;

    return (
      <div>
        {productItem.isGiftCard === 'Y' && (
          <GiftCard
            gcSwatchProps={gcSwatchProps}
            handleOnClick={this.handleOnClick}
            updateGiftCardAmount={this.updateGiftCardAmount}
            productItem={productItem}
            s={this.state}
            customCardValue={CUSTOM_CARD_VALUE}
          />
        )}

        {this.shouldRenderAddToCart() && (
          <Fragment>
            <div>
              <Quantity.Heading className="o-copy__14bold">{labels.QUANTITY_LABEL || QUANTITY_LABEL}</Quantity.Heading>
            </div>
            {this.renderAtc()}
          </Fragment>
        )}
        {this.shouldRenderSeeDetails() && (
          <div className="row">
            <div className={`col-12 col-md-6 ${addToCartHolder}`}>
              <Link
                onClick={() => {
                  this.onClickSeeDetailsQuickViewGA(productItem);
                }}
                href={this.generateSeeDetailsLink(productItem)}
                className={cx(this.seeDetailsLinkStyle, seeDetailsAdjustWidth)}
              >
                {labels.SEE_DETAILS || SEE_DETAILS}
              </Link>
              {this.renderDivider()}
            </div>
          </div>
        )}

        {this.state.isNoDiffOOS && <div className={msg}>{labels.OUT_OF_STOCK || OUT_OF_STOCK}</div>}

        {this.props.notification && (
          <div>
            <div className="row mb-0">
              <Responsive maxWidth={767}>
                {productItem.isGiftCard !== 'Y' &&
                  storeMessage &&
                  storeMessage.skuId && (
                    <div className="col-12 col-md-6 mb-0 mb-lg-0">
                      <WishList productItem={productItem} mobileTextAlign="center" />
                    </div>
                  )}
                {this.state.isOutOfStock &&
                  !this.state.isNoDiffOOS && (
                    <div className={`${font} col-12 col-md-6 mb-2`}>
                      <BackInStock
                        cms={Json.context.data.cms}
                        productData={productData}
                        productItem={productItem}
                        isNoDiffBundle={this.props.isNoDiffBundle}
                        showBis={changeToBoolean[showBIS]}
                      />
                    </div>
                  )}
                <NotSoldOnlineMessage
                  className={`${font} col-12 col-md-6 mb-2`}
                  isAddToCartDisabled={isAddToCartDisabled}
                  inventoryStatus={onlineInventoryStatus}
                  ecomCode={ecomCode}
                />
              </Responsive>
              <Responsive minWidth={768}>
                <Fragment>
                  {this.renderDesktopBackInStock()}
                  {this.renderDesktopWishList()}
                </Fragment>
              </Responsive>
              {storeMessage && storeMessage.skuId && this.renderDivider()}
            </div>

            {isSof &&
              !this.props.isStoreSelected && (
                <Fragment>
                  <div className="o-copy__14bold pt-1 pb-1 pb-md-2" aria-label="please choose a pick up location before adding to cart">
                    {CHOOSE_A_PICKUP_MESSAGE_1}
                    &nbsp;
                    <button
                      onClick={() => this.openFindAStoreModal(productItem, isSof, storeMessage)}
                      aria-hidden="true"
                      className={`border-0 p-0 m-0 shadow-none ${link} ${bgTransparent}`}
                    >
                      {CHOOSE_A_PICKUP_MESSAGE_2}
                    </button>
                    &nbsp;
                    {CHOOSE_A_PICKUP_MESSAGE_3}
                  </div>
                  {this.renderDivider()}
                </Fragment>
              )}

            <div className="row">
              {prMsgTop &&
                prMsgTop.length > 0 && (
                  <Fragment>
                    <div className="col-12 mb-2 mb-md-0">
                      {prMsgTop.map(item => (
                        <p className="mt-2 mb-0" key={item.key}>
                          {item.value}
                        </p>
                      ))}
                    </div>
                    {this.renderDivider()}
                  </Fragment>
                )}

              <div className="col-12">
                {storeMessage &&
                  !isNoDiffBundle &&
                  productItem.isGiftCard !== 'Y' && (
                    <div className="row">
                      <div className={`col-sm-12 col-md-6 mt-3 mb-3 ${borderRightNotMobile}`}>
                        <ShippingMessage
                          message={onlineMessage}
                          isSof={isSof}
                          findAStoreModal={this.props.myStoreDetails}
                          updateAnalytics={this.updateAnalytics}
                          toggleFindAStore={this.props.fnToggleFindAStore}
                          fnGetProductItemId={this.props.fnGetProductItemId}
                          productItem={productItem}
                          authMsgs={authMsgs}
                          myStore={myStoreDetails}
                          selectedQuantity={selectedQuantity}
                          myZipCode={myStoreDetails && myStoreDetails.zipCode}
                          labels={labels}
                          store={store}
                          estimatedShipping={this.getEstimatedShippingSLA()}
                        />
                      </div>
                      <div className="col-sm-12 d-block d-md-none">
                        <Divider />
                      </div>
                      <div className="col-sm-12 col-md-6 mt-3 mb-3">
                        <BopisMessage
                          labels={labels}
                          message={storeMessage}
                          isSof={isSof}
                          findAStoreModal={this.props.myStoreDetails}
                          updateAnalytics={this.updateAnalytics}
                          toggleFindAStore={this.props.fnToggleFindAStore}
                          fnGetProductItemId={this.props.fnGetProductItemId}
                          productItem={productItem}
                          authMsgs={authMsgs}
                          myStore={myStoreDetails}
                          selectedQuantity={selectedQuantity}
                          store={store}
                          shippingInfo={this.state.shippingInfo}
                        />
                      </div>
                      <div className="col-sm-12 d-none d-md-block">
                        <Divider />
                      </div>
                    </div>
                  )}
                {this.renderSeeMoreLessMessageToggle(prMsgBottom) && (
                  <div className={` ${font} col-12 mt-3 mb-3`}>
                    <div id="PMC" className={displayLink && showMsg ? fade : ''}>
                      {prMsgBottom.map(item => (
                        <p key={item.key}>{item.value}</p>
                      ))}
                    </div>
                    {displayLink && (
                      <div className="mt-md-2">
                        <Divider />
                        <span
                          className={`${showLink} col-12`}
                          onClick={this.toggleMsg}
                          onKeyPress={this.onEnterFireOnClick(this.toggleMsg)}
                          tabIndex="0"
                          role="link"
                        >
                          {showMsg ? labels.SEE_MORE || SEE_MORE : labels.SEE_LESS || SEE_LESS}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

ProductActionItems.propTypes = {
  notification: PropTypes.bool,
  onClickAddToCartLogGA: PropTypes.func,
  onClickIncrementQuantityLogGA: PropTypes.func,
  onClickDecrementQuantityLogGA: PropTypes.func,
  productItem: PropTypes.object,
  store: PropTypes.object,
  isStoreSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isOutOfStock: PropTypes.bool,
  authMsgs: PropTypes.object,
  labels: PropTypes.object,
  onRequestOpenAddToCartModal: PropTypes.func,
  onRequestCloseAddToCartModal: PropTypes.func,
  fnToggleFindAStore: PropTypes.func,
  isNoDiffBundle: PropTypes.bool,
  showSeeDetailsOnDisableAddToCart: PropTypes.bool,
  breadCrumbDetails: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  fnGetProductItemId: PropTypes.func,
  isQuickView: PropTypes.bool,
  myStoreDetails: PropTypes.object,
  forceSeeDetails: PropTypes.bool
};

ProductActionItems.defaultProps = {
  notification: true,
  isNoDiffBundle: false,
  showSeeDetailsOnDisableAddToCart: false,
  isQuickView: false
};

const mapDispatchToProps = dispatch => ({
  fnToggleFindAStore: data => dispatch(toggleFindAStore(data)),
  fnGetProductItemId: data => dispatch(actions.getProductItemId(data))
});

const mapStateToProps = state => ({
  store: state,
  gtmDataLayer: state.gtmDataLayer,
  myStoreDetails: state.findAStoreModalRTwo.getMystoreDetails
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const ProductActionItemsContainer = compose(withConnect)(ProductActionItems);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ProductActionItemsContainer
          ua={navigator.userAgent.toLowerCase().match(/android|blackberry|tablet|mobile|iphone|ipad|ipod|opera mini|iemobile/i)}
          {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]}
        />
      </Provider>,
      el
    );
  });
}

export default withConnect(ProductActionItems);
