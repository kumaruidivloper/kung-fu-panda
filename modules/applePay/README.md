The readme file for the component **applePay**
```js
import React from 'react';
import ApplePay from 'ApplePay';

class App extends React.Component {
  applePaymentSuccessCallback() {
    ...
  }
  applePaymentErrorCallaback(error) {
    ...
  }
  getApplePayRequetPayload() {
      return {
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
        merchantCapabilities: ['supports3DS'],
        total: { label: 'Your Merchant Name', type: 'final', amount: '10.00' },
        lineItems: [
          {
            label: 'Bag Subtotal',
            type: 'final',
            amount: '35.00'
          }
        ]
      };
  }
  render() {
    return (
      <ApplePay
        supportsVersion={<Number>}
        merchantIdentifier={<String>}
        orderDetails={this.getApplePayRequetPayload()}
        successCallback={this.applePaymentSuccessCallback}
        errorCallback={this.applePaymentErrorCallaback}
      />
    );
  }
}
```

## Props

Common props you may want to specify include:

* `supportsVersion` - The Apple Pay version number. The initial version is 1. The latest version is 3.
* `merchantIdentifier` - The merchant ID created when the merchant enrolled in Apple Pay.
* `orderDetails` - An ApplePayPaymentRequest dictionary that contains all the information needed to display the payment sheet.
* `successCallback` - Callback function that is called after successful payment.
* `errorCallback` - Callback function for any kind of error that occurred during the payment session.

