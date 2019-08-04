import { cancelOrderAPI, orderDetailsById } from '@academysports/aso-env';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { get } from '@react-nitro/error-boundary';

import { getErrorKey } from '../../utils/helpers';
import { getOrderDetails } from '../noOrder/actions';
import { cancelOrderFailure, cancelOrderSuccess, oderDetailsSuccess, orderDetailsfailure } from './action';
import { API_SUCCESS_CODE, ORDER_CANCEL_REQUEST, ORDER_DETAILS_REQUEST, CANCEL_INELIGIBLE } from './constants';
import { getXhrErrorMessageFrom } from '../../utils/xhrError';

import { logAnalyticsCancelOrder } from './analytics';

// import { getOrderDetails } from '../noOrder/actions';
function* getOrderDetailsById(action) {
  const { orderId } = action;
  const options = {
    method: 'GET'
  };
  const reqURL = orderDetailsById(orderId);
  try {
    const response = yield call(axios, reqURL, options);
    if (response.status === API_SUCCESS_CODE) {
      yield put(oderDetailsSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(orderDetailsfailure(errorKey));
    }
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield put(orderDetailsfailure(errorKey));
  }
}
function* cancelOrder(action) {
  const { orderId, zipCode, orderItem } = action;
  const options = {
    method: 'POST'
  };
  const reqURL = cancelOrderAPI(orderId, zipCode);
  try {
    const response = yield call(axios, reqURL, options);
    const isCancelled = get(response, 'data.success', true);
    if (isCancelled) {
      yield put(cancelOrderSuccess(response.data));
      logAnalyticsCancelOrder(orderId, orderItem);
    } else {
      yield put(cancelOrderFailure(response.data.warningKey));
      yield put(getOrderDetails(orderId, zipCode));
    }
  } catch (response) {
    const errorKey = getErrorKey(response);
    const errorMsg = getXhrErrorMessageFrom(response);
    if (errorKey === CANCEL_INELIGIBLE && ExecutionEnvironment.canUseDOM) {
      window.location.reload();
    }
    yield put(cancelOrderFailure(errorKey, errorMsg));
  }
}

export default function* cancellationOrder() {
  yield takeLatest(ORDER_DETAILS_REQUEST, getOrderDetailsById);
  yield takeLatest(ORDER_CANCEL_REQUEST, cancelOrder);
}
