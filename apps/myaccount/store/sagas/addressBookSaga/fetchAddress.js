import { getAddress } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getErrorKey, isUnAuthorized } from '../../../../../utils/helpers';
import { hideLoader, showLoader } from '../../actions/globalLoader';
import { API_SUCCESS_CODE, LOAD_ADDRESS_DATA } from './../../../myaccount.constants';
import { addressError, fetchAddressSuccess } from './../../actions/fetchAddress';

export default function* fetchAddress() {
  yield takeLatest(LOAD_ADDRESS_DATA, fetchAddressFromAPI);
}
function* fetchAddressFromAPI(action) {
  const { data } = action;
  const requestURL = getAddress(data);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL);
    if (response.status === API_SUCCESS_CODE) {
      yield put(fetchAddressSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(addressError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(response)) {
      return;
    }
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(addressError(errorKey))];
  }
}
