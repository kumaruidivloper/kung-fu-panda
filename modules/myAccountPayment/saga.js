import {
  addCreditCardAPI,
  addGiftCardAPI,
  deleteCreditCardAPI,
  deleteGiftCardAPI,
  getCreditCardAPI,
  getPostGiftCardsAPI,
  putCreditCardAPI
} from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { eraseCityStateData } from '../../apps/myaccount/store/actions/fetchCityState';
import { hideLoader, showLoader } from '../../apps/myaccount/store/actions/globalLoader';
import { inValidateAddressVerification } from '../../apps/myaccount/store/actions/validateAddress';
import { getErrorKey, isUnAuthorized } from '../../utils/helpers';
import {
  addCreditCardError,
  addGiftCardserror,
  deleteCreditCardError,
  deleteCreditCardSuccess,
  deleteGiftCardError,
  getCreditCardError,
  getCreditCards,
  getCreditCardsSuccess,
  getGiftCards,
  getGiftCardsError,
  getGiftCardsSuccess,
  putCreditCardError,
  addGiftCardSuccess,
  deleteGiftCardSuccess
} from './actions';
import {
  ADD_CREDIT_CARD,
  ADD_GIFT_CARD,
  API_SUCCESS_CODE,
  DELETE_API_SUCCESS_CODE,
  DELETE_CREDIT_CARD,
  DELETE_GIFT_CARD,
  GET_CREDIT_CARDS,
  GET_GIFT_CARDS,
  POST_API_SUCCESS_CODE,
  PUT_CREDIT_CARD
} from './constants';

/**
 * This function gets the user credit cards from api and handles the error if any
 * @param {Object} action
 */
function* getCreditcardFromAPI(action) {
  const { data } = action;
  const reqURL = getCreditCardAPI(data);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'GET'
    });
    if (response.status === API_SUCCESS_CODE) {
      yield put(inValidateAddressVerification());
      yield put(getCreditCardsSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(getCreditCardError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(response)) {
      return;
    }
    const errorKey = getErrorKey(response);
    yield put(getCreditCardError(errorKey));
    yield put(hideLoader());
    if (response.status === 403) {
      window.location.assign('/shop/LogonForm');
    }
  }
}
/**
 * This function gets user gift cards from api and handles the error if any
 * @param {Object} action
 */
function* getGiftCardsFromAPI(action) {
  const { data } = action;
  const reqURL = getPostGiftCardsAPI(data);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL);
    if (response.status === API_SUCCESS_CODE) {
      yield put(getGiftCardsSuccess(response.data.profile.payment));
      yield put(hideLoader());
    } else {
      const errorKey = getErrorKey(response);
      yield put(getGiftCardsError(errorKey));
    }
  } catch (response) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(response)) {
      return;
    }
    const errorKey = getErrorKey(response);
    yield put(getGiftCardsError(errorKey));
    yield put(hideLoader());
    if (response.status === 403) {
      window.location.assign('/shop/LogonForm');
    }
  }
}
/**
 * This function add the user gift card
 * @param {Object} action
 */
function* addGiftCardToAPI(action) {
  const { id, data } = action;
  const reqURL = addGiftCardAPI(id);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data
    });
    if (response.status === POST_API_SUCCESS_CODE && response.data.profile.payment[0].success) {
      yield put(addGiftCardSuccess(response.data));
      yield put(getGiftCards(id));
    } else {
      yield put(addGiftCardserror(response.data.errors[0].errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(response)) {
      return;
    }
    yield put(hideLoader());
    yield put(addGiftCardserror(response.data.errors[0].errorKey));
  }
}
/**
 * This function adds the user credit card
 * @param {Object} action
 */
function* addCreditCardToAPI(action) {
  const { id, data } = action;
  const reqURL = addCreditCardAPI(id);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data
    });
    if (response.status === POST_API_SUCCESS_CODE && response.data.profile.payment[0].success) {
      yield put(getCreditCards(id));
      yield put(eraseCityStateData());
    } else {
      const errorKey = getErrorKey(response);
      yield put(addCreditCardError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(response)) {
      return;
    }
    const errorKey = getErrorKey(response);
    yield put(addCreditCardError(errorKey));
    yield put(hideLoader());
  }
}
/**
 * This function deletes the user gift card
 * @param {Object} action
 */
function* deleteGiftCardFromAPI(action) {
  const { id, data } = action;
  const reqURL = deleteGiftCardAPI(id, data);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST'
    });
    if (response.status === DELETE_API_SUCCESS_CODE) {
      yield put(deleteGiftCardSuccess(response.data));
      yield put(getGiftCards(id));
    } else {
      const errorKey = getErrorKey(response);
      yield put(deleteGiftCardError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(response)) {
      return;
    }
    const errorKey = getErrorKey(response);
    yield put(deleteGiftCardError(errorKey));
    yield put(hideLoader());
  }
}
/**
 * This function deletes the user credit card
 * @param {Object} action
 */
function* deleteCreditCardFromAPI(action) {
  const { id, data } = action;
  const reqURL = deleteCreditCardAPI(id, data);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST'
    });
    if (response.status === DELETE_API_SUCCESS_CODE) {
      yield put(deleteCreditCardSuccess(response.success));
      yield put(getCreditCards(id));
    } else {
      const errorKey = getErrorKey(response);
      yield put(deleteCreditCardError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(response)) {
      return;
    }
    const errorKey = getErrorKey(response);
    yield put(deleteCreditCardError(errorKey));
    yield put(hideLoader());
  }
}
/**
 * This function updates the user credit card
 * @param {Object} action
 */
function* putCreditCardToAPI(action) {
  const { id, itemID, data, makePrimary } = action;
  const reqURL = putCreditCardAPI(id, itemID, makePrimary);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data
    });
    if (response.status === API_SUCCESS_CODE && response.data.profile.payment[0].success) {
      yield put(getCreditCards(id));
    } else {
      const errorKey = getErrorKey(response);
      yield put(putCreditCardError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(response)) {
      return;
    }
    const errorKey = getErrorKey(response);
    yield put(putCreditCardError(errorKey));
    yield put(hideLoader());
  }
}

export default function* fetchCityState() {
  yield takeLatest(GET_CREDIT_CARDS, getCreditcardFromAPI);
  yield takeLatest(GET_GIFT_CARDS, getGiftCardsFromAPI);
  yield takeLatest(ADD_GIFT_CARD, addGiftCardToAPI);
  yield takeLatest(DELETE_GIFT_CARD, deleteGiftCardFromAPI);
  yield takeLatest(DELETE_CREDIT_CARD, deleteCreditCardFromAPI);
  yield takeLatest(ADD_CREDIT_CARD, addCreditCardToAPI);
  yield takeLatest(PUT_CREDIT_CARD, putCreditCardToAPI);
}
