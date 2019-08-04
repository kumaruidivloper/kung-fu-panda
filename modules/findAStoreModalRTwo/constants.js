import { GOOGLE_APIKEY } from '@academysports/aso-env';

export const NODE_TO_MOUNT = 'findAStoreModalRTwo';
export const DATA_COMP_ID = 'data-compid';
export const LOAD_STORE_DETAILS_SUCCESS = 'loadStoreDetailsSuccess';
export const LOAD_STORE_DETAILS_ERROR = 'loadStoreDetailsError';
export const LOAD_STORE_DETAILS_REQUEST = 'loadStoreDetailsRequest';
export const COOKIE_STORE_ID = 'WC_StLocId';
export const COKIE_SELECTED_ZIPCODE = 'WC_StZip_Selected';
export const LAT_LONG = 'LAT_LONG';
export const USERACTIVITY = 'USERACTIVITY';
export const USERTYPE = 'USERTYPE';
export const MAKE_MY_STORE = 'MAKE_MY_STORE';
export const MAKE_MY_STORE_UPDATED = 'MAKE_MY_STORE_UPDATED';
export const MY_STORE_DETAILS = 'MY_STORE_DETAILS';
export const FIND_A_MODAL_STORE_STATUS = 'FIND_A_MODAL_STORE_STATUS';
export const SAVED_FAVOURITE_STORE = 'SAVED_FAVOURITE_STORE';
export const FIND_LAT_LANG_ZIPCODE_REQUEST = 'findLatLangZipCodeRequest';
export const FIND_LAT_LANG_ZIPCODE_SUCCESS = 'findLatLangZipCodeSuccess';
export const FIND_LAT_LANG_ZIPCODE_ERROR = 'findLatLangZipCodeError';
export const FETCH_ZIP_CODE_GAPI_REQUEST = 'findZipCodeGapiRequest';
export const FETCH_ZIP_CODE_GAPI_SUCCESS = 'findZipCodeGapiSuccess';
export const FETCH_ZIP_CODE_GAPI_ERROR = 'findZipCodeGapiError';
export const FETCH_GEO_FROMIP_REQUEST = 'findGeoFromIpRequest';
export const FETCH_GEO_FROMIP_SUCCESS = 'findGeoFromIpSuccess';
export const FETCH_GEO_FROMIP_ERROR = 'findGeoFromIpError';
export const LAT_LANG_DETAILS_FOR_MAP = 'latLangDetailsForMap';
export const LAT_LANG_DETAILS_FOR_MAP_ERROR = 'LAT_LANG_DETAILS_FOR_MAP_ERROR';
export const GOOGLE_MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?key=${GOOGLE_APIKEY}&api=1&`;
export const PDP_PRODUCT_ITEM_ID = 'FAS_PDP_PRODUCT_ITEM_ID';
export const ZIP_CODE_API = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_APIKEY}&latlng=`;
export const LAT_LNG_ZIPCODE_API = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_APIKEY}&address=`;
export const GET_IP_BY_NETWORK = 'http://ip-api.com/json';
// export const GET_IP_BY_NETWORK = `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_APIKEY}`;
export const MAKE_MY_STORE_DETAILS_UPDATED = 'MAKE_MY_STORE_DETAILS_UPDATED';
export const MY_STORE_REG_USER_DATA = 'MY_STORE_REG_USER_DATA';
export const GET_CART_DETAILS = 'GET_CART_DETAILS';
export const GET_CART_ERROR = 'GET_CART_ERROR';
export const GET_CART_SUCCESS = 'GET_CART_SUCCESS';
export const SET_CMS = 'SET_CMS';
export const UPDATE_ORDER_ID_REQUEST = 'UPDATE_ORDER_ID_REQUEST';
export const UPDATE_ORDER_ID_SUCCESS = 'UPDATE_ORDER_ID_SUCCESS';
export const UPDATE_ORDER_ID_ERROR = 'UPDATE_ORDER_ID_ERROR';
export const FETCH_GEO_FROM_AKAMAI = 'FETCH_GEO_FROM_AKAMAI';
export const GEO_LOCATED_ZIP_CODE = 'geoLocatedZipCode';
export const SOURCE_REALTIME = 'realtime';
export const STORE_LOCATOR_LINK = '/shop/storelocator';
export const LABEL_TRUE = 'true';
export const SEARCH_LABEL = 'Enter Zip Code or City, State';

/** analytics Constants */
export const TRUE = 1;
export const FALSE = 0;
export const NULL = null;
export const EMPTY_VAL = null;
export const ANALYTICS_EVENT_IN = 'search';
export const ANALYTICS_EVENT_CATEGORY = 'store locator';
export const ANALYTICS_EVENT_ACTION = {
  VIEW: 'view store detail',
  DIRECTIONS: 'get directions',
  SEARCH: 'store search',
  MAKE_MY_STORE: 'make my store'
};
export const analyticsLabelSuccessfulStoreSearch = 'successful store search';
export const analyticsLabelUnsuccessfulStoreSearch = 'unsuccessful store search';
export const analyticsLabelViewMoreStores = 'View more stores';
