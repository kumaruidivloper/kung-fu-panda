import { RETURN_INSTRUCTION } from '@academysports/aso-env';
import { get } from '@react-nitro/error-boundary';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { card, blueColor, promoDiv } from './orderDetails.styles';
import { dollarFormatter } from '../../utils/helpers';
import { getOrderType } from '../../utils/analytics/ordersAnalyticsHelpers';
import OrderCancelModal from '../orderCancelModal';
import { CANCEL_ELIGIBLE, SHIP_TO_STORE_PRICE, FREE } from './constants';

class OrderSummary extends React.PureComponent {
  costDetail = (label, value) => {
    let classname = 'o-copy__16reg';
    const freeValue = Number(value) === 0;
    if (freeValue) {
      classname = 'o-copy__16bold';
    }
    return (
      <div className="d-flex justify-content-between">
        <span className="o-copy__14reg">{label}:</span>
        <span className={classname}>{freeValue ? FREE : dollarFormatter(value)}</span>
      </div>
    );
  };
  /**
   * function to trigger window print command
   */
  handlePrint = () => {
    window.print();
    const { analyticsContent, orderDetailsById } = this.props;
    const order = get(orderDetailsById, 'orders[0]', '');
    const analyticsData = {
      event: 'downloadContent',
      eventCategory: 'print',
      eventAction: 'print receipt',
      eventLabel: 'pdf',
      ordertype: `${order ? getOrderType(order) : 'ship to home'}`,
      orderid: `${get(orderDetailsById, 'orders[0].orderNumber', '')}`
    };
    analyticsContent(analyticsData);
  };
  handleInstruction = () => {
    const { analyticsContent, orderDetailsById } = this.props;
    const analyticsData = {
      event: 'myaccount',
      eventCategory: 'user account',
      eventAction: 'my orders|return instore|return instructions',
      eventLabel: `order|${get(orderDetailsById, 'orders[0].orderNumber', '')}`,
      ordertype: 'shipment',
      orderid: `${get(orderDetailsById, 'orders[0].orderNumber', '')}`
    };
    analyticsContent(analyticsData);
  };
  render() {
    const { cms, analyticsContent } = this.props;
    return this.props.orderDetailsById.orders.map(orderItem => (
      <div className={classNames('mt-half mt-md-2 pt-2 pb-2 pb-md-3', card)}>
        <div className="px-1 px-md-3">
          <span className={classNames('o-copy__16bold')}>{cms.commonLabels.orderSummaryLabel}</span>
          <hr className="my-1" />
          <div className="row">
            <div className="col-12 offset-md-5 col-md-7">
              {this.costDetail(cms.commonLabels.subTotalLabel, orderItem.price.subTotal)}
              {orderItem.shipMethodId === 'PICKUPINSTORE' && (
                <div className="d-flex justify-content-between">
                  <span className="o-copy__14reg">In-Store Pickup:</span>
                  <span className="o-copy__16bold">{FREE}</span>
                </div>
              )}
              {!orderItem.containsStorePickUpItemsOnly && this.costDetail(cms.commonLabels.shippingLabel, orderItem.price.shipping)}
              {orderItem.price.shipToStoreCharges &&
                parseFloat(orderItem.price.shipToStoreCharges) !== 0 &&
                this.costDetail(SHIP_TO_STORE_PRICE, orderItem.price.shipToStoreCharges)}
              <div className="d-flex justify-content-between">
                <span className={classNames('o-copy__14reg')}>{cms.commonLabels.taxesLabel}</span>
                <span className={classNames('o-copy__16reg')}>{dollarFormatter(orderItem.price.taxes)}</span>
              </div>
              {parseFloat(orderItem.price.adjustment) !== 0 && (
                <div className="d-flex justify-content-between">
                  <span className={classNames('o-copy__14reg', promoDiv)}>Discount:</span>
                  <span className={classNames('o-copy__16reg', promoDiv)}>{dollarFormatter(orderItem.price.adjustment)}</span>
                </div>
              )}
              {orderItem.price.employeeDiscount && (
                <div className="d-flex justify-content-between">
                  <span className={classNames('o-copy__14reg', promoDiv)}>Employee Discount:</span>
                  <span className={classNames('o-copy__16reg', promoDiv)}>{dollarFormatter(orderItem.price.employeeDiscount)}</span>
                </div>
              )}
              <hr className="my-half" />
              <div className="d-flex justify-content-between">
                <span className="o-copy__16bold">{cms.commonLabels.totalLabel}:</span>
                <span className="o-copy__20bold">{dollarFormatter(orderItem.price.total)}</span>
              </div>
              <div className={classNames('d-flex justify-content-between', 'mt-3')}>
                {orderItem.orderStatus === 'V' && (
                  <a
                    onClick={this.handleInstruction}
                    href={RETURN_INSTRUCTION}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames('o-copy__14reg', blueColor)}
                  >
                    <p className={classNames('o-copy__14reg', blueColor)}>{cms.returnInstructionsLabelLower}</p>
                  </a>
                )}
                {orderItem.extraAttributes.orderIneligibleCancel !== 'Y' &&
                  CANCEL_ELIGIBLE.indexOf(orderItem.orderStatus) > -1 && (
                    <div className={classNames('o-copy__14reg', blueColor)}>
                      <OrderCancelModal
                        redirect={this.props.orderCancelRedirect}
                        error={this.props.orderCancelError}
                        errorKey={this.props.orderCancelErrorKey}
                        fnCancelOrder={this.props.fnCancelOrder}
                        handleBackToOrders={this.props.handleBackToOrders}
                        cms={cms}
                        orderDetailsById={this.props.orderDetailsById}
                        analyticsContent={analyticsContent}
                      />
                    </div>
                  )}
                {orderItem.orderStatus !== 'X' && (
                  <a onClick={this.handlePrint} href="# " className={classNames('o-copy__14reg ml-auto', blueColor)}>
                    <span className={classNames('o-copy__14reg', blueColor)}>{cms.printAReceiptLabel}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  }
}

OrderSummary.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetailsById: PropTypes.object,
  handleBackToOrders: PropTypes.func,
  fnCancelOrder: PropTypes.func,
  orderCancelError: PropTypes.bool,
  orderCancelErrorKey: PropTypes.string,
  orderCancelRedirect: PropTypes.bool,
  analyticsContent: PropTypes.func
};

export default OrderSummary;
