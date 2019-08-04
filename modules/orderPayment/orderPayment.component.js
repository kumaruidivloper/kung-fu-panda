import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { get } from '@react-nitro/error-boundary';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { paymentContainer, horizontalLine, visaStyle, displayBlock } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID, PAYPAL, PAYPAL_PAYMENT } from './constants';

class OrderPayment extends React.PureComponent {
  /**
   * Method to render payment section.
   * @param {array} payment List of payment type object
   */
  renderPaymentDetails(payment) {
    const { cms } = this.props;
    const paidWithPaypal = get(cms, 'order.commonLabels.paidWithPaypalLabel', PAYPAL_PAYMENT);
    if (!payment || !payment.length) {
      return null;
    }
    return payment.map(paymentItem => {
      const paymentType = paymentItem.paymentMethod && paymentItem.paymentMethod.toLowerCase();
      if (paymentType === PAYPAL) {
        return <span className={`o-copy__14bold pr-4 pb-2 ${displayBlock}`}>{paidWithPaypal}</span>;
      }
        return (
          <span className={`o-copy__14bold pr-4 pb-2 ${displayBlock}`}>
            {paymentItem.paymentMethod} {cms.endingInLabel}
            {paymentItem.lastFourDigits}
          </span>
        );
    });
  }

  render() {
    const { cms, orderDetailsById } = this.props;
    const { orders } = orderDetailsById;
    const { payment } = orders[0];
    return (
      orderDetailsById &&
      orderDetailsById.orders[0] &&
      orderDetailsById.orders.map(orderItem => (
        <div className="mt-half mt-md-2 pt-0 pb-0">
          <div className={`${paymentContainer}`}>
            <div className="o-copy__16bold pt-2 pt-md-1 pb-2 pb-md-1 px-1 px-md-3">{cms.paymentLabel}</div>
            <hr className={classNames('mx-1 mx-md-3', horizontalLine)} />
            <div className="pt-half pl-1 pl-md-3 pb-quarter o-copy__14reg">{cms.checkoutLabels.billingInformation}</div>
            <div className={classNames('d-flex pl-1 pl-md-3', visaStyle)}>
              <div>
                <div className="o-copy__14bold">
                  {orderItem.billingAddress.firstName} {orderItem.billingAddress.lastName}
                </div>
                <div className="o-copy__14reg">{orderItem.billingAddress.address1}</div>
                <div className="o-copy__14reg pb-2">
                  {orderItem.billingAddress.city} {orderItem.billingAddress.state} {orderItem.billingAddress.zipCode}
                </div>
              </div>
              <div className="d-flex flex-column">{this.renderPaymentDetails(payment)}</div>
            </div>
          </div>
        </div>
      ))
    );
  }
}

OrderPayment.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetailsById: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<OrderPayment {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default OrderPayment;
