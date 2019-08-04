import { printLabel, printPackSlip } from '@academysports/aso-env';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { get } from '@react-nitro/error-boundary';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import Button from '@academysports/fusion-components/dist/Button';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  PICK_UP_INSTORE,
  PICKUP_DATE,
  READY_FOR_PICKUP,
  MAX_PICKUP_DATE,
  SHIP_TO_STORE,
  ESTIMATED_FROM_DATE,
  EVENT_NAME,
  EVENT_CATEGORY,
  DATE_YEAR_FORMAT,
  SHIP_TO_HOME_RETURN_VALUE,
  NOT_ELIGIBLE_ERROR_KEY,
  PACK_SLIP_LABEL,
  CANCELLED_LABEL,
  STATUS_CANCELLED,
  CANCEL_ELIGIBLE,
  SUBMITTED_LABEL,
  SHIPPED_LABEL
} from './constants';
import { card, backButton, imageStyle, skulabel, returnWrapper, hoverBlue, displayMobileNone } from './orderDetails.styles';
import FlashError from './flashError/flashError';
import InStorePickUp from './inStorePickUp';
import OrderSummary from './orderSummary';
import OrderPayment from '../orderPayment';
import OrderNote from '../orderNote';
import InStorePickupInstrc from '../inStorePickupInstrc';
import ShowShippingInfo from './shippingAddressInfo/shippingAddressInfo';
import { dollarFormatter, padDigits } from '../../utils/helpers';
import { dateFormatter, isDate } from '../../utils/dateUtils';
import { getReturnOrderAnalyticsObject, getOrderType } from '../../utils/analytics/ordersAnalyticsHelpers';
import withScroll from '../../hoc/withScroll';

class OrderDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.productRow = this.productRow.bind(this);
    this.toggleRedirection = this.toggleRedirection.bind(this);
    this.renderBackButton = this.renderBackButton.bind(this);
    this.renderCancelOrderBanner = this.renderCancelOrderBanner.bind(this);
    this.renderError = this.renderError.bind(this);
    this.renderOrderStatus = this.renderOrderStatus.bind(this);
    this.printReturnLabel = this.printReturnLabel.bind(this);
    this.fnPrintPackingSlip = this.fnPrintPackingSlip.bind(this);
    this.storeDetails = this.storeDetails.bind(this);
    this.onTrackAnalytics = this.onTrackAnalytics.bind(this);
    this.renderActionItems = this.renderActionItems.bind(this);
    this.getOrderId = this.getOrderId.bind(this);
    this.getOrderType = this.getOrderType.bind(this);
    this.onLoadAnalytics = this.onLoadAnalytics.bind(this);
    this.submitReturnOrderAnalytics = this.submitReturnOrderAnalytics.bind(this);
    this.state = {
      beginIndex: new URLSearchParams(window.location.search).get('beginIndex') || 0
    };
  }
  /**
   * function to redirect unauthenticated user to order search page,
   * otherwise fetch data deoending on if user came from order search or order listing
   */
  componentDidMount() {
    const { match, search, loadSelectedOrderDetails, authenticated, breadCrumbAction, cms, scrollPageToTop } = this.props;
    if (!authenticated) {
      if (match.params.zipCode) {
        loadSelectedOrderDetails(match.params.id, match.params.zipCode);
      } else {
        window.location.href = '/myaccount/orders';
      }
    } else if (search) {
      loadSelectedOrderDetails(match.params.id, match.params.zipCode);
    } else {
      const orderNumber = match.params.id;
      loadSelectedOrderDetails(orderNumber);
    }
    breadCrumbAction(cms.orderDetailsLabel);
    scrollPageToTop();
  }
  /**
   * function for calling the store address API when store id is recieved
   * @param {object} nextProps recieving the updated props
   */
  componentWillReceiveProps(nextProps) {
    if (
      this.props.orderDetailsById !== nextProps.orderDetailsById &&
      Object.keys(nextProps.orderDetailsById).length !== 0 &&
      nextProps.orderDetailsById.orders[0].inStorePickUpDetails
    ) {
      const storeId =
        nextProps.orderDetailsById.orders &&
        nextProps.orderDetailsById.orders[0].inStorePickUpDetails &&
        padDigits(parseInt(nextProps.orderDetailsById.orders[0].inStorePickUpDetails.physicalStoreId, 10), 4);
      this.props.getStoreAddressDetailsFn(storeId);
    }
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.orderDetailsById) !== JSON.stringify(prevProps.orderDetailsById)) {
      this.onLoadAnalytics();
    }
  }
  /**
   * Method handle on track analytics
   */
  onTrackAnalytics() {
    const { analyticsContent } = this.props;
    const orderId = this.getOrderId();
    const analyticsData = {
      event: EVENT_NAME,
      eventCategory: EVENT_CATEGORY,
      eventAction: 'my orders|find order',
      eventLabel: 'track shipment',
      ordertype: this.getOrderType(),
      orderid: `${orderId}`
    };
    analyticsContent(analyticsData);
  }
  /**
   * method handle on load analytics
   */
  onLoadAnalytics() {
    const { analyticsContent } = this.props;
    const orderType = this.getOrderType();
    const orderId = this.getOrderId();
    const analyticsData = {
      event: EVENT_NAME,
      eventCategory: EVENT_CATEGORY,
      eventAction: 'my orders|view order details',
      eventLabel: `order detail|${orderId}`,
      ordertype: orderType,
      orderid: orderId
    };
    analyticsContent(analyticsData);
  }
  /**
   * method return order id
   */
  getOrderId() {
    const { orderDetailsById } = this.props;
    const { orders } = orderDetailsById;
    return orders && orders.length !== 0 && orders[0].orderNumber ? orders[0].orderNumber : '';
  }
  /**
   * method return order type
   */
  getOrderType() {
    const { orderDetailsById } = this.props;
    const order = get(orderDetailsById, 'orders[0]', '');
    return order ? getOrderType(order) : SHIP_TO_HOME_RETURN_VALUE; // This getOrderType() is the imported util function
  }
  /**
   * Method to return total price, used for the Analytics object.
   */
  getTotalPrice() {
    const { orderDetailsById } = this.props;
    return get(orderDetailsById, 'orders[0].price.total', '');
  }

  /**
   * Method to get Order status using shipment object
   * Status taken from individual item level
   */
  getOrderStatus = (shipmentObj = {}, item = {}) => {
    const { items: shipmentItems = [] } = shipmentObj;
    const { items } = item;
    const itemOrderIdFromShipment = shipmentItems.length ? shipmentItems[0] : '';

    const filteredItem = items.filter(({ orderItemsId }) => orderItemsId === itemOrderIdFromShipment);
    const { status } = filteredItem.length ? filteredItem[0] : {};
    return status;
  };

  /**
   * Authenticated users render profile email or email associated to an order.
   */
  getShippingEmail = email => {
    const { authenticated, profileEmail } = this.props;
    return authenticated ? profileEmail : email;
  };

  /**
   * Method to push analytics object on CTA of Return button.
   */
  submitReturnOrderAnalytics() {
    const { analyticsContent, fninitiateOrderReset } = this.props;
    fninitiateOrderReset();
    analyticsContent(getReturnOrderAnalyticsObject('return', this.getOrderId(), this.getOrderType(), this.getTotalPrice()));
  }

  /**
   * function to trigger api and open return label in new window
   * @param {string} orderNumber
   */
  printReturnLabel(rmaId) {
    const requestURL = printLabel(rmaId);
    const newWin = window.open(requestURL);
    newWin.opener = null;
  }
  /**
   * function to trigger api and print label in new window
   */
  fnPrintPackingSlip(orderNumber, invNum) {
    const requestURL = printPackSlip(orderNumber, invNum);
    const newWin = window.open(requestURL);
    const { orderDetailsById, analyticsContent } = this.props;
    const order = get(orderDetailsById, 'orders[0]', '');
    const analyticsData = {
      event: 'downloadContent',
      eventCategory: 'print',
      eventAction: 'print packslip',
      eventLabel: 'pdf',
      ordertype: `${order ? getOrderType(order) : 'ship to home'}`,
      orderid: `${get(orderDetailsById, 'orders[0].orderNumber', '')}`
    };
    analyticsContent(analyticsData);
    newWin.opener = null;
  }
  /**
   * func to redirect user to store details page
   * @param {bool} viewStoreDetails call has been made from view store details
   */
  storeDetails(viewStoreDetails = false) {
    const { analyticsContent, orderDetailsById, storeAddressDetail } = this.props;
    const orderId = get(orderDetailsById, 'orders[0].orderNumber', '');
    const orderType = this.getOrderType();
    const analyticsData = {
      event: EVENT_NAME,
      eventCategory: EVENT_CATEGORY,
      eventAction: 'my orders|return online|confirm & return items',
      eventLabel: `order|${orderId}`,
      ordertype: orderType,
      orderid: `${orderId}`,
      'cancelled/return revenue': get(orderDetailsById, 'orders[0].price.total', '')
    };
    const storeId = get(storeAddressDetail, 'data.stores[0].storeId', '');
    if (viewStoreDetails) {
      analyticsData.event = 'search';
      analyticsData.eventCategory = 'my account';
      analyticsData.eventAction = 'my orders|view store detail';
      analyticsData.eventLabel = `store|${storeId || ''}`;
      analyticsData.searchresultscount = null;
      analyticsData.storeid = storeId;
      analyticsData.storesearchkeyword = null;
      analyticsData.successfulstorefinder = 0;
      analyticsData.unsuccessfullstorefinder = 0;
      analyticsData.viewstoredetails = 1;
    }
    analyticsContent(analyticsData);
    const stateCode = get(storeAddressDetail, 'data.stores[0].properties.stateCode', '');
    const city = get(storeAddressDetail, 'data.stores[0].properties.city', '');
    const state = stateCode ? stateCode.toLowerCase() : '';
    const cityName = city ? city.toLowerCase() : '';
    const linkToStore = `/shop/storelocator/${state || ''}/${cityName || ''}/store-${storeId || ''}`;
    const newWin = window.open(linkToStore);
    newWin.opener = null;
  }

  /**
   * Method to filter out all associated bundle items to product
   * @param {*} orders
   */
  filterOutItemsByShipmentType(items, shipmentObj = {}) {
    const { itemAndStatus = [] } = shipmentObj;
    if (!shipmentObj.items || !shipmentObj.items.length) {
      return [];
    }
    return items.filter(item => {
      const index = Object.keys(itemAndStatus).indexOf(item.orderItemsId);
      if (index > -1) {
        return itemAndStatus[item.orderItemsId] === item.status;
      }
      return false;
    });
  }
  /**
   * function to display product blades for order
   * @param {object} cms
   * @param {object} order
   * @param {object} shipmentObj
   */
  productRow(cms, order, shipmentObj) {
    if (!order.items || !order.items.length) {
      return '';
    }
    const items = this.filterOutItemsByShipmentType(order.items, shipmentObj);
    return items.map(orderItems => (
      <Fragment>
        <div className="d-flex flex-row pt-2 mb-2 justify-content-between">
          <div className="d-flex flex-row w-100">
            <div className="col-4 col-md-2 pt-half px-0">
              <img src={`${orderItems.imageURL}?wid=150&hei=150`} alt={orderItems.name} className={imageStyle} />
            </div>
            <div className="col-8 px-0 px-md-1">
              <div className="d-flex flex-row pb-half">
                <span className="o-copy__14reg">{orderItems.name}</span>
                <span className="o-copy__16reg d-none d-md-block" />
              </div>
              <div>
                {Object.keys(orderItems.attributes).map(k => (
                  <div className="pb-half">
                    <span className="o-copy__14bold pr-half">{k}:</span>
                    <span className="o-copy__14reg">{orderItems.attributes[k]}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex pb-half">
                <span className="o-copy__14bold pr-half">{cms.commonLabels.quantityLabel}: </span>
                <span className="o-copy__14reg"> {orderItems.quantity}</span>
              </div>
              <div className="d-flex justify-content-between pb-half pb-md-1">
                <div className="d-flex">
                  <div className={classNames('o-copy__12reg pr-half', skulabel)}>{cms.commonLabels.skuLabel}:</div>
                  <div className={classNames('o-copy__12reg', skulabel)}>{orderItems.skuId}</div>
                </div>
                <div className="d-md-none d-block">
                  <div className="o-copy__20reg">{dollarFormatter(orderItems.totalItemPrice)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-none d-md-block col-2 pr-0 text-right">
            <span className="o-copy__16reg">{dollarFormatter(orderItems.totalItemPrice)}</span>
          </div>
        </div>
        <div className="offset-3 pl-1">
          {orderItems.returnQty && (
            <div>
              <div>
                <section className={`${returnWrapper} d-flex flex-column p-half mb-1`}>
                  <span className="d-flex">
                    <p className="o-copy__14reg mb-0 pr-half">{cms.returnInitiatedText}</p>
                    <p className="o-copy__14bold pr-half">{dateFormatter(orderItems.itemExtraAttributes.orderReturnTime, DATE_YEAR_FORMAT)}</p>
                    {/* date key not yet available  from wcs */}
                    <p className="o-copy__14reg mb-0 pr-half">{cms.quantityToReturnText}</p>
                    <p className="o-copy__14bold"> {orderItems.returnQty}</p>
                    {/* date key not yet available from wcs */}
                  </span>
                </section>
              </div>
              <span className="o-copy__12reg">{cms.yourRefundInformation}</span>
              <div className="py-half">
                <Button
                  size="S"
                  btntype="secondary"
                  className="col-md-6 col-12 o-copy__14bold p-0 mt-2"
                  onClick={() => this.printReturnLabel(order.rmaId)}
                >
                  {cms.printReturnButtonLabel}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Fragment>
    ));
  }
  /**
   * the function changes the redirection to false once the user comes to listing page
   */
  toggleRedirection() {
    this.props.fnToggleRedirection();
    this.props.handleBackToOrders();
  }

  /**
   * function for returning the Arrive info based on which date from from or to dates are present
   * @param {object} item order item
   * @param {string} classname
   */
  arriveDateChecker(item, classname, estimatedDate = null) {
    if (item) {
      const { estimatedFromDate: fromDate, estimatedToDate: toDate } = item;
      const hasFromDate = isDate(fromDate);
      const hasToDate = isDate(toDate);

      if (hasFromDate && hasToDate) {
        return (
          <span className={classname}>
            {dateFormatter(fromDate).split(',')[0]} - {dateFormatter(toDate).split(',')[0]}
          </span>
        );
      } else if (hasFromDate) {
        return <span className={classname}>{dateFormatter(fromDate).split(',')[0]}</span>;
      } else if (hasToDate) {
        return <span className={classname}>{dateFormatter(toDate).split(',')[0]}</span>;
      } else if (isDate(estimatedDate)) {
        return (
          <span className={classname}>
            &#160;-&#160;
            {dateFormatter(estimatedDate)}
          </span>
        );
      }
    }

    return null;
  }

  /**
   * render staus message with cms data
   * @param {string} text, cms data
   * @param {date} date
   * @param {string} key
   */
  renderInterpolation(text, date, key) {
    if (/\d/.test(key)) {
      return text.replace(/{{date}}/, key);
    }
    if (text && date) {
      return text.replace(/{{date}}/, dateFormatter(date[key]));
    }
    return text;
  }

  /**
   * function to render status text based on status code
   * @param {object} item
   * @param {object} storeDetails
   */

  renderOrderStatus(item, storeDetails, shipmentObj) {
    const { cms } = this.props;
    const status = this.getOrderStatus(shipmentObj, item);

    if (shipmentObj.bopis) {
      switch (status) {
        case 'V':
          return (
            <div className="d-flex flex-column">
              <div>
                <span className="o-copy__14bold">
                  {cms.inStorePickupLabel.inStorePickupFromLabel} {storeDetails.neighborhood}
                </span>
              </div>
              <div className="d-flex pb-half">
                <span className="o-copy__14bold pr-half">{this.renderInterpolation(cms.pickedUpText, shipmentObj, PICKUP_DATE)}</span>
                <span className="o-copy__14reg">
                  ({shipmentObj.items.length} {cms.itemLabel})
                </span>
              </div>
            </div>
          );
        case 'S':
        case 'B':
        case 'N':
        case 'G':
        case 'C':
        case 'M':
          return (
            <div className="d-flex flex-column py-half">
              <div>
                <span className="o-copy__14bold">
                  {cms.inStorePickupLabel.inStorePickupFromLabel} {storeDetails.neighborhood}
                </span>
              </div>
              <div>
                <span className="o-copy__14bold pr-half">
                  {this.renderInterpolation(cms.estimatedPickUpDateOrderStatus || '', shipmentObj, ESTIMATED_FROM_DATE)}
                </span>
              </div>
            </div>
          );

        case 'K':
          return (
            <div className="d-flex flex-column py-half">
              <div>
                <span className="o-copy__14bold">
                  {cms.inStorePickupLabel.inStorePickupFromLabel} {storeDetails.neighborhood}
                </span>
              </div>
              <div>
                <span className="o-copy__14bold pr-half">{this.renderInterpolation(cms.readyForPickup, shipmentObj, READY_FOR_PICKUP)}</span>
                <span className="o-copy__14reg">
                  ({shipmentObj.items.length} {cms.itemLabel}) {this.renderInterpolation(cms.pickupDateLabel, shipmentObj, MAX_PICKUP_DATE)}
                </span>
              </div>
              <span className="o-copy__14reg">{cms.cancelNoteLabel}</span>
            </div>
          );

        default:
          return null;
      }
    } else {
      switch (status) {
        case 'V':
          return (
            <div className="d-flex flex-column">
              <div>
                <span className="o-copy__14bold">
                  {cms.inStorePickupLabel.inStorePickupFromLabel} {storeDetails.neighborhood}
                </span>
              </div>
              <div className="d-flex pb-half">
                <span className="o-copy__14bold pr-half">{this.renderInterpolation(cms.pickedUpText, shipmentObj, PICKUP_DATE)}</span>
                <span className="o-copy__14reg">
                  ({shipmentObj.items.length} {cms.itemLabel})
                </span>
              </div>
            </div>
          );
        case 'K':
          return (
            <div className="d-flex flex-column py-half">
              <div>
                <span className="o-copy__14bold">
                  {cms.inStorePickupLabel.inStorePickupFromLabel} {storeDetails.neighborhood}
                </span>
              </div>
              <div>
                <span className="o-copy__14bold pr-half">{this.renderInterpolation(cms.readyForPickup, shipmentObj, READY_FOR_PICKUP)}</span>
                <span className="o-copy__14reg">
                  ({shipmentObj.items.length} {cms.itemLabel}) {this.renderInterpolation(cms.pickupDateLabel, shipmentObj, MAX_PICKUP_DATE)}
                </span>
              </div>
              <span className="o-copy__14reg">{cms.cancelNoteLabel}</span>
            </div>
          );
        case 'S':
          return (
            <div className="d-flex py-half">
              <span className="o-copy__14bold pr-half">
                <span>{cms.orderShippedLabel || SHIPPED_LABEL}: </span>
                <span>{cms.estimatedArrivalLabel} </span>
                <span>{this.arriveDateChecker(shipmentObj, 'o-copy__14bold', item.estimatedShipDate)}</span>
              </span>
              <span className="o-copy__14reg">
                ({shipmentObj.items.length} {cms.itemLabel})
              </span>
            </div>
          );
        case 'd':
        case 'D':
          return (
            <div className="d-flex py-half">
              <span className="o-copy__14bold pr-half">
                {cms.deliveredOnLabel} {dateFormatter(item.orderDeliveredDate, DATE_YEAR_FORMAT)}:
              </span>
              <span className="o-copy__14reg">
                ({shipmentObj.items.length} {cms.itemLabel})
              </span>
            </div>
          );
        case 'B':
        case 'N':
        case 'G':
        case 'C':
        case 'M':
          return (
            <div className="d-flex py-half">
              <span className="o-copy__14bold pr-half">{cms.orderSubmittedLabel || SUBMITTED_LABEL}:</span>
              <span className="o-copy__14reg">
                {cms.estimatedArrivalLabel} {this.arriveDateChecker(shipmentObj, 'o-copy__14reg', item.estimatedShipDate)}
              </span>
            </div>
          );
        case STATUS_CANCELLED:
          return (
            <div className="d-flex py-half">
              <span className="o-copy__14bold pr-half">{cms.orderCancelledLabel || CANCELLED_LABEL}</span>
            </div>
          );
        default:
          return null;
      }
    }
  }

  /**
   * render API side error messsages
   */
  renderError() {
    const { orderCancelError, errorMsg, orderCancelErrorKey, cms, orderDetailsById } = this.props;
    let errorKey = orderCancelErrorKey;
    let orderIneligible = 'N';
    if (
      orderDetailsById &&
      orderDetailsById.orders[0] &&
      orderDetailsById.orders[0].extraAttributes &&
      orderDetailsById.orders[0].extraAttributes.orderIneligibleCancel
    ) {
      orderIneligible = orderDetailsById.orders[0].extraAttributes.orderIneligibleCancel;
      errorKey = NOT_ELIGIBLE_ERROR_KEY;
    }
    const errorMessage = errorMsg[errorKey] || cms.errorMsg[errorKey];
    return orderCancelError || (orderIneligible === 'Y' && CANCEL_ELIGIBLE.indexOf(orderDetailsById.orders[0].orderStatus) > -1) ? (
      <FlashError errorMessage={errorMessage} wrapperClassName="d-flex flex-column p-1 mt-2 mb-half" />
    ) : null;
  }

  /**
   * function to display banner with order canceeled date , if order is in
   * cancelled state
   * @param {object} item
   */
  renderCancelOrderBanner(item) {
    const { cms } = this.props;
    if (item.orderStatus !== 'X') {
      return null;
    }

    const errorMessage = `${cms.orderCancelText} ${item.extraAttributes && dateFormatter(item.extraAttributes.orderCancelledTime, DATE_YEAR_FORMAT)}`;
    return <FlashError errorMessage={errorMessage} wrapperClassName="d-flex flex-column p-1 mt-2 mb-half text-center" />;
  }

  /**
   * function to render back button at the top of order details page
   */
  renderBackButton() {
    const { cms, authenticated } = this.props;
    return (
      <div className={classNames('d-flex flex-row mb-2 mb-md-3', displayMobileNone)}>
        <NavLink to={`/myaccount/orders?beginIndex=${this.state.beginIndex}`}>
          <button className={classNames('d-flex flex-row align-items-center', backButton)} onClick={this.toggleRedirection} tabIndex="-1">
            {authenticated && (
              <React.Fragment>
                <span className="academyicon icon-chevron-left pr-half pr-md-half" />
                <span className={classNames('o-copy__14reg d-md-block d-print-block ', hoverBlue)}> {cms.backToOrderLabel} </span>
              </React.Fragment>
            )}
          </button>
        </NavLink>
      </div>
    );
  }

  /**
   * func to render track shipment , order return and store details button
   * @param {object} shipmentItem
   * @param {string} zipCode
   */
  renderActionItems(shipmentItem) {
    const { cms, match, orderDetailsById } = this.props;
    const { orders } = orderDetailsById;
    const { params } = match;
    const { trackingNumber, trackingURL, initiateReturn, shipMethodId, shipmentNum, invNum } = shipmentItem;
    return (
      <div className="d-flex col-12 flex-column flex-md-row w-100 px-0 mt-2 my-md-2">
        {trackingNumber && trackingURL ? (
          <a
            href={`${trackingURL.concat(trackingNumber)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pl-0 pr-md-1"
            aria-current="page"
            tabIndex="-1"
          >
            <Button size="S" type="submit" className="col-12 col-md-none mb-2 mb-md-0 o-copy__14bold px-1" onClick={this.onTrackAnalytics}>
              {cms.trackShipmentButtonLabel}
            </Button>
          </a>
        ) : null}
        {shipMethodId === PICK_UP_INSTORE || shipMethodId === SHIP_TO_STORE ? (
          <Button size="S" className="o-copy__14bold mb-2 mb-md-0  mr-md-1" onClick={() => this.storeDetails(true)}>
            {cms.inStorePickupLabel.viewStoreDetailsLabel}
          </Button>
        ) : null}
        {initiateReturn ? (
          <NavLink
            to={`/myaccount/return/orders/${params.id}/${params.zipCode || orders[0].billingAddress.zipCode}/${shipmentNum}`}
            aria-current="page"
            tabIndex="-1"
            className="pl-0 pr-md-1"
          >
            <Button
              size="S"
              btntype="secondary"
              className="col-12 col-md-none o-copy__14bold mr-md-1 mb-2 mb-md-0 "
              onClick={this.submitReturnOrderAnalytics}
            >
              {cms.returnButtonLabel}
            </Button>
          </NavLink>
        ) : null}
        {orders[0].orderNumber && invNum ? (
          <Button
            size="S"
            btntype="secondary"
            className="o-copy__14bold mr-md-1 mb-md-0"
            onClick={() => this.fnPrintPackingSlip(orders[0].orderNumber, invNum)}
          >
            {cms.packslipButtonLabel || PACK_SLIP_LABEL}
          </Button>
        ) : null}
      </div>
    );
  }
  render() {
    const {
      cms,
      orderDetailsById,
      handleBackToOrders,
      fnCancelOrder,
      orderCancelRedirect,
      orderCancelError,
      orderCancelErrorKey,
      storeAddress,
      analyticsContent
    } = this.props;
    const { shipmentLabel = '' } = cms;
    const storeDetails = storeAddress && Object.keys(storeAddress.data).length > 0 && storeAddress.data.stores[0].properties;
    if (orderDetailsById && orderDetailsById.orders) {
      return (
        <Fragment>
          {orderDetailsById.orders.map(item => {
            const date = item.orderPlacedDate ? dateFormatter(item.orderPlacedDate, DATE_YEAR_FORMAT) : '';
            return (
              <div className="container-fluid pb-0 pb-md-1">
                {this.renderBackButton()}
                <h5>{cms.orderDetailsLabel}</h5>
                {this.renderError()}
                {this.renderCancelOrderBanner(item)}
                <div className={classNames('mb-0 mb-md-2', card)}>
                  <div className="px-1 px-md-3 pb-3">
                    <div className="d-flex flex-row flex-wrap pt-2">
                      <div className="col-12 col-md-5 px-0">
                        <span className="o-copy__16bold">{cms.orderPlacedOnLabel}</span>
                        <span className="o-copy__16reg pl-half">{date}</span>
                      </div>
                      <div className="col-12 col-md-7 px-0">
                        <span className="o-copy__16bold">{cms.orderNumberMyAccount}</span>
                        <span className="o-copy__16reg pl-half">{item.orderNumber}</span>
                      </div>
                    </div>
                    <hr className="mb-2" />
                    {item.shipments.map((shipmentItem, i) => (
                      <React.Fragment>
                        {item.shipments.length > 0 ? (
                          <span className="o-copy__14reg">
                            <label className="o-copy__14bold mb-0">
                              {shipmentLabel} {i + 1}
                              &#160;of&#160;
                              {item.shipments.length}
                            </label>
                          </span>
                        ) : null}
                        {this.renderOrderStatus(item, storeDetails, shipmentItem)}
                        {this.renderActionItems(shipmentItem)}
                        {/* <div className="o-copy__14reg mb-2">
                          {cms.estimatedArrivalLabel}: {arrivalDate} ({item.items.length}) <span className="o-copy__14reg">Item</span>
                        </div> */}
                        {orderDetailsById.orders.map(orderItem => this.productRow(cms, orderItem, shipmentItem))}
                        {item.shipments.length - 1 !== i && <hr className="mb-2" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {item.containsSpecialOrderItem && (
                  <InStorePickUp label="Special Order Ship To Store" cms={cms} details={item.inStorePickUpDetails} storeDetails={storeDetails} />
                )}
                {!item.containsBopusItemsOnly && !item.containsSpecialOrderItemsOnly ? (
                  <ShowShippingInfo
                    cms={cms}
                    orderDetails={item.shippingAddress}
                    email={this.getShippingEmail(item.email)}
                    shipment={item.shipments.filter(ship => ship.shipMethodId !== PICK_UP_INSTORE && ship.shipMethodId !== SHIP_TO_STORE)}
                  />
                ) : null}
                {item.shipMethodId === PICK_UP_INSTORE || item.shipMethodId === SHIP_TO_STORE ? (
                  <InStorePickUp
                    label={cms.inStorePickupLabel.inStorePickupLabel}
                    cms={cms}
                    details={item.inStorePickUpDetails}
                    storeDetails={storeDetails}
                  />
                ) : null}
                {item.containsBopusItems &&
                  item.orderStatus !== 'V' && (
                    <Fragment>
                      <InStorePickupInstrc cms={cms} />
                      <OrderNote cms={cms} />
                    </Fragment>
                  )}
                <OrderSummary
                  cms={cms}
                  handleBackToOrders={handleBackToOrders}
                  orderDetailsById={orderDetailsById}
                  fnCancelOrder={fnCancelOrder}
                  orderCancelError={orderCancelError}
                  orderCancelErrorKey={orderCancelErrorKey}
                  orderCancelRedirect={orderCancelRedirect}
                  analyticsContent={analyticsContent}
                />
                {this.props.authenticated ? <OrderPayment cms={cms} orderDetailsById={orderDetailsById} /> : null}
              </div>
            );
          })}
          <div />
        </Fragment>
      );
    }
    return null;
  }
}

OrderDetails.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetailsById: PropTypes.object,
  handleBackToOrders: PropTypes.func,
  loadSelectedOrderDetails: PropTypes.func,
  getStoreAddressDetailsFn: PropTypes.func,
  search: PropTypes.bool,
  match: PropTypes.object,
  fnCancelOrder: PropTypes.func,
  orderCancelError: PropTypes.bool,
  orderCancelErrorKey: PropTypes.string,
  // orderCancelErrorMessage: PropTypes.string,
  orderCancelRedirect: PropTypes.bool,
  authenticated: PropTypes.bool,
  fnToggleRedirection: PropTypes.func,
  errorMsg: PropTypes.object,
  breadCrumbAction: PropTypes.func,
  storeAddress: PropTypes.object,
  scrollPageToTop: PropTypes.func,
  analyticsContent: PropTypes.func,
  storeAddressDetail: PropTypes.object,
  // fnPrintReturnLabel: PropTypes.func
  profileEmail: PropTypes.string,
  fninitiateOrderReset: PropTypes.func
};

const WrappedOrderDetails = withScroll(OrderDetails);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WrappedOrderDetails {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WrappedOrderDetails;
