import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import { get } from '@react-nitro/error-boundary';
import React, { Fragment } from 'react';
import { cx } from 'react-emotion';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import ReactDOM from 'react-dom';
import { compose } from 'redux';
import { reducer as form } from 'redux-form';
import { Provider, connect } from 'react-redux';
import { isMobile } from '../../utils/userAgent';
import CreateAccountForm from './createAccountForm';
import { dateFormatter } from '../../utils/dateUtils';
import {
  USER_ID,
  STORE_ID,
  USERTYPE,
  USERTYPE_REGISTERED,
  PICKUP_SELECTION,
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  ITEMS_FOR_PICKUP,
  SHIP_TO_STORE,
  DISCOVER_CARD,
  AMEX_CARD,
  MASTER_CARD,
  VISA_CARD,
  CREDIT_CARD,
  UPS_GROUND,
  UPS_OVERNIGHT,
  UPS_2_DAY,
  WHITEGLOVE,
  FEDX_GROUND,
  FEDX_2_DAY,
  FEDX_OVERNIGHT,
  FEDX_HOME,
  WHITEGLOVETHRESHOLD,
  WHITEGLOVEROC,
  PICKUPINSTORE,
  USPS_GROUND,
  FREE_LABEL,
  NOT_APPLICABLE
} from './constants';
import GenericError from './../../modules/genericError/components/alertComponent';
import {
  linkLabels,
  storeInfo,
  boxHeading,
  itemImageThumbnail,
  successModal,
  colorBlue,
  containerBox,
  bundleItemContainer,
  triangleUp,
  iconSize,
  estimatedPickupBox,
  boxHeadingTop,
  cursorPointer,
  discountColor,
  Message,
  imageContainer,
  lastParagraph,
  textStyle,
  textMiddle,
  textGreen
} from './styles';
import injectReducer from '../../utils/injectReducer';
import saga from './saga';
import injectSaga from '../../utils/injectSaga';
import { toggleCreateAccountModal, createAccountRequest, getAccountRequest, getStoreRequest, cancelOrderRequest } from './actions';
import reducer from './reducer';
import Storage from '../../utils/StorageManager';
import { padDigits, dollarFormatter, getURLparam } from '../../utils/helpers';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';
import { formatPhoneNumber } from '../../utils/stringUtils';
import { toolTipStyle } from '../checkoutPaymentOptions/payment.styles';
import { adBugMapper } from '../../utils/analyticsUtils';
import { LANDING_DRAWER, LANDING_DRAWER_LOGIN } from '../../apps/checkout/checkout.constants';

export class CreateAccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      storeHoursOpen: false,
      bopisStoreHoursOpen: false,
      showPassMeter: false
    };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.accountSuccessModal = this.accountSuccessModal.bind(this);
    this.loginPassword = this.loginPassword.bind(this);
    this.validatePass = this.validatePass.bind(this);
    this.viewOrderHistory = this.viewOrderHistory.bind(this);
    this.pushAnalytics = this.pushAnalytics.bind(this);
    this.errorAnalytics = this.errorAnalytics.bind(this);
  }
  componentWillMount() {
    this.props.getAccountRequest(getURLparam('orderId'));
  }
  /**
   * function for handling updated reducer props for storing session of userid and store id and getting updated store id details
   * @param {object} nextProps updated props object
   */
  componentWillReceiveProps(nextProps) {
    const { analyticsContent, cms } = this.props;
    const { itemJsonObject } = nextProps;
    const { data, isFetching, error } = itemJsonObject;
    const label = get(cms, 'commonLabels.submitLabel', 'submit');

    if (this.props.itemJsonObject.data !== data && Object.keys(data).length !== 0 && data.orders[0].storeId) {
      const storeId = data.orders && padDigits(parseInt(data.orders[0].storeId, 10), 4);
      this.props.getStoreAddressFn(storeId);
    }
    if (this.props.modalStatus.data !== nextProps.modalStatus.data && Object.keys(nextProps.modalStatus.data).length !== 0) {
      const { identity } = nextProps.modalStatus.data;
      if (identity) {
        Storage.setSessionStorage(USER_ID, identity.userId);
        Storage.removeSessionStorage(STORE_ID);
      }
    }

    if (this.props.modalStatus.data !== nextProps.modalStatus.data && !nextProps.modalStatus.isFetching && nextProps.modalStatus.error) {
      this.errorAnalytics(cms.errorMsg[nextProps.modalStatus.data]);
    }
    if (this.props.modalStatus.data !== nextProps.modalStatus.data && !nextProps.modalStatus.error && nextProps.modalStatus.modal) {
      this.pushAnalytics(label);
    }

    if (this.props.itemJsonObject !== itemJsonObject && isFetching === false && error === false) {
      const { addresses = {}, payments, orderItems, orderId, shippingGroups, promotions, totals } = data.orders[0];

      const { state = NOT_APPLICABLE, zipCode } = addresses.shippingAddress !== null ? addresses.shippingAddress : addresses.billingAddress;
      const { state: billingState = '', zipCode: billingZipCode = '' } = addresses && addresses.billingAddress;

      const shippingCity = addresses.shippingAddress && addresses.shippingAddress.city;
      const recipientEmail = addresses.billingAddress && addresses.billingAddress.email;

      const typeOfCard = this.allCardTypes(payments);
      const payMethod = this.methodOfPayment(payments);

      const hasSOFItems = shippingGroups.find(attr => attr.hasSOFItems === 'true');
      const isSpecialOrder = hasSOFItems ? 'true' : 'false';

      const promoList = promotions.length > 0 ? promotions.map(promo => promo.code.toLowerCase()) : [];
      const promoDetails = promoList.length > 0 ? promoList.reduce((a, i) => a.concat('|', i)) : 'n/a';

      const productItems = this.enhancedAnalyticsProducts(orderItems, isSpecialOrder);

      const enhancedAnalyticsData = {
        ecommerce: {
          purchase: {
            actionField: {
              id: orderId, // Transaction ID. Required for purchases and refunds
              revenue: this.calcRevenue(totals), // Total transaction value (excl. tax and shipping)
              tax: totals.totalOrderTaxes, // Total tax value
              shipping: totals.totalShippingCharge, // Total shipping value
              coupon: promoDetails // set to a pipe-delimited string containing the names of any coupons/promo’s applied at the order level
            },
            products: productItems
          }
        },
        dimension50: state.toLowerCase(),
        dimension51: zipCode,
        dimension52: payMethod.toLowerCase(),
        dimension53: typeOfCard.toLowerCase(),
        dimension54: billingState.toLowerCase(),
        dimension55: billingZipCode,
        'shipping city': shippingCity || '',
        'email id': recipientEmail || '',
        dimension85: this.orderType(orderItems),
        'checkout steps': this.checkSignIn() ? Storage.getLocalStorage(LANDING_DRAWER) : Storage.getLocalStorage(LANDING_DRAWER_LOGIN)
      };
      analyticsContent(enhancedAnalyticsData);
      Storage.removeLocalStorage(LANDING_DRAWER);
      Storage.removeLocalStorage(LANDING_DRAWER_LOGIN);
    }
  }
  /**
   * fetches the data and then sends an action for create account
   * @param {object} data redux form data of password field
   * @param {string} email email string
   * @param {string} firstName firstName string
   * @param {string} lastName lastname string
   */
  onSubmitHandler(data, props) {
    const { email, firstName, lastName } = props;
    const dataNew = { logonId: email, firstName, lastName };

    dataNew.logonPasswordVerify = data.logonPassword;
    dataNew.logonPassword = data.logonPassword;
    dataNew.receiveEmail = data.signupToEmails ? `${data.signupToEmails}` : 'false';

    this.props.createAccount(dataNew);
  }
  /**
   * It returns day name
   * @param {string} date - date string format-'2018-07-26'
   */
  getDayName(date) {
    const {
      cms: { commonLabels }
    } = this.props;
    const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } = commonLabels;
    const dateString = new Date(date);
    const weekday = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
    const dayName = weekday[dateString.getDay()];
    return dayName;
  }
  /**
   * prints an item or product blade
   * @param {object} order json object of an item or product
   * @param {object} cms cms object
   * @param {boolean} bundleFlag flag whether item is in a bundle or not
   */
  getProduct(order, cms, bundleFlag) {
    return (
      <div className="d-flex py-1">
        <div className={`${imageContainer} mr-half`}>
          <img className={`${itemImageThumbnail}`} alt={order.skuDetails.skuInfo.imageAltDescription} src={order.skuDetails.skuInfo.thumbnail} />
        </div>
        <div className="flex-column o-copy__14reg flex-grow-1">
          <p className="mb-1">{order.skuDetails.skuInfo.name}</p>
          <div className="mb-half d-flex">
            <strong className="o-copy__14bold">{cms.commonLabels.skuLabel}:</strong>
            <div className="ml-half">{order.skuId}</div>
          </div>
          {order.skuDetails.skuInfo.skuAttributes.length > 0 &&
            order.skuDetails.skuInfo.skuAttributes.map(attribute => (
              <div className="mb-half d-flex">
                <strong className="o-copy__14bold">{attribute.name}:</strong>
                <div className="ml-half">{attribute.value}</div>
              </div>
            ))}
          {!bundleFlag && (
            <div className="d-flex justify-content-between">
              <div>
                <strong className="o-copy__14bold">{cms.commonLabels.quantityLabel}:</strong> {order.quantity}
              </div>
              <div className="o-copy__16reg">{dollarFormatter(order.orderItemPrice)}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
  /**
   * prints the bundle items
   * @param {array} itemjson the array of items of a particular section namely pickup, shipping or ship to store
   * @param {object} cms cms object
   * @param {array} orders all items array
   */
  getBundle(itemjson, cms, orders) {
    return itemjson.map(bundle => (
      <div className="row pt-1 pb-half">
        <div className="col-2">
          <img className={`${itemImageThumbnail}`} alt={bundle.skuDetails.skuInfo.imageAltDescription} src={bundle.skuDetails.skuInfo.thumbnail} />
        </div>
        <div className="col-10 o-copy__14reg">
          <p>{bundle.skuDetails.skuInfo.name}</p>
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <strong className="o-copy__14bold">{cms.commonLabels.quantityLabel}:</strong> <div className="ml-half">{bundle.quantity}</div>
            </div>
            <p className="o-copy__16reg">${bundle.orderItemPrice}</p>
          </div>
        </div>
        <div className={`${triangleUp} ml-3`} />
        <div className={`${bundleItemContainer} col-12 py-1`}>
          {bundle.bundleOrderItems.map(item =>
            orders.map(orderItem => (orderItem.orderItemId === item.orderItemId ? this.getProduct(orderItem, cms, true) : null))
          )}
        </div>
      </div>
    ));
  }
  /**
   * seperates the single items from all the items and prints them
   * @param {array} itemjson the array of items of a particular section namely pickup, shipping or ship to store
   * @param {object} cms cms object
   */
  getOrderItems(itemjson, cms) {
    return itemjson.map(order => (order.isBundleItem ? null : this.getProduct(order, cms, false)));
  }
  /**
   * for setting dangerous html
   * @param {string} label
   */
  getLabelText(label) {
    return { __html: label };
  }
  /**
   *
   * getCardType will return credit card type ex:- Visa Ending in
   * @param {string} cardType credit card type
   */
  getCardType(cardType) {
    const { cms } = this.props;
    switch (cardType.toLowerCase()) {
      case DISCOVER_CARD.toLowerCase():
        return cms.DISCOVER;
      case AMEX_CARD.toLowerCase():
        return cms.AMEX;
      case MASTER_CARD.toLowerCase():
        return cms.MasterCard;
      case VISA_CARD.toLowerCase():
        return cms.VISA;
      default:
        return '';
    }
  }

  /**
   *
   * getShippingType will return shipping type from AEM
   * @param {string} shipModeCode shipping mode code
   */
  getShippingType(shipModeCode) {
    const { cms } = this.props;
    switch (shipModeCode) {
      case UPS_GROUND:
        return cms.ups_Ground;
      case UPS_2_DAY:
        return cms.ups_2_Day;
      case UPS_OVERNIGHT:
        return cms.ups_Overnight;
      case USPS_GROUND:
        return cms.usps_Ground;
      case WHITEGLOVE:
        return cms.whiteGlove;
      case SHIP_TO_STORE:
        return cms.ship_To_Store;
      case FEDX_GROUND:
        return cms.fedx_Ground;
      case FEDX_2_DAY:
        return cms.fedx_2_Day;
      case FEDX_OVERNIGHT:
        return cms.fedx_Overnight;
      case FEDX_HOME:
        return cms.fedx_Home;
      case WHITEGLOVETHRESHOLD:
        return cms.whiteGloveThreshold;
      case WHITEGLOVEROC:
        return cms.whiteGloveROC;
      case PICKUPINSTORE:
        return cms.pickupInStore;
      default:
        return '';
    }
  }

  orderType = order => {
    const shippingMethods = order.map(method => method.itemShippingType);
    const uniqueValuesOfShippingMethods = shippingMethods.filter((value, index) => shippingMethods.indexOf(value) === index);
    return uniqueValuesOfShippingMethods.length > 1
      ? uniqueValuesOfShippingMethods.reduce(
          (accumulator, shippingMethod) => `${this.shipmentType(accumulator)}|${this.shipmentType(shippingMethod)}`
        )
      : this.shipmentType(uniqueValuesOfShippingMethods[0]);
  };

  shipmentType = availableShippingMethods => {
    const orderFulfillmentTypes = type => {
      switch (type) {
        case 'PICKUPINSTORE':
          return 'bopis';
        case 'STS':
          return 'ship to store';
        case 'Ship To Store':
          return 'ship to store';
        case 'SG':
          return 'ship to home';
        default:
          return 'ship to home';
      }
    };
    const shippingMethodsMessage = orderFulfillmentTypes(availableShippingMethods);
    return shippingMethodsMessage;
  };
  /**
   * calc Revenue = subtotal - discount - employeeDiscount
   * discount and employeeDiscount are negative incoming values
   */
  calcRevenue(totals) {
    const { totalProductPrice = 0, employeeDiscount = 0, totalAdjustment = 0 } = totals;
    return (Number(totalProductPrice) + Number(employeeDiscount) + Number(totalAdjustment)).toFixed(2);
  }
  /**
   * toggles the cancel order modal
   */
  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  /**
   * it seggregates the order items into 3 portions of pickup, shipping items and ship to store
   * @param {object} order containing order items
   */
  groupOrderItems(order) {
    const pickupItems = order.orderItems.filter(item => item.shipModeCode === ITEMS_FOR_PICKUP);
    const shipToStoreItems = order.orderItems.filter(item => item.shipModeCode === SHIP_TO_STORE);
    const shippingItems = order.orderItems.filter(item => item.shipModeCode !== ITEMS_FOR_PICKUP && item.shipModeCode !== SHIP_TO_STORE);
    return { pickupItems, shipToStoreItems, shippingItems };
  }
  /**
   * it seggregates the bundle items into 3 portions of pickup, shipping items and ship to store
   * @param {object} order containing bundle productinfo
   */
  groupBundleItems(order) {
    const pickupItems = order.bundleProductInfo.filter(item => item.shipModeCode === ITEMS_FOR_PICKUP);
    const shipToStoreItems = order.bundleProductInfo.filter(item => item.shipModeCode === SHIP_TO_STORE);
    const shippingItems = order.bundleProductInfo.filter(item => item.shipModeCode !== ITEMS_FOR_PICKUP && item.shipModeCode !== SHIP_TO_STORE);
    return { pickupItems, shipToStoreItems, shippingItems };
  }
  /**
   * function for printing account creation success modal
   * @param {object} status create Account status reducer object
   * @param {object} cms content object
   * @param {object} billingAddress billing Address details object
   */
  accountSuccessModal(status, cms, billingAddress) {
    return status.error ? (
      <div className="mb-2">
        <GenericError message={cms.errorMsg[status.data]} auid="account_creation_failed" />
      </div>
    ) : (
      this.modalCheck(status.modal, cms, billingAddress)
    );
  }
  /**
   * function for printing types of card used in payment in enhanced analytics required format
   * @param {object} payments payments details object
   */
  allCardTypes(payments) {
    const { paymentMethod, giftCardDetails, ccPaymentInstruction } = payments;
    let typeOfCards;

    if (paymentMethod === 'creditCard' && !giftCardDetails && ccPaymentInstruction) {
      typeOfCards = ccPaymentInstruction.cardType;
    } else if (paymentMethod === 'creditCard' && giftCardDetails && ccPaymentInstruction) {
      typeOfCards = ccPaymentInstruction.cardType.concat('|', NOT_APPLICABLE);
    } else {
      typeOfCards = NOT_APPLICABLE;
    }

    return typeOfCards;
  }
  /**
   * function for printing account creation success modal
   * @param {boolean} modal modal status for account creation success
   * @param {object} cms content object
   * @param {object} billingAddress billing Address details object
   */
  modalCheck(modal, cms, billingAddress) {
    return (
      modal && (
        <section className={`${successModal} mb-1 d-flex align-items-center justify-content-center`}>
          <Message className="col-12">
            <span role="alert" aria-atomic="true" className="o-copy__14reg message">
              {cms.accountCreatedMessage.replace('{{name}}', billingAddress.firstName)}
            </span>
            <button onClick={this.props.toggleSuccessModal} className="closeButton float-right">
              <span className="academyicon icon-close" />
            </button>
          </Message>
        </section>
      )
    );
  }
  // -------------------------------------BOPIS related functions ----------------------------

  /**
   * pickup store instructions display function
   * @param {object} cms content object
   * @param {integer} pickupItem single items length of pickup
   * @param {integer} pickupBundle items length of pickup
   * @param {integer} sofItem single items length of sof
   * @param {integer} sofBundle items length of sof
   */
  bopisInstructions(cms, pickupItem, pickupBundle, sofItem, sofBundle) {
    const inStorePickupInstructionsLabel = get(cms, 'inStorePickupLabel.inStorePickupInstructionsLabel', '');
    if (sofItem > 0 || sofBundle > 0) {
      const inStorePickupDisclaimerLabel = get(cms, 'inStorePickupLabel.inStorePickupDisclaimerLabel', '');
      const inStorePickupInstructionsForSof = get(cms, 'inStorePickupLabel.inStorePickupInstructionsForSof', '');
      return (
        cms && (
          <section className={`${containerBox} py-2 px-md-2 px-1 mb-1`}>
            <div className={`${boxHeading} mb-1`}>
              <p className="o-copy__16bold">{inStorePickupInstructionsLabel}</p>
            </div>
            <p className="o-copy__14reg" dangerouslySetInnerHTML={this.getLabelText(inStorePickupInstructionsForSof)} />
            <p className="o-copy__14reg">{inStorePickupDisclaimerLabel}</p>
          </section>
        )
      );
    }
    const inStorePickupInstructionsForBopis = get(cms, 'inStorePickupLabel.inStorePickupInstructionsForBopis', '');
    return (
      cms &&
      (pickupItem > 0 || pickupBundle > 0) && (
        <section className={`${containerBox} py-2 px-md-2 px-1 mb-1`}>
          <div className={`${boxHeading} mb-1`}>
            <p className="o-copy__16bold">{inStorePickupInstructionsLabel}</p>
          </div>
          <div className={`${lastParagraph} o-copy__14reg`} dangerouslySetInnerHTML={this.getLabelText(inStorePickupInstructionsForBopis)} />
        </section>
      )
    );
  }
  /**
   * function for returning the Arrive info based on which date from dates are present
   * @param {string} fromDate from date string
   * @param {object} cms cms object
   */
  arriveDateBopis = fromDate =>
    fromDate ? <span className="o-copy__14reg mb-0 pl-half">{`${this.getDayName(fromDate)}, ${dateFormatter(fromDate)}.`}</span> : null;
  /**
   * Pickup related Info display block function
   * @param {object} cms content object
   * @param {integer} item single items length of pickup
   * @param {integer} bundle items length of pickup
   * @param {object} addressObject address object
   */
  bopisInfo(cms, item, bundle, addressObject) {
    const { storeAddress } = this.props;
    const { commonLabels } = cms;
    const storeDetails = Object.keys(storeAddress.data).length > 0 && storeAddress.data.stores[0].properties;
    return (
      cms &&
      (item > 0 || bundle > 0) && (
        <section className={`${containerBox} py-2 px-md-2 px-1 mb-1`}>
          <div className={`${boxHeading} mb-1`}>
            <p className="o-copy__16bold">{cms.inStorePickupLabel.inStorePickupLabel}</p>
          </div>
          <div className="row">
            <div className="col-12">
              <p className="o-copy__14reg">{cms.inStorePickupLabel.pickupInformationLabel}</p>
            </div>
            <div className="col-12 pb-1">
              <div className={`${estimatedPickupBox} p-1`}>
                <p className="o-copy__14reg mb-0">
                  <b>{cms.inStorePickupLabel.estimatedPickupDateLabel}</b>
                  {addressObject.shippingGroups.map(
                    group =>
                      group.shippingMode.shipModeCode === ITEMS_FOR_PICKUP ? (
                        <span>{group.shippingMode.estimatedFromDate ? this.arriveDateBopis(group.shippingMode.estimatedFromDate) : null}</span>
                      ) : null
                  )}
                </p>
                <p className="o-copy__12reg mb-0">{cms.inStorePickupLabel.estimatedPickupDateOrderSummaryHintText}</p>
              </div>
            </div>
            {storeDetails && (
              <div className="col-md-6 col-12">
                <p className="o-copy__14bold mb-0">
                  {storeDetails.neighborhood}
                  <Tooltip
                    auid="conf_addr"
                    direction="top"
                    align="C"
                    lineHeightFix={1.5}
                    content={
                      <div className={`${storeInfo} o-copy__12reg`} id="descriptionTooltipCA" role="alert">
                        <span>{storeDetails.neighborhood}</span>
                        <span>{storeDetails.streetAddress}</span>
                        <span>
                          {storeDetails.city},{storeDetails.state} {storeDetails.zipCode}
                        </span>
                        <span className="mt-half">
                          <span className="o-copy__12bold">{storeDetails.todayTiming}</span>
                        </span>
                      </div>
                    }
                    showOnClick={isMobile()}
                    ariaLabel={storeDetails.neighborhood}
                  >
                    <button
                      className={` academyicon icon-information px-half ${toolTipStyle}`}
                      tabIndex="0"
                      role="tooltip" //eslint-disable-line
                      aria-describedby="descriptionTooltipCA"
                    />
                  </Tooltip>
                </p>
                <p className="o-copy__14reg mb-0 text-capitalize">{storeDetails.streetAddress}</p>
                <p className="o-copy__14reg text-capitalize">
                  {storeDetails.city}, {storeDetails.state} {storeDetails.zipCode}
                </p>
                {this.state.bopisStoreHoursOpen ? (
                  <div>
                    <span
                      onKeyDown={e => e.key === 'Enter' && this.setState({ bopisStoreHoursOpen: !this.state.bopisStoreHoursOpen })}
                      tabIndex="0"
                      role="button"
                      onClick={() => this.setState({ bopisStoreHoursOpen: !this.state.bopisStoreHoursOpen })}
                    >
                      <p className={`o-copy__14reg ${cursorPointer}`}>
                        <span className="label">{cms.inStorePickupLabel.storeHoursLabel}</span>
                        <i className={`academyicon icon-chevron-up align-middle px-half ${colorBlue}`} />
                      </p>
                    </span>
                    <p className="o-copy__14reg mb-0">
                      <p className="mb-0">{`${commonLabels.monday} - ${commonLabels.saturday} ${storeDetails.weekHours.weekDayHrs}`}</p>
                      <p className="mb-half">{`${commonLabels.sunday} ${storeDetails.weekHours.weekEndHrs}`}</p>
                    </p>
                  </div>
                ) : (
                  <span
                    onKeyDown={e => e.key === 'Enter' && this.setState({ bopisStoreHoursOpen: !this.state.bopisStoreHoursOpen })}
                    tabIndex="0"
                    role="button"
                    onClick={() => this.setState({ bopisStoreHoursOpen: !this.state.bopisStoreHoursOpen })}
                  >
                    <p className={`o-copy__14reg ${cursorPointer}`}>
                      <span className="label">{cms.inStorePickupLabel.storeHoursLabel}</span>
                      <i className={`academyicon icon-chevron-down align-middle px-half ${colorBlue}`} />
                    </p>
                  </span>
                )}
              </div>
            )}
            <div className="offset-md-1 col-md-5 col-12">
              <p className="o-copy__14bold mb-0 text-capitalize">
                {`${addressObject.addresses.billingAddress.firstName} ${addressObject.addresses.billingAddress.lastName}`}
              </p>
              <p className="o-copy__14reg pb-1">{addressObject.addresses.billingAddress.email}</p>
              {addressObject.shippingGroups.map(
                group =>
                  group.shippingMode.shipModeCode === ITEMS_FOR_PICKUP &&
                  Object.keys(group.shippingMode.alternatePickup).length > 0 &&
                  group.shippingMode.alternatePickup.selection !== PICKUP_SELECTION && (
                    <div>
                      <p className="o-copy__14bold mb-0">{cms.inStorePickupLabel.alternatePickupPersonLabel}</p>
                      <p className="o-copy__14reg mb-0 text-capitalize">
                        {`${group.shippingMode.alternatePickup.firstName} ${group.shippingMode.alternatePickup.lastName}`}
                      </p>
                      <p className="o-copy__14reg mb-0">{`${group.shippingMode.alternatePickup.email}`}</p>
                      <p className="o-copy__14reg mb-0">{`${group.shippingMode.alternatePickup.mobile}`}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        </section>
      )
    );
  }
  /**
   * pickup note section display function
   * @param {object} cms content object
   * @param {integer} item single items length of pickup
   * @param {integer} bundle items length of pickup
   */
  bopisNote(cms, item, bundle) {
    return (
      cms &&
      (item > 0 || bundle > 0) && (
        <section className={`${containerBox} py-2 px-md-2 px-1 mb-1`}>
          <p className="mb-half o-copy__16bold">{cms.noteLabel}:</p>
          <div className="row">
            <div className="col-12">
              <p className="o-copy__14reg m-0">{cms.noteMessageLabel}</p>
            </div>
          </div>
        </section>
      )
    );
  }
  /**
   * pickup items display function in order summary section
   * @param {object} cms content object
   * @param {integer} item single items length of pickup
   * @param {integer} bundle items length of pickup
   * @param {object} itemjson complete json object getting from the API
   */
  bopisOrderSummarySection(cms, item, bundle, orders) {
    return (
      cms &&
      (item.pickupItems.length > 0 || bundle.pickupItems.length > 0) && (
        <div className={`${textMiddle} o-copy__14reg pt-1 pb-half`}>
          <div className="d-flex">
            <i className={`academyicon icon-store pr-1 ${colorBlue} ${iconSize}`} />
            {cms.inStorePickupLabel.itemsForPickupLabel.toUpperCase()}
          </div>
          {this.getOrderItems(item.pickupItems, cms)}
          {this.getBundle(bundle.pickupItems, cms, orders.orderItems)}
        </div>
      )
    );
  }
  /**
   * function is used to collate product details needed for enhanced analytics
   * @param {array} orderItems - contains order item details
   * @returns [array] containing product details for enhanced analytics
   */
  enhancedAnalyticsProducts(orderItems, isSpecialOrder) {
    const productItems = orderItems.map(item => {
      const { skuDetails, adjustment, shipModeCode } = item;
      const { skuInfo } = skuDetails;
      const hasColor = skuInfo.skuAttributes.find(attr => attr && attr.name === 'Color');
      const productColor = hasColor && hasColor.value ? hasColor.value : 'n/a';

      const hasTeam = skuInfo.skuAttributes.find(attr => attr && attr.name === 'Team');
      const teamName = hasTeam && hasTeam.value ? hasTeam.value : 'n/a';

      const adBug = get(item, 'skuDetails.skuInfo.adBug', []) || [];

      const typeOfOrder = shipModeCode === 'Ship To Store' || shipModeCode === 'Pickup In Store' ? shipModeCode : 'Ship To Home';

      const couponList = adjustment && adjustment.length > 0 ? adjustment.map(coupon => (coupon.description ? coupon.description : coupon.code)) : [];
      const couponDetails = couponList.length > 0 ? couponList.reduce((a, i) => a.concat('|', i), '') : 'n/a';

      const productDetails = {
        name: skuInfo.name ? skuInfo.name : '',
        id: skuInfo.parentSkuId,
        price: item.orderItemPrice,
        brand: skuInfo.manufacturer ? skuInfo.manufacturer.toLowerCase() : '',
        category: skuInfo.categoryName ? skuInfo.categoryName.toLowerCase() : '',
        variant: item.skuId,
        quantity: item.quantity,
        coupon: couponDetails,
        dimension4: null,
        dimension25: adBug.length > 0 ? adBugMapper(adBug[0]) : 'regular',
        dimension29: null,
        dimension34: '',
        dimension35: '',
        dimension68: productColor.toLowerCase(),
        dimension70: teamName.toLowerCase(),
        dimension72: item.skuId,
        dimension74: `${skuInfo.parentSkuId} - ${skuInfo.name}`,
        dimension77: isSpecialOrder,
        dimension86: typeOfOrder.toLowerCase(),
        dimension87: item.isBundleItem ? 'bundled' : 'single',
        metric22: item.orderItemPrice,
        product_image_url: skuInfo.imageURL || ''
      };

      return productDetails;
    });

    return productItems;
  }
  /**
   * function is used to track analytics when error occurs on click of submit
   * @param {string} errorMsg form validation error message
   */
  errorAnalytics(errorMsg) {
    const { analyticsContent } = this.props;

    const analyticsData = {
      event: 'errormessage',
      eventCategory: 'error message',
      eventAction: 'form validation error|create account',
      eventLabel: `${errorMsg.toLowerCase()}`
    };

    analyticsContent(analyticsData);
  }
  // ----------------------------------SHIPPING related functions-----------------------------
  /**
   * Shipping related Info display block function
   * @param {object} cms content object
   * @param {integer} item single items length of shipping
   * @param {integer} bundle items length of shipping
   * @param {object} addressObject object of orderitem json
   */
  shippingInfo(cms, item, bundle, addressObject) {
    return (
      cms &&
      (item > 0 || bundle > 0) && (
        <section className={`${containerBox} py-2 px-md-2 px-1 mb-1`}>
          <div className={`${boxHeading} mb-1`}>
            <p className="o-copy__16bold">{cms.commonLabels.shippingLabel.toUpperCase()}</p>
          </div>
          <div className="row">
            <div className="col-md-6 col-12">
              <p className="o-copy__14reg">{get(cms, 'checkoutLabels.shippingAddressLabel', 'Label Not Found')}</p>
              <p className="o-copy__14bold mb-0 text-capitalize">
                {`${addressObject.addresses.shippingAddress.firstName} ${addressObject.addresses.shippingAddress.lastName}`}
              </p>
              <p className="o-copy__14reg mb-0 text-capitalize">
                {`${addressObject.addresses.shippingAddress.address.toLowerCase()} ${addressObject.addresses.shippingAddress.city.toLowerCase()} ${
                  addressObject.addresses.shippingAddress.state
                } ${addressObject.addresses.shippingAddress.zipCode}`}
              </p>
              <p className="o-copy__14reg pb-1">
                {`${formatPhoneNumber(addressObject.addresses.shippingAddress.phoneNumber)} | ${addressObject.addresses.billingAddress.email}`}
              </p>
            </div>
            <div className="offset-md-1 col-md-5 col-12">
              <p className="o-copy__14reg">{cms.checkoutLabels.shippingMethodLabel}</p>
              {addressObject.shippingGroups.map(
                group =>
                  group.shippingMode.shipModeCode !== ITEMS_FOR_PICKUP && group.shippingMode.shipModeCode !== SHIP_TO_STORE ? (
                    <div>
                      <p className="o-copy__14reg mb-0">
                        {cms.checkoutLabels.shipmentLabel} {group.groupSeqNum} - {cms.commonLabels.itemsLabel}({group.orderItems.length})
                      </p>
                      {group.shippingMode.estimatedFromDate && group.shippingMode.estimatedToDate ? (
                        <p className="o-copy__14bold mb-0">
                          {`${cms.checkoutLabels.arrivesLabel} ${dateFormatter(group.shippingMode.estimatedFromDate)} - ${dateFormatter(
                            group.shippingMode.estimatedToDate
                          )}`}
                        </p>
                      ) : (
                        this.arriveDateChecker(group.shippingMode.estimatedFromDate, group.shippingMode.estimatedToDate, cms)
                      )}
                      <p className="o-copy__14reg pb-1">{this.getShippingType(group.shippingMode.shipModeCode)}</p>
                    </div>
                  ) : null
              )}
            </div>
          </div>
        </section>
      )
    );
  }
  /**
   * function is used to extract all the methods of payments used, in enhanced analytics data format
   * @param {object} payments payment details object
   */
  methodOfPayment(payments) {
    const { paymentMethod, giftCardDetails, ccPaymentInstruction, paypalPaymentInstruction } = payments;
    let typeOfPayments;

    if (paymentMethod && (ccPaymentInstruction || paypalPaymentInstruction) && !giftCardDetails) {
      typeOfPayments = paymentMethod;
    } else if (paymentMethod === 'creditCard' && giftCardDetails && !ccPaymentInstruction) {
      typeOfPayments = 'giftcard';
    } else if (paymentMethod === 'creditCard' && giftCardDetails && ccPaymentInstruction) {
      typeOfPayments = paymentMethod.concat(',', 'giftcard');
    }

    return typeOfPayments;
  }
  /**
   * function is used to track analytics on click of links
   * @param {string} label link label
   */
  pushAnalytics(label) {
    const { analyticsContent } = this.props;

    const analyticsData = {
      event: 'checkoutsteps',
      eventCategory: 'checkout',
      eventAction: 'order confirmation',
      eventLabel: `${label.toLowerCase()}`,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };

    analyticsContent(analyticsData);
  }
  /**
   * function for returning the Arrive info based on which date from from or to dates are present
   * @param {string} fromDate from date string
   * @param {string} toDate to date string
   * @param {object} cms cms object
   */
  arriveDateChecker = (fromDate, toDate, cms) =>
    fromDate ? (
      <p className="o-copy__14bold mb-0">{`${cms.checkoutLabels.arrivesLabel} ${dateFormatter(fromDate)}`}</p>
    ) : (
      toDate && <p className="o-copy__14bold mb-0">{`${cms.checkoutLabels.arrivesLabel}  ${dateFormatter(toDate)}`}</p>
    );
  /**
   * shipping items display function in order summary section
   * @param {object} cms content object
   * @param {integer} item single items length of shipping
   * @param {integer} bundle items length of shipping
   * @param {object} itemjson complete json object getting from the API
   */
  shippingItemsOrderSummarySection(cms, item, bundle, orders) {
    return (
      cms &&
      (item.shippingItems.length > 0 || bundle.shippingItems.length > 0) && (
        <div className="o-copy__14reg pt-1 pb-half">
          <div className="d-flex">
            <i className={`academyicon icon-package pr-1 ${colorBlue} ${iconSize}`} />
            {cms.commonLabels.shippingItemsLabel}
          </div>
          {this.getOrderItems(item.shippingItems, cms)}
          {this.getBundle(bundle.shippingItems, cms, orders.orderItems)}
        </div>
      )
    );
  }
  newStoreHours(storeHours) {
    return storeHours.map((value, index) => (
      <p className="mb-quater" key={index.toString()}>
        {value}
      </p>
    ));
  }
  // ----------------------------------SHIPTOSTORE related functions-----------------------------
  /**
   * ship to store related Info display block function
   * @param {object} cms content object
   * @param {integer} item single items length of ship to store
   * @param {integer} bundle items length of ship to store
   */
  shipToStoreInfo(cms, item, bundle, addressObject) {
    const { storeAddress } = this.props;
    const storeDetails = Object.keys(storeAddress.data).length > 0 && storeAddress.data.stores[0].properties;
    const { todayHours } = storeDetails;
    const storeHours = todayHours ? todayHours.split(',') : '';
    const listStoreHours = storeHours ? this.newStoreHours(storeHours) : '';
    const pickupInformationLabel = get(cms, 'inStorePickupLabel.pickupInformationLabel', '');
    const specialOrderShipToStoreTitle = get(cms, 'inStorePickupLabel.specialOrderShipToStoreTitle', '');
    return (
      cms &&
      (item > 0 || bundle > 0) && (
        <section className={`${containerBox} py-2 px-md-2 px-1 mb-1`}>
          <div className={`${boxHeading} mb-1`}>
            <p className="o-copy__16bold">{specialOrderShipToStoreTitle}</p>
          </div>
          <div className="row">
            <div className="col-12">
              <p className="o-copy__14reg">{pickupInformationLabel}</p>
              <div className="row">
                <div className="col-md-6 col-12">
                  {addressObject.shippingGroups.map(
                    group =>
                      group.shippingMode.shipModeCode === SHIP_TO_STORE ? (
                        <span>
                          {group.shippingMode.estimatedFromDate && group.shippingMode.estimatedToDate ? (
                            <p className="o-copy__14bold mb-0">
                              {`${cms.checkoutLabels.arrivesLabel}  ${dateFormatter(group.shippingMode.estimatedFromDate)} - ${dateFormatter(
                                group.shippingMode.estimatedToDate
                              )}`}
                            </p>
                          ) : (
                            this.arriveDateChecker(group.shippingMode.estimatedFromDate, group.shippingMode.estimatedToDate, cms)
                          )}
                          <p className="o-copy__14reg">{this.getShippingType(group.shippingMode.shipModeCode)}</p>
                        </span>
                      ) : null
                  )}
                  <p className="o-copy__14bold mb-0">{storeDetails.neighborhood}</p>
                  {storeDetails && (
                    <div>
                      <p className="o-copy__14reg text-capitalize">
                        {storeDetails.streetAddress}, {storeDetails.city}, {storeDetails.state} {storeDetails.zipCode}
                      </p>
                      {this.state.storeHoursOpen ? (
                        <div>
                          <span
                            onKeyDown={e => e.key === 'Enter' && this.setState({ storeHoursOpen: !this.state.storeHoursOpen })}
                            tabIndex="0"
                            role="button"
                            onClick={() => this.setState({ storeHoursOpen: !this.state.storeHoursOpen })}
                          >
                            <p className={`o-copy__14reg ${cursorPointer}`}>
                              <span className="label">{cms.inStorePickupLabel.storeHoursLabel}</span>
                              <i className={`academyicon icon-chevron-up align-middle pl-half ${colorBlue}`} />
                            </p>
                          </span>
                          <p className="o-copy__14reg mb-0">{listStoreHours}</p>
                        </div>
                      ) : (
                        <span
                          onKeyDown={e => e.key === 'Enter' && this.setState({ storeHoursOpen: !this.state.storeHoursOpen })}
                          tabIndex="0"
                          role="button"
                          onClick={() => this.setState({ storeHoursOpen: !this.state.storeHoursOpen })}
                        >
                          <p className={`o-copy__14reg ${cursorPointer}`}>
                            <span className="label">{cms.inStorePickupLabel.storeHoursLabel}</span>
                            <i className={`academyicon icon-chevron-down align-middle pl-half ${colorBlue}`} />
                          </p>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {storeDetails && (
                  <div className={`offset-md-1 col-md-5 col-12 ${textStyle}`}>
                    <p className="o-copy__14bold mb-0 text-capitalize">
                      {`${addressObject.addresses.billingAddress.firstName} ${addressObject.addresses.billingAddress.lastName}`}
                    </p>
                    <p className="o-copy__14reg">{addressObject.addresses.billingAddress.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )
    );
  }
  /**
   * shipto store items display function in order summary section
   * @param {object} cms content object
   * @param {integer} item single items length of ship to store
   * @param {integer} bundle items length of ship to store
   * @param {object} itemjson complete json object getting from the API
   */
  shipToStoreOrderSummarySection(cms, item, bundle, orders) {
    return (
      cms &&
      (item.shipToStoreItems.length > 0 || bundle.shipToStoreItems.length > 0) && (
        <div>
          <p className="o-copy__14reg pt-1 pb-half">
            <i className={`academyicon icon-package pr-1 ${colorBlue} ${iconSize}`} />
            {cms.inStorePickupLabel.specialOrderShipToStoreTitle.toUpperCase()}
          </p>
          {this.getOrderItems(item.shipToStoreItems, cms)}
          {this.getBundle(bundle.shipToStoreItems, cms, orders.orderItems)}
        </div>
      )
    );
  }
  /**
   * function which checks for sign in cookies
   */
  checkSignIn() {
    return !Storage.getCookie(USERTYPE) || Storage.getCookie(USERTYPE) !== USERTYPE_REGISTERED;
  }
  /**
   * It toggles the password strength meter to show.
   */
  loginPassword() {
    this.setState({ showPassMeter: true });
  }
  /**
   * function for checking whether user is guest or not, if not then to display create account section
   * @param {object} cms cms object
   * @param {object} addressObject order object
   */
  guestCheck(cms, addressObject) {
    return (
      cms &&
      this.checkSignIn() && (
        <section className={`${containerBox} py-2 px-md-2 px-1 mb-1`}>
          <div className={`${boxHeading} mb-1`}>
            <p className="o-copy__16bold text-uppercase">{cms.createAccount}</p>
          </div>
          <p className="o-copy__14reg pb-1">{cms.fasterCheckoutDescription}</p>
          <p className="o-copy__14bold mb-half text-capitalize">
            {`${addressObject.addresses.billingAddress.firstName} ${addressObject.addresses.billingAddress.lastName}`}
          </p>
          <p className="o-copy__14reg">{addressObject.addresses.billingAddress.email}</p>
          <CreateAccountForm
            {...this.props}
            onSubmitForm={this.onSubmitHandler}
            loginPassword={this.loginPassword}
            validatePass={this.validatePass}
            showPassMeter={this.state.showPassMeter}
            email={addressObject.addresses.billingAddress.email}
            firstName={addressObject.addresses.billingAddress.firstName}
            lastName={addressObject.addresses.billingAddress.lastName}
          />
        </section>
      )
    );
  }
  /**
   * It toggles the password strength meter to show
   */
  validatePass() {
    this.setState({ showPassMeter: false });
  }
  /**
   * It gets triggered on click of view order history link
   */
  viewOrderHistory() {
    const { cms } = this.props;
    const label = cms && cms.commonLabels ? cms.commonLabels.orderSummaryLinks[1].label : 'view order history';

    this.pushAnalytics(label);
  }

  render() {
    const { cms, itemJsonObject, cancelOrder } = this.props;
    const { commonLabels } = cms;
    const itemjson = Object.keys(itemJsonObject.data).length !== 0 && itemJsonObject.data;
    const orders = itemjson && itemjson.orders[0];
    const items = itemjson && this.groupOrderItems(orders);
    const bundleItems = itemjson && this.groupBundleItems(orders);
    const { ccPaymentInstruction } = itemjson && orders && orders.payments;
    const cardType = ccPaymentInstruction ? ccPaymentInstruction.cardType : null;
    const inStorePickupLabel = get(cms, 'inStorePickupLabel.inStorePickupLabel', '');
    const freeShip =
      Object.keys(itemJsonObject.data).length !== 0 &&
      (items.shippingItems.length > 0 || bundleItems.shippingItems.length > 0) &&
      Number(orders.totals.totalShippingCharge) === 0;
    const freeLabel = commonLabels.freeLabel ? commonLabels.freeLabel.toUpperCase().trim() : FREE_LABEL;
    return (
      <div className="container-fluid">
        {itemJsonObject.error && (
          <div className="my-4">
            <GenericError message={cms.errorMsg[itemJsonObject.errorKey]} auid="fetch_order_failed" />
          </div>
        )}
        {cancelOrder.error && (
          <div className="my-4">
            <GenericError message={cms.errorMsg[cancelOrder.errorKey]} auid="cancel_order_failed" />
          </div>
        )}
        {Object.keys(itemJsonObject.data).length !== 0 && (
          <Fragment>
            <div className="row px-1 px-md-5 py-2">
              <div className="col-12 col-md-8 pr-md-3 pr-0 pl-0">
                {this.accountSuccessModal(this.props.modalStatus, cms, orders.addresses.billingAddress)}
                {this.bopisInstructions(
                  cms,
                  items.pickupItems.length,
                  bundleItems.pickupItems.length,
                  items.shipToStoreItems.length,
                  bundleItems.shipToStoreItems.length
                )}
                {this.guestCheck(cms, orders)}
                {this.bopisInfo(cms, items.pickupItems.length, bundleItems.pickupItems.length, orders)}
                {this.shipToStoreInfo(cms, items.shipToStoreItems.length, bundleItems.shipToStoreItems.length, orders)}
                {orders && this.shippingInfo(cms, items.shippingItems.length, bundleItems.shippingItems.length, orders)}
                {/* payment section */}
                <section className={`${containerBox} py-2 px-md-2 px-1 mb-1`}>
                  <div className={`${boxHeading} mb-1`}>
                    <p className="o-copy__16bold">{cms.checkoutLabels.paymentTitle}</p>
                  </div>
                  <div className="row">
                    {orders.payments.paymentMethod.toLowerCase() !== CREDIT_CARD.toLocaleLowerCase() && (
                      <div className="col-12">
                        <p className="o-copy__14reg">{cms.checkoutLabels.paymentMethod}</p>
                        <p className="o-copy__14reg mb-3">You paid with {orders.payments.paymentMethod}</p>
                      </div>
                    )}
                    <div className="w-100 col-12">
                      <p className="o-copy__14reg">{cms.checkoutLabels.billingInformation}</p>
                      <div className="row">
                        <div className="col-md-6 col-12">
                          <p className="o-copy__14bold mb-0 text-capitalize">
                            {`${orders.addresses.billingAddress.firstName} ${orders.addresses.billingAddress.lastName}`}
                          </p>
                          <p className="o-copy__14reg pb-1 text-capitalize">
                            {`${orders.addresses.billingAddress.address}  ${orders.addresses.billingAddress.city}, ${
                              orders.addresses.billingAddress.state
                            }, ${orders.addresses.billingAddress.zipCode}`}
                          </p>
                        </div>
                        {cardType &&
                          Object.keys(orders.payments.ccPaymentInstruction).length !== 0 && (
                            <div className="offset-md-1 col-md-5 col-12">
                              <p className="o-copy__14bold mb-0">
                                {this.getCardType(cardType)} - {orders.payments.ccPaymentInstruction.lastFourCCDigit}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  {orders.payments.giftCardDetails &&
                    orders.payments.giftCardDetails.length > 0 && (
                      <div className="row">
                        <div className="col-12">
                          <p className="o-copy__14reg">{cms.giftCardUsedLabel}</p>
                        </div>
                        {orders.payments.giftCardDetails.map(gcard => (
                          <Fragment>
                            <div className="col-md-6 col-12">
                              <p className="o-copy__14bold">
                                XXXX-XXXX-XXXX-
                                {gcard.giftcard.slice(gcard.giftcard.length - 4, gcard.giftcard.length)}
                              </p>
                            </div>
                            {gcard.totalGCBalance && (
                              <div className="offset-md-1 col-md-5 col-12">
                                <p className="o-copy__14bold mb-0">{cms.balanceRemainingLabel}</p>
                                <p className="o-copy__14reg pb-1">${gcard.totalGCBalance}</p>
                              </div>
                            )}
                          </Fragment>
                        ))}
                      </div>
                    )}
                </section>
                {this.bopisNote(cms, items.pickupItems.length, bundleItems.pickupItems.length)}
              </div>
              <section className={`col-12 col-md-4 p-1 ${containerBox}`}>
                <div className="mb-2">
                  <h6>{commonLabels.orderSummaryLabel}</h6>
                </div>
                <div className={`o-copy__14reg pb-1 ${boxHeading}`}>
                  {commonLabels.itemsLabel} ({orders.numberOfItems})
                </div>
                {this.bopisOrderSummarySection(cms, items, bundleItems, orders)}
                {this.shipToStoreOrderSummarySection(cms, items, bundleItems, orders)}
                {this.shippingItemsOrderSummarySection(cms, items, bundleItems, orders)}
                <div className={`pt-2 ${boxHeadingTop}`}>
                  <div className="d-flex justify-content-between o-copy__14reg">
                    <span className="mb-half">{commonLabels.subTotalLabel}:</span>
                    <span className="o-copy__16reg">{dollarFormatter(orders.totals.totalProductPrice)}</span>
                  </div>
                  {(items.pickupItems.length > 0 || bundleItems.pickupItems.length > 0) && (
                    <div className="d-flex justify-content-between o-copy__14reg">
                      <span className="mb-half text-capitalize">{inStorePickupLabel.toLowerCase()}:</span>
                      <span className="o-copy__16bold">{freeLabel}</span>
                    </div>
                  )}
                  {(items.shipToStoreItems.length > 0 || bundleItems.shipToStoreItems.length > 0) && (
                    <div className="d-flex justify-content-between o-copy__14reg">
                      <span className="mb-half text-capitalize">{cms.inStorePickupLabel.specialOrderShipToStoreTitle.toLowerCase()}:</span>
                      <span className="o-copy__16reg">{dollarFormatter(orders.totals.specialOrderShipToStoreCharge)}</span>
                    </div>
                  )}
                  {(items.shippingItems.length > 0 || bundleItems.shippingItems.length > 0) && (
                    <div className="d-flex justify-content-between o-copy__14reg">
                      <span className="mb-half">{commonLabels.shippingLabel}:</span>
                      <span className={`${freeShip ? 'o-copy__16bold' : 'o-copy__16reg'}`}>
                        {freeShip ? freeLabel : dollarFormatter(orders.totals.totalShippingCharge)}
                      </span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between o-copy__14reg">
                    <span className="mb-half">{commonLabels.taxesLabel}:</span>
                    <span className="o-copy__16reg">{dollarFormatter(orders.totals.totalOrderTaxes)}</span>
                  </div>
                  {orders.totals.gcAppliedOrderAmount && (
                    <div className="d-flex justify-content-between o-copy__14reg">
                      <span className={cx(textGreen, 'mb-half')}>{commonLabels.giftCardLabel}:</span>
                      <span className={cx(textGreen, 'o-copy__16reg')}>-{dollarFormatter(orders.totals.gcAppliedOrderAmount)}</span>
                    </div>
                  )}
                  {orders.totals.employeeDiscount &&
                    orders.totals.employeeDiscount !== null &&
                    parseInt(orders.totals.employeeDiscount, 10) !== 0 && (
                      <div className={`d-flex justify-content-between o-copy__14reg ${discountColor}`}>
                        <span className="mb-half">{commonLabels.employeeDiscountLabel}:</span>
                        <span className={`o-copy__16reg ${discountColor}`}>{dollarFormatter(orders.totals.employeeDiscount)}</span>
                      </div>
                    )}
                  {orders.totals &&
                    orders.totals.totalAdjustment &&
                    parseInt(orders.totals.totalAdjustment, 10) !== 0 && (
                      <div className={`d-flex justify-content-between o-copy__14reg ${discountColor}`}>
                        <span className="mb-half">{commonLabels.discountsLabel}:</span>
                        <span className={`o-copy__16reg ${discountColor}`}>{dollarFormatter(orders.totals.totalAdjustment)}</span>
                      </div>
                    )}
                  <div className={`d-flex justify-content-between pt-1 mb-4 ${boxHeadingTop}`}>
                    <p className="o-copy__16bold">{commonLabels.totalLabel}:</p>
                    <p className="o-copy__20bold">${orders.totals.grandOrderTotal}</p>
                  </div>
                  <div className="d-flex justify-content-end o-copy__14reg mb-2">
                    {!this.checkSignIn() ? (
                      <a href={commonLabels.orderSummaryLinks[1].url} className={`${linkLabels}`} onClick={this.viewOrderHistory}>
                        <div className="text-right">{commonLabels.orderSummaryLinks[1].label}</div>
                      </a>
                    ) : (
                      <a
                        href={commonLabels.orderSummaryLinks[2].url
                          .replace('{{orderId}}', getURLparam('orderId'))
                          .replace('{{zipCode}}', orders.addresses.billingAddress.zipCode)}
                        className={`${linkLabels}`}
                        onClick={this.viewOrderHistory}
                      >
                        <div className="text-right">{commonLabels.orderSummaryLinks[1].label}</div>
                      </a>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

CreateAccount.propTypes = {
  cms: PropTypes.object.isRequired,
  createAccount: PropTypes.func,
  toggleSuccessModal: PropTypes.func,
  modalStatus: PropTypes.object,
  itemjson: PropTypes.object,
  getStoreAddressFn: PropTypes.func,
  getAccountRequest: PropTypes.func,
  storeAddress: PropTypes.object,
  itemJsonObject: PropTypes.object,
  cancelOrderRequest: PropTypes.func,
  cancelOrder: PropTypes.object,
  analyticsContent: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  createAccount: data => dispatch(createAccountRequest(data)),
  toggleSuccessModal: () => dispatch(toggleCreateAccountModal()),
  getAccountRequest: orderId => dispatch(getAccountRequest(orderId)),
  getStoreAddressFn: storeId => dispatch(getStoreRequest(storeId)),
  fnCancelOrder: (orderId, zipCode) => dispatch(cancelOrderRequest(orderId, zipCode))
});
const mapStateToProps = state => ({
  modalStatus: state.createAccount.createAccount,
  itemJsonObject: state.createAccount.getAccount,
  storeAddress: state.createAccount.getStoreAddress,
  cancelOrder: state.createAccount.cancelOrder
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const CreateAccountContainer = compose(
    withReducer,
    formReducer,
    withSaga,
    withConnect
  )(CreateAccount);
  const CreateAccountWrapper = AnalyticsWrapper(CreateAccountContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CreateAccountWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}
export default AnalyticsWrapper(withConnect(CreateAccount));
