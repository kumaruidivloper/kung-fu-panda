import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_BILLING_ADDRESS_REQUEST, GET_SUCCESS_CODE } from './../../checkout.constants';
import { fetchSavedBillingAddressSuccess, fetchSavedBillingAddressError } from './../actions/savedBillingAddress';
import { showLoader, hideLoader } from '../actions/globalLoader';

export default function* fetchSavedBillingAddress() {
  yield takeLatest(FETCH_BILLING_ADDRESS_REQUEST, fetchSavedBillingAddressWorkerSaga);
}

function* fetchSavedBillingAddressWorkerSaga() {
  try {
    yield put(showLoader());
    const response = yield call(fetchSavedBillingAddressErrorAPI);
    if (response.status === GET_SUCCESS_CODE) {
      yield put(fetchSavedBillingAddressSuccess(response.data));
    }
    yield put(hideLoader());
  } catch (err) {
    yield [put(hideLoader()), put(fetchSavedBillingAddressError(err))];
  }
}

function fetchSavedBillingAddressErrorAPI() {
  return axios({ method: 'get', url: '/checkout/orderDetails' });
}
