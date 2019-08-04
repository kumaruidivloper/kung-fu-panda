/* global google */
// import PropTypes from 'prop-types';
import React from 'react';

import {
  GATEWAY, GATEWAY_MERCHANT_ID, CURRENCY_CODE, TOKENIZATION_TYPE, ALLOWED_CARD_NETWORKS, ALLOWED_AUTH_METHODS, ENVIRONMENT
} from './constants';
import GooglePayButton from './googlePayButton';

class GooglePay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getGooglePaymentDataConfiguration = this.getGooglePaymentDataConfiguration.bind(this);
    this.onGooglePaymentButtonClicked = this.onGooglePaymentButtonClicked.bind(this);
    this.onGooglePayLoaded = this.onGooglePayLoaded.bind(this);
  }
  componentDidMount() {
    this.onGooglePayLoaded();
  }
  /**
   * function triggered when google pay button is clicked.
   */
  onGooglePaymentButtonClicked() {
    const paymentDataRequest = this.getGooglePaymentDataConfiguration();
    paymentDataRequest.transactionInfo = this.getGoogleTransactionInfo();
    const paymentsClient = this.getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(paymentData => {
          console.log(paymentData);
          // handle the response
          this.processPayment(paymentData);
        })
        .catch(err => {
          // show error in developer console for debugging
          console.error(err);
        });
  }
  /**
   * Function triggered when Google Pay is loaded and available.
   */
  onGooglePayLoaded() {
    const paymentsClient = this.getGooglePaymentsClient();
    paymentsClient.isReadyToPay(this.getGooglePayBaseConfiguration())
        .then(response => {
          if (response.result) {
            console.log('response', response.result);
          }
        })
        .catch(err => {
          console.error(err);
        });
  }
  /**
   * setup function for payments. Item prices and amounts to go here.
   */
  getGoogleTransactionInfo() {
    return {
      currencyCode: CURRENCY_CODE,
      totalPriceStatus: 'FINAL',
      // set to cart total
      totalPrice: '1.00'
    };
  }
  /**
   * helper function to set base configurations for Google Pay.
   */
  getGooglePayBaseConfiguration() {
    const googlePayApiVersion = {
      apiVersion: 2,
      apiVersionMinor: 0
    };
    // configuration object for card based payments via GATEWAY.
    const cardPaymentMethod = {
      type: 'CARD',
      tokenizationSpecification: {
        type: TOKENIZATION_TYPE,
        parameters: {
          gateway: GATEWAY,
          gatewayMerchantId: GATEWAY_MERCHANT_ID
        }
      },
      // Additional parameters for billing address, required since Google Pay API v2.
      parameters: {
        allowedAuthMethods: ALLOWED_AUTH_METHODS,
        allowedCardNetworks: ALLOWED_CARD_NETWORKS,
        billingAddressRequired: true,
        billingAddressParameters: {
          format: 'FULL',
          phoneNumberRequired: true
        }
      }
    };
    return Object.assign(
        {},
        googlePayApiVersion,
        {
          allowedPaymentMethods: [cardPaymentMethod]
        }
    );
  }
  /**
   * creates and returns paymentrequestObject for Google Pay API to process.
   */
  getGooglePaymentDataConfiguration() {
    const paymentDataRequest = this.getGooglePayBaseConfiguration();
    paymentDataRequest.transactionInfo = this.getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
      merchantName: GATEWAY
    };
    paymentDataRequest.shippingAddressRequired = true;
    return paymentDataRequest;
  }
  /**
   * Initialises a new google.payments.api object with passed environment variable.
   */
  getGooglePaymentsClient() {
    return (new google.payments.api.PaymentsClient({ environment: ENVIRONMENT }));
  }
  /**
   * callback function, called once payment via Google Pay is successful.
   */
  processPayment(paymentData) {
    /* just consoling it right now, for debugging purposes. */
    console.log(paymentData);
  }
  render() {
    return (
      <div className="d-flex flex-md-row-reverse mt-2 undefined">
        <GooglePayButton googlePayClicked={this.onGooglePaymentButtonClicked} />
      </div>
    );
  }
}

// GooglePay.propTypes = {
//   orderDetails: PropTypes.object.isRequired
// };

export default GooglePay;
