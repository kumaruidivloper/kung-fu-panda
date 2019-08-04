import {
    CHECKOUT_INVENTORY_REQUEST,
    CHECKOUT_INVENTORY_SUCCESS,
    CHECKOUT_INVENTORY_FAILURE
  } from './../../checkout.constants';
  export const checkoutInventory = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case CHECKOUT_INVENTORY_REQUEST:
        return { ...state, isFetching: true, error: false };
      case CHECKOUT_INVENTORY_SUCCESS:
        return { ...state, isFetching: false, error: false, data: action.data };
      case CHECKOUT_INVENTORY_FAILURE:
        return { ...state, isFetching: false, error: true, data: action.data };
      default:
        return state;
    }
  };
