import { REMOVE_ORDER_ITEM_REQUEST, REMOVE_ORDER_ITEM_SUCCESS, REMOVE_ORDER_ITEM_FAILURE } from './../../checkout.constants';


export function checkoutRemoveOrderItem(data) {
  return {
    type: REMOVE_ORDER_ITEM_REQUEST,
    data
  };
}

export function checkoutRemoveOrderItemSuccess(data) {
  return {
    type: REMOVE_ORDER_ITEM_SUCCESS,
    data
  };
}

export function checkoutRemoveOrderItemError(error) {
  return {
    type: REMOVE_ORDER_ITEM_FAILURE,
    error
  };
}
