import { updatePasswordPUT, updateProfileInfoPUT } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchMyAccountData } from '../../apps/myaccount/store/actions/fetchAccountData';
import { hideLoader, showLoader } from '../../apps/myaccount/store/actions/globalLoader';
import { getErrorKey } from '../../utils/helpers';
import {
  updateInformationFailure,
  updateInformationSuccess,
  updatePasswordFailure,
  updatePasswordSuccess
} from './actions';
import { API_SUCCESS_CODE, POST_API_SUCCESS_CODE, UPDATE_INFORMATION_REQUEST, UPDATE_PASSWORD_REQUEST } from './constants';

import { getProfileId } from '../../utils/UserSession';
// update user information
function* putUpdatedUserInformationData(action) {
  const { profileId, data } = action;
  const reqURL = updateProfileInfoPUT(profileId);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data
    });
    if (response.status === API_SUCCESS_CODE) {
      yield put(updateInformationSuccess(false));
      yield put(fetchMyAccountData(profileId));
    } else {
      const errorKey = getErrorKey(response);
      yield put(updateInformationFailure(errorKey));
    }
    yield put(hideLoader());
  } catch (error) {
    const errorKey = getErrorKey(error);
    yield [put(hideLoader()), put(updateInformationFailure(errorKey))];
  }
}
// update password
function* putUpdatePassword(action) {
  const { data } = action;
  const reqURL = updatePasswordPUT;
  const putData = {
    oldPassword: data.currentPassword,
    logonPassword: data.newPassword,
    logonPasswordVerify: data.newPassword,
    logonId: data.email
  };
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data: putData
    });
    if (response.status === POST_API_SUCCESS_CODE) {
      yield put(updatePasswordSuccess(false));
      yield put(fetchMyAccountData(getProfileId()));
    } else {
      const errorKey = getErrorKey(response);
      yield put(updatePasswordFailure(errorKey));
    }
    yield put(hideLoader());
  } catch (error) {
    const errorKey = getErrorKey(error);
    yield [put(hideLoader()), put(updatePasswordFailure(errorKey))];
  }
}
export default function* UserInformationData() {
  yield takeLatest(UPDATE_INFORMATION_REQUEST, putUpdatedUserInformationData);
  yield takeLatest(UPDATE_PASSWORD_REQUEST, putUpdatePassword);
}
