import React from 'react';
import PropTypes from 'prop-types';
import {
  PAYPAL_ENV,
  PAYPAL_API_KEY
} from '@academysports/aso-env';
import { showLoader, hideLoader } from './../../../apps/checkout/store/actions/globalLoader';
import { ANALYTICS_EVENT_CATEGORY, ANALYTICS_SUB_EVENT_IN, analyticsEventActionPayment, CHECKOUT_PAYPAL } from './../constants';
export default class PaypalButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: null
    };
    this.paypalBtnWrapper = React.createRef();
  }

  componentDidMount() {
    this.renderPayPalButton();
  }

  renderPayPalButton() {
    const self = this;
    const { shippingAddress } = this.props;
    showLoader();
    window.paypal.Button.render({
      env: PAYPAL_ENV, // sandbox | production
      style: {
        label: 'checkout', // checkout | credit | pay | buynow | generic
        size: 'responsive', // small | medium | large | responsive
        shape: 'pill', // pill | rect
        color: 'blue', // gold | blue | silver | black
        tagline: false
      },
      client: {
        sandbox: PAYPAL_API_KEY,
        production: PAYPAL_API_KEY
      },
      // Wait for the PayPal button to be clicked
      payment: (_, actions) => actions.payment.create({
          payment: {
            intent: 'order',
            payer: {
              payment_method: 'paypal'
            },
            transactions: [{
              amount: {
                total: this.props.grandTotal,
                currency: this.props.currency,
                details: this.props.details
              },
              description: 'The payment transaction description.',
              payment_options: {
                allowed_payment_method: 'IMMEDIATE_PAY'
              },
              item_list: {
                items: this.props.inlineItems,
                ...(Object.keys(shippingAddress).length && { shipping_address: shippingAddress })
              }
            }],
            note_to_payer: 'Contact us for any questions on your order.'
          }
        }),

      // Wait for the payment to be authorized by the customer
      onAuthorize: (_, actions) => actions.payment.get().then(payload => {
            actions.payment.execute(payload).then(orderData => {
            self.props.onPaymentComplete(orderData, this.props.orderId);
            this.setState({ orderInfo: orderData });
           }).catch(self.props.onPaymentFail());
       })

    }, this.paypalBtnWrapper.current);
    hideLoader();
  }
  render() {
    const { orderInfo } = this.state;
    // if orderInfo is not null, then payment info has been set successfully.
    if (orderInfo) {
      this.props.analyticsContent({
        event: ANALYTICS_SUB_EVENT_IN,
        eventCategory: ANALYTICS_EVENT_CATEGORY,
        eventAction: analyticsEventActionPayment,
        eventLabel: CHECKOUT_PAYPAL,
        customerleadlevel: null,
        customerleadtype: null,
        leadsubmitted: 0,
        newslettersignupcompleted: 0
      });
    }
    return (
      <React.Fragment>
        {!this.state.orderInfo && <div ref={this.paypalBtnWrapper} />}
      </React.Fragment>
      );
  }
}

PaypalButton.propTypes = {
  grandTotal: PropTypes.string,
  currency: PropTypes.string,
  inlineItems: PropTypes.array,
  orderId: PropTypes.string,
  shippingAddress: PropTypes.object,
  details: PropTypes.object,
  analyticsContent: PropTypes.func
};

PaypalButton.defaultProps = {
};
