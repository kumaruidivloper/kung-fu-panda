import { signUp, validateAddress } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { getCityState } from '@academysports/aso-env';
import { getErrorKey } from '../../utils/helpers';
import { COUNTRY } from '../../utils/constants'
import { showLoader, hideLoader } from './../../apps/signInSignUp/store/actions/globalLoader';
import { signupFailure, signupSuccess, validateAddressSuccess, validateAddressFailure, fetchCityStateFromZipCodeSuccess, fetchCityStateFromZipCodeError } from './actions';
import { POST_API_SUCCESS_CODE, USER_REGISTER, VALIDATE_ADDRESS_SIGNUP_REQUEST, LOAD_CITY_STATE_DATA, API_SUCCESS_CODE } from './constants';

// function to register a new user

function* userRegisterCall(action) {
  const { data } = action;
  const options = {
    method: 'POST',
    data
  };
  try {
    const response = yield call(axios, signUp, options);
    if (response.status === POST_API_SUCCESS_CODE) {
      yield put(signupSuccess(response.data));
      yield put(hideLoader());
    } else {
      const errorKey = getErrorKey(response);
      yield put(signupFailure(errorKey));
      yield put(hideLoader());
    }
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield put(signupFailure(errorKey));
    yield put(hideLoader());
  }
}

function* validateNewAddress(newAddress) {
  const data = {
    city: newAddress.data.city,
    country: COUNTRY,
    state: newAddress.data.state,
    zipCode: newAddress.data.zipcode,
    street: newAddress.data.street
  };
  try {
    const response = yield call(validateAddressAPI, data);
    if (response.status === POST_API_SUCCESS_CODE) {
      yield put(validateAddressSuccess(response.data));
    } else {
      yield put(validateAddressFailure(response.data));
    }
    yield put(hideLoader());
  } catch (err) {
    if (err.data) {
      yield put(validateAddressFailure(err));
    }
    yield put(hideLoader());
  }
}

function validateAddressAPI(data) {
  return axios({ method: 'post', url: validateAddress, data: { ...data } });
}

function* fetchCityStateFromAPI(action) {
  const { data } = action;
  const requestURL = getCityState(data);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL);
    if (response.status === API_SUCCESS_CODE) {
      yield put(fetchCityStateFromZipCodeSuccess(response.data));
    } else {
      yield put(fetchCityStateFromZipCodeError(response.data));
    }
    yield put(hideLoader());
  } catch (error) {
    if (error.data) {
      yield put(fetchCityStateFromZipCodeError(error.data));
    }
    yield put(hideLoader());
  }
}

export default function* signUpData() {
  yield takeLatest(USER_REGISTER, userRegisterCall);
  yield takeLatest(VALIDATE_ADDRESS_SIGNUP_REQUEST, validateNewAddress);
  yield takeLatest(LOAD_CITY_STATE_DATA, fetchCityStateFromAPI);
}
