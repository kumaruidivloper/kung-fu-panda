import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  APPLE_PAY_GET_SESSION,
  APPLE_PAY_PROCESS_PAYMENT
} from '@academysports/aso-env';
import { NODE_TO_MOUNT, DATA_COMP_ID, API_SUCCESS_CODE } from './constants';
import * as styles from './applePay.style';

class ApplePay extends React.PureComponent {
  static isApplePayAvailable() {
    return (window.ApplePaySession && window.ApplePaySession.canMakePayments);
  }

  /**
   * Returns true/false if an apple device supports ApplePay
   * @returns {boolean}
   */
  static canMakePayments() {
    return window.ApplePaySession.canMakePayments();
  }

  constructor(props) {
    super(props);
    this.state = {
      isApplePayAvailable: false
    };
    this.initiateApplePayment = this.initiateApplePayment.bind(this);
  }

  componentWillMount() {
    this.canUseApplePay();
  }

  /**
   * Sets state based on apple pay feature availability which is used to show/hide applePay button
   */
  canUseApplePay() {
    if (this.constructor.isApplePayAvailable) {
      const isApplePayAvailable = this.constructor.canMakePayments();
      this.setState({ isApplePayAvailable });
    } else {
      this.setState({ isApplePayAvailable: false });
    }
  }

  /**
   * Begins apple pay session on click of the button
   */
  initiateApplePayment() {
    const { supportsVersion, orderDetails } = this.props;
    try {
      const session = new ApplePaySession(supportsVersion, orderDetails);// eslint-disable-line
      this.registerMerchantValidationEvent(session);
      this.registerCancelPaymentEvent(session);
      this.registerPaymentAuthEvent(session);
      session.begin();
    } catch (err) {
      this.props.errorCallback('Could not create an ApplePay session!');
    }
  }

  /**
   * Registers merchant validation callback
   * @param {object} appleSessionObj
   */
  registerMerchantValidationEvent(appleSessionObj) {
    const self = this;
    // eslint-disable-next-line
    appleSessionObj.onvalidatemerchant = event => {
      console.log('ApplePay onvalidatemerchant-->', JSON.stringify(event));
      const { validationURL } = event;
      axios.post(APPLE_PAY_GET_SESSION, { endPointURL: validationURL }).then(response => {
        if (response.data.statusCode === API_SUCCESS_CODE) {
          const responseJSON = response.data;
          let sessionDetails = {};
          if (responseJSON && responseJSON.svcBdy) {
            sessionDetails = responseJSON.svcBdy.getSessionRes;
          } else {
            sessionDetails = responseJSON;
          }
          try {
            appleSessionObj.completeMerchantValidation(sessionDetails);
          } catch (err) {
            console.log('Erorr: completeMerchantValidation Failed \n', err.message);
          }
        } else {
          console.log('Error: GET_APPLE_SESSION_URL Code Failure');
          try {
            appleSessionObj.abort();
          } catch (err) {
            console.log('Erorr: Apple Session Abort Failed \n', err.message);
          }
          self.props.errorCallback(response.data);
        }
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log('Error: GET_APPLE_SESSION_URL Call Failed ===> \n\n', error.message);
        self.props.errorCallback(error);
      });
    };
  }

  /**
   * Registers payment authorization callback
   * @param {object} appleSessionObj
   */
  registerPaymentAuthEvent(appleSessionObj) {
    const self = this;
    if (appleSessionObj) {
      // eslint-disable-next-line
      appleSessionObj.onpaymentauthorized = event => {
        console.log('ApplePay onpaymentauthorized-->', JSON.stringify(event));
        const paymentResponseJSON = event.payment;
        axios.post(APPLE_PAY_PROCESS_PAYMENT, paymentResponseJSON).then(response => {
          if (response.data.statusCode === API_SUCCESS_CODE) {
            console.log('PROCESS_PAYMENT_URL returned success status');
            try {
              // eslint-disable-next-line
              appleSessionObj.completePayment(ApplePaySession.STATUS_SUCCESS);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log('Erorr: completePayment Failed \n', err.message);
            }
            self.props.successCallback(response.data);
          } else {
            console.log('PROCESS_PAYMENT_URL returned failure status');
            try {
              appleSessionObj.abort();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log('In onpaymentauthorized function Apple session aborting error ', err.message);
            }
            self.props.errorCallback(response.data);
          }
        }).catch(error => {
          // eslint-disable-next-line no-console
          console.log('PROCESS_PAYMENT_URL service failed ===> \n\n', error.message);
          self.props.errorCallback(error);
        });
      };
    }
  }

  /**
   * Registers cancel payment callback
   * @param {object} appleSessionObj
   */
  registerCancelPaymentEvent(appleSessionObj) {
    if (appleSessionObj) {
      const self = this;
      // eslint-disable-next-line
      appleSessionObj.oncancel = event => {
        // eslint-disable-next-line no-console
        console.log('oncancel ===> \n', event);
        self.props.errorCallback('Payment session was terminated by the user!');
      };
    }
  }


  render() {
    return (
      <React.Fragment>
        {this.state.isApplePayAvailable &&
        <div className={`${styles.applePayButton} applePay`}>
          <button
            data-auid="checkout_payment_apple_pay_btn"
            className="apple-pay-button apple-pay-button-black"
            onClick={this.initiateApplePayment}
          />
        </div>
        }
      </React.Fragment>

    );
  }
}

ApplePay.propTypes = {
  supportsVersion: PropTypes.number,
  orderDetails: PropTypes.object,
  successCallback: PropTypes.func, // eslint-disable-line
  errorCallback: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <ApplePay {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />,
      el
    );
  });
}

export default ApplePay;
