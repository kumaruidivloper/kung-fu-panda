import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { getShippingAddress, addShippingAddress } from '@academysports/aso-env';
import { FETCH_SHIPPING_ADDRESS_REQUEST, ADD_SHIPPING_ADDRESS_REQUEST, GET_SUCCESS_CODE, POST_SUCCESS_CODE } from './../../checkout.constants';
// import { fetchSavedShippingAddressSuccess, fetchSavedShippingAddressError } from './../actions/savedShippingAddress';
// import { FETCH_SHIPPING_ADDRESS_REQUEST, ADD_SHIPPING_ADDRESS_REQUEST } from './../../checkout.constants';
import { fetchSavedShippingAddressSuccess, fetchSavedShippingAddressError, addshippingAddressSuccess, addshippingAddressError } from './../actions/savedShippingAddress';
import { fetchOrderDetails } from './../actions/index';
import { showLoader, hideLoader } from '../actions/globalLoader';

export default function* fetchSavedShippingAddress() {
  yield takeLatest(FETCH_SHIPPING_ADDRESS_REQUEST, fetchSavedShippingAddressWorkerSaga);
  yield takeLatest(ADD_SHIPPING_ADDRESS_REQUEST, addNewShippingAddressWorkerSaga);
}

function* fetchSavedShippingAddressWorkerSaga(action) {
  const { userId } = action;
  try {
    yield put(showLoader());
    const response = yield call(fetchSavedShippingAddressAPI, userId);
    if (response.status === GET_SUCCESS_CODE) {
      yield put(fetchSavedShippingAddressSuccess(response.data));
      yield put(hideLoader());
     } else {
      yield put(fetchSavedShippingAddressError());
      yield put(hideLoader());
     }
  } catch (err) {
    if (err.data) {
      yield put(fetchSavedShippingAddressError(err.data));
    }
    yield put(hideLoader());
  }
}

function* addNewShippingAddressWorkerSaga(action) {
  const shippingAddressData = {
      ...action.data,
    country: 'US',
    orderId: action.orderid,
    isAddressVerified: (action.isAddressVerified ? '1' : '0'),
    URL: 'checkout'
  };
  try {
    yield put(showLoader());
    const response = yield call(submitShippingAddressAPI, shippingAddressData);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(addshippingAddressSuccess(response.data));
      yield put(fetchOrderDetails(action.orderid));// fetch order details
    } else {
      yield put(addshippingAddressError(response.data));
      yield put(hideLoader());
    }
  } catch (err) {
    if (err.data) {
      yield put(addshippingAddressError(err.data));
    }
    yield put(hideLoader());
  }
}

function fetchSavedShippingAddressAPI(userId) {
  return axios({ method: 'get', url: getShippingAddress(userId) });
}
function submitShippingAddressAPI(shippingAddressData) {
  return axios({ method: 'post', url: addShippingAddress(shippingAddressData.orderId), data: { ...shippingAddressData } });
}
