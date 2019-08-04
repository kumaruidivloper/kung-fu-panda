import { POST_PLACEORDER_REQUEST, POST_PLACEORDER_SUCCESS, POST_PLACEORDER_FAILURE } from './../../checkout.constants';


export function postPlaceOrder(data) {
  return {
    type: POST_PLACEORDER_REQUEST,
    data
  };
}

export function postPlaceOrderSuccess(data) {
  return {
    type: POST_PLACEORDER_SUCCESS,
    data
  };
}

export function postPlaceOrderError(error) {
  return {
    type: POST_PLACEORDER_FAILURE,
    error
  };
}
