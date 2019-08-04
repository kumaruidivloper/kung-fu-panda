import { productAPI, inventoryApi } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest, select } from 'redux-saga/effects';

import {
  CLEAR_ERROR,
  CLOSE_MODAL,
  FETCH_PRODUCT,
  FETCH_PRODUCT_ERROR,
  FETCH_PRODUCT_SUCCESS,
  FETCH_INVENTORY_ERROR,
  OPEN_MODAL_FOR_PRODUCT,
  OPEN_MODAL_FOR_PRODUCT_ID,
  SET_ON_CLOSE_FOCUS_ID,
  SET_OPEN,
  SET_PRODUCT,
  SET_SEOURL
} from './constants';
import { COOKIE_STORE_ID } from '../../utils/constants';
import Storage from '../../utils/StorageManager';
import { deleteBackupSelectedStoreCookie } from '../../utils/cookies/SelectedStore';

function* closeModal() {
  yield put({ type: CLEAR_ERROR });
  yield put({ type: SET_OPEN, open: false });
  yield put({ type: SET_PRODUCT, data: null });
}

function* openModalForProduct(action) {
  const { product } = action;
  if (product) {
    yield put({ type: CLEAR_ERROR });
    yield put({ type: SET_PRODUCT, data: product });
    yield put({ type: SET_OPEN, open: true });
  }
}

function* openModalForProductId(action) {
  const { productId, seoURL, onCloseFocusId, bopisEnabled } = action;
  if (productId) {
    yield put({ type: CLEAR_ERROR });
    yield put({ type: SET_PRODUCT, data: null });
    yield put({ type: SET_ON_CLOSE_FOCUS_ID, onCloseFocusId });
    yield put({ type: SET_OPEN, open: true });
    yield put({ type: FETCH_PRODUCT, options: { params: { productId, seoURL, bopisEnabled } } });
  }
}

const getFindAStoreDetails = state => {
  const { findAStoreModalRTwo: { getMystoreDetails = {} } = {} } = state;
  const { bopisEligible } = getMystoreDetails;
  return {
    bopisEligible,
    storeId: Storage.getCookie(COOKIE_STORE_ID)
  };
};

function* fetchProduct(action) {
  const { options = {} } = action;
  const { params = {} } = options;
  const { productId, seoURL, bopisEnabled } = params;
  if (productId) {
    yield put({ type: CLEAR_ERROR });
    yield put({ type: SET_PRODUCT, data: null });
    yield put({ type: SET_SEOURL, seoURL });

    let productResponse;
    try {
      deleteBackupSelectedStoreCookie();
      productResponse = yield call(axios, `${productAPI}${params.productId}`);
    } catch (error) {
      yield put({ type: FETCH_PRODUCT_ERROR, error });
    }

    if (productResponse) {
      const { bopisEligible = '', storeId = '' } = yield select(getFindAStoreDetails);
      const bopisValue = bopisEnabled === 'true' ? bopisEligible : 0;
      const derivedBopisEligibility = storeId.toString().trim().length && bopisValue ? bopisValue : 0;

      let inventoryResponse;
      try {
        const inventoryAPIQuery = `${inventoryApi}?productId=${params.productId}&storeId=${storeId}&storeEligibility=${derivedBopisEligibility}`;
        inventoryResponse = yield call(axios, inventoryAPIQuery);
      } catch (error) {
        yield put({ type: FETCH_INVENTORY_ERROR, error });
      }

      if (productResponse.status >= 200 && productResponse.status < 300) {
        // if inventory api succeed get the online data and pass it along with product data
        if (inventoryResponse && inventoryResponse.status >= 200 && inventoryResponse.status < 300) {
          const { inventory: { online, ...restInventory } = {}, ...rest } = productResponse.data;
          const { online: inventoryOnlineData } = inventoryResponse.data;
          const productData = {
            ...rest,
            inventory: {
              ...restInventory,
              online: inventoryOnlineData || online
            }
          };
          yield put({ type: FETCH_PRODUCT_SUCCESS, data: productData });
        } else {
          yield put({
            type: FETCH_INVENTORY_ERROR,
            error: new Error(`Something went wrong. - inventoryResponse.status - ${(inventoryResponse || {}).status}`)
          });
          yield put({ type: FETCH_PRODUCT_SUCCESS, data: productResponse.data });
        }
      } else {
        yield put({
          type: FETCH_PRODUCT_ERROR,
          error: new Error(`Something went wrong. - productResponse.status - ${(productResponse || {}).status}`)
        });
      }
    }
  }
}

function* quickViewSaga() {
  yield takeLatest([FETCH_PRODUCT], fetchProduct);
  yield takeLatest([OPEN_MODAL_FOR_PRODUCT], openModalForProduct);
  yield takeLatest([OPEN_MODAL_FOR_PRODUCT_ID], openModalForProductId);
  yield takeLatest([CLOSE_MODAL], closeModal);
}

export default quickViewSaga;
