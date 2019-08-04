import { getStoreAddressUrl } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getStoreDetailError, getStoreDetailSuccess } from './actions';
import { API_SUCCESS_CODE, GET_STORE_REQUEST } from './constants';
import { isUnAuthorized } from '../../utils/helpers';

export default function* orderDetails() {
  yield takeLatest(GET_STORE_REQUEST, getStoreWorkerSaga);
}
/**
 * worker saga for calling API for fetching store details
 * @param {object} action action object containing store id as data
 */
function* getStoreWorkerSaga(action) {
  const { data } = action;
  try {
    const response = yield call(requestGetStoreAPI, data);
    if (response.status === API_SUCCESS_CODE) {
      yield put(getStoreDetailSuccess(response.data));
    } else {
      yield put(getStoreDetailError(response));
    }
  } catch (err) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(err)) {
      return;
    }
    yield put(getStoreDetailError(err));
  }
}
/**
 * function for making API call
 * @param {string} storeId store id
 */
function requestGetStoreAPI(storeId) {
  return axios({ method: 'get', url: getStoreAddressUrl(storeId) });
}
