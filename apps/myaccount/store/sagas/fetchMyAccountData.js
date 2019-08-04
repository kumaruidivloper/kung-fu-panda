import { profileInfo } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../actions/globalLoader';
import { API_SUCCESS_CODE, MY_ACCOUNT_DATA } from './../../myaccount.constants';
import { fetchMyAccountDataError, fetchMyAccountDataSuccess } from './../actions/fetchAccountData';
import { isUnAuthorized } from '../../../../utils/helpers';

export default function* fetchAccountData() {
  yield takeLatest(MY_ACCOUNT_DATA, fetchMyAccountAPI);
}
function* fetchMyAccountAPI(action) {
  const { profileId } = action;
  const requestURL = profileInfo(profileId);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL, {
      method: 'get'
    });
    if (response.status === API_SUCCESS_CODE && response.data) {
      yield put(fetchMyAccountDataSuccess(response.data));
    } else {
      yield put(fetchMyAccountDataError());
    }
    yield put(hideLoader());
  } catch (error) {
    if (isUnAuthorized(error)) {
      return;
    }
    yield [put(hideLoader()), put(fetchMyAccountDataError())];
  }
}
