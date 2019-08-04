import { combineReducers } from 'redux';
import {
  FIND_A_MODAL_STORE_STATUS,
  LOAD_STORE_DETAILS_SUCCESS,
  LOAD_STORE_DETAILS_REQUEST,
  MAKE_MY_STORE_UPDATED,
  MY_STORE_DETAILS,
  LOAD_STORE_DETAILS_ERROR,
  FIND_LAT_LANG_ZIPCODE_REQUEST,
  FIND_LAT_LANG_ZIPCODE_SUCCESS,
  FETCH_GEO_FROMIP_REQUEST,
  FETCH_GEO_FROMIP_SUCCESS,
  FETCH_ZIP_CODE_GAPI_REQUEST,
  FETCH_ZIP_CODE_GAPI_SUCCESS,
  FETCH_ZIP_CODE_GAPI_ERROR,
  LAT_LANG_DETAILS_FOR_MAP,
  LAT_LANG_DETAILS_FOR_MAP_ERROR,
  PDP_PRODUCT_ITEM_ID,
  MY_STORE_REG_USER_DATA,
  GET_CART_DETAILS,
  GET_CART_SUCCESS,
  GET_CART_ERROR,
  SET_CMS,
  UPDATE_ORDER_ID_REQUEST,
  UPDATE_ORDER_ID_SUCCESS,
  UPDATE_ORDER_ID_ERROR
  } from './constants';
/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const storeDetails = (state = { isFetching: false, error: false, data: [] }, action) => {
  switch (action.type) {
    case LOAD_STORE_DETAILS_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false, data: [] });
    case LOAD_STORE_DETAILS_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data.stores });
      case LOAD_STORE_DETAILS_ERROR:
      return Object.assign({}, state, { isFetching: false, error: true, data: [] });
    default:
      return state;
  }
};

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const mystoreDetails = (state = [], action) => {
  switch (action.type) {
    case MAKE_MY_STORE_UPDATED:
      return action.data;
    default:
      return state;
  }
};
/**
 * Storing mystore details to show in other pages
 * @param state
 * @param action
 * @returns {*}
 */
export const getMystoreDetails = (state = { isCompleted: false }, action) => {
  switch (action.type) {
    case MY_STORE_DETAILS:
      return Object.assign({}, state, { isCompleted: true, ...action.data });
    default:
      return state;
  }
};

export const storeDetailsError = (state = '', action) => {
  switch (action.type) {
    case LOAD_STORE_DETAILS_ERROR:
      return action.error;
    default:
      return state;
  }
};

export const findAStoreModalIsOpen = (state = { status: false, isBopisEligible: false }, action) => {
  switch (action.type) {
    case FIND_A_MODAL_STORE_STATUS: {
      const { origin, source, ...rest } = action.data;
      const params = (origin === 'header') ? { ...rest } : { source, ...rest };
      return params;
    }
    default:
      return state;
    }
};

export const pdpProductItemId = (state = null, action) => {
  switch (action.type) {
    case PDP_PRODUCT_ITEM_ID:
      return action.data;
    default:
      return state;
  }
};

export const setCMS = (state = {}, action) => {
  switch (action.type) {
    case SET_CMS:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
};

export const latLangDetails = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case FIND_LAT_LANG_ZIPCODE_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false, data: {} });
    case FIND_LAT_LANG_ZIPCODE_SUCCESS:
    return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
    default:
      return state;
  }
};

export const zipCodeDetails = (state = { isFetching: false, error: false, data: '' }, action) => {
  switch (action.type) {
    case FETCH_GEO_FROMIP_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false, data: '' });
    case FETCH_GEO_FROMIP_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
    case FETCH_ZIP_CODE_GAPI_ERROR:
      return Object.assign({}, state, { isFetching: false, error: true, data: '' });
    default:
      return state;
  }
};

export const zipCodeFromGapi = (state = { isFetching: false, error: false, data: '' }, action) => {
  switch (action.type) {
    case FETCH_ZIP_CODE_GAPI_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false, data: '' });
    case FETCH_ZIP_CODE_GAPI_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
    default:
      return state;
  }
};

export const latLangDetailsForMap = (state = { isCompleted: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case LAT_LANG_DETAILS_FOR_MAP:
      return Object.assign({}, state, { isCompleted: true, error: false, data: action.data });
    case LAT_LANG_DETAILS_FOR_MAP_ERROR:
      return Object.assign({}, state, { isCompleted: true, error: true, data: {} });
    default:
      return state;
  }
};
export const myStoreRegUserData = (state = { isCompleted: false, data: {} }, action) => {
  switch (action.type) {
    case MY_STORE_REG_USER_DATA:
      return Object.assign({}, state, { isCompleted: true, data: action.data });
    default:
      return state;
  }
};
export const getCartData = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case GET_CART_DETAILS:
      return Object.assign({}, state, { isFetching: true, error: false, data: {} });
    case GET_CART_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
    case GET_CART_ERROR:
      return Object.assign({}, state, { isFetching: false, error: true, data: {} });
    default:
      return state;
  }
};
export const updateOrderId = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case UPDATE_ORDER_ID_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false, data: {} });
    case UPDATE_ORDER_ID_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
    case UPDATE_ORDER_ID_ERROR:
      return Object.assign({}, state, { isFetching: false, error: true, data: {} });
    default:
      return state;
  }
};
/**
 * combine the reducers
 */
export default combineReducers({
  storeDetails,
  mystoreDetails,
  getMystoreDetails,
  storeDetailsError,
  findAStoreModalIsOpen,
  latLangDetails,
  zipCodeDetails,
  zipCodeFromGapi,
  latLangDetailsForMap,
  pdpProductItemId,
  myStoreRegUserData,
  getCartData,
  setCMS,
  updateOrderId
});
