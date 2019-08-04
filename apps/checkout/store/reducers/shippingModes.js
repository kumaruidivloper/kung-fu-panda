import {
  FETCH_SHIPPINGMODES_SUCCESS,
  FETCH_SHIPPINGMODES_REQUEST,
  FETCH_SHIPPINGMODES_FAILURE,
  POST_SHIPPINGMODES_REQUEST,
  POST_SHIPPINGMODES_SUCCESS,
  POST_SHIPPINGMODES_FAILURE
  } from './../../checkout.constants';

  /**
   *
   * @param state
   * @param action
   * @returns {*}
   */
  export const savedShippingModes = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case FETCH_SHIPPINGMODES_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });
      case FETCH_SHIPPINGMODES_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
      case FETCH_SHIPPINGMODES_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true });
      default:
        return state;
    }
  };

  export const validateShippingModes = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case POST_SHIPPINGMODES_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });
      case POST_SHIPPINGMODES_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
      case POST_SHIPPINGMODES_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true });
      default:
        return state;
    }
  };
