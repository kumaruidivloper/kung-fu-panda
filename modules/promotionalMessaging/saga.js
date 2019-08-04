import { addPromoCodeAPI, removePromoCodeAPI } from '@academysports/aso-env';
import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { loadCartData, promocodeError, promocodeSuccess } from './action';
import { ADD_PROMOCODE, REMOVE_PROMOCODE } from './constants';

export function* addPromotionalCode(action) {
  const requestURL = addPromoCodeAPI(action.data.orderId, action.data.code);
  try {
    const response = yield call(axios, requestURL, {
      method: 'POST',
      data: {
        promoCode: action.data.code
      }
    });
    if (response.status === 201) {
      yield all([put(loadCartData()), put(promocodeSuccess())]);
    }
  } catch (error) {
    yield put(promocodeError(error));
  }
}

export function* removePromotionalCode(action) {
  const requestURL = removePromoCodeAPI(action.data.orderId, action.data.code);
  try {
    const response = yield call(axios, requestURL, {
      method: 'POST'
    });
    if (response.status === 201) {
      yield all([put(loadCartData()), put(promocodeSuccess())]);
    }
  } catch (error) {
    if (!error || !error.data) {
      return;
    }
    yield put(promocodeError(error));
  }
}

export default function* promotionalMessaging() {
  yield takeLatest(ADD_PROMOCODE, addPromotionalCode);
  yield takeLatest(REMOVE_PROMOCODE, removePromotionalCode);
}
