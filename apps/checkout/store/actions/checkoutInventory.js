import { CHECKOUT_INVENTORY_REQUEST, CHECKOUT_INVENTORY_SUCCESS, CHECKOUT_INVENTORY_FAILURE } from './../../checkout.constants';

export function checkoutInventoryRequest(data) {
  return {
    type: CHECKOUT_INVENTORY_REQUEST,
    data
  };
}
export function checkoutInventorySuccess(data) {
  return {
    type: CHECKOUT_INVENTORY_SUCCESS,
    data
  };
}
export function checkoutInventoryError(error) {
  return {
    type: CHECKOUT_INVENTORY_FAILURE,
    error
  };
}
