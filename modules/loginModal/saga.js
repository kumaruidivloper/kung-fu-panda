import { loginIdentity } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { signinError, signinSuccess } from './actions';
import { POST_SUCCESS_CODE, SIGN_IN_REQUEST } from './constants';

function* signInWorkerSaga(action) {
  const { data } = action;
  try {
    const response = yield call(axios, loginIdentity, { method: 'post', data });
    if (response.status === POST_SUCCESS_CODE) {
      yield put(signinSuccess(response.data));
    } else {
      yield put(signinError(response.data));
    }
  } catch (error) {
    if (error.data) {
      yield put(signinError(error.data));
    }
  }
 }
 export default function* signinData() {
    yield takeLatest(SIGN_IN_REQUEST, signInWorkerSaga);
 }
