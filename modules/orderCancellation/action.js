import {
  ORDER_CANCEL_REQUEST,
  ORDER_CANCEL_SUCCESS,
  ORDER_CANCEL_FAILURE,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAILURE,
  ORDER_CANCEL_REDIRECT
} from './constants';
// order details by Id
export const orderDetailsRequest = orderId => ({ type: ORDER_DETAILS_REQUEST, orderId });
export const oderDetailsSuccess = data => ({ type: ORDER_DETAILS_SUCCESS, data });
export const orderDetailsfailure = data => ({ type: ORDER_DETAILS_FAILURE, data });
// cancel order
export const cancelOrderRequest = (orderId, zipCode, orderItem) => ({ type: ORDER_CANCEL_REQUEST, orderId, zipCode, orderItem });
export const cancelOrderSuccess = data => ({ type: ORDER_CANCEL_SUCCESS, data });
export const cancelOrderFailure = (data, errorMsg) => ({ type: ORDER_CANCEL_FAILURE, data, errorMsg });
export const toggleRedirection = () => ({ type: ORDER_CANCEL_REDIRECT });
