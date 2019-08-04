import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { createNewWishListAPI, renameWishlistAPI } from '@academysports/aso-env';
import { fetchWishlistItems } from '../../wishlistItems/action';
import { getUserWishlist } from '../../wishList/actions';
import { CREATE_WISHLIST, RENAME_WISHLIST } from '../../createWishList/constants';
import { POST_API_SUCCESS_CODE } from '../constants';
import { showLoader, hideLoader } from '../../../apps/myaccount/store/actions/globalLoader';
import { renameWishlistFailure, createWishlistFailure } from '../../createWishList/actions';
import { getErrorKey } from '../../../utils/helpers';

function* createNewWishList(action) {
  const { data, profileID } = action;
  const postData = {
    descriptionName: data,
    description: data
  };
  const reqURL = createNewWishListAPI(profileID);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data: postData
    });
    if (response.status === POST_API_SUCCESS_CODE) {
      yield put(getUserWishlist(profileID));
    } else {
      const errorKey = getErrorKey(response);
      yield put(createWishlistFailure(errorKey));
    }
    yield put(hideLoader());
    } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(createWishlistFailure(errorKey))];
    }
}

function* renameWishList(action) {
  const { profileID, wishlistId, data } = action;
  const reqURL = renameWishlistAPI(profileID, wishlistId);
  const putData = {
    descriptionName: data,
    description: data
  };
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data: putData
    });
    if (response.status === POST_API_SUCCESS_CODE) {
      yield put(fetchWishlistItems(profileID, wishlistId));
    } else {
      const errorKey = getErrorKey(response);
      yield put(renameWishlistFailure(errorKey));
    }
    yield put(hideLoader());
    } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(renameWishlistFailure(errorKey))];
    }
}
export default function* createWishList() {
  yield takeLatest(CREATE_WISHLIST, createNewWishList);
  yield takeLatest(RENAME_WISHLIST, renameWishList);
}
