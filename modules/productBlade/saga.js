import { addItemBackToCart, addToWishListAPI, updateQtyAPI, updateShipModeAPI, removeWishlistItemAPI } from '@academysports/aso-env';
import axios from 'axios';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '@react-nitro/error-boundary';

import { GET_SUCCESS_CODE } from '../../apps/cart/cart.constants';
import { fetchMiniCart } from '../../modules/header/actions';
import { ON_WISHLIST_MOVED } from '../wishListPopover/constants';
import { addMessages, hideLoader, loadCart, qtyUpdateSuccess, qtyUpdatingError, showLoader, wishListError, removeWishListItem } from './actions';
import { ADD_TO_WISH_LIST, REMOVE_CART_MSG, REMOVE_ITEM, UNDO_ACTION, UPDATE_QTY, UPDATE_SHIPPING_MODE, REMOVE_ITEM_WISHLIST } from './constants';
import { getUserId, isUnAuthorized } from '../../utils/helpers';

export function* updateShipMode(action) {
  const { data } = action;
  try {
    const response = yield call(axios, updateShipModeAPI, {
      method: 'POST',
      data: data.update
    });
    if (response.status === GET_SUCCESS_CODE) {
      yield put(loadCart());
    }
  } catch (error) {
    data.revertChanges();
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(error)) {
      return;
    }
    yield put(qtyUpdatingError({ errorDetails: error.data || {}, orderItemId: data.orderItemId }));
  }
}

export function* updateItemQty(action) {
  yield put(qtyUpdateSuccess());
  let { data } = action;
  const { hideUndo, isPickUpInStore, storeId, giftListItemID, wishListId, revertChanges, orderId } = data;
  let type = 'cart';
  try {
    if (action.type === REMOVE_ITEM) {
      data = constructRemoveItemObject(data.product, data.qty);
      type = 'cart';
    }
    if (action.type === ON_WISHLIST_MOVED) {
      data = constructRemoveItemObject(data.product, data.qty);
      type = 'wishList';
    }
    yield put(showLoader(data.orderItemId));
    // API not using any url path params here, for sake we are passing here to avoid undefined.
    const response = yield call(axios, updateQtyAPI(orderId || '00000'), {
      method: 'POST',
      data: {
        orderItem: data.orderItem
      }
    });
    yield put(hideLoader(data.orderItemId));
    if (action.type === REMOVE_ITEM || action.type === ON_WISHLIST_MOVED) {
      yield all([
        put(loadCart({ id: data.orderItemId || data.bundleId, type, ...data, hideUndo, isPickUpInStore, storeId, giftListItemID, wishListId })),
        put(fetchMiniCart())
      ]);
    } else {
      yield all([put(loadCart()), put(fetchMiniCart())]);
    }
    // If any partial update happened, then need to show error message
    const responseMessage = get(response, 'data.updateItemQuantity.orderItem[0]', {});
    if (responseMessage.xitem_ErrorMessage) {
      yield put(qtyUpdatingError({ errorDetails: { errors: [responseMessage] }, orderItemId: data.orderItemId }));
    }
  } catch (error) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(error)) {
      return;
    }
    revertChanges();
    yield all([
      put(hideLoader(data.orderItemId)),
      put(qtyUpdatingError({ errorDetails: error.data ? error.data : {}, orderItemId: data.orderItemId }))
    ]);
  }
}

/**
 * Method to remove the item from wishlist when user clicks on UNDO CTA
 * @param {object} action Contains wishlist details
 */
export function* fnRemoveWishListItem(action) {
  const { userId, wishListId, giftListItemID } = action.data;
  const reqURL = removeWishlistItemAPI(userId, wishListId, giftListItemID);
  try {
    yield call(axios, reqURL, { method: 'POST' });
  } catch (error) {
    console.error('Error while remove - Wishlist ', error);
  }
}

export function* fnaddItemBackToCart(action) {
  yield put({ type: REMOVE_CART_MSG, data: action.data.id });
  const { data } = action;
  const { giftListItemID, wishListId } = data;
  const userId = getUserId();
  try {
    const resp = yield call(axios, addItemBackToCart, {
      method: 'POST',
      data: getAddToCartObj(data)
    });
    if (resp.status === 200) {
      yield all([put(loadCart()), put(fetchMiniCart()), put(removeWishListItem({ userId, wishListId, giftListItemID }))]);
    }
  } catch (error) {
    console.log(error);
  }
}

export function getAddToCartObj(data) {
  let skus;
  const { storeId, isPickUpInStore } = data;
  if (data.bundleSkus && data.bundleSkus.length) {
    skus = data.bundleSkus.map(item => ({
      id: item.productId,
      quantity: data.quantity,
      type: 'REGULAR'
    }));
  } else {
    skus = [
      {
        id: data.skuId,
        quantity: data.quantity,
        type: 'REGULAR'
      }
    ];
  }
  return {
    skus,
    inventoryCheck: true,
    isGCItem: false,
    giftAmount: '',
    isBundle: data.bundleSkus && data.bundleSkus.length > 0 ? true : undefined,
    bundleId: data.bundleId,
    selectedStoreId: storeId,
    isPickUpInStore
  };
}

export function constructRemoveItemObject(obj, qty) {
  const reqObj = {};
  reqObj.orderItemId = obj.data.orderItemId;
  if (!obj.bundleProductInfo || !obj.bundleProductInfo.length) {
    reqObj.orderItem = [{ orderItemId: obj.data.orderItemId, quantity: 0 }];
  } else {
    reqObj.bundleId = obj.data.skuId;
    reqObj.orderItem = obj.bundleProductInfo.map(item => ({ orderItemId: item.orderItemId, quantity: 0 }));
  }
  reqObj.name = obj.data.skuDetails.skuInfo.name;
  reqObj.orderId = obj.orderId;
  reqObj.quantity = qty;
  reqObj.bundleSkus = obj.bundleProductInfo;
  reqObj.skuId = obj.data.productId;
  return reqObj;
}

export function* moveToWishList(action) {
  const { data } = action;
  const { apiObj } = data;
  const requestURL = addToWishListAPI(apiObj.skuId);
  try {
    yield call(axios, requestURL, {
      method: 'PUT',
      data: apiObj
    });
    yield put(addMessages({ id: data.apiObj.orderItem.orderItemId, type: 'wishList', name: data.name }));
    yield all([put(loadCart()), put(fetchMiniCart())]);
  } catch (error) {
    yield put(wishListError(error));
  }
}

export default function* productBlade() {
  yield takeLatest(UPDATE_QTY, updateItemQty);
  yield takeLatest(REMOVE_ITEM, updateItemQty);
  yield takeLatest(ON_WISHLIST_MOVED, updateItemQty);
  yield takeLatest(ADD_TO_WISH_LIST, moveToWishList);
  yield takeLatest(UPDATE_SHIPPING_MODE, updateShipMode);
  yield takeEvery(UNDO_ACTION, fnaddItemBackToCart);
  yield takeEvery(REMOVE_ITEM_WISHLIST, fnRemoveWishListItem);
}
