import { ORDER_DETAILS_BY_ID_DATA, ORDER_DETAILS_BY_ID_DATA_SUCCESS, ORDER_DETAILS_BY_ID_DATA_FAILURE } from './constants';
import { CLEAR_ORDER_CANCEL_ERRORS } from '../orderCancellation/constants';


export function getOrderById(orderId) {
  return {
    type: ORDER_DETAILS_BY_ID_DATA,
    orderId
  };
}
export function getOrderByIdSuccess(data) {
  return {
    type: ORDER_DETAILS_BY_ID_DATA_SUCCESS,
    data
  };
}
export function getOrderByIdError() {
  return {
    type: ORDER_DETAILS_BY_ID_DATA_FAILURE
  };
}
export function clearCancelErrors(data) {
  return {
    type: CLEAR_ORDER_CANCEL_ERRORS,
    data
  };
}
