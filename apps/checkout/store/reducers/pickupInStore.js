import {
    POST_PICKUPINSTORE_REQUEST,
    POST_PICKUPINSTORE_SUCCESS,
    POST_PICKUPINSTORE_FAILURE
  } from './../../checkout.constants';
  export const pickupInStore = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case POST_PICKUPINSTORE_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });
      case POST_PICKUPINSTORE_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
      case POST_PICKUPINSTORE_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true, data: action.data });
      default:
        return state;
    }
  };
