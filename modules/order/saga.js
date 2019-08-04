import { orderDetailsById } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../../apps/myaccount/store/actions/globalLoader';
import { getOrderByIdError, getOrderByIdSuccess, clearCancelErrors } from './actions';
import { API_SUCCESS_CODE, ORDER_DETAILS_BY_ID_DATA } from './constants';

export default function* fetchOrderList() {
  yield takeLatest(ORDER_DETAILS_BY_ID_DATA, fetchOrderListFromAPI);
}
function* fetchOrderListFromAPI(action) {
 const { orderId } = action;
 const requestURL = orderDetailsById(orderId);
 try {
  yield put(showLoader());
   yield put(clearCancelErrors(null));
   const response = yield call(axios, requestURL);
   if (response.status === API_SUCCESS_CODE) {
    yield put(getOrderByIdSuccess(response.data));
   }
   yield put(hideLoader());
   } catch (error) {
    yield [put(hideLoader()), put(getOrderByIdError())];
 }
}
