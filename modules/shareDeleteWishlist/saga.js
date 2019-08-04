import { shareWishListAPI } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../../apps/myaccount/store/actions/globalLoader';
import { shareWishlistSuccess, shareWishlistFailure } from './actions';
import { SHARE_WISHLIST, POST_API_SUCCESS_CODE } from './constants';
import { getErrorKey } from '../../utils/helpers';

function* shareWishlistCall(action) {
  const { data, profileId, wishListId } = action;
  const reqURL = shareWishListAPI(profileId, wishListId); // TO-D0 resolve this
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data
    });
    if (response.status === POST_API_SUCCESS_CODE) {
      yield put(shareWishlistSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(shareWishlistFailure(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(shareWishlistFailure(errorKey))];
  }
}

export default function* shareWishlist() {
  yield takeLatest(SHARE_WISHLIST, shareWishlistCall);
}
