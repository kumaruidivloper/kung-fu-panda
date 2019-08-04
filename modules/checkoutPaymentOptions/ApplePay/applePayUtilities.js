/**
 * Utility functions for Apple Pay.
 */
import {
  APPLE_PAY_MERCHANT_NAME
} from '@academysports/aso-env';
import { COUNTRY } from '../../../utils/constants';
/**
 * returns request payload for Apple Pay.
 * @param {object} totals is object containg values for different pricing & taxes.
 */
export const getApplePayRequestPayload = totals => {
    const { grandTotal, orderTotalTax, totalShippingCharge } = totals;
    return {
      countryCode: COUNTRY,
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
      merchantCapabilities: ['supports3DS'],
      total: { label: APPLE_PAY_MERCHANT_NAME, type: 'final', amount: grandTotal },
      lineItems: [
        {
          label: 'Bag Subtotal',
          type: 'final',
          amount: grandTotal
        },
        {
          label: 'Estimated Tax',
          type: 'final',
          amount: orderTotalTax
        },
        {
          label: 'Shipping Charges',
          type: 'final',
          amount: totalShippingCharge
        }
      ]
    };
};
/**
 * Callback function when apple pay is successful, to be developed further.
 */
export const applePaymentSuccessCallback = () => {
    console.log('--applePaymentSuccessCallback--');
};
/**
 * Callback function when apple pay is failed, to be developed further.
 */
export const applePaymentErrorCallaback = () => {
    console.log('--applePaymentErrorCallaback--');
};
