import { INITIATE_ORDER_REQUEST, INITIATE_ORDER_SUCCESS, INITIATE_ORDER_FAILURE } from './constants';
// initiate return
export const initiateOrderRequest = data => ({ type: INITIATE_ORDER_REQUEST, data });
export const initiateOrderSuccess = data => ({ type: INITIATE_ORDER_SUCCESS, data });
export const initiateOrderFailure = errorKey => ({ type: INITIATE_ORDER_FAILURE, errorKey });
