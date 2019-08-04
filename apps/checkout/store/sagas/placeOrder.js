import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { placeOrder } from '@academysports/aso-env';
import { POST_PLACEORDER_REQUEST, POST_SUCCESS_CODE } from './../../checkout.constants';
import { postPlaceOrderSuccess, postPlaceOrderError } from './../actions/placeOrder';
import { showLoader, hideLoader } from '../actions/globalLoader';
import { unsetCheckoutCookie } from './../../../../utils/helpers';

export function* postPlaceOrderData(action) {
  const { data } = action.data;
  try {
    yield put(showLoader());
    const response = yield call(submitPlaceOrderAPI, data);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(postPlaceOrderSuccess(response.data));
      unsetCheckoutCookie(); // unset checkout cookie
      window.location.href = `/shop/OrderConfirmation?orderId=${data.orderId}`; // redirect to order confirmation page
    } else {
      yield put(postPlaceOrderError(response.data));
      yield put(hideLoader());
    }
  } catch (error) {
    if (error.data) {
      yield put(postPlaceOrderError(error.data));
    }
    yield put(hideLoader());
  }
}

function submitPlaceOrderAPI(data) {
  return axios({
    method: 'post',
    url: placeOrder(data.orderId),
    data
  });
}

export default function* placeOrderSagas() {
  yield takeLatest(POST_PLACEORDER_REQUEST, postPlaceOrderData);
}
