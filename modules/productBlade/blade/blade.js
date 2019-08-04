import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import { get } from '@react-nitro/error-boundary';
import * as styles from '../styles';
import Storage from '../../../utils/StorageManager';
import { ShippingModes } from './shippingModes';
import { QtyField } from './qtyField';
import WishList from '../../wishListPopover';
import { analyticsDataConstructor } from '../../../utils/analyticsUtils';
import {
  ORDER_LEVEL,
  ASO_EMPLOYEE_DISCOUNT,
  pickupInStore,
  TIME_SEC,
  PROMO_DESCRIPTION_CONSTANT,
  selectedBOPIS,
  XITEM_ERR_MESSAGE,
  X_CALCULATION_USAGE,
  OOS_MESSAGE,
  OOS_MESSAGE_WITHOUT_WL,
  QUNATITY_LIMIT
} from '../constants';
import { GENERIC_ERROR_MESSAGE } from '../../../apps/cart/cart.constants';
import { dollarFormatter } from '../../../utils/helpers';
import { COOKIE_STORE_ID } from '../../../utils/constants';

class Blade extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      quantity: this.props.data.quantity,
      shippingMode: this.findModeSelected(),
      showMore: true,
      quantityError: false,
      outOfStock: this.props.isOutOfStock,
      partiallyAvailable: this.props.isLimitedStock,
      showReadMore: false,
      previousQuantity: this.props.data.quantity
    };
    this.toggleReadMore = this.toggleReadMore.bind(this);
    this.triggerFindStoreModal = this.triggerFindStoreModal.bind(this);
    this.revertPreviousUpdated = this.revertPreviousUpdated.bind(this);
    this.findModeSelected = this.findModeSelected.bind(this);
    this.disclaimerRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => this.hidePartialAvailabilityMsg(), TIME_SEC);
    this.getHeightForDisclaimer();
  }

  componentDidUpdate(props) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(props.data)) {
      this.updateDetails();
    }
  }

  /**
   * Method for determining if the quantity entered by user is only partially available
   * for the particular selected shipping mode.
   */
  setStateForPartiallyAvailable() {
    this.setState({ partiallyAvailable: false });
    const { data } = this.props;
    const { inventory } = data.skuDetails;
    const { shippingMode, quantity } = this.state;
    const isSplitOrderEligible = this.isCombinedInventoryAvailable(inventory, quantity);
    if (shippingMode === pickupInStore && inventory.store && quantity > parseInt(inventory.store[0].availableQuantity, 10)) {
      if (data.isSOFItem && isSplitOrderEligible) {
        this.toggleHowToProceedModal();
        return false;
      }
      this.setState({ partiallyAvailable: true });
      setTimeout(() => this.hidePartialAvailabilityMsg(), TIME_SEC);
      this.setState({ quantity: parseInt(inventory.store[0].availableQuantity, 10) });
      return parseInt(inventory.store[0].availableQuantity, 10);
    } else if (inventory.online && quantity > parseInt(inventory.online[0].availableQuantity, 10)) {
      this.setState({ partiallyAvailable: true });
      setTimeout(() => this.hidePartialAvailabilityMsg(), TIME_SEC);
      this.setState({ quantity: parseInt(inventory.online[0].availableQuantity, 10) });
      return parseInt(inventory.online[0].availableQuantity, 10);
    }

    return this.state.quantity;
  }

  /**
   * Method to get the order item level discount.
   * @param {object} data orderItem object for which item level discount is to be returned.
   */
  getDiscountAmount(data) {
    const { totalAdjustment } = data;
    return !totalAdjustment || !totalAdjustment.length ? '' : totalAdjustment.find(item => item.displayLevel === 'OrderItem');
  }

  /* Dsiclamer messaging should have show more option if message more than 2 lines.
   * Based on fontsize and text height, if container has height more that 40px then need to show link.
   * Method to find the height and set the flag for show more
   */
  getHeightForDisclaimer() {
    this.setState({ showReadMore: false });
    const height = get(this.disclaimerRef, 'current.clientHeight', 40);
    if (height > 40) {
      this.setState({ showReadMore: true });
    }
  }

  /**
   * Method will get trigger whenever props get changed.
   * Will set all the required values in state
   */
  updateDetails() {
    const { data, isOutOfStock, isLimitedStock } = this.props;
    const initialState = {
      quantity: data.quantity,
      shippingMode: this.findModeSelected(),
      showMore: false,
      outOfStock: isOutOfStock,
      showReadMore: false,
      previousQuantity: data.quantity
    };
    // To avoid message hide after limited stock got auto updated with available quantity
    if (!this.state.partiallyAvailable) {
      initialState.partiallyAvailable = isLimitedStock;
    }
    this.setState({ ...initialState });
    setTimeout(() => this.hidePartialAvailabilityMsg(), TIME_SEC);
  }

  /**
   * Method to check the avilable quantity by combination of both inventory
   * If both inventory doesn't have enough qty then it will return available one.
   * @param {object} inventory
   * @param {number} qty
   */
  isCombinedInventoryAvailable(inventory, qunatity) {
    const qty = parseInt(qunatity, 10);
    if (!inventory.store || !inventory.store.length || !inventory.online || !inventory.online.length) {
      return false;
    }
    const availableQty = parseInt(inventory.store[0].availableQuantity, 10) + parseInt(inventory.online[0].availableQuantity, 10);
    if (availableQty > qty && parseInt(inventory.online[0].availableQuantity, 10) >= qty) {
      return true;
    }

    return false;
  }

  /**
   * Method to open a modal for sof - Split order
   * @param {number} inventory
   * @param {number} qty
   */
  toggleHowToProceedModal() {
    const { data } = this.props;
    const { quantity } = this.state;
    data.proposedQuantity = quantity;
    this.setState({ quantity: data.quantity });
    this.props.fnToggleSOFM({ status: true, sofItems: [data] });
  }

  /**
   * Method to hide the partial available message
   */
  hidePartialAvailabilityMsg() {
    this.setState({ partiallyAvailable: false });
  }

  /**
   * Method to find out which Shipping mode should be selected on default.
   */
  findModeSelected() {
    const modeSTSorBOPIS = this.props.data.availableShippingMethods.filter(
      obj => (obj.shippingType === 'STS' || obj.shippingType === 'PICKUPINSTORE') && obj.shipmodeId === this.props.data.shipModeId
    );
    if (modeSTSorBOPIS.length === 0) {
      return 'SG';
    }
    return modeSTSorBOPIS[0].shippingType;
  }

  /**
   * Method to trigger an action for updating the quantity with respect to an order item.
   */
  submitUpdateQty() {
    const { data, bundleProductInfo, orderId, fnUpdateQty } = this.props;
    const { quantity, shipModeCode } = data;
    // Condition to avoid unwanted service call when user came out from qty field.
    if (quantity === this.state.quantity) {
      return;
    }
    let qty = this.state.quantity;
    if (shipModeCode !== selectedBOPIS) {
      qty = this.setStateForPartiallyAvailable();
    }
    if (!qty) {
      return;
    }
    qty = qty.replace ? qty.replace(/^0+/, '') : qty;
    const reqObj = {};
    reqObj.orderItemId = data.orderItemId;
    if (!bundleProductInfo || !bundleProductInfo.length) {
      reqObj.orderItem = [{ orderItemId: data.orderItemId, quantity: qty }];
    } else {
      reqObj.orderItem = bundleProductInfo.map(item => ({ orderItemId: item.orderItemId, quantity: qty }));
    }
    this.setState({ previousQuantity: qty });
    this.setState({ quantity: qty });
    reqObj.name = data.skuDetails.skuInfo.name;
    reqObj.orderId = orderId;
    reqObj.revertChanges = this.revertPreviousUpdated;
    fnUpdateQty(reqObj);
  }

  /**
   * Method to handle a change in the Quantity field corresponding to a product.
   * Can be triggered by simply typing in the quantity field.
   * @param {object} event : Event object corresponding to a change in quantity field.
   */
  handleQtyChange(event) {
    if (event.target.value && Number.isNaN(parseInt(event.target.value, 10))) {
      this.setState({ quantityError: true, quantity: this.state.previousQuantity });
      return;
    }
    this.setState({ quantityError: false, quantity: event.target.value });
    if (event.target.value && parseInt(event.target.value, 10)) {
      this.setState({ quantityError: false, previousQuantity: event.target.value });
    }
  }

  /**
   * gets order fulfillment types based on shipping Mode from Order API response
   * @param {string} type shiping type recieved from API.
   * */
  orderFulfillmentTypes = type => {
    switch (type) {
      case 'PICKUPINSTORE':
        return 'bopis';
      case 'STS':
        return 'ship to store';
      default:
        return 'ship to home';
    }
  };

  typeOfOrder = availableShippingMethods => {
    const orderFulfillmentTypes = type => {
      switch (type) {
        case 'PICKUPINSTORE':
          return 'bopis';
        case 'STS':
          return 'ship to store';
        case 'SG':
          return 'ship to store';
        default:
          return 'ship to home';
      }
    };
    const shippingMethods = availableShippingMethods.map(method => method.shippingType);
    const shippingMethodsMessage = orderFulfillmentTypes(shippingMethods);
    return shippingMethodsMessage;
  };

  /**
   * Method for handling a submit action on Quantity field; ie an onBlur ( Out of focus ).
   * If the field is left empty and submitted, it resets the value with the one passed from
   * props(which ideally is the previously entered valid value).
   * @param {*} event
   */
  handleQtyFieldSubmit(event) {
    const { data, analyticsContent, cartQuantity } = this.props;
    const { isGCItem, isBulkGCItem, bulkGiftCartMinQty, giftCartMaxQty } = data;
    const eventLabelToPublish = parseInt(this.state.quantity, 10) > data.quantity ? 'add' : 'remove';
    const eventActionToPublish = parseInt(this.state.quantity, 10) > data.quantity ? 'quantity added' : 'quantity removed';
    const eventNameToPublish = parseInt(this.state.quantity, 10) > data.quantity ? 'view shopping cart' : 'remove from cart';
    let analyticsImpressionData = {};
    if (eventLabelToPublish === 'add') {
      analyticsImpressionData.quantity = this.state.quantity - data.quantity;
      analyticsImpressionData.dimension29 = null;
      analyticsImpressionData.dimension77 = data.isSOFItem;
    } else {
      analyticsImpressionData.quantity = data.quantity - this.state.quantity;
      analyticsImpressionData.dimension34 = data.skuDetails.inventory.online.length > 0;
      analyticsImpressionData.dimension35 = data.skuDetails.inventory.store.length > 0;
      analyticsImpressionData.dimension87 = data.isBundleItem ? 'bundled' : 'single';
      analyticsImpressionData.dimension86 = this.typeOfOrder(data.availableShippingMethods) || '';
    }
    analyticsImpressionData = analyticsDataConstructor(data, analyticsImpressionData.quantity);
    const analyticsData = {
      event: eventLabelToPublish === 'add' ? 'shoppingcart' : 'removeFromCart',
      eventCategory: 'shopping cart',
      eventAction: `${eventNameToPublish}|${eventActionToPublish}`,
      eventLabel: `${eventActionToPublish} - ${analyticsImpressionData.quantity}`,
      ecommerce: {
        currencyCode: 'USD'
      }
    };
    analyticsData.ecommerce[eventLabelToPublish] = {
      products: [analyticsImpressionData]
    };
    analyticsData.dimension24 =
      data.skuDetails.skuInfo.adBug && data.skuDetails.skuInfo.adBug.length > 0 ? data.skuDetails.skuInfo.adBug[0] : 'regular';
    analyticsData.dimension76 = data.isSOFItem;
    if (eventLabelToPublish === 'add') {
      analyticsData.dimension28 = 'in page browse';
      analyticsData.metric21 = data.unitPrice;
      analyticsData.metric45 = cartQuantity > 0 ? 0 : 1;
    } else {
      analyticsData.dimension85 = this.typeOfOrder(data.availableShippingMethods) || '';
    }
    analyticsContent(analyticsData);
    if (event.target.value !== '') {
      if (event.target.value !== '0') {
        if (isGCItem === 'Y' && isBulkGCItem === 'Y' && parseInt(this.state.quantity, 10) < parseInt(bulkGiftCartMinQty, 10)) {
          this.setState({ quantity: bulkGiftCartMinQty }, () => this.submitUpdateQty());
        } else if (isGCItem === 'Y' && isBulkGCItem === 'N' && parseInt(this.state.quantity, 10) > parseInt(giftCartMaxQty, 10)) {
          this.setState({ quantity: giftCartMaxQty }, () => this.submitUpdateQty());
        } else {
          this.submitUpdateQty();
        }
      } else this.handleRemove();
    } else this.setState({ quantity: data.quantity });
  }

  /**
   * Method to trigger action for removing an item from cart.
   * Called whenever a Remove button is clicked, or 0 is submitted in the Quantity field.
   * @param {bool} hideUndo Flag to hide and show undo option in blade messages.
   */
  handleRemove(hideUndo) {
    const { fnRemoveitem, data, bundleProductInfo, analyticsContent, orderId } = this.props;
    const { previousQuantity } = this.state;
    const analyticsImpressionData = analyticsDataConstructor(data, previousQuantity);
    const analyticsData = {
      event: 'removeFromCart',
      eventCategory: 'shopping cart',
      eventAction: 'remove from cart|quantity removed',
      eventLabel: 'quantity removed'
    };
    analyticsData.ecommerce = {};
    analyticsData.ecommerce.remove = {
      products: [analyticsImpressionData]
    };
    analyticsData.dimension24 =
      data.skuDetails.skuInfo.adBug && data.skuDetails.skuInfo.adBug.length > 0 ? data.skuDetails.skuInfo.adBug[0] : 'regular';
    analyticsData.dimension76 = data.isSOFItem;
    analyticsData.dimension85 = this.typeOfOrder(data.availableShippingMethods) || '';
    analyticsContent(analyticsData);
    fnRemoveitem({
      product: { data, bundleProductInfo },
      qty: previousQuantity,
      hideUndo,
      orderId,
      isPickUpInStore: data.shipModeCode === selectedBOPIS && true,
      storeId: Storage.getCookie(COOKIE_STORE_ID)
    });
  }

  /**
   * Method to handle click on an 'Add to wish list' link.
   * If it is a guest user, it triggers an action to display a Sign in modal.
   * Else, it dispatches an action for adding the item to a wish list.
   */
  handleWishListClicked() {
    const { data, fnTriggerSignIn, fnAddToWishList } = this.props;
    if (!Storage.getCookie('USERTYPE') || Storage.getCookie('USERTYPE') !== 'R') {
      fnTriggerSignIn();
    } else {
      // Prepare the object as per API specified request object.
      const reqObj = {};
      reqObj.apiObj = { skuId: data.skuId, quantity: this.state.quantity };
      reqObj.name = data.skuDetails.skuInfo.name;
      fnAddToWishList(reqObj);
    }
  }

  /**
   * Method to handle a radio button being clicked( In the shipping mode selector in each blade).
   * If new clicked value is same as the previously selected value, does nothing.
   * Else, if a radio button clicked does not have a corresponding object in available shipping methods,
   *      do nothing,
   * Else, dispatch an action for updating the shipping mode for that particular item, and pass it
   * the relevant request object.
   * @param {string} shipModeChosen Ship mode chosen ( 'SG', 'STS', 'Pickup')
   */
  handleRadioBtn(shipModeChosen) {
    const { bundleProductInfo, data, findAStore, orderId, fnUpdateMode } = this.props;
    const storeDetails = findAStore && findAStore.getMystoreDetails ? findAStore.getMystoreDetails : {};
    const shipModeId = data.availableShippingMethods.filter(obj => obj.shippingType === shipModeChosen)[0].shipmodeId;
    this.setState({ shippingMode: shipModeChosen });
    if (shipModeChosen === this.state.shippingMode || (shipModeChosen !== 'SG' && !storeDetails.storeId)) {
      return;
    }
    let orderItem = [];
    if (bundleProductInfo.length > 0) {
      orderItem = bundleProductInfo.map(item => ({ orderItemId: item.orderItemId, shipModeId }));
    } else {
      orderItem.push({ orderItemId: data.orderItemId, shipModeId });
    }

    if (shipModeChosen !== 'SG') {
      orderItem = orderItem.map(item => ({
        orderItemId: item.orderItemId,
        shipModeId,
        orderItemExtendAttribute: [
          {
            attributeName: 'STOREIDENTIFIER',
            attributeValue: storeDetails.storeId,
            attributeType: 'STRING'
          }
        ]
      }));
    }
    fnUpdateMode({
      update: { orderId, shipAsComplete: true, orderItem, x_calculationUsage: X_CALCULATION_USAGE },
      revertChanges: this.revertPreviousUpdated,
      orderItemId: data.orderItemId
    });
  }

  /**
   * Method to revert the previous changes if any error occur while update item
   */
  revertPreviousUpdated() {
    this.setState({ shippingMode: this.findModeSelected(), quantity: this.props.data.quantity });
  }

  /**
   *
   * @param {*} data
   * Function to construct out of stock and limited availability msg.
   */
  constructOutOfStock() {
    const { outOfStock, partiallyAvailable, previousQuantity } = this.state;
    const { data, cms } = this.props;
    const { skuId, productId, skuDetails: { skuInfo: { name, thumbnail } } = '' } = data;
    const showWishList = this.showWishListOption();
    const oosMessage = showWishList ? get(cms, 'errorMsg.outOfStock', OOS_MESSAGE) : OOS_MESSAGE_WITHOUT_WL;
    return (
      <div className={`${styles.bladeErrMsg} pt-1 px-md-4 px-0`}>
        <div role="tabpanel" tabIndex="0" className={`o-copy__14reg pl-1 pr-1 pr-sm-3 ${partiallyAvailable && styles.closeBtnMob} pr-sm-1 py-1`}>
          <span role="alert">{outOfStock ? oosMessage : cms.errorMsg.limitedStock}</span>
          {outOfStock && (
            <span className={`${styles.options} mt-quarter mt-sm-0 d-flex align-items-start`}>
              {showWishList && (
                <div className={`${styles.oosWishlist} mr-2 mt-quarter mt-sm-0 o-copy__14reg`}>
                  <WishList
                    productItem={{
                      itemId: skuId,
                      skuId: productId,
                      sKUs: [{ skuId, imageURL: thumbnail }],
                      name,
                      seoURL: name,
                      product: this.props,
                      qty: previousQuantity,
                      hideUndo: true
                    }}
                    isFromCart="true"
                    onClick={this.handleWishListClicked}
                    direction={{ mobile: 'bottom', desktop: 'left' }}
                    hideWishListIcon
                  />
                </div>
              )}
              {/* Added flag "true" to hide undo option if user removed OOS item */}
              <button
                data-auid="crt_btnRmvCartOos"
                className={styles.links}
                role="link"
                name="Remove from cart"
                onClick={() => this.handleRemove(true)}
              >
                {cms.commonLabels.removeFromCartLabel}
              </button>
            </span>
          )}
          {partiallyAvailable && (
            <button onClick={() => this.hidePartialAvailabilityMsg()} className={styles.clsBtn} aria-label="close partially available message">
              <i className="academyicon icon-close" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /**
   *
   * @param {*} data
   * Function to construct Bundle/Kit
   */
  constructBundleLayout() {
    return this.props.bundleProductInfo.map((kit, i) => (
      <div className="kit my-2 col-12 px-0 row mx-0" key={kit.orderItemId}>
        <div className="col-md-1 col-2 pl-0 pl-lg-1">
          <img data-auid={`cart_bundle_img_in_cart_${i}`} src={kit.skuDetails.skuInfo.thumbnail} alt={kit.skuDetails.skuInfo.name} className="mr-2" />
        </div>
        <div className="col-md-9 col-7 pr-0">
          <span className="o-copy__14reg">{kit.skuDetails.skuInfo.name}</span>
          <div className="attributes">
            {kit.skuDetails.skuInfo.skuAttributes.map(attr => (
              <span key={attr.name} className="attrib mr-2">
                <span className="o-copy__14bold">{attr.name}:</span> <span className="o-copy__14reg">{attr.value}</span>
              </span>
            ))}
          </div>
        </div>
        <span className="col-md-2 col-3 px-0 text-right o-copy__14reg">Included</span>
      </div>
    ));
  }

  /**
   *
   * Function to construct free gift.
   * @param {object} data orderItem object containing details for free gift to be displayed.
   */
  constructFreeGift(data) {
    const { cms } = this.props;
    const discountedAmount = this.getDiscountAmount(data) ? this.getDiscountAmount(data).amount : data.unitPrice;
    return (
      <div className="my-2 col-12 px-0 row mx-0">
        <div className="col-md-1 col-2 pl-0 pl-lg-1">
          <img data-auid="cart_free_gift_img" src={data.skuDetails.skuInfo.thumbnail} alt={data.skuDetails.skuInfo.name} className="mr-2" />
        </div>
        <div className="col-md-9 col-7 pr-0">
          <label className={`${styles.freeGiftTitle} o-copy__14bold`}>{cms.promotionalMsg.freeGiftLabel}</label>
          <div className="o-copy__14reg">{data.skuDetails.skuInfo.name}</div>
        </div>
        <div className={`col-md-2 col-3 px-0 ${styles.freeGiftPrice}`}>
          <label className="o-copy__20reg price">{dollarFormatter(data.orderItemPrice)}</label>
          <label className="o-copy__12reg price discount mb-0">{dollarFormatter(discountedAmount)}</label>
        </div>
      </div>
    );
  }

  /**
   *
   * @param {*} data
   * Function to construct update shipping mode
   */
  constructShippingMode(data) {
    const { cms, findAStore, bundleProductInfo, labels = {} } = this.props;
    const isBopisEnabled = labels.bopisEnabled === 'true';

    return (
      <ShippingModes
        availableShippingMethods={
          (bundleProductInfo && bundleProductInfo.length > 0) || !isBopisEnabled
            ? data.availableShippingMethods.filter(method => method.shippingType !== 'PICKUPINSTORE')
            : data.availableShippingMethods
        }
        inventory={data.skuDetails.inventory}
        handleChange={shipMode => this.handleRadioBtn(shipMode)}
        cms={cms}
        itemId={data.orderItemId ? data.orderItemId : data.bundleOrderItems[0].orderItemId}
        currentChoice={this.state.shippingMode}
        findAStore={findAStore}
        toggleFASM={this.triggerFindStoreModal}
        bopisEnabled={isBopisEnabled}
      />
    );
  }

  /**
   *
   * @param {*} data
   * Function to construct qty field
   */
  constructQtyField(data) {
    const { cms, qtyUpdateLoader } = this.props;
    return (
      <QtyField
        showLoader={qtyUpdateLoader.indexOf(data.orderItemId) !== -1}
        label={cms.commonLabels.quantityLabel}
        qty={this.state.quantity}
        quantityError={this.state.quantityError}
        orderId={data.orderItemId}
        onChange={event => this.handleQtyChange(event)}
        onSubmit={event => this.handleQtyFieldSubmit(event)}
      />
    );
  }

  toggleReadMore() {
    this.setState({ showMore: !this.state.showMore });
  }
  /**
   * trigger find store modal on click of change location
   */
  triggerFindStoreModal() {
    const { analyticsContent, fnToggleFASM } = this.props;
    let pageName = '';
    if (ExecutionEnvironment.canUseDOM) {
      pageName = document.location.pathname;
    }
    fnToggleFASM({ status: true, isBopisEligible: true, source: 'realtime' });
    const analyticsData = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'change location initiated',
      eventLabel: pageName
    };
    analyticsContent(analyticsData);
  }
  /**
   * Method to construct disclaimer messaging in product blade
   * On clicking read more option will toggle height.
   * Read More option will be hidden if this.state.readMorecharCount less than 250
   * @param {bool} isSOFItem Boolean value representing if item is a SOF item
   * @param {array} productMessage array of product message items array
   */
  constructDisclaimerMessaging(productMessage) {
    const { showReadMore, showMore } = this.state;
    const { cms } = this.props;
    return (
      <div
        className={`${
          styles.disclaimerMessaging
        } offset-2 offset-md-1 offset-lg-2 col-10 col-md-11 col-lg-10 mt-3 pl-0 pl-md-1 pl-lg-0 pr-md-1 pr-lg-4`}
      >
        <p id="disclaimerMessaging" ref={this.disclaimerRef} className={`o-copy__12reg pt-half mb-half ${showReadMore && showMore ? 'hide' : ''}`}>
          {ExecutionEnvironment.canUseDOM &&
            productMessage.map(
              msg =>
                this.disclaimerMessageCheck(productMessage) && (
                  <div className={styles.displayBlock}>
                    {msg.key === QUNATITY_LIMIT ? this.replaceQunatityLimit() : window.ASOData.messages[msg.key]}
                  </div>
                )
            )}
        </p>
        {showReadMore && (
          <button data-auid="crt_readMoreLink o-copy__14reg" className={styles.readMore} onClick={this.toggleReadMore}>
            {!showMore ? cms.commonLabels.readLess : cms.commonLabels.readMore}
            <i className={`academyicon ${!showMore ? 'icon-chevron-up' : 'icon-chevron-down'} ml-half`} />
          </button>
        )}
      </div>
    );
  }

  /**
   * Method to replace the maximum quantity limit in disclamier messaging
   */
  replaceQunatityLimit() {
    const { data } = this.props;
    const qunatityLimit = window.ASOData.messages[QUNATITY_LIMIT];
    if (!qunatityLimit) {
      return null;
    }
    return qunatityLimit.replace('{0}', parseInt(data.quantityLimit, 10));
  }

  /**
   * method for checking whether product message contains any of the 4 keys mentioned
   * @param {array} productMessage object containing product messages array
   */
  disclaimerMessageCheck = (productMessage = []) => {
    if (productMessage.length > 0) {
      const validMsg = productMessage.filter(
        msg => msg.key === 'specialOrder' || msg.key === 'dropShip' || msg.key === 'hazmat' || msg.key === 'whiteGlove' || msg.key === 'hotMarketShippingMessage' || msg.key === QUNATITY_LIMIT
      );
      return validMsg && validMsg.length > 0;
    }
    return false;
  };

  /**
   * Method to construct promotional messages in product blade.
   * Only order level discounts are displayed.
   * @param {array} adjustments
   */
  constructPromotionalMessaging(adjustments) {
    const { cms: { commonLabels } = {}, cms } = this.props;
    const orderAdjustments = adjustments.filter(item => item.displayLevel === ORDER_LEVEL);
    return orderAdjustments.map((promo, i) => (
      <div className={`${styles.promotionalMsg} o-copy__14bold ${i !== orderAdjustments.length - 1 && 'mb-half'}`} key={promo.code}>
        {promo.code && promo.code.indexOf(ASO_EMPLOYEE_DISCOUNT) > -1 && cms.successMsg.employeeDiscountAppliedLabel}
        {promo.description &&
          (commonLabels.orderPromotionsLabel
            ? commonLabels.orderPromotionsLabel.replace(PROMO_DESCRIPTION_CONSTANT, promo.description)
            : promo.description)}
      </div>
    ));
  }

  /**
   * Method to find if product is not a Bundle kit item; and has sku attributes to be displayed.
   * @param {object} data Data of the respective order item.
   */
  isNotBundleProductAndHasAttributes(data) {
    const { bundleProductInfo } = this.props;
    const { skuInfo } = data.skuDetails;
    const { skuAttributes } = skuInfo;
    return (!bundleProductInfo || !bundleProductInfo.length > 0) && skuAttributes && skuAttributes.length > 0;
  }

  /**
   * Method to construct price section for the blade.
   */
  constructDisplayPrice() {
    const { data } = this.props;
    const adjustments = this.getDiscountAmount(data);
    return (
      <div className={styles.priceContainer}>
        <div className={`o-copy__20reg ${adjustments && 'mb-half'}`}>{dollarFormatter(data.orderItemPrice)}</div>
        {adjustments &&
          parseFloat(adjustments.amount) !== 0 && (
            <div className={`${styles.discountContainer} o-copy__12reg mt-quarter`}>
              <span className="mr-1">{adjustments.description}</span>
              <span>{dollarFormatter(adjustments.amount)}</span>
            </div>
          )}
      </div>
    );
  }

  /**
   * Method to construct common error block for displaying errors
   * All the error will get hide in 5sec. This has been handled in css.
   * Based on orderItemId we are filtering the message.
   * Currently this has been implemented for update quantity.
   */
  constructErrorBlock() {
    const { errorDetails: { errors } = [], orderItemId } = this.props.productUpdate.data;
    const { errorMsg } = this.props.cms;
    const qty = this.props.productUpdate.data.errorDetails.errors[0].xitem_newInventoryAvailableQuantity;
    if (this.props.data.orderItemId === orderItemId) {
      this.setState({ quantity: qty });
    }
    return (
      errors &&
      errors.map(err => {
        if (orderItemId !== this.props.data.orderItemId) {
          return false;
        }
        return (
          <div className={`${styles.bladeErrMsg} ${styles.hideMsg} pt-1 px-md-4 px-0`}>
            <div className="o-copy__14reg pl-1 pr-1 py-1" role="alert">
              {err[XITEM_ERR_MESSAGE] ? err[XITEM_ERR_MESSAGE] : errorMsg[err.errorKey] || GENERIC_ERROR_MESSAGE}
            </div>
          </div>
        );
      })
    );
  }

  /**
   * Method will return bool whether wishlist option need to show or not
   */
  showWishListOption() {
    const { skuDetails: { skuInfo } = {} } = this.props.data;
    const { bundleProductInfo } = this.props;
    return !((bundleProductInfo && bundleProductInfo.length) || skuInfo.isGiftCard === 'Y');
  }

  render() {
    const { cms, data, freeGift, productUpdate, bundleProductInfo } = this.props;
    const { outOfStock, partiallyAvailable, previousQuantity } = this.state;
    const showWishList = this.showWishListOption();
    const skuAttributesLength = get(data, 'skuDetails.skuInfo.skuAttributes.length', 0);
    const productMessages = get(data, 'skuDetails.skuInfo.productMessage', []);
    const key = data.orderItemId;
    return (
      <div className={`${styles.blade} mb-quarter mb-sm-half container px-0`}>
        <div className="px-1 px-md-0 pb-2 pb-sm-0">
          {productUpdate && productUpdate.error && productUpdate.data && productUpdate.data.errorDetails && this.constructErrorBlock()}
          {(outOfStock || partiallyAvailable) && this.constructOutOfStock()}
          <div className={`${styles.bladeBody} pt-lg-2 pt-1 pb-0 pb-sm-2 pb-lg-3 d-flex flex-row flex-wrap w-100`}>
            <div className={`${styles.thumbnail} col-2 col-md-1 col-lg-2 pl-0 pl-md-1 pl-lg-4 pr-lg-1`}>
              <a
                data-auid={`crt_lnkImgContainer_${key}`}
                href={data.skuDetails.skuInfo.seoURL}
                className={styles.imageContainer}
                aria-label={data.skuDetails.skuInfo.imageAltDescription}
              >
                <img data-auid={`crt_imgCard_${key}`} src={data.skuDetails.skuInfo.fullImage} alt={data.skuDetails.skuInfo.imageAltDescription} />
                {outOfStock && (
                  <img
                    data-auid={`cart_out_of_stock_img_blade_${key}`}
                    src={cms.commonLabels.outOfStockImageURL}
                    alt="Out of Stock"
                    className="ofs"
                  />
                )}
              </a>
            </div>
            <div className={`col-10 col-md-3 col-lg-3 ${styles.productDetails} pb-1 pb-md-0 pl-0 pl-md-1 pl-lg-quarter pr-lg-1 pr-md-0`}>
              <a
                data-auid={`crt_lnkProdName_${key}`}
                href={data.skuDetails.skuInfo.seoURL}
                title={data.skuDetails.skuInfo.name}
                className={`o-copy__14reg mb-1 ${styles.productName}`}
              >
                {data.skuDetails.skuInfo.name}
              </a>
              {this.isNotBundleProductAndHasAttributes(data) &&
                data.skuDetails.skuInfo.skuAttributes.map((attr, i) => (
                  <div key={attr.name} className={`d-flex ${i !== skuAttributesLength - 1 ? 'mb-quarter' : 'mb-2'}`}>
                    <span className="o-copy__14bold text-capitalize">{attr.name}:</span>
                    <span className="o-copy__14reg text-capitalize ml-half">
                      &nbsp;
                      {attr.value}
                    </span>
                  </div>
                ))}
              <div className={styles.promoMessageMobile}>
                <div className="promotionalDiscountContainer">
                  {data.totalAdjustment && data.totalAdjustment.length > 0 && this.constructPromotionalMessaging(data.totalAdjustment)}
                </div>
              </div>
            </div>
            {/* shipping mode layout */}
            {!outOfStock && (
              <div className="offset-2 offset-md-0 col-10 col-md-4 col-lg-3 pl-lg-1 pl-md-half pl-0 pr-0 pt-half pt-sm-0">
                {this.constructShippingMode(data)}
              </div>
            )}

            {!outOfStock && (
              <div
                className={`d-flex justify-content-between offset-2 offset-md-0 col-10 col-md-4 pr-0 pl-lg-1 pl-md-half pl-0 ${styles.qtyFiledCon}`}
              >
                <div className={`${styles.qtyAndLinks} pl-md-quarter o-copy__14bold pl-0 w-100`}>
                  {/* Construct qty field */}
                  {this.constructQtyField(data)}

                  <div className={`d-flex flex-column ${styles.bladeActions}`}>
                    {showWishList && (
                      <WishList
                        productItem={{
                          itemId: data.skuId,
                          skuId: data.productId,
                          sKUs: [{ skuId: data.skuId, imageURL: data.skuDetails.skuInfo.thumbnail }],
                          name: data.skuDetails.skuInfo.name,
                          seoURL: data.skuDetails.skuInfo.name,
                          product: this.props,
                          qty: previousQuantity
                        }}
                        isFromCart="true"
                        errorMsg={cms.errorMsg}
                        auid={`crt_btnWlist_${key}`}
                        direction={{ mobile: 'bottom', desktop: 'left' }}
                      />
                    )}
                    <button
                      data-auid={`crt_btnRmvFromCart_${key}`}
                      className={`${styles.links} px-0`}
                      tabIndex="0"
                      role="link"
                      onClick={() => this.handleRemove()}
                      onKeyDown={e => e.key === 'Enter' && this.handleRemove()}
                      name="Remove from cart"
                    >
                      <i className={`${styles.linkIcon} mr-half academyicon icon-x-circle`} />
                      <span className="o-copy__14reg">{cms.commonLabels.removeFromCartLabel}</span>
                    </button>
                  </div>
                </div>
                <div className={`${styles.price} o-copy__20reg`}>{this.constructDisplayPrice()}</div>
              </div>
            )}
            <div className={`${styles.promoMessage} col-12 pl-half`}>
              <div className="promotionalDiscountContainer offset-1 offset-lg-2">
                {data.totalAdjustment && data.totalAdjustment.length > 0 && this.constructPromotionalMessaging(data.totalAdjustment)}
              </div>
            </div>
            {productMessages.length > 0 &&
              /** Added passing of disclaimer message */
              this.constructDisclaimerMessaging(productMessages)}
          </div>
        </div>

        {/* Bundle/Kit Layout */}
        {bundleProductInfo &&
          bundleProductInfo.length > 0 && (
            <div className={`${styles.bundleInfo} px-1 pr-md-1 px-lg-4 row mx-0`}>
              <span className="arrow-up" />
              {this.constructBundleLayout()}
            </div>
          )}

        {/* Free Gift */}
        {freeGift && (
          <div className={`${styles.bundleInfo} px-1 pr-md-1 px-lg-4 row mx-0`}>
            <span className="arrow-up" />
            {this.constructFreeGift(freeGift)}
          </div>
        )}
      </div>
    );
  }
}

Blade.propTypes = {
  cms: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  orderId: PropTypes.string,
  qtyUpdateLoader: PropTypes.array,
  fnUpdateMode: PropTypes.func,
  fnUpdateQty: PropTypes.func,
  fnRemoveitem: PropTypes.func,
  fnAddToWishList: PropTypes.func,
  fnTriggerSignIn: PropTypes.func,
  findAStore: PropTypes.object,
  fnToggleFASM: PropTypes.func,
  bundleProductInfo: PropTypes.array,
  fnToggleSOFM: PropTypes.func,
  freeGift: PropTypes.object,
  isLimitedStock: PropTypes.bool,
  isOutOfStock: PropTypes.bool,
  productUpdate: PropTypes.object,
  analyticsContent: PropTypes.func,
  labels: PropTypes.object,
  cartQuantity: PropTypes.number
};

export default Blade;
