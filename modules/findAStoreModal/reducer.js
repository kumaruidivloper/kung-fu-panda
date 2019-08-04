import { combineReducers } from 'redux';
import {
  FETCH_STORE_DETAILS_SUCCESS,
  MY_STORE_DETAILS,
  PDP_PRODUCT_ITEM_ID,
  FETCH_STORE_DETAILS_FAILURE,
  SAVE_STORE_ID,
  SAVE_STORE_URL
} from './constants';

export const storeDetails = (state = {}, action) => {
  switch (action.type) {
    case FETCH_STORE_DETAILS_SUCCESS:
      return { storesList: action.data, isSuccess: true };
    case FETCH_STORE_DETAILS_FAILURE:
      return { ...state, isSuccess: action.data };
    default:
      return state;
  }
};

export const getMystoreDetails = (state = {}, action) => {
  switch (action.type) {
    case MY_STORE_DETAILS:
      return action.data;
    default:
      return state;
  }
};

export const pdpInventoryMsgs = (state = null, action) => {
  switch (action.type) {
    case PDP_PRODUCT_ITEM_ID:
      return action.data;
    default:
      return state;
  }
};

export const getStoreId = (state = '', action) => {
  switch (action.type) {
    case SAVE_STORE_ID:
      return action.data;
    default:
      return state;
  }
};

export const getStoreURL = (state = '', action) => {
  switch (action.type) {
    case SAVE_STORE_URL:
      return action.url;
    default:
      return state;
  }
};

export default combineReducers({
  storeDetails,
  getMystoreDetails,
  pdpInventoryMsgs,
  getStoreId,
  getStoreURL
});
