/**
 *
 * CheckoutRreviewOrder component consists of a disclaimer with two links "Terms & Conditions" and
 * "Privacy Policy" which take user to respective pages.
 * The place order button submits the user order and navigates to the Order Confirmation Page.
 */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import { postPlaceOrder } from './../../apps/checkout/store/actions/placeOrder';
import { checkoutInventoryRequest } from '../../apps/checkout/store/actions/checkoutInventory';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  ANALYTICS_EVENT_IN,
  ANALYTICS_SUB_EVENT_IN,
  ANALYTICS_EVENT_CATEGORY,
  analyticsEventActionReview,
  analyticsEventLabelReview,
  CMS_DEFAULT_ERROR
} from './constants';
import { PICKUP_IN_STORE_CONSTANT } from '../../apps/checkout/checkout.constants';
import * as styles from './styles';
import { scrollIntoView } from '../../utils/scroll';
import GenericError from '../genericError/genericError.component';
import OrderSubmitButton from './components/orderSubmitButton/orderSubmitButton';
import Prop65Wraning from '../shippingAddress/components/prop65Warning/prop65Warning';
import { isMobile } from './../../utils/navigator';
import { mapOrderItems, typeOfOrder } from './../../utils/analyticsUtils';
import Storage from './../../utils/StorageManager';
class CheckoutReviewOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkflag: false,
      checkboxError: false,
      ageRestrictionEnabled: false,
      shippingRestrictedItems: false
    };
    this.reviewOrderRef = React.createRef();
    this.canPlaceOrder = this.canPlaceOrder.bind(this);
    this.onButtonSubmit = this.onButtonSubmit.bind(this);
    this.getInventoryDetails = this.getInventoryDetails.bind(this);
    this.clearApiError = this.clearApiError.bind(this);
  }

  /**
   * LifeCycle method added to push eCommerce analytics
   */
  componentDidMount() {
    const { analyticsContent, orderDetails, cms, landingDrawer } = this.props;
    const { payments, giftCardDetails, addresses } = orderDetails;
    const orderItemsShippingMethodColln = orderDetails.orderItems.map(item => item.availableShippingMethods[0]);
    const { state, zipCode } = Object.keys(addresses.shippingAddress).length > 0 ? addresses.shippingAddress : addresses.billingAddress;
    const { state: billingState = '', zipCode: billingZipCode = '' } = addresses && addresses.billingAddress;
    const status = orderDetails.containsProp65Warning ? `${cms.warningProp65}` : 'order review drawer';
    const typeOfCard = this.allCardTypes(payments, giftCardDetails);
    const payMethod = this.methodOfPayment(payments, giftCardDetails);
    const enhancedAnalyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventActionReview,
      eventLabel: `${status}`,
      ecommerce: {
        checkout: {
          actionField: { step: 8, option: 'order review' },
          products: mapOrderItems(orderDetails.orderItems)
        }
      },
      dimension50: state,
      dimension51: zipCode,
      dimension52: payMethod,
      dimension53: typeOfCard,
      dimension54: billingState,
      dimension55: billingZipCode,
      dimension85: typeOfOrder(orderItemsShippingMethodColln) || ''
    };
    enhancedAnalyticsData['checkout steps'] = landingDrawer;
    this.scrollIntoView();
    analyticsContent(enhancedAnalyticsData);
  }

  componentWillReceiveProps(nextProps) {
    const { placeOrder, analyticsContent, landingDrawer } = this.props;
    const newPlaceOrderValues = nextProps && nextProps.placeOrder && nextProps.placeOrder.data;
    if (Object.keys(placeOrder.data).length < Object.keys(newPlaceOrderValues).length) {
      const analyticsData = {
        event: ANALYTICS_SUB_EVENT_IN,
        eventCategory: ANALYTICS_EVENT_CATEGORY,
        eventAction: analyticsEventActionReview,
        eventLabel: analyticsEventLabelReview,
        customerleadlevel: null,
        customerleadtype: null,
        leadsubmitted: 0,
        newslettersignupcompleted: 0
      };
      analyticsContent(analyticsData);
      // setting value of landing drawer of checkout to cookies for access on order confirmation for analytics tracking.
      Storage.setCookie('ANALYTICS_CHECKOUT_LANDING_DRAWER', landingDrawer);
    }
  }

  /**
   * clear placeorder api error before component unmount
   */
  componentWillUnmount() {
    this.clearApiError();
  }

  /**
   * it handle the place  order submit.it call the place order action and pass request data
   * @param  {object} data    submit order data
   * @param  {boolean} {if(this.state.ageRestrictionEnabled===true  if age restricted items are present
   * @param  {boolean} {if(this.state.checkflag===false)}       if checkbox not checked
   * @param  {true}} {this.setState({checkboxError})}    checkbox error set to true
   */
  onButtonSubmit() {
    const { orderId } = this.props.orderDetails;
    const agreeAgeRestriction = this.state.checkflag === true ? 'Y' : 'N';
    const shippingModes = this.getShippingMethodsDetails();
    const placeOrderData = {
      orderId,
      shippingModes,
      agreeTermsAndConditions: 'Y',
      agreeAgeRestrictionForOrder: agreeAgeRestriction
    };
    if (this.state.ageRestrictionEnabled === true) {
      if (this.state.checkflag === false) {
        this.setState(
          {
            checkboxError: true
          },
          () => {
            this.scrollIntoView();
          }
        );
      } else {
        this.getInventoryDetails(placeOrderData);
      }
    } else {
      this.getInventoryDetails(placeOrderData);
    }
  }
  /**
   * it return the shipping mode list(contains shipmodeId and date details)
   */
  getShippingMethodsDetails() {
    const { orderDetails } = this.props;
    const shippingModes = [];
    orderDetails.shippingGroups.filter(shippingGroup => shippingGroup.shippingModes.length === 1).map(shippingGroup => {
      const placeOrderData = {
        selectedShipmodeId: shippingGroup.shippingModes[0].shipmodeId || '',
        estimatedFromDate: shippingGroup.shippingModes[0].estimatedFromDate || '',
        estimatedToDate: shippingGroup.shippingModes[0].estimatedToDate || ''
      };
      shippingGroup.orderItems.map(data => shippingModes.push({ ...data, ...placeOrderData }));
      return true;
    });
    orderDetails.shippingGroups.filter(shippingGroup => shippingGroup.shippingModes.length !== 1).map(shippingGroup => {
      const selectedShippingMode = shippingGroup.shippingModes.find(data => data.isSelected === true);
      const placeOrderData = {
        selectedShipmodeId: selectedShippingMode.shipmodeId || '',
        estimatedFromDate: selectedShippingMode.estimatedFromDate || '',
        estimatedToDate: selectedShippingMode.estimatedToDate || ''
      };
      shippingGroup.orderItems.map(data => shippingModes.push({ ...data, ...placeOrderData }));
      return true;
    });
    return shippingModes;
  }
  /**
   * it return bundle inventory details
   */
  getBundleInventory() {
    const orderItemOnlineBundle = this.getOrderItemBundleData(true);
    const orderItemPickupBundle = this.getOrderItemBundleData(false);
    const bundleData = [];
    if (Object.keys(orderItemOnlineBundle).length !== 0) {
      this.getBundleInfoData(true, orderItemPickupBundle, bundleData);
    }
    if (Object.keys(orderItemPickupBundle).length !== 0) {
      this.getBundleInfoData(false, orderItemPickupBundle, bundleData);
    }
    return bundleData;
  }
  /**
   * Utility function to return order data objects.
   * @param {boolean} isFulfillmentConditionOnline boolean flag to denote whether shipment mode is online or pickup in store.
   */
  getOrderItemBundleData = isFulfillmentConditionOnline => {
    const { orderDetails } = this.props;
    return orderDetails.orderItems
      .filter(orderItem => this.orderItemBundleConditionChecker(isFulfillmentConditionOnline, orderItem) && orderItem.isBundleItem === true)
      .map(orderItem => {
        const postOrderData = {
          skuId: orderItem.skuId,
          requestedQuantity: `${orderItem.quantity}`
        };
        return postOrderData;
      });
  };
  /**
   * @param {boolean} isFulfillmentConditionOnline boolean flag to denote whether shipment mode is online or pickup in store.
   * @param {object} orderItemBundle object containing orderItems in the bundle.
   * @param {object} bundleData object containing bundle data.
   */
  getBundleInfoData = (isFulfillmentConditionOnline, orderItemBundle, bundleData) => {
    const { orderDetails } = this.props;
    if (Object.keys(orderItemBundle).length !== 0) {
      bundleData.push({
        skuId:
          orderDetails.bundleProductInfo.find(bundleInfo => this.orderItemBundleConditionChecker(isFulfillmentConditionOnline, bundleInfo)) &&
          orderDetails.bundleProductInfo.find(bundleInfo => bundleInfo.shipModeCode === PICKUP_IN_STORE_CONSTANT).skuId,
        inventorySource: isFulfillmentConditionOnline ? 'online' : 'pickup',
        skus: orderItemBundle
      });
    }
  };

  /**
   * it return pickup inventory details
   */
  getPickupInventory() {
    const { orderDetails } = this.props;
    // let pickupData = {};
    const orderItemPickup = orderDetails.orderItems
      .filter(orderItem => orderItem.shipModeCode === PICKUP_IN_STORE_CONSTANT && orderItem.isBundleItem === false)
      .map(orderItem => {
        const postOrderData = {
          skuId: orderItem.skuId,
          requestedQuantity: `${orderItem.quantity}`
        };
        return postOrderData;
      });
    // if (Object.keys(orderItemPickup).length !== 0) {
    //   pickupData = {
    //     storeId: orderDetails.storeId,
    //     skus: orderItemPickup
    //   };
    // }
    // return pickupData;
    return {
      storeId: orderDetails.storeId || '180',
      skus: orderItemPickup
    };
  }
  /**
   * it return online inventory details
   */
  getOnlineInventory() {
    const { orderDetails } = this.props;
    // let onlineData = {};
    const orderItemOnline = orderDetails.orderItems
      .filter(orderItem => orderItem.shipModeCode !== PICKUP_IN_STORE_CONSTANT && orderItem.isBundleItem === false)
      .map(orderItem => {
        const postOrderData = {
          skuId: orderItem.productId,
          requestedQuantity: `${orderItem.quantity}`
        };
        return postOrderData;
      });
    // if (Object.keys(orderItemOnline).length !== 0) {
    //   onlineData = {
    //     skus: orderItemOnline
    //   };
    // }
    // return onlineData;
    return {
      skus: orderItemOnline
    };
  }
  /**
   * it combine all inventory details and call inventory request action
   * @param {object} placeOrderData - contains data for place order(orderId, shipping modes)
   */
  getInventoryDetails(placeOrderData) {
    const { orderDetails } = this.props;
    const postRequest = {
      onlineskus: this.getOnlineInventory(),
      pickupskus: this.getPickupInventory(),
      bundleskus: this.getBundleInventory()
    };
    // '10151' is default store id. if order details does not contain store id then pass default store id
    const storeId = orderDetails.storeId || '10151';
    this.props.fnInventoryCheckout({ storeId, data: postRequest, placeOrderData });
  }

  /**
   * function to clear the placeOrder error before component unmount
   */
  clearApiError() {
    const { placeOrder } = this.props;
    placeOrder.error = false;
    placeOrder.data = {};
  }

  /**
   * function for printing types of card used in payment in enhanced analytics required format
   * @param {object} payments payments details object
   */
  allCardTypes(payments, giftCardDetails) {
    const { paymentMethod, ccPaymentInstruction } = payments;
    let typeOfCards;

    if (paymentMethod === 'creditCard' && giftCardDetails.length === 0 && ccPaymentInstruction) {
      typeOfCards = ccPaymentInstruction.cardType;
    } else if (paymentMethod === 'creditCard' && giftCardDetails.length > 0 && ccPaymentInstruction) {
      typeOfCards = ccPaymentInstruction.cardType.concat('|', 'n/a');
    } else {
      typeOfCards = 'n/a';
    }

    return typeOfCards;
  }
  /**
   * scrolls the component into view on component mount
   */
  scrollIntoView() {
    const el = this.reviewOrderRef.current;
    const offset = isMobile() ? -80 : 0;
    if (el) {
      scrollIntoView(el, { offset });
    }
  }
  /**
   * function is used to extract all the methods of payments used, in enhanced analytics data format
   * @param {object} payments payment details object
   */
  methodOfPayment(payments, giftCardDetails) {
    const { paymentMethod, ccPaymentInstruction, paypalPaymentInstruction } = payments;
    let typeOfPayments;

    if (paymentMethod && (ccPaymentInstruction || paypalPaymentInstruction) && giftCardDetails.length === 0) {
      typeOfPayments = paymentMethod;
    } else if (giftCardDetails.length > 0 && !ccPaymentInstruction) {
      typeOfPayments = 'giftcard';
    } else if (paymentMethod === 'creditCard' && giftCardDetails.length > 0 && ccPaymentInstruction) {
      typeOfPayments = paymentMethod.concat(',', 'giftcard');
    }

    return typeOfPayments;
  }
  /**
   * @param {boolean} onlineFulfillmentMode boolean flag to determine whether fulfillment is online or in store.
   * @param {object} orderItem order Item object.
   */
  orderItemBundleConditionChecker = (onlineFulfillmentMode, orderItem) => {
    if (onlineFulfillmentMode) {
      return orderItem.shipModeCode !== PICKUP_IN_STORE_CONSTANT;
    }
    return orderItem.shipModeCode === PICKUP_IN_STORE_CONSTANT;
  };
  /**
   * @description checks if the order can be placed based on whether the age restriction checkbox is checked or not
   * @param  {boolean} {this.setState({checkflag})}
   * @param  {boolean}} checkboxError
   */
  canPlaceOrder() {
    this.setState({
      checkflag: !this.state.checkflag,
      checkboxError: false
    });
  }
  /**
   * @description renders generic api error if any error occurs in placeorder api after clicking place order button
   * @returns generic error component
   */
  renderGenericError() {
    const { cms = {}, placeOrder, analyticsContent } = this.props;
    const { errorMsg = {} } = cms;
    if (placeOrder.error === true && placeOrder.data) {
      const apiErrorsList = placeOrder.data.errors;
      const errorKey = Array.isArray(apiErrorsList) ? apiErrorsList[0].errorKey : CMS_DEFAULT_ERROR;
      const eventLabel = errorMsg[errorKey] || errorMsg[CMS_DEFAULT_ERROR] || '';

      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'order review error',
        eventLabel: `${eventLabel.toLowerCase()}`
      };
      analyticsContent(analyticsData);

      return (
        <div className="mb-2">
          <GenericError auid="place_order_error" cmsErrorLabels={cms.errorMsg} apiErrorList={apiErrorsList} />
        </div>
      );
    }
    return null;
  }
  // async checkInventoryDetails() {
  //   const { checkoutInventory } = this.props;
  //   const responseData =
  //     checkoutInventory && checkoutInventory.data && Object.keys(checkoutInventory.data).length !== 0 ? checkoutInventory.data : null;
  //   const onlineSku =
  //     responseData &&
  //     responseData.onlineskus &&
  //     responseData.onlineskus.skus &&
  //     responseData.onlineskus.skus.length !== 0 &&
  //     responseData.onlineskus.skus.filter(sku => sku.inventoryStatus === 'OUT_OF_STOCK');
  //   const bundleSku =
  //     responseData &&
  //     responseData.bundleskus &&
  //     responseData.bundleskus.length !== 0 &&
  //     responseData.bundleskus.filter(sku => sku.inventoryStatus === 'OUT_OF_STOCK');
  //   const pickupSku =
  //     responseData &&
  //     responseData.pickupskus &&
  //     responseData.pickupskus.length !== 0 &&
  //     responseData.pickupskus[0].skus &&
  //     responseData.pickupskus[0].skus.filter(sku => sku.inventoryStatus === 'OUT_OF_STOCK');
  //   return (onlineSku && onlineSku.length !== 0) || (bundleSku && bundleSku.length !== 0) || (pickupSku && pickupSku.length !== 0);
  // }
  renderSystemError(cms) {
    const str = cms.errorMsg && cms.errorMsg.systemError;
    const errorResp = str.replace('{{customerCareNo}}', '1-888-922-2336');
    return `${errorResp}`;
  }
  renderAgeRestrictionContent(cms) {
    this.setState({
      ageRestrictionEnabled: true
    });
    return (
      <div className={`${styles.placeOrderBorder} mb-2`}>
        <div className="col-12 px-0 mb-1">
          {this.state.checkboxError && <div className="body-12-regular text-danger ml-4 my-1">{cms.errorMsg.termsAndConditions}</div>}
          <label className={`${styles.checkStyle} d-flex flex-row`}>
            <Checkbox
              checked={this.state.checkflag}
              disabled={false}
              onChange={this.canPlaceOrder}
              name="age-restriction-checkbox"
              id="ageRestrictionCheckbox"
            />
            <div className="ml-1 o-copy__14reg">{cms.reviewOrderSubText}</div>
          </label>
        </div>
      </div>
    );
  }
  /**
   *
   * @param {function} fnPlaceOrder - Passing function fnPlaceOrder as a prop to dispatch redux action
   * @param {Object} data - on Click (data) is passed in the function fnPlaceOrder and response is received.
   */
  render() {
    const { cms, orderDetails, placeOrder } = this.props;
    const updatedReviewOrderDescriptionText = cms.reviewOrderDescriptionText.replace('<br/>', '');
    return (
      <section ref={this.reviewOrderRef}>
        {this.renderGenericError()}
        <div className="d-flex flex-wrap container px-0">
          {orderDetails && orderDetails.containsProp65Warning && <Prop65Wraning cms={cms} orderDetails={orderDetails} />}
          {orderDetails.checkoutStates && orderDetails.checkoutStates.hasAgeRestrictedItems === true && this.renderAgeRestrictionContent(cms)}
          <div className="col-md-5 col-lg-5 col-xl-6 col-12 px-0">
            <div className={`${styles.linkStyle} o-copy__14reg`} dangerouslySetInnerHTML={{ __html: updatedReviewOrderDescriptionText }} />
          </div>
          <div className="offset-md-1 col-md-6 offset-lg-1 col-lg-6 offset-xl-2 col-xl-4 col-12 px-0 pt-1 pt-md-0 text-right">
            <OrderSubmitButton
              disableSubmit={this.state.shippingRestrictedItems || placeOrder.isFetching || placeOrder.data.nextURL}
              onSubmitOrder={this.onButtonSubmit}
              label={cms.commonLabels.placeOrderLabel}
            />
          </div>
        </div>
      </section>
    );
  }
}

CheckoutReviewOrder.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetails: PropTypes.object,
  placeOrder: PropTypes.object,
  fnInventoryCheckout: PropTypes.func,
  analyticsContent: PropTypes.func,
  landingDrawer: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
  fnPlaceOrder: data => dispatch(postPlaceOrder(data)),
  fnInventoryCheckout: data => dispatch(checkoutInventoryRequest(data))
});

const withConnect = connect(
  null,
  mapDispatchToProps
);
const CheckoutReviewOrderContainer = compose(withConnect)(CheckoutReviewOrder);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CheckoutReviewOrderContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(CheckoutReviewOrder);
