import {
  GET_ACCOUNT_REQUEST,
  GET_ACCOUNT_FAILURE,
  GET_ACCOUNT_SUCCESS,
  TOGGLE_CREATE_ACCOUNT_MODAL,
  CREATE_ACCOUNT_REQUEST,
  CREATE_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_FAILURE,
  GET_STORE_SUCCESS,
  GET_STORE_FAILURE,
  GET_STORE_REQUEST,
  ORDER_CANCEL_REQUEST,
  ORDER_CANCEL_SUCCESS,
  ORDER_CANCEL_FAILURE
} from './constants';
// import actions from '../../../../../../../.cache/typescript/2.6/node_modules/@types/redux-form/lib/actions';

export const toggleCreateAccountModal = () => ({
  type: TOGGLE_CREATE_ACCOUNT_MODAL
});

export const createAccountSuccess = data => ({
  type: CREATE_ACCOUNT_SUCCESS,
  data
});

export const createAccountError = data => ({
  type: CREATE_ACCOUNT_FAILURE,
  data
});

export const createAccountRequest = data => ({
  type: CREATE_ACCOUNT_REQUEST,
  data
});

export const getAccountSuccess = data => ({
  type: GET_ACCOUNT_SUCCESS,
  data
});

export const getAccountError = data => ({
  type: GET_ACCOUNT_FAILURE,
  data
});

export const getAccountRequest = data => ({
  type: GET_ACCOUNT_REQUEST,
  data
});
export const getStoreSuccess = data => ({
  type: GET_STORE_SUCCESS,
  data
});

export const getStoreError = error => ({
  type: GET_STORE_FAILURE,
  error
});

export const getStoreRequest = data => ({
  type: GET_STORE_REQUEST,
  data
});

export const cancelOrderRequest = (orderId, zipCode) => ({ type: ORDER_CANCEL_REQUEST, orderId, zipCode });
export const cancelOrderSuccess = data => ({ type: ORDER_CANCEL_SUCCESS, data });
export const cancelOrderFailure = data => ({ type: ORDER_CANCEL_FAILURE, data });
