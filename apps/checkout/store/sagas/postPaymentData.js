import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { postCreditCardBillingAddress } from '@academysports/aso-env';
import { POST_PAYMENT_REQUEST, POST_SUCCESS_CODE } from './../../checkout.constants';
import { postpaymentDataError } from './../actions/postPaymentData';
import { showLoader, hideLoader } from '../actions/globalLoader';
import { fetchOrderDetails } from './../actions/index';
import { toggleBillingAddress } from '../actions/savedCreditCards';
export default function* paymentPostData() {
  yield takeLatest(POST_PAYMENT_REQUEST, postPaymentDataSaga);
}

export function* postPaymentDataSaga(action) {
  const { data } = action;
  try {
    yield put(showLoader());
    const response = yield call(postPaymentAPI, data, data.orderId);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(fetchOrderDetails(data.orderId)); // fetch order details
      toggleBillingAddress(false);
    } else {
      yield put(postpaymentDataError());
      yield put(hideLoader());
    }
  } catch (err) {
    if (err.data) {
      yield put(postpaymentDataError(err.data));
    }
    yield put(hideLoader());
  }
}

function postPaymentAPI(data, orderId) {
  return axios({ method: 'post', url: postCreditCardBillingAddress(orderId), data });
}
