import { loginIdentity } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getErrorKey } from '../../utils/helpers';
import { hideLoader } from './../../apps/signInSignUp/store/actions/globalLoader';
import { signinError, signinSuccess } from './actions';
import { POST_API_SUCCESS_CODE, SIGNIN, LAT_LONG } from './constants';
import Storage from '../../utils/StorageManager';

function* putSigninData(action) {
  const {
    data
  } = action;
  const options = {
    method: 'POST',
    data
  };
  // yield (put(showLoader()));
  try {
    const response = yield call(axios, loginIdentity, options);
    if (response.status === POST_API_SUCCESS_CODE) {
      removeStoredLatLong();
      yield put(signinSuccess(response.data));
      yield (put(hideLoader()));
    } else {
      const errorKey = getErrorKey(response);
      yield put(signinError(errorKey));
      yield (put(hideLoader()));
    }
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield put(signinError(errorKey));
    yield (put(hideLoader()));
  }
}

/**
 * Method to delete LAT_LONG cookie post user signin.
 */
function removeStoredLatLong() {
  Storage.deleteCookie(LAT_LONG);
}
export default function* signinData() {
  yield takeLatest(SIGNIN, putSigninData);
}
