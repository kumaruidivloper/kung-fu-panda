import { POST_PAYPAL_REQUEST, POST_PAYPAL_SUCCESS, POST_PAYPAL_FAILURE } from './../../checkout.constants';

export function postPayPalData(data, orderId) {
  return {
    type: POST_PAYPAL_REQUEST,
    data,
    orderId
  };
}

export function postPayPalSuccess(data) {
  return {
    type: POST_PAYPAL_SUCCESS,
    data
  };
}

export function postPayPalError() {
  return {
    type: POST_PAYPAL_FAILURE
  };
}
