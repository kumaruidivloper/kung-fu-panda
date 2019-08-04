import {
  GET_STORE_SUCCESS,
  GET_STORE_FAILURE,
  GET_STORE_REQUEST,
  INITIATE_ORDER_RESET
} from './constants';

export const getStoreDetailSuccess = data => ({
  type: GET_STORE_SUCCESS,
  data
});

export const getStoreDetailError = error => ({
  type: GET_STORE_FAILURE,
  error
});

export const getStoreDetailRequest = data => ({
  type: GET_STORE_REQUEST,
  data
});

export const initiateOrderReset = () => ({ type: INITIATE_ORDER_RESET });
