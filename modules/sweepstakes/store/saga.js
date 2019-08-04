import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
    PUT_SWEEP_STAKES_REQUEST,
    AUTH_TOKEN
} from './../constants';
import { putSweepstakesDataSuccess, putSweepstakesDataError } from './actions';
/**
 * it handle the response status, success action and failure action
 * @param {object} action -contain request data
 */
function* sweepstakesData(action) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Organization': 'AcademySports',
    Accept: 'application/json',
    Authorization: AUTH_TOKEN
  };
  const { data, header, postUrl } = action.data;

  try {
    const response = yield call(sweepstakesAPI, headers, { data, header }, postUrl);
    yield put(putSweepstakesDataSuccess(response.data));
  } catch (error) {
    yield put(putSweepstakesDataError(error));
  }
}
/**
 * it handles api call
 * @param {object} headers - headers data
 * @param {object} data - post data
 */
function sweepstakesAPI(headers, data, postUrl) {
  return axios({
    method: 'PUT', url: postUrl, headers, data
  });
}
/**
 * it handle the request action call
 */
export default function* shipToStoreSagas() {
  yield takeLatest(PUT_SWEEP_STAKES_REQUEST, sweepstakesData);
}
