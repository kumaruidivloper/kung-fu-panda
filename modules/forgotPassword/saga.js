import { resetPassword } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getErrorKey } from '../../utils/helpers';
import { hideLoader, showLoader } from './../../apps/signInSignUp/store/actions/globalLoader';
import { forgotPasswordError, forgotPasswordSuccess } from './actions';
import { FORGOT_PASSWORD, POST_API_SUCCESS_CODE } from './constants';

function* putEmailData(action) {
  const { data } = action;
  yield put(showLoader());
  try {
    const response = yield call(axios, resetPassword, { method: 'post', data });
    if (response.status === POST_API_SUCCESS_CODE) {
      yield put(forgotPasswordSuccess(response.data));
      yield put(hideLoader());
    } else {
      const errorKey = getErrorKey(response);
      yield put(forgotPasswordError(errorKey));
      yield put(hideLoader());
    }
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield put(forgotPasswordError(errorKey));
    yield put(hideLoader());
  }
 }
 export default function* signinData() {
    yield takeLatest(FORGOT_PASSWORD, putEmailData);
 }
