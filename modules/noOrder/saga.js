import { orderDetailsById } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../../apps/myaccount/store/actions/globalLoader';
import { getErrorKey } from '../../utils/helpers';
import { getOrderDetailsError, getOrderDetailsSuccess } from './actions';
import { API_SUCCESS_CODE, ORDER_DETAILS_DATA } from './constants';

// import { orderList } from '@academysports/aso-env';
function* fetchOrderDetailsFromAPI(action) {
  const { orderId, zipCode } = action;
  //  const requestURL = orderList;
  const requestURL = orderDetailsById(orderId);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL, {
      params: {
        orderId,
        zipCode
      }
    });
    if (response.status === API_SUCCESS_CODE) {
      yield put(getOrderDetailsSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(getOrderDetailsError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(getOrderDetailsError(errorKey)), put(hideLoader())];
  }
}
export default function* fetchOrderDetails() {
  yield takeLatest(ORDER_DETAILS_DATA, fetchOrderDetailsFromAPI);
}
