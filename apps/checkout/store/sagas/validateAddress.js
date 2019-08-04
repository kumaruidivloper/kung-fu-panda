import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { validateAddress } from '@academysports/aso-env';
import { VALIDATE_ADDRESS_REQUEST, POST_SUCCESS_CODE } from './../../checkout.constants';
import { validateAddressError, validateAddressSuccess } from './../actions/validateAddress';
import { showLoader, hideLoader } from '../actions/globalLoader';
import { COUNTRY } from '../../../../utils/constants';
export default function* fetchSavedShippingAddress() {
  yield takeLatest(VALIDATE_ADDRESS_REQUEST, validateNewAddress);
}

function* validateNewAddress(newAddress) {
  const data = {
    city: newAddress.data.billingCity || newAddress.data.city,
    country: COUNTRY,
    state: newAddress.data.billingState || newAddress.data.state,
    zipCode: newAddress.data.billingZipCode || newAddress.data.zipCode,
    street: newAddress.data.billingAddress1 || newAddress.data.address
  };
  try {
    yield put(showLoader());
    const response = yield call(validateAddressAPI, data);
    if (response.status === POST_SUCCESS_CODE) {
      yield put(validateAddressSuccess(response.data));
    } else {
      yield put(validateAddressError(response.data));
    }
    yield put(hideLoader());
  } catch (err) {
    if (err.data) {
      yield put(validateAddressError(err));
    }
    yield put(hideLoader());
  }
}

function validateAddressAPI(data) {
  return axios({ method: 'post', url: validateAddress, data: { ...data } });
}
