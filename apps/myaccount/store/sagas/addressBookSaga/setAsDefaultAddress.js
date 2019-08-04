import { editAddress } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getErrorKey } from '../../../../../utils/helpers';
import { hideLoader, showLoader } from '../../actions/globalLoader';
import { API_SUCCESS_CODE, SET_DEFAULT } from './../../../myaccount.constants';
import { addressError, fetchAddress } from './../../actions/fetchAddress';
import { getProfileId } from '../../../../../utils/UserSession';

export default function* setAsDefault() {
  yield takeLatest(SET_DEFAULT, setAsDefaultAPI);
}
function* setAsDefaultAPI(action) {
  const { profileId, addressId, nickName } = action;
  const requestURL = editAddress(profileId, addressId.addressId, true);
  const data = {
    primary: true,
    addressId: addressId.addressId,
    nickName
  };
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL, {
      method: 'POST',
      data
    });
    if (response.status === API_SUCCESS_CODE) {
      yield put(fetchAddress(getProfileId()));
    } else {
      const errorKey = getErrorKey(response);
      yield put(addressError(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(addressError(errorKey))];
  }
}
