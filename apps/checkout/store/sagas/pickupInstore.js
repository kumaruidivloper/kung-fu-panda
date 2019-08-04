import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { addShippingAddress } from '@academysports/aso-env';
import {
    POST_PICKUPINSTORE_REQUEST,
    POST_SUCCESS_CODE
} from './../../checkout.constants';
import { fetchOrderDetails } from './../actions/index';
import { postPickupInStoreSuccess, postPickupInStoreError } from './../actions/pickupInStore';
import { showLoader, hideLoader } from '../actions/globalLoader';

function* pickupInStoreData(action) {
  const { data } = action;
  try {
    yield put(showLoader());
    const response = yield call(submitPickupInStoreAPI, data);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(postPickupInStoreSuccess(response.data));
      yield put(fetchOrderDetails(data.orderId));
    } else {
      yield put(postPickupInStoreError(response.data));
      yield put(hideLoader());
    }
  } catch (error) {
    if (error.data) {
      yield put(postPickupInStoreError(error.data));
    }
    yield put(hideLoader());
  }
}

function submitPickupInStoreAPI(data) {
  return axios({
    method: 'post', url: addShippingAddress(data.orderId), data
  });
}

export default function* pickupInStoreSagas() {
  yield takeLatest(POST_PICKUPINSTORE_REQUEST, pickupInStoreData);
}
