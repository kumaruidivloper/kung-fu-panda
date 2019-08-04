import { initiateReturnAPI } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getOrderDetails } from '../noOrder/actions';
import { initiateOrderFailure, initiateOrderSuccess } from './action';
import { API_POST_SUCCESS_CODE, INITIATE_ORDER_REQUEST } from './constants';
import { getErrorKey } from '../../utils/helpers';

function* initiateReturn(action) {
  const { data } = action;
  const { orderId, zipCode } = data;
  const reqURL = initiateReturnAPI(orderId);
  // const value = data.data;
  try {
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data
    });
    if (response.status === API_POST_SUCCESS_CODE) {
      yield put(initiateOrderSuccess(response.data));
      yield put(getOrderDetails(orderId, zipCode));
    } else {
      const errorKey = getErrorKey(response);
      yield put(initiateOrderFailure(errorKey));
    }
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield put(initiateOrderFailure(errorKey));
  }
}

export default function* returnOrder() {
  yield takeLatest(INITIATE_ORDER_REQUEST, initiateReturn);
}
