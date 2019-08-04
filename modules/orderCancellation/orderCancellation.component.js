import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { bgNone, imageStyle, skulabel, card, promoDiv, horzLine, giftCardTitle } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID, GIFT_CARD, ITEM, FREE, DATE_YEAR_FORMAT } from './constants';
import { dateFormatter } from '../../utils/dateUtils';
import { dollarFormatter } from '../../utils/helpers';
import { enhancedAnalyticsTrackingOrders } from '../../utils/analytics/ordersAnalyticsHelpers';
import withScroll from '../../hoc/withScroll';

class OrderCancellation extends React.PureComponent {
  /**
   * Function to make an api call to fetch order details,
   * takes zipcode and order id from url
   */
  componentDidMount() {
    const { match, loadOrderDetails, breadCrumbAction, cms, scrollPageToTop, orderDetails, analyticsContent } = this.props;
    enhancedAnalyticsTrackingOrders(orderDetails, analyticsContent);
    breadCrumbAction(cms.orderCancelledLabel);
    if (match) {
      loadOrderDetails(match.params.id, match.params.zipCode);
    }
    scrollPageToTop();
  }
  /**
   * function to show products in order
   * @param {object} cms
   * @param {object} item, items in order
   */
  productRow(cms, item) {
    return (
      item.items &&
      item.items.map(orderItems => (
        <div className="d-flex flex-row pt-2 justify-content-between">
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
                  <div className="d-flex pb-half">
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
                  <div className="o-copy__14reg">{dollarFormatter(orderItems.totalItemPrice)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-none d-md-block col-2 pr-0 text-right">
            <span className="o-copy__16reg">{dollarFormatter(orderItems.totalItemPrice)}</span>
          </div>
        </div>
      ))
    );
  }
/**
 * function to render the label and price and display 'FREE' if proce is zero.
 * @param label the label to be displayed
 * @param value the price to be displayed
 */
  costDetail = (label, value) => {
    let classname = 'o-copy__16reg';
    const freeValue = Number(value) === 0;
    if (freeValue) {
      classname = 'o-copy__16bold';
    }
    return (
      <div className="d-flex justify-content-between mb-1">
        <span className="o-copy__14reg">{label}:</span>
        <span className={classname}>{freeValue ? FREE : dollarFormatter(value)}</span>
      </div>
    );
  };
  /**
   * function to display pricing details of the order
   */
  pricingRow() {
    const { cms, orderDetails } = this.props;
    return (
      orderDetails.orders &&
      orderDetails.orders.map(orderItem => (
        <div>
          <div className="d-flex justify-content-between mb-1">
            <span className="o-copy__14reg">{cms.commonLabels.subTotalLabel}:</span>
            <span className="o-copy__16reg d-none d-md-block">{dollarFormatter(orderItem.price.subTotal)}</span>
          </div>
          {this.costDetail(cms.commonLabels.taxesLabel, orderItem.price.taxes)}
          {this.costDetail(cms.commonLabels.shippingLabel, orderItem.price.shipping)}
          {parseFloat(orderItem.price.adjustment) !== 0 && (
            <div className="d-flex justify-content-between mb-1">
              <span className={classNames('o-copy__14reg', promoDiv)}>Discount:</span>
              <span className={classNames('o-copy__14reg', promoDiv)}>{dollarFormatter(orderItem.price.adjustment)}</span>
            </div>
          )}
          {orderItem.price.employeeDiscount && (
            <div className="d-flex justify-content-between mb-1">
              <span className={classNames('o-copy__14reg', promoDiv)}>Employee Discount:</span>
              <span className={classNames('o-copy__14reg', promoDiv)}>{dollarFormatter(orderItem.price.employeeDiscount)}</span>
            </div>
          )}
        </div>
      ))
    );
  }
  /**
   * function to display refund details of cancelled order
   * @param {object} cms
   * @returns {object} the refund details of order cancellation
   */
  refundDetails(cms) {
    const { orders } = this.props.orderDetails;
    const { payment, price } = orders[0];
    return (
      <div>
        <div className="d-flex justify-content-between pb-half pb-md-1">
          <span className="o-copy__16bold">{cms.refundAmountLabel}</span>
          <span className="o-copy__16bold">{dollarFormatter(price.total)}</span>
        </div>
        <span className="o-copy__14bold">{cms.amountRefundedToLabel}</span>
        {payment &&
          payment.map(orderItem => (
            <div className="d-flex justify-content-between pt-half">
              <span className="o-copy__14reg">
                {orderItem.paymentMethod} Ending in -{orderItem.lastFourDigits}
              </span>
              <span className="o-copy__16reg d-none d-md-block">{dollarFormatter(orderItem.amount)}</span>
            </div>
          ))}
      </div>
    );
  }
  /**
   * func to render gift card message if payment method includes gift card
   * @param {object} cms
   */
  renderGiftCardMessage(cms) {
    const { orders } = this.props.orderDetails;
    const { payment } = orders[0];
    const method = payment.find(paymentObject => paymentObject.paymentMethod === GIFT_CARD);
    const index = payment.indexOf(method);
    if (index > -1) {
      return <div className={`${giftCardTitle} o-copy__14reg pt-3 pb-1 pb-md-0`}>{cms.giftCardMessage}</div>;
    }
    return null;
  }
  render() {
    const { cms, orderDetails } = this.props;
    return orderDetails ? (
      <div>
        <Fragment>
          {orderDetails.orders &&
            orderDetails.orders.map(item => {
              const date = item.orderPlacedDate ? dateFormatter(item.orderPlacedDate, DATE_YEAR_FORMAT) : '';
              return (
                <div col-12>
                  <div className="d-flex flex-row px-1 px-md-0 mb-2 mb-md-3">
                    <NavLink to={`/myaccount/orders/${item.orderNumber}`}>
                      <button className={classNames('d-flex flex-row align-items-center', bgNone)}>
                        <span className="academyicon icon-chevron-left pr-half pr-md-half" />
                        <span className="o-copy__14reg d-none d-md-block"> {cms.backToOrderLabel} </span>
                        <span className="o-copy__14reg d-block d-md-none"> {cms.orderDetailsLabel} </span>
                      </button>
                    </NavLink>
                  </div>
                  <div className="d-flex flex-row justify-content-between px-1 px-md-0">
                    <h5 className="pb-3 mb-0">{cms.orderCancellationLabel}</h5>
                  </div>
                  <div className="o-copy__16bold pb-half px-1 px-md-0">{cms.orderCancellationRequestText}</div>
                  <div className="o-copy__14reg pb-2 px-1 px-md-0">{cms.confirmationMailText}</div>
                  <div className={classNames('p-1 p-md-4 mb-half mb-md-2', card)}>
                    <div className="d-flex flex-row">
                      <div className="o-copy__16bold mr-quarter">{cms.cancellationPlacedOnLabel}</div>
                      <div className="o-copy__16reg">{date}</div>
                    </div>
                    <div className={classNames('py-1', horzLine)}>
                      <hr />
                    </div>
                    <div className="o-copy__14reg pb-0 pb-md-half">
                      <span className="o-copy__14bold">{cms.cancelledItemsLabel}</span>
                      <span className="pl-quarter">{`(${item.items.length} ${item.items.length > 1 ? cms.itemLabel : ITEM})`}</span>
                    </div>
                    {orderDetails && orderDetails.orders && orderDetails.orders.map(orderItem => this.productRow(cms, orderItem))}
                  </div>
                  <div className={classNames('p-1 p-md-4', card)}>
                    <div className="o-copy__16bold pb-half">{cms.pendingAuthorizationLabel}</div>
                    <div className="o-copy__14reg">{cms.cancellationInfoMessage}</div>
                    <div className={classNames('py-1', horzLine)}>
                      <hr />
                    </div>
                    <div className="col-12 offset-md-5 col-md-7 px-0">
                      {this.pricingRow()}
                      <div className={classNames('mb-1', horzLine)}>
                        <hr />
                      </div>
                      {this.refundDetails(cms)}
                      {this.renderGiftCardMessage(cms)}
                    </div>
                  </div>
                </div>
              );
            })}
        </Fragment>
      </div>
    ) : null;
  }
}

OrderCancellation.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetails: PropTypes.object,
  loadOrderDetails: PropTypes.func,
  match: PropTypes.any,
  breadCrumbAction: PropTypes.func,
  scrollPageToTop: PropTypes.func,
  analyticsContent: PropTypes.func
};

const WrappedOrderCancellation = withScroll(OrderCancellation);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WrappedOrderCancellation {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WrappedOrderCancellation;
