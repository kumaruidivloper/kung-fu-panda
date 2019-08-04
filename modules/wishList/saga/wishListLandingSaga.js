import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { userWishListNamesAPI } from '@academysports/aso-env';
import { getUserWishListSuccess, getUserWishListFailure } from '../../wishlistLanding/actions';
import { USER_WISHLIST } from '../../wishlistLanding/constants';
import { API_SUCCESS_CODE } from './../constants';
import { getErrorKey } from '../../../utils/helpers';
import { showLoader, hideLoader } from '../../../apps/myaccount/store/actions/globalLoader';
import { getProfileId } from '../../../utils/UserSession';

function* getUserWishlist() {
  const reqURL = userWishListNamesAPI(getProfileId());
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL);
    if (response.status === API_SUCCESS_CODE) {
      yield put(getUserWishListSuccess(response.data.profile));
    } else {
      const errorKey = getErrorKey(response);
      yield put(getUserWishListFailure(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(getUserWishListFailure(errorKey))];
  }
}

export default function* userWishList() {
  yield takeLatest(USER_WISHLIST, getUserWishlist);
}
