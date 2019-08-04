import { cancelOrderAPI, getAccountOrderConfirmation, getStoreAddressUrl, signUp } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getErrorKey } from '../../utils/helpers';
import {
  cancelOrderFailure,
  cancelOrderSuccess,
  createAccountError,
  createAccountSuccess,
  getAccountError,
  getAccountSuccess,
  getStoreError,
  getStoreSuccess
} from './actions';
import {
  API_SUCCESS_CODE,
  CREATE_ACCOUNT_REQUEST,
  DELETE_API_SUCCESS_CODE,
  GET_ACCOUNT_REQUEST,
  GET_STORE_REQUEST,
  ORDER_CANCEL_REQUEST,
  POST_SUCCESS_CODE
} from './constants';

export default function* createAccount() {
  yield takeLatest(CREATE_ACCOUNT_REQUEST, createAccountWorkerSaga);
  yield takeLatest(GET_ACCOUNT_REQUEST, getAccountWorkerSaga);
  yield takeLatest(GET_STORE_REQUEST, getStoreWorkerSaga);
  yield takeLatest(ORDER_CANCEL_REQUEST, cancelOrder);
}

function* createAccountWorkerSaga(action) {
  const { data } = action;
  try {
    const response = yield call(requestCreateAccountAPI, data);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(createAccountSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(createAccountError(errorKey));
    }
  } catch (err) {
    const errorKey = getErrorKey(err);
    yield put(createAccountError(errorKey));
  }
}
function* getAccountWorkerSaga(action) {
  const { data } = action;
  try {
    const response = yield call(requestGetAccountAPI, data);
    if (response.status === API_SUCCESS_CODE) {
      yield put(getAccountSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(getAccountError(errorKey));
    }
  } catch (err) {
    const errorKey = getErrorKey(err);
    yield put(getAccountError(errorKey));
  }
}
function* getStoreWorkerSaga(action) {
  const { data } = action;
  try {
    const response = yield call(requestGetStoreAPI, data);
    if (response.status === API_SUCCESS_CODE) {
      yield put(getStoreSuccess(response.data));
    } else {
      yield put(getStoreError(response));
    }
  } catch (err) {
    yield put(getStoreError(err));
  }
}
function requestGetStoreAPI(storeId) {
  return axios({ method: 'get', url: getStoreAddressUrl(storeId) });
}
function requestGetAccountAPI(orderId) {
  return axios({ method: 'get', url: getAccountOrderConfirmation(orderId) });
}

function requestCreateAccountAPI(data) {
  return axios({ method: 'post', url: signUp, data });
}

 /**
  * Cancel order saga
  */

function* cancelOrder(action) {
  const { orderId, zipCode } = action;
  const options = {
    method: 'POST'
  };
  const reqURL = cancelOrderAPI(orderId, zipCode);
  try {
    const response = yield call(axios, reqURL, options);
    if (response.status === DELETE_API_SUCCESS_CODE) {
      // yield put(orderDetailsRequest(orderId));
      yield put(cancelOrderSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(cancelOrderFailure(errorKey));
    }
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield put(cancelOrderFailure(errorKey));
  }
}
