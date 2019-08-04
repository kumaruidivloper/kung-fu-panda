import { getCityState } from '@academysports/aso-env';
import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { GET_SUCCESS_CODE } from '../../apps/cart/cart.constants';
import { loadCart } from '../../apps/cart/store/actions';
import Storage from './../../utils/StorageManager';
import { zipcodeFailure, zipcodeSuccess } from './actions';
import { ZIP_VALIDATION } from './constants';

/**
 * Method to validate zipcode
 * @param {object} action
 */
export function* deliveryZipValidation(action) {
  try {
    const response = yield call(axios, getCityState(action.data.zipcode));
    if (response.status === GET_SUCCESS_CODE) {
      action.data.modalToggle();
      Storage.setSessionStorage('cartUserChangedZip', action.data.zipcode);
      yield all([put(loadCart()), put(zipcodeSuccess())]);
    }
  } catch (error) {
    if (error.data) {
      yield put(zipcodeFailure(error.data));
    } else {
      // Fallback
      yield put(zipcodeFailure({}));
    }
  }
}

export default function* cartOrderSummary() {
  yield takeLatest(ZIP_VALIDATION, deliveryZipValidation);
}
