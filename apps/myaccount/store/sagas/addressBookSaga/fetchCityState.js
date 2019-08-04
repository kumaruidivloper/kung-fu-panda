import { getCityState } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getErrorKey } from '../../../../../utils/helpers';
import { hideLoader, showLoader } from '../../actions/globalLoader';
import { LOAD_CITY_STATE_DATA } from './../../../myaccount.constants';
import { addressError } from './../../actions/fetchAddress';
import { fetchCityStateFromZipCodeError, fetchCityStateFromZipCodeSuccess } from './../../actions/fetchCityState';

export default function* fetchCityState() {
  yield takeLatest(LOAD_CITY_STATE_DATA, fetchCityStateFromAPI);
}
function* fetchCityStateFromAPI(action) {
  const { data } = action;
  const requestURL = getCityState(data);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL);
    if (response.status === 200) {
      yield put(fetchCityStateFromZipCodeSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(addressError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(addressError(errorKey))];
    yield put(fetchCityStateFromZipCodeError(response.data));
  }
}
