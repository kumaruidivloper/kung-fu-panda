import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { postPayPalAPI } from '@academysports/aso-env';
import { POST_PAYPAL_REQUEST, POST_SUCCESS_CODE } from './../../checkout.constants';
import { postPayPalError } from './../actions/postPayPalData';
import { showLoader, hideLoader } from '../actions/globalLoader';
import { fetchOrderDetails } from './../actions/index';

export default function* postPayPalData() {
  yield takeLatest(POST_PAYPAL_REQUEST, postPayPalSaga);
}

export function* postPayPalSaga(action) {
  const { data, orderId } = action;
  try {
    yield put(showLoader());
    const response = yield call(postPayPalAPICall, data, orderId);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(fetchOrderDetails(data.orderId)); // fetch order details
    } else {
      yield put(postPayPalError());
      yield put(hideLoader());
    }
  } catch (err) {
    if (err.data) {
      yield put(postPayPalError(err.data));
    }
    yield put(hideLoader());
  }
}

function postPayPalAPICall(data, orderId) {
  return axios({ method: 'post', url: postPayPalAPI(orderId), data });
}
