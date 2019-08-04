import { addToCartItems, getWishlistItem, removeWishlistItemAPI } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hideLoader, showLoader } from '../../apps/myaccount/store/actions/globalLoader';
import {
  addItemToCartFailure,
  fetchMiniCartSuccess,
  fetchWishlistItems,
  fetchWishlistItemsFailure,
  fetchWishlistItemsSuccess,
  removeWishlistItem,
  removeWishlistItemFailure,
  addItemToCartSuccess,
  removeWishlistItemSuccess
} from './action';
import { getErrorKey } from '../../utils/helpers';
import { ADD_ITEM_CART, FETCH_WISHLIST_ITEMS, REMOVE_WISHLIST_ITEM, API_SUCCESS_CODE } from './constants';

// fetch wishlist items
function* getWishlistItems(action) {
  const { profileID, wishlistId } = action;
  const reqURL = getWishlistItem(profileID, wishlistId);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL);
    if (response.status === API_SUCCESS_CODE) {
    yield put(fetchWishlistItemsSuccess(response.data));
    } else {
      const errorKey = getErrorKey(response);
      yield put(fetchWishlistItemsFailure(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(fetchWishlistItemsFailure(errorKey))];
  }
}
// remove wishlist item
function* removeWishlistItems(action) {
  const { profileID, wishlistId, itemId } = action;
  const options = {
    method: 'post'
  };
  const reqURL = removeWishlistItemAPI(profileID, wishlistId, itemId);
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, options);
    if (response.status === API_SUCCESS_CODE) {
      yield put(fetchWishlistItems(profileID, wishlistId));
      yield put(removeWishlistItemSuccess(itemId));
    } else {
      const errorKey = getErrorKey(response);
      yield put(removeWishlistItemFailure(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(removeWishlistItemFailure(errorKey))];
  }
}
// add item to cart
function* addItemToCart(action) {
  const { data } = action;
  const reqURL = addToCartItems;
  const value = data.data;
  try {
    yield put(showLoader());
    const response = yield call(axios, reqURL, {
      method: 'POST',
      data: value
    });
    if (response.status === API_SUCCESS_CODE) {
      const miniCartObject = {
        quantity: {
          totalCartQuantity: response.data && response.data.addToCart && response.data.addToCart.totalCartQuantity
        }
      };
      yield put(fetchMiniCartSuccess(miniCartObject));
      yield put(removeWishlistItem(data.profileID, data.wishlistId, data.itemId));
      yield put(fetchWishlistItems(data.profileID, data.wishlistId));
      yield put(addItemToCartSuccess(response.data.addToCart));
    } else {
      const errorKey = getErrorKey(response);
      yield put(addItemToCartFailure(errorKey));
    }
    yield put(hideLoader());
  } catch (response) {
    const errorKey = getErrorKey(response);
    yield [put(hideLoader()), put(addItemToCartFailure(errorKey))];
  }
}
export default function* WishlistItems() {
  yield takeLatest(FETCH_WISHLIST_ITEMS, getWishlistItems);
  yield takeLatest(REMOVE_WISHLIST_ITEM, removeWishlistItems);
  yield takeLatest(ADD_ITEM_CART, addItemToCart);
}
