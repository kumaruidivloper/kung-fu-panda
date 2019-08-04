import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { getSavedCards } from '@academysports/aso-env';
import { FETCH_SAVED_CARDS_REQUEST, GET_SUCCESS_CODE } from './../../checkout.constants';
import { fetchSavedCardsError, fetchSavedCardsSuccess } from './../actions/savedCreditCards';
import { showLoader, hideLoader } from '../actions/globalLoader';

export default function* fetchSavedCreditCards() {
  yield takeLatest(FETCH_SAVED_CARDS_REQUEST, fetchSavedCardsWorkerSaga);
}

export function* fetchSavedCardsWorkerSaga(action) {
  const { userId } = action;
  try {
    yield put(showLoader());
    const response = yield call(fethSavedCardsAPI, userId);
    if (response.status === GET_SUCCESS_CODE) {
      yield put(fetchSavedCardsSuccess(response.data));
    } else {
      yield put(fetchSavedCardsError(response.data && response.data.status));
    }
    yield put(hideLoader());
  } catch (err) {
    yield [put(hideLoader()), put(fetchSavedCardsError(err))];
  }
}

function fethSavedCardsAPI(userId) {
  return axios({ method: 'get', url: getSavedCards(userId) });
}
