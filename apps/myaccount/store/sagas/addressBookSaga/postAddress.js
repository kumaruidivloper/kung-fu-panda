import { postAddress } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getErrorKey } from '../../../../../utils/helpers';
import { hideLoader, showLoader } from '../../actions/globalLoader';
import { POST_ADDRESS_DATA, POST_API_SUCCESS_CODE } from './../../../myaccount.constants';
import { addressError, fetchAddress } from './../../actions/fetchAddress';

export default function* postAddressData() {
  yield takeLatest(POST_ADDRESS_DATA, fetchAddressFromAPI);
}

function* fetchAddressFromAPI(action) {
  const { data, profileID } = action;
  const postData = {
    ...data,
    country: 'US'
  };
  const requestURL = postAddress(profileID);
  try {
    yield put(showLoader());
    const response = yield call(axios, requestURL, {
      method: 'post',
      data: postData
    });
    if (response.status === POST_API_SUCCESS_CODE) {
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
