import {
    POST_SHIPTOSTORE_REQUEST,
    POST_SHIPTOSTORE_SUCCESS,
    POST_SHIPTOSTORE_FAILURE
  } from './../../checkout.constants';
  export const shipToStore = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case POST_SHIPTOSTORE_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });
      case POST_SHIPTOSTORE_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
      case POST_SHIPTOSTORE_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true, data: action.data });
      default:
        return state;
    }
  };
