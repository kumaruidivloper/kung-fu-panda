import {
    POST_PLACEORDER_REQUEST,
    POST_PLACEORDER_SUCCESS,
    POST_PLACEORDER_FAILURE
  } from './../../checkout.constants';
  export const placeOrder = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case POST_PLACEORDER_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });
      case POST_PLACEORDER_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
      case POST_PLACEORDER_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true, data: action.error });
      default:
        return state;
    }
  };
