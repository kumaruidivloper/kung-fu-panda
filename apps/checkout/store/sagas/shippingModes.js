import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { getShippingModes, addShippingAddress } from '@academysports/aso-env';
import {
  fetchSavedShippingModesError,
  fetchSavedShippingModesSuccess,
  postShippingAddressModesError,
  postShippingAddressModesSuccess
} from '../actions/shippingModes';
import { FETCH_SHIPPINGMODES_REQUEST, POST_SHIPPINGMODES_REQUEST, GET_SUCCESS_CODE, POST_SUCCESS_CODE } from '../../checkout.constants';
import { fetchOrderDetails } from './../actions/index';
import { showLoader, hideLoader } from '../actions/globalLoader';

export default function* shippingModesSagas() {
  yield takeLatest(FETCH_SHIPPINGMODES_REQUEST, fecthShippingMethodsData);
  yield takeLatest(POST_SHIPPINGMODES_REQUEST, postShippingAddressModessData);
}

function* fecthShippingMethodsData(action) {
  const { data } = action;
  const requestUrl = getShippingModes(data);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestUrl);
    if (response.status === GET_SUCCESS_CODE) {
      yield put(fetchSavedShippingModesSuccess(response.data));
    }
    yield put(hideLoader());
  } catch (error) {
    if (error.data) {
      yield put(fetchSavedShippingModesError(error.data));
    }
    yield put(hideLoader());
  }
}

function* postShippingAddressModessData(action) {
  const { data } = action;
  try {
    yield put(showLoader());
    const response = yield call(submitShippingMethodAPI, data);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(postShippingAddressModesSuccess(response.data));
      yield put(fetchOrderDetails(data.orderId));// fetch order details
    } else {
      yield put(postShippingAddressModesError());
      yield put(hideLoader());
    }
  } catch (error) {
    if (error.data) {
      yield put(postShippingAddressModesError(error.data));
    }
    yield put(hideLoader());
  }
}
function submitShippingMethodAPI(data) {
  return axios({ method: 'post', url: addShippingAddress(data.orderId), data });
}
