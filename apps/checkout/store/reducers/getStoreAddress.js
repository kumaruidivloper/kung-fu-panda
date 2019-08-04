import {
    FETCH_STORE_ADDRESS_REQUEST,
    FETCH_STORE_ADDRESS_SUCCESS,
    FETCH_STORE_ADDRESS_FAILURE
  } from './../../checkout.constants';
  export const storeAddress = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case FETCH_STORE_ADDRESS_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });
      case FETCH_STORE_ADDRESS_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
      case FETCH_STORE_ADDRESS_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true, data: action.data });
      default:
        return state;
    }
  };
