import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { getStoreAddressUrl } from '@academysports/aso-env';
import {
    FETCH_STORE_ADDRESS_REQUEST,
    GET_SUCCESS_CODE
} from './../../checkout.constants';
import { getStoreAddressSuccess, getStoreAddressError } from './../actions/getStoreAddress';
import { showLoader, hideLoader } from '../actions/globalLoader';

function* getStoreAddress(action) {
  const { data } = action;
  try {
    yield put(showLoader());
    const response = yield call(getStoreAddressCall, data);
    if (response.status === GET_SUCCESS_CODE) {
      yield put(getStoreAddressSuccess(response.data));
    }
    yield put(hideLoader());
  } catch (error) {
    yield [put(hideLoader()), put(getStoreAddressError(error))];
  }
}

function getStoreAddressCall(storeId) {
  return axios({
    method: 'get', url: getStoreAddressUrl(storeId)
  });
}

export default function* getStoreAddressSagas() {
  yield takeLatest(FETCH_STORE_ADDRESS_REQUEST, getStoreAddress);
}
