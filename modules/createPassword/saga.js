import { updatePasswordPUT } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import StorageManager from './../../utils/StorageManager';
import { getErrorKey } from '../../utils/helpers';
import { saveNewPasswordError, saveNewPasswordSuccess } from './actions';
import { SAVE_NEW_PASSWORD, PASSWORD_EXPIRED_COOKIE } from './constants';

function* saveNewPasswordCall(action) {
  const { data } = action;
  const putData = {
    logonPassword: data.pwd
  };
  const analyticsData = {
    event: 'signin',
    eventCategory: 'user account',
    eventAction: 'forgot your password|complete',
    eventLabel: 'email'
  };
  try {
    const response = yield call(axios, updatePasswordPUT, {
      method: 'POST',
      data: putData
    });
    yield put(saveNewPasswordSuccess(response.data));
    analyticsData.authenticationcomplete = '1';
    data.analyticsContent(analyticsData);
    StorageManager.deleteCookie(PASSWORD_EXPIRED_COOKIE);
  } catch (err) {
    analyticsData.authenticationcomplete = '0';
    data.analyticsContent(analyticsData);
    const errorKey = getErrorKey(err);
    yield put(saveNewPasswordError(errorKey));
  }
}

export default function* saveNewPassword() {
  yield takeLatest(SAVE_NEW_PASSWORD, saveNewPasswordCall);
}
