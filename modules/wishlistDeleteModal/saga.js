import { deleteWishListAPI } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../../apps/myaccount/store/actions/globalLoader';
import { getUserWishlist } from '../wishList/actions';
import { API_SUCCESS_CODE, DELETE_WISHLIST } from './constants';
import { deleteWishlistFailure } from './actions';
import { getErrorKey } from '../../utils/helpers';

function* userDeleteWishlistCall(action) {
  const { wishlistId, profileID } = action;
  const options = {
    method: 'POST'
  };
  const reqURL = deleteWishListAPI(wishlistId, profileID);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, options);
    if (response.status === API_SUCCESS_CODE) {
      yield put(getUserWishlist(profileID)); // handle redirection
    } else {
      const errorKey = getErrorKey(response);
      yield put(deleteWishlistFailure(errorKey));
    }
    yield put(hideLoader());
    } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(deleteWishlistFailure(errorKey))];
    }
}

export default function* deleteWishlistData() {
  yield takeLatest(DELETE_WISHLIST, userDeleteWishlistCall);
}
