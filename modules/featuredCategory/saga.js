// import { preScreenCall } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { getErrorKey } from '../../utils/helpers';
import { preScreenCallFailure, preScreenCallSuccess } from './actions';
import { PRE_SCREEN_CALL_REQUEST } from './constants';

export default function* featuredCategory() {
  yield takeLatest(PRE_SCREEN_CALL_REQUEST, preScreenData);
}

function* preScreenData(action) {
  const { data } = action;
  try {
    const response = yield call(preScreenApi, data);
    if (response.status === 201) {
      yield put(preScreenCallSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(preScreenCallFailure(errorKey));
    }
  } catch (err) {
    const errorKey = getErrorKey(err);
   yield put(preScreenCallFailure(errorKey));
  }
}

function preScreenApi(data) {
  return axios({ method: 'get', url: `api/validate/prescreencode?prescreencode=${data}` });
}
