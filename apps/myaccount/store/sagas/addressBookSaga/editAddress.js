import { editAddress } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getErrorKey } from '../../../../../utils/helpers';
import { hideLoader, showLoader } from '../../actions/globalLoader';
import { API_SUCCESS_CODE, EDIT_ADDRESS } from './../../../myaccount.constants';
import { addressError, fetchAddress } from './../../actions/fetchAddress';

export default function* deleteAddressData() {
  yield takeLatest(EDIT_ADDRESS, deleteAddressFromAPI);
}
function* deleteAddressFromAPI(action) {
  const { selectedAddress, profileID, addressID } = action;
  const requestURL = editAddress(profileID, addressID, false);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL, {
      method: 'POST',
      data: selectedAddress
    });
    if (response.status === API_SUCCESS_CODE) {
      yield put(fetchAddress(profileID));
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
