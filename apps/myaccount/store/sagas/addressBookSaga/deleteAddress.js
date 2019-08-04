import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { deleteAddress } from '@academysports/aso-env';
import { DELETE_ADDRESS, API_SUCCESS_CODE } from './../../../myaccount.constants';
import { fetchAddress, addressError } from './../../actions/fetchAddress';
import { getErrorKey } from '../../../../../utils/helpers';
import { showLoader, hideLoader } from '../../actions/globalLoader';

export default function* deleteAddressData() {
  yield takeLatest(DELETE_ADDRESS, deleteAddressFromAPI);
}
function* deleteAddressFromAPI(action) {
  const { profileID, addressID } = action;
  const requestURL = deleteAddress(profileID, addressID);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL, {
      method: 'POST'
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
