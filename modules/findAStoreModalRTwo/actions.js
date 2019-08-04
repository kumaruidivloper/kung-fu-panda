import {
    LOAD_STORE_DETAILS_REQUEST,
    LOAD_STORE_DETAILS_SUCCESS,
    LOAD_STORE_DETAILS_ERROR,
    MAKE_MY_STORE,
    MAKE_MY_STORE_UPDATED,
    MY_STORE_DETAILS,
    FIND_A_MODAL_STORE_STATUS,
    FIND_LAT_LANG_ZIPCODE_REQUEST,
    FIND_LAT_LANG_ZIPCODE_SUCCESS,
    FIND_LAT_LANG_ZIPCODE_ERROR,
    FETCH_ZIP_CODE_GAPI_ERROR,
    FETCH_ZIP_CODE_GAPI_REQUEST,
    FETCH_ZIP_CODE_GAPI_SUCCESS,
    FETCH_GEO_FROMIP_SUCCESS,
    FETCH_GEO_FROMIP_ERROR,
    FETCH_GEO_FROMIP_REQUEST,
    LAT_LANG_DETAILS_FOR_MAP,
    LAT_LANG_DETAILS_FOR_MAP_ERROR,
    PDP_PRODUCT_ITEM_ID,
    MAKE_MY_STORE_DETAILS_UPDATED,
    MY_STORE_REG_USER_DATA,
    GET_CART_DETAILS,
    GET_CART_SUCCESS,
    GET_CART_ERROR,
    SET_CMS,
    UPDATE_ORDER_ID_REQUEST,
    UPDATE_ORDER_ID_SUCCESS,
    UPDATE_ORDER_ID_ERROR,
    FETCH_GEO_FROM_AKAMAI
  } from './constants';

  export const loadStoreDetails = data => ({ type: LOAD_STORE_DETAILS_REQUEST, data });

  export const storeDetailsLoaded = data => ({ type: LOAD_STORE_DETAILS_SUCCESS, data });

  export const storeLoadingError = error => {
    console.error('repoLoadingError: ', error); // eslint-disable-line
    return {
      type: LOAD_STORE_DETAILS_ERROR,
      error
    };
  };

  export const makeMyStore = data => ({ type: MAKE_MY_STORE, data });
  export const makeMyStoreUpdate = data => ({ type: MAKE_MY_STORE_UPDATED, data });
  export const myStoreDetails = data => ({ type: MY_STORE_DETAILS, data });
  export const toggleFindAStore = data => ({ type: FIND_A_MODAL_STORE_STATUS, data });
  export const findLatLangZipCodeRequest = data => ({ type: FIND_LAT_LANG_ZIPCODE_REQUEST, data });
  export const findLatLangZipCodeSuccess = data => ({ type: FIND_LAT_LANG_ZIPCODE_SUCCESS, data });
  export const findLatLangZipCodeError = data => ({ type: FIND_LAT_LANG_ZIPCODE_ERROR, data });
  export const findZipCodeGapiRequest = data => ({ type: FETCH_ZIP_CODE_GAPI_REQUEST, data });
  export const findZipCodeGapiSuccess = data => ({ type: FETCH_ZIP_CODE_GAPI_SUCCESS, data });
  export const findZipCodeGapiError = data => ({ type: FETCH_ZIP_CODE_GAPI_ERROR, data });
  export const fetchFromIpRequest = data => ({ type: FETCH_GEO_FROMIP_REQUEST, data });
  export const fetchFromIpSuccess = data => ({ type: FETCH_GEO_FROMIP_SUCCESS, data });
  export const fetchFromIpError = data => ({ type: FETCH_GEO_FROMIP_ERROR, data });
  export const latLangDetailsForMap = data => ({ type: LAT_LANG_DETAILS_FOR_MAP, data });
  export const latLangDetailsForMapError = data => ({ type: LAT_LANG_DETAILS_FOR_MAP_ERROR, data });
  export const getProductItemID = data => ({ type: PDP_PRODUCT_ITEM_ID, data });
  export const makeMyStoreDetailsUpdated = () => ({ type: MAKE_MY_STORE_DETAILS_UPDATED });
  export const myStoreRegUserData = data => ({ type: MY_STORE_REG_USER_DATA, data });
  export const getCartDetails = data => ({ type: GET_CART_DETAILS, data });
  export const getCartSuccess = data => ({ type: GET_CART_SUCCESS, data });
  export const getCartError = data => ({ type: GET_CART_ERROR, data });
  export const setCMS = data => ({ type: SET_CMS, data });
  export const updateOrderIdRequest = data => ({ type: UPDATE_ORDER_ID_REQUEST, data });
  export const updateOrderIdSuccess = data => ({ type: UPDATE_ORDER_ID_SUCCESS, data });
  export const updateOrderIdError = data => ({ type: UPDATE_ORDER_ID_ERROR, data });
  export const fetchFromAkamai = data => ({ type: FETCH_GEO_FROM_AKAMAI, data });
