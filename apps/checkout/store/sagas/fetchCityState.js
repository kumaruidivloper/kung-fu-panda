import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { getCityState } from '@academysports/aso-env';
import { LOAD_CITY_STATE_DATA, GET_SUCCESS_CODE } from './../../checkout.constants';
import { fetchCityStateFromZipCodeSuccess, fetchCityStateFromZipCodeError } from './../actions/fetchCityState';
import { showLoader, hideLoader } from '../actions/globalLoader';

export default function* fetchCityState() {
  yield takeLatest(LOAD_CITY_STATE_DATA, fetchCityStateFromAPI);
}

function* fetchCityStateFromAPI(action) {
  const { data } = action;
  const requestURL = getCityState(data);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL);
    if (response.status === GET_SUCCESS_CODE) {
      yield put(fetchCityStateFromZipCodeSuccess(response.data));
    } else {
      yield put(fetchCityStateFromZipCodeError(response.data));
    }
    yield put(hideLoader());
  } catch (error) {
    if (error.data) {
      yield put(fetchCityStateFromZipCodeError(error.data));
    }
    yield put(hideLoader());
  }
}
