import { POST_PAYMENT_REQUEST, POST_PAYMENT_SUCCESS, POST_PAYMENT_FAILURE } from './../../checkout.constants';

export function postpaymentData(data, orderId) {
  return {
    type: POST_PAYMENT_REQUEST,
    data,
    orderId
  };
}

export function postpaymentDataSuccess(data) {
  return {
    type: POST_PAYMENT_SUCCESS,
    data
  };
}

export function postpaymentDataError(error) {
  return {
    type: POST_PAYMENT_FAILURE,
    error
  };
}
