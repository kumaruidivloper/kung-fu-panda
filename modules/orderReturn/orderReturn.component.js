import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { printLabel } from '@academysports/aso-env';
import PropTypes from 'prop-types';
import { get } from '@react-nitro/error-boundary';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import Button from '@academysports/fusion-components/dist/Button';
import OrderReturnDropdown from '../orderReturnDropdown';
import { bgNone, imageStyle, containerStyle, skulabel, returnWrapper, errorWrapper, btnAlignment } from './style';
import { dateFormatter } from '../../utils/dateUtils';
import { NODE_TO_MOUNT, DATA_COMP_ID, DATE_YEAR_FORMAT, BACK_TO_ORDER_DETAILS_LABEL } from './constants';
import { dollarFormatter } from '../../utils/helpers';
import { getReturnOrderAnalyticsObject, getOrderType, enhancedAnalyticsTrackingOrders } from '../../utils/analytics/ordersAnalyticsHelpers';
import ReturnInstructions from './returnInstructions';
import withScroll from '../../hoc/withScroll';

class OrderReturn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationScreen: false,
      selectedOption: '',
      returnItems: {}
    };
    this.updateItemQuantity = this.updateItemQuantity.bind(this);
    this.continueReturn = this.continueReturn.bind(this);
    this.initiateReturn = this.initiateReturn.bind(this);
    this.printReturnLabel = this.printReturnLabel.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  componentWillMount() {
    const { match, loadOrderDetails, orderDetailsById, analyticsContent } = this.props;
    enhancedAnalyticsTrackingOrders(orderDetailsById, analyticsContent);
    loadOrderDetails(match.params.id, match.params.zipCode);
  }

  componentDidMount() {
    const { scrollPageToTop } = this.props;
    scrollPageToTop();
  }

  getOrderId() {
    const { orderDetailsById } = this.props;
    return get(orderDetailsById, 'orders[0].orderNumber', '');
  }

  getTotalPrice() {
    const { orderDetailsById } = this.props;
    return get(orderDetailsById, 'orders[0].price.total', '');
  }

  updateItemQuantity(itemId, qty, reason, returnEligible, skuId, orderItemsId, invNum, selectedCode) {
    const { cms } = this.props;
    this.setState({
      selectedOption: reason,
      returnItems: {
        ...this.state.returnItems,
        [itemId]: {
          quantity: qty,
          reason: selectedCode,
          returnEligible,
          productId: skuId,
          orderItemsId,
          invNum,
          comment: cms.selectReasonDropdownOptions[reason - 1].text
        }
      }
    });
  }
  initiateReturn() {
    const { analyticsContent, cms } = this.props;
    const orderDetailsById = this.props.orderDetailsById.orders[0];
    const data = {
      invoiceNumber: orderDetailsById.invoiceNumber,
      rmaId: orderDetailsById.rmaId ? orderDetailsById.rmaId : '',
      oldOrder: orderDetailsById.oldOrder,
      orderId: orderDetailsById.orderNumber,
      splitshipstatus: orderDetailsById.splitShipStatus,
      submitted: true,
      responsive: true,
      zipCode: orderDetailsById.billingAddress.zipCode,
      create: orderDetailsById.rmaId || '',
      itemReturnAttributes: Object.values(this.state.returnItems)
    };
    analyticsContent(
      getReturnOrderAnalyticsObject(
        cms.confirmReturnButtonLabel,
        this.getOrderId(),
        getOrderType(get(this.props, 'orderDetailsById.orders[0]', {})),
        this.getTotalPrice()
      )
    );
    this.props.fnInitiateReturnOrder(data);
  }
  continueReturn() {
    const { analyticsContent, orderDetailsById, cms } = this.props;
    analyticsContent(
      getReturnOrderAnalyticsObject(
        cms.confirmContinueButtonLabel,
        this.getOrderId(),
        getOrderType(get(orderDetailsById, 'orders[0]', {})),
        this.getTotalPrice()
      )
    );
    this.setState({
      showConfirmationScreen: true
    });
  }
  /**
   * function to trigger api and open return label in new window
   * @param {string} orderNumber
   */
  printReturnLabel(orderNumber) {
    const requestURL = printLabel(orderNumber);
    window.open(requestURL);
  }
  productRow(cms, item, order, shipItem) {
    const shipItems = shipItem.items;
    const { showConfirmationScreen, returnItems, selectedOption } = this.state;
    const { showSucessScreen } = this.props;
    return (
      item.items &&
      item.items.map(orderItems => {
        if ((showSucessScreen && !returnItems[orderItems.skuId]) || (showConfirmationScreen && !returnItems[orderItems.skuId])) {
          return null;
        }
        if (shipItems.indexOf(orderItems.orderItemsId) > -1 && shipItem.invNum === orderItems.invNum) {
          if ((orderItems.initiateReturn && orderItems.status !== 'X') || returnItems[orderItems.skuId]) {
            const returnItem = returnItems && returnItems[orderItems.skuId];
            const returnQuantity = returnItem && returnItem.quantity;
            return (
              <div>
                <div className="d-flex flex-row pt-2 justify-content-around">
                  <div className="col-2">
                    <img src={orderItems.imageURL} alt={orderItems.name} className={imageStyle} />
                  </div>
                  <div className="col-6">
                    <div className="d-flex flex-row pb-half">
                      <span className="o-copy__14reg">{orderItems.name}</span>
                      <span className="o-copy__16reg d-none d-md-block" />
                    </div>
                    <div>
                      {Object.keys(orderItems.attributes).map(k => (
                        <div className="d-flex pb-half">
                          <span className="o-copy__14bold pr-half">{k}:</span>
                          <span className="o-copy__14reg">{orderItems.attributes[k]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex pb-half">
                      <span className="o-copy__14bold pr-half">{cms.commonLabels.quantityLabel}: </span>
                      <span className="o-copy__14reg"> {orderItems.quantity - orderItems.returnQty || orderItems.quantity}</span>
                    </div>
                    <div className="d-flex justify-content-between pb-half pb-md-1">
                      <div className="d-flex">
                        <div className={classNames('o-copy__12reg pr-half', skulabel)}>{cms.commonLabels.skuLabel}:</div>
                        <div className={classNames('o-copy__12reg', skulabel)}>{orderItems.skuId}</div>
                      </div>
                      <div className="d-md-none d-block">
                        <div className="o-copy__14reg">{dollarFormatter(orderItems.totalItemPrice)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="d-none d-md-block col-2 pr-0 text-right">
                    <span className="o-copy__16reg">{dollarFormatter(orderItems.totalItemPrice)}</span>
                  </div>
                </div>
                {showConfirmationScreen ? (
                  <div className="offset-3 pr-1">
                    {returnItems[orderItems.skuId] && (
                      <section className={`${returnWrapper} d-flex flex-column p-half mb-1`}>
                        <span className="d-flex">
                          <p className="o-copy__14reg mb-0 mr-quarter">{cms.reasonLabel} </p>
                          <p className="o-copy__14bold pr-half">{cms.selectReasonDropdownOptions[selectedOption - 1].text}</p>
                          <p className="o-copy__14reg mb-0 mr-quarter">{cms.quantityToReturnText} </p>
                          <p className="o-copy__14bold">{returnItems && returnItems[orderItems.skuId] && returnItems[orderItems.skuId].quantity}</p>
                        </span>
                      </section>
                    )}
                    {this.props.showSucessScreen && (
                      <div>
                        <div className="o-copy__14reg">{cms.yourRefundInformation}</div>
                        <div className="py-half">
                          <Button
                            size="S"
                            btntype="secondary"
                            className="col-md-6 col-12 o-copy__14bold p-0"
                            onClick={() => this.printReturnLabel(order[0].rmaId)}
                          >
                            {cms.printReturnButtonLabel}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pl-0 pl-md-3 pb-2">
                    <OrderReturnDropdown
                      cms={cms}
                      returnEligible={orderItems.returnEligible}
                      skuId={orderItems.skuId}
                      orderItemsId={orderItems.orderItemsId}
                      quantity={
                        (this.state.returnItems[orderItems] && this.state.returnItems[orderItems].quantity) ||
                        (orderItems.returnQty && orderItems.quantity - orderItems.returnQty) ||
                        orderItems.quantity
                      }
                      itemId={orderItems.skuId}
                      updateItemQuantity={this.updateItemQuantity}
                      invNum={orderItems.invNum}
                    />
                  </div>
                )}
                {showConfirmationScreen &&
                  returnQuantity >= 1 &&
                  !showSucessScreen && (
                    <div className="offset-3">
                      <span className="o-copy__12reg">{cms.yourRefundInformation}</span>
                    </div>
                  )}
              </div>
            );
          }
        }
        return <div />;
      })
    );
  }
  renderHelpText(showSucessScreen, showConfirmationScreen, cms) {
    return (
      <div className="o-copy__14reg mx-half pl-0 pl-md-3 pb-1 pb-d-2">
        {!showSucessScreen && !showConfirmationScreen && cms.pleaseSelectReasonText}
        {!showSucessScreen && showConfirmationScreen && cms.pleaseConfirmReturnOrderText}
        {showSucessScreen && cms.returnSummaryText}
      </div>
    );
  }
  /**
   * render API side error messsages
   */
  renderError() {
    const { error, errorMsg, errorKey, cms } = this.props;
    return error ? (
      <div>
        <section className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
          <p className="o-copy__14reg mb-0">{errorMsg[errorKey] || cms.errorMsg[errorKey]}</p>
        </section>
      </div>
    ) : null;
  }
  render() {
    const { cms, match, orderDetailsById, showSucessScreen } = this.props;
    const { showConfirmationScreen, returnItems } = this.state;
    const { params } = match;
    return (
      <div>
        {orderDetailsById.orders &&
          orderDetailsById.orders.map(item => {
            const date = item.orderPlacedDate ? dateFormatter(item.orderPlacedDate, DATE_YEAR_FORMAT) : '';
            return (
              <div className="col-12">
                <div className="d-flex flex-row mb-2 mb-md-3">
                  <NavLink to={`/myaccount/orderSearch/${item.orderNumber}/${item.billingAddress.zipCode}`}>
                    <button className={classNames('d-flex flex-row align-items-center', bgNone)} onClick={() => this.props.handleBackToOrders()}>
                      <span className="academyicon icon-chevron-left pr-half pr-md-half" />
                      <span className="o-copy__14reg d-none d-md-block"> {cms.backToOrderDetailsLabel || BACK_TO_ORDER_DETAILS_LABEL} </span>
                      <span className="o-copy__14reg d-block d-md-none"> {cms.orderDetailsLabel} </span>
                    </button>
                  </NavLink>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <h5 className="pb-md-3 pb-1">{!showSucessScreen ? cms.orderReturnLabel : cms.orderReturnsInitiatedLabel}</h5>
                  {/* commented as per ticket Number KER-15019 */}
                  {/* <div className="o-copy__16bold d-none d-md-block">
                    {cms.contactUsLabel} {cms.contactUsNumber}
                  </div> */}
                </div>
                {this.renderError()}
                <div className={`${containerStyle}`}>
                  <div className="mx-half mx-md-3 pb-3">
                    <div className="row pt-2">
                      <div className="col-12 col-md-5">
                        <span className="o-copy__16bold">{cms.orderPlacedOnLabel}</span>
                        <span className="o-copy__16reg pl-half">{date}</span>
                      </div>
                      <div className="col-12 col-md-7">
                        <span className="o-copy__16bold">{cms.orderNumberMyAccount}</span>
                        <span className="o-copy__16reg pl-half">{item.orderNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mx-half d-flex flex-row pb-1">
                    {showSucessScreen ? (
                      <div className="d-flex flex-column pr-4">
                        <div className="o-copy__14bold pl-0 pl-md-3">{cms.returnStatusLabel}</div>
                        <div className="o-copy__14reg pl-0 pl-md-3">Initiated</div>
                      </div>
                    ) : (
                      <div className="d-flex flex-column pr-4">
                        <div className="o-copy__14bold pl-0 pl-md-3">{cms.deliveredDateLabel}</div>
                        <div className="o-copy__14reg pl-0 pl-md-3" />
                      </div>
                    )}
                    {!showConfirmationScreen && (
                      <div className="d-flex flex-column pr-4">
                        <div className="o-copy__14bold">{cms.commonLabels.itemsLabel}</div>
                        <div className="o-copy__14reg">
                          {item.shipments.map(shipmentItem => {
                            if (shipmentItem.shipmentNum === parseInt(params.shipmentNum, 10)) {
                              return shipmentItem.items.length;
                            }
                            return '';
                          })}
                        </div>
                      </div>
                    )}
                    {showConfirmationScreen && (
                      <Fragment>
                        <div className="d-flex flex-column pr-4">
                          <div className="o-copy__14bold">{cms.returnItemsLabel}</div>
                          <div className="o-copy__14reg">{Object.keys(returnItems).length}</div>
                        </div>
                        <div className="d-flex flex-column pr-4">
                          <div className="o-copy__14bold">{cms.returnDateLabel}</div>
                          <div className="o-copy__14reg">{dateFormatter(Date.now(), DATE_YEAR_FORMAT)}</div>
                        </div>
                      </Fragment>
                    )}
                  </div>
                  {this.renderHelpText(showSucessScreen, showConfirmationScreen, cms)}
                  <hr className="mb-2 mx-half mx-md-3" />
                  {item.shipments.map(shipmentItem => {
                    if (shipmentItem.shipmentNum === parseInt(params.shipmentNum, 10)) {
                      return orderDetailsById.orders.map(orderItem => this.productRow(cms, orderItem, orderDetailsById.orders, shipmentItem));
                    }
                    return <div />;
                  })}
                </div>
                {showSucessScreen && (
                  <div className="py-1">
                    <ReturnInstructions cms={cms} />
                  </div>
                )}
                {!showConfirmationScreen && (
                  <div className={`${btnAlignment} py-2`}>
                    <div className={`o-copy__14reg pb-1 ${btnAlignment}`}>{`(${Object.keys(returnItems).length}) Item selected for return`}</div>
                    <Button classnName={`${btnAlignment} pt-2`} size="S" onClick={this.continueReturn}>
                      {cms.confirmContinueButtonLabel}{' '}
                    </Button>
                  </div>
                )}
                {showConfirmationScreen &&
                  !showSucessScreen && (
                    <div className="text-right pt-2">
                      <Button classnName="pt-2 text-right" size="S" onClick={this.initiateReturn}>
                        {cms.confirmReturnButtonLabel}
                      </Button>
                    </div>
                  )}
              </div>
            );
          })}
      </div>
    );
  }
}

OrderReturn.propTypes = {
  cms: PropTypes.object.isRequired,
  handleBackToOrders: PropTypes.func,
  match: PropTypes.object,
  loadOrderDetails: PropTypes.func,
  orderDetailsById: PropTypes.object,
  fnInitiateReturnOrder: PropTypes.func,
  error: PropTypes.bool,
  errorKey: PropTypes.string,
  errorMsg: PropTypes.object,
  showSucessScreen: PropTypes.bool,
  scrollPageToTop: PropTypes.func,
  analyticsContent: PropTypes.func
};

const WrappedOrderReturn = withScroll(OrderReturn);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WrappedOrderReturn {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WrappedOrderReturn;
