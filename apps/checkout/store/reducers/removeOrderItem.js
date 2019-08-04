import {
    REMOVE_ORDER_ITEM_REQUEST,
    REMOVE_ORDER_ITEM_SUCCESS,
    REMOVE_ORDER_ITEM_FAILURE
  } from './../../checkout.constants';
  export const checkoutRemoveOrderItem = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case REMOVE_ORDER_ITEM_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });
      case REMOVE_ORDER_ITEM_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
      case REMOVE_ORDER_ITEM_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true, data: action.data });
      default:
        return state;
    }
  };
