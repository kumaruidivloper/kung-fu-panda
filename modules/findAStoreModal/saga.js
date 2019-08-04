import { findAStoreAPI, makeMyStoreAPI } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchStoreDetailsError, fetchStoreDetailsSuccess } from './actions';
import { FETCH_STORE_DETAILS, POST_MY_STORE } from './constants';
import { getStoreIds, updateAnalytics } from './helpers';

function checkForPrevStores(prevStores = [], stores) {
  const prevStore = prevStores[0];
  if (!prevStore) {
    return stores;
  }
  const { properties: prevProperty } = prevStore;
  let currentMyStore = [prevStore];
  const nextMyStoreList = [];
  stores.forEach(item => {
    const { properties = {} } = item;
    if (properties.gx_id === prevProperty.gx_id) {
      currentMyStore = [];
      currentMyStore.push(item);
    } else {
      nextMyStoreList.push(item);
    }
  });
  return [...currentMyStore, ...nextMyStoreList];
}

function setAnalytics(gtmDataLayer, searchTerm, stores, success) {
  updateAnalytics(
    gtmDataLayer,
    'search',
    'store locator',
    'store search',
    `${success ? 'successful store search' : 'unsuccessful store search'}`,
    `${success ? stores.length : 0}`,
    `${success ? getStoreIds(stores, 0, 10) : null}`,
    `${searchTerm.toLowerCase()}`,
    `${success ? 1 : 0}`,
    `${!success ? 1 : 0}`,
    0
  );
}

function* getStoreDetails(action) {
  const { params = {} } = action;
  const { lat, long, pdpInventoryMsgs, storeDetails: prevStores, gtmDataLayer, searchTerm } = params;
  let queryFilter = `?lat=${lat}&lon=${long}`;
  if (pdpInventoryMsgs) {
    const { itemId, skuItemId, categoryId, ecomCode, isSof, productId, skuId, inventoryStatus } = pdpInventoryMsgs;
    queryFilter = `${queryFilter}&itemId=${itemId}&skuItemId=${skuItemId}&categoryId=${categoryId}&ecomCode=${ecomCode}&isSOF=${isSof}&productId=${productId}&skuId=${skuId}&inventoryStatus=${inventoryStatus}`;
  }
  const requestURL = `${findAStoreAPI}${queryFilter}`;
  try {
    const storeDetails = yield call(axios, requestURL);
    const { data = {} } = storeDetails;
    const { stores = [] } = data;
    if (stores.length > 0) {
      const updatedStores = checkForPrevStores(prevStores, stores);
      setAnalytics(gtmDataLayer, searchTerm, updatedStores, true);
      yield put(fetchStoreDetailsSuccess(updatedStores));
      yield put(fetchStoreDetailsError(true));
    } else {
      setAnalytics(gtmDataLayer, searchTerm, null, false);
      yield put(fetchStoreDetailsError(false));
    }
  } catch (e) {
    setAnalytics(gtmDataLayer, searchTerm, null, false);
    yield put(fetchStoreDetailsError(false));
  }
}

function* postMyStoreDetails(action) {
  const { data } = action;
  const headers = {
    method: 'POST',
    data: data // eslint-disable-line
  };
  try {
    yield call(axios, `${makeMyStoreAPI}`, headers);
  } catch (e) {
    console.log(e); // eslint-disable-line
  }
}

export default function* productDta() {
  yield takeLatest(FETCH_STORE_DETAILS, getStoreDetails);
  yield takeLatest(POST_MY_STORE, postMyStoreDetails);
}
