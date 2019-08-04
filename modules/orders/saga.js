import { orderList } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../../apps/myaccount/store/actions/globalLoader';
import { fetchOrderDataError, fetchOrderDataSuccess } from './action';
import { API_SUCCESS_CODE, ORDER_DATA } from './constants';
import { isUnAuthorized } from '../../utils/helpers';

function* fetchOrderListFromAPI(action) {
  const { options } = action;
  if (options) {
    const { pageSize, selectedSortValue, pageNumber } = options;
    const requestURL = orderList(pageSize, selectedSortValue, pageNumber);
    console.log('product grid : Request URL: ', requestURL);
    try {
      yield put(showLoader());
      const response = yield call(axios, requestURL);
      if (response.status === API_SUCCESS_CODE) {
        yield put(fetchOrderDataSuccess(response.data));
      }
      yield put(hideLoader());
    } catch (error) {
      // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
      if (isUnAuthorized(error)) {
        return;
      }
      yield [put(hideLoader()), put(fetchOrderDataError())];
    }
  } else {
    console.error('data not available!'); // eslint-disable-line
  }
}

export default function* fetchOrderList() {
  yield takeLatest(ORDER_DATA, fetchOrderListFromAPI);
}
