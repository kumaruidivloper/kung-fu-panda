import {
  FIND_A_MODAL_STORE_STATUS,
  FETCH_STORE_DETAILS,
  FETCH_STORE_DETAILS_SUCCESS,
  FETCH_STORE_DETAILS_FAILURE,
  MY_STORE_DETAILS,
  POST_MY_STORE,
  PDP_PRODUCT_ITEM_ID,
  SAVE_STORE_ID,
  SAVE_STORE_URL
} from './constants';

export const toggleFindAStore = data => ({ type: FIND_A_MODAL_STORE_STATUS, data });
export const fetchStoreDetails = params => ({ type: FETCH_STORE_DETAILS, params });
export const fetchStoreDetailsSuccess = data => ({ type: FETCH_STORE_DETAILS_SUCCESS, data });
export const fetchStoreDetailsError = data => ({ type: FETCH_STORE_DETAILS_FAILURE, data });
export const myStoreDetails = data => ({ type: MY_STORE_DETAILS, data });
export const postMyStoreDetails = data => ({ type: POST_MY_STORE, data });
export const getProductItemID = data => ({ type: PDP_PRODUCT_ITEM_ID, data });
export const saveStoreId = data => ({ type: SAVE_STORE_ID, data });
export const saveStoreURL = url => ({ type: SAVE_STORE_URL, url });
