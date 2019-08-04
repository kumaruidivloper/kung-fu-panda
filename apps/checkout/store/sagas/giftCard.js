import { applyGiftCard, fetchGiftCard, removeGiftCard } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../actions/globalLoader';
import {
  GET_SUCCESS_CODE,
  GIFTCARD_APPLY_REQUEST,
  GIFTCARD_FETCH_REQUEST,
  GIFTCARD_REMOVE_REQUEST,
  POST_SUCCESS_CODE
} from './../../checkout.constants';
import { fetchOrderDetails } from './../actions';
import {
  giftCardApplyFailure,
  giftCardApplySuccess,
  giftCardFetchFailure,
  giftCardFetchSuccess,
  giftCardRemoveFailure,
  giftCardRemoveSuccess
} from './../actions/giftCard';

export default function* addGiftCard() {
  yield takeLatest(GIFTCARD_APPLY_REQUEST, addGiftCardAPI);
  yield takeLatest(GIFTCARD_REMOVE_REQUEST, removeGiftCardAPI);
  yield takeLatest(GIFTCARD_FETCH_REQUEST, fetchGiftCardAPI);
}

function* addGiftCardAPI(action) {
  const { data } = action;
  try {
    yield put(showLoader());
    const response = yield call(applyNewGiftCard, data);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(giftCardApplySuccess(response.data));
      yield put(fetchOrderDetails(data.orderId));// fetch order details
    } else {
      yield put(giftCardApplyFailure(true));
      yield put(hideLoader());
    }
  } catch (error) {
    if (error.data) {
      yield put(giftCardApplyFailure(error.data));
    }
    yield put(hideLoader());
  }
}

function applyNewGiftCard(giftCardData) {
  return axios({ method: 'post', url: applyGiftCard(giftCardData.orderId), data: { ...giftCardData } });
}

function* removeGiftCardAPI(action) {
  const { data } = action;
  try {
    yield put(showLoader());
    const response = yield call(removeNewGiftCard, data);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(giftCardRemoveSuccess(response.data));
      yield put(fetchOrderDetails(data.orderId));// fetch order details
    } else {
      yield put(giftCardRemoveFailure(true));
      yield put(hideLoader());
    }
  } catch (error) {
    if (error.data) {
      yield put(giftCardRemoveFailure(error.data));
    }
    yield put(hideLoader());
  }
}

function removeNewGiftCard(giftCardData) {
  return axios({ method: 'post', url: removeGiftCard(giftCardData.orderId, giftCardData.gcPiId) });
}

function* fetchGiftCardAPI(action) {
  const { data } = action;
  try {
    yield put(showLoader());
    const response = yield call(fetchGiftCards, data);
    if (response.status === GET_SUCCESS_CODE) {
      yield put(giftCardFetchSuccess(response.data));
      yield put(hideLoader());
    } else {
      yield put(giftCardFetchFailure(true));
      yield put(hideLoader());
    }
  } catch (error) {
    if (error.data) {
      yield put(giftCardFetchFailure(error.data));
    }
    yield put(hideLoader());
  }
}

function fetchGiftCards(giftCardData) {
  return axios({ method: 'get', url: fetchGiftCard(giftCardData.profileId) });
}
