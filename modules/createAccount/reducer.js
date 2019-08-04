import { combineReducers } from 'redux';
import { ORDER_CANCEL_REDIRECT, ORDER_CANCEL_FAILURE, ORDER_CANCEL_SUCCESS, GET_ACCOUNT_REQUEST, GET_ACCOUNT_SUCCESS, GET_ACCOUNT_FAILURE, TOGGLE_CREATE_ACCOUNT_MODAL, CREATE_ACCOUNT_REQUEST, CREATE_ACCOUNT_SUCCESS, CREATE_ACCOUNT_FAILURE, GET_STORE_FAILURE, GET_STORE_SUCCESS, GET_STORE_REQUEST } from './constants';

  export const createAccount = (state = { isFetching: false, error: false, data: {}, modal: false }, action) => {
    switch (action.type) {
      case CREATE_ACCOUNT_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });

      case CREATE_ACCOUNT_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data, modal: true });

      case CREATE_ACCOUNT_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true, modal: false, data: action.data });

      case TOGGLE_CREATE_ACCOUNT_MODAL:
        return Object.assign({}, state, { isFetching: false, error: false, modal: !state.modal });
      default:
        return state;
    }
  };
  export const getAccount = (state = { isFetching: false, errorKey: '', error: false, data: {} }, action) => {
    switch (action.type) {
      case GET_ACCOUNT_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });

      case GET_ACCOUNT_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

      case GET_ACCOUNT_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true, errorKey: action.data });
      default:
        return state;
    }
  };

  export const getStoreAddress = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case GET_STORE_REQUEST:
        return Object.assign({}, state, { isFetching: true, error: false });

      case GET_STORE_SUCCESS:
        return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

      case GET_STORE_FAILURE:
        return Object.assign({}, state, { isFetching: false, error: true });
      default:
        return state;
    }
  };
  /**
   * cancel order reducer
   */
  export const cancelOrder = (state = { data: {}, errorKey: '', error: false, redirect: false }, action) => {
    switch (action.type) {
      case ORDER_CANCEL_SUCCESS:
        return Object.assign({}, state, { data: action.data, errorKey: '', error: false, redirect: true });
      case ORDER_CANCEL_FAILURE:
        return Object.assign({}, state, { data: {}, errorKey: action.data, error: true, redirect: false });
      case ORDER_CANCEL_REDIRECT:
        return Object.assign({}, state, { redirect: false });
      default:
        return state;
    }
  };
  export default combineReducers({
    createAccount,
    getAccount,
    getStoreAddress,
    cancelOrder
  });
