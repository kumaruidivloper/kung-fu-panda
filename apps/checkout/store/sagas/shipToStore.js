import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { addShippingAddress } from '@academysports/aso-env';
import {
    POST_SHIPTOSTORE_REQUEST,
    POST_SUCCESS_CODE
} from './../../checkout.constants';
import { fetchOrderDetails } from './../actions/index';
import { postShipToStoreSuccess, postShipToStoreError } from './../actions/shipToStore';
import { showLoader, hideLoader } from '../actions/globalLoader';

function* shipToStoreData(action) {
  const { data } = action;
  try {
    yield put(showLoader());
    const response = yield call(submitShipToStoreAPI, data);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(postShipToStoreSuccess(response.data));
      yield put(fetchOrderDetails(data.orderId));
    } else {
      yield put(postShipToStoreError());
      yield put(hideLoader());
    }
  } catch (error) {
    if (error.data) {
      yield put(postShipToStoreError(error));
    }
    yield put(hideLoader());
  }
}

function submitShipToStoreAPI(data) {
  return axios({
    method: 'post', url: addShippingAddress(data.orderId), data
  });
}

export default function* shipToStoreSagas() {
  yield takeLatest(POST_SHIPTOSTORE_REQUEST, shipToStoreData);
}
