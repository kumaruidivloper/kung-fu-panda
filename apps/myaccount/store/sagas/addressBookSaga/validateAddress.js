import { validateAddress } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../../actions/globalLoader';
import { POST_API_SUCCESS_CODE, VALIDATE_ADDRESS_REQUEST } from './../../../myaccount.constants';
import { validateAddressError, validateAddressSuccess } from './../../actions/validateAddress';

export default function* fetchSavedShippingAddress() {
  yield takeLatest(VALIDATE_ADDRESS_REQUEST, validateNewAddress);
}
function* validateNewAddress(newAddress) {
  const data = {
    city: newAddress.data.city,
    country: 'US',
    state: newAddress.data.state,
    zipCode: newAddress.data.zipCode,
    street: newAddress.data.address || newAddress.data.addressLine1
  };
  try {
    yield put(showLoader());
    const response = yield call(validateAddressAPI, data);
    if (response.status === POST_API_SUCCESS_CODE) {
      yield put(validateAddressSuccess(response.data));
    } else {
      yield put(validateAddressError(response.data));
    }
    yield put(hideLoader());
  } catch (err) {
    yield [put(hideLoader()), put(validateAddressError(err))];
  }
}
function validateAddressAPI(data) {
  return axios({ method: 'post', url: validateAddress, data: { ...data } });
}
