import {
  findAStoreAPI,
  // getCurrentCartItems,
  makeMyStoreAPI,
  orderUpdateAPI,
  akamaiCoordURL,
  cartZipCodeByGeo,
  GOOGLE_APIKEY,
  miniCartAPI
} from '@academysports/aso-env';
import axios from 'axios';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import Storage from '../../utils/StorageManager';
import * as actions from './actions';
import {
  COOKIE_STORE_ID,
  FETCH_GEO_FROMIP_REQUEST,
  FETCH_ZIP_CODE_GAPI_REQUEST,
  FIND_LAT_LANG_ZIPCODE_REQUEST,
  GET_CART_DETAILS,
  GET_IP_BY_NETWORK,
  LAT_LNG_ZIPCODE_API,
  LOAD_STORE_DETAILS_REQUEST,
  MAKE_MY_STORE,
  UPDATE_ORDER_ID_REQUEST,
  ZIP_CODE_API,
  FETCH_GEO_FROM_AKAMAI,
  LAT_LONG,
  GEO_LOCATED_ZIP_CODE
} from './constants';
import {
  inventoryData,
  checkNullObject,
  appendStoreName,
  extractRegUserResponse,
  extractMyStoreResponse,
  myStoreIsEmpty,
  buildStoreApiQuery,
  checkCallStoreAPI
} from './helpers';
import * as selectors from './selectors';

axios.defaults.withCredentials = false;

/**
 * This is method to make geo location call using google geocode API and get the zipcode for the given lat lang
 * if no stores within 250 miles radius API returns empty array then this will geo locate user and set zipcode
 * This will make sure no other stores api call happen in any other pages
 * @param {object} response
 */
const setExtractedZipCodeFromGoogleCall = response => {
  if (response && response.data) {
    const { results = [] } = response.data;
    if (results.length) {
      const { address_components: addressComponents } = results[0];
      const extractedZip = addressComponents.filter(item => item.types.indexOf('postal_code') > -1);
      if (extractedZip.length && extractedZip[0].long_name) {
        Storage.setSessionStorage(GEO_LOCATED_ZIP_CODE, extractedZip[0].long_name);
      }
    }
  }
};

/**
 * @param {*} action Redux Action
 * Saga call for getting store list
 * API Call - api/stores
 * @QueryParams : Lat/Lang
 */
function* getProductData(action) {
  try {
    const { data } = action;
    const queryFilter = buildStoreApiQuery(data);
    const { manualSearch } = data;
    const requestURL = `${findAStoreAPI}${queryFilter}`;
    const { openhourlabel } = yield select(selectors.cms);
    const storeDetails = yield call(axios, encodeURI(requestURL));
    let nearestStores = extractRegUserResponse(storeDetails.data, manualSearch, openhourlabel);
    const { zipCode } = nearestStores;
    if (!Storage.getSessionStorage(GEO_LOCATED_ZIP_CODE)) {
      if (!zipCode) {
        const { lat, lang } = data;
        const response = yield call(axios, `${cartZipCodeByGeo(GOOGLE_APIKEY)}${lat},${lang}`);
        setExtractedZipCodeFromGoogleCall(response);
      } else {
        Storage.setSessionStorage(GEO_LOCATED_ZIP_CODE, zipCode);
      }
    }
    let updatedMyStore;
    /* eslint-disable array-callback-return */
    yield storeDetails.data.stores.filter(store => {
      if (store.storeId === data.storeId) {
        updatedMyStore = extractMyStoreResponse(store, openhourlabel);
        nearestStores = {};
      }
    });
    /**
     * For manual search first store should not be Favorite store
     * Below code is for differntiating between Auto Detected and Manual Search
     * Auto Detected Location, will have first store as favorite if there is store data
     * within vicinity
     */
    if (!manualSearch) {
      const cartData = yield select(selectors.cartData);
      if (!checkNullObject(cartData) && !checkNullObject(nearestStores) && !data.pdp) {
        const sessionToStore = nearestStores;
        const storeId = sessionToStore.gx_id;
        yield put(
          actions.updateOrderIdRequest({
            storeId,
            sessionToStore,
            manualSearch
          })
        );
      } else if (myStoreIsEmpty(updatedMyStore)) {
        yield all([put(actions.myStoreDetails(updatedMyStore)), put(actions.makeMyStoreDetailsUpdated())]);
      } else if (!checkNullObject(nearestStores)) {
        yield all([put(actions.myStoreDetails(nearestStores)), put(actions.makeMyStoreDetailsUpdated())]);
      }
    }
    yield put(actions.storeDetailsLoaded(storeDetails.data));
  } catch (error) {
    yield put(actions.storeLoadingError(error));
  }
}
/**
 * @param {*} action
 * API call for Login user to save user profile
 */
function* setmystore(action) {
  const { data } = action;
  let { stLocId } = data.makeMyStoreBody;
  const { storeInfo } = data.makeMyStoreBody;
  stLocId = `${stLocId}`;
  const requestURL = `${makeMyStoreAPI}`;
  const options = {
    method: 'POST',
    data: {
      stLocId
    }
  };
  try {
    const myStoreDetails = yield call(axios, requestURL, options);
    yield put(actions.makeMyStoreUpdate(myStoreDetails.data));
    yield all([put(actions.myStoreDetails(storeInfo)), put(actions.makeMyStoreDetailsUpdated())]);
    Storage.setCookie(COOKIE_STORE_ID, storeInfo.gx_id);
  } catch (error) {
    yield put(actions.makeMyStoreUpdate(error));
  }
}
/**
 * @param {*} action
 * Find lat/lang from zip code using google map api
 */
function* findLatLangZipCode(action) {
  const { data } = action;
  const { isBopisEligible, source, storeEligibility } = data;
  const requestURL = `${LAT_LNG_ZIPCODE_API}${data.zipcode}`;
  try {
    const latLangData = yield call(axios, requestURL);
    /**
     * Fix for Bug 12581 - Google Map API will return status ok,
     * only if search result is greater then zero
     */
    if (latLangData && latLangData.data && latLangData.data.status && latLangData.data.status === 'OK') {
      if (latLangData.data.results) {
        yield put(actions.findLatLangZipCodeSuccess(latLangData.data));
        const { lat, lng } = latLangData.data.results[0].geometry.location;
        yield put(
          actions.loadStoreDetails({
            lat,
            lang: lng,
            radius: data.radius,
            storeId: data.storeId,
            skus: data.skus,
            manualSearch: true,
            isBopisEligible,
            source,
            storeEligibility
          })
        );
        yield put(
          actions.latLangDetailsForMap({
            lat,
            lang: lng
          })
        );
      }
    } else {
      yield put(actions.storeLoadingError(''));
    }
  } catch (error) {
    yield put(actions.latLangDetailsForMapError(error));
  }
}
/**
 * @param {*} action
 * Find zip code from Lat/lang
 */
function* findZipCode(action) {
  const { mySelectedStore } = action.data;
  const { storeId } = action.data;
  let isStoreIdChanged = false;
  if (mySelectedStore && storeId) {
    try {
      const cookieData = JSON.parse(mySelectedStore);
      if (cookieData.gx_id !== storeId) {
        isStoreIdChanged = true;
      }
    } catch (e) {
      isStoreIdChanged = false;
    }
  }
  try {
    const { lat, lang } = action.data;
    const requestURL = `${ZIP_CODE_API}${lat},${lang}`;
    const zipCodeData = yield call(axios, requestURL);
    let extractedZip = '';
    for (let index = 0; index < zipCodeData.data.results[0].address_components.length; index += 1) {
      if (zipCodeData.data.results[0].address_components[index].types[0] === 'postal_code') {
        extractedZip = zipCodeData.data.results[0].address_components[index].long_name;
      }
    }
    yield put(actions.findZipCodeGapiSuccess(extractedZip));
    yield put(actions.latLangDetailsForMap(action.data));
    if (!mySelectedStore || isStoreIdChanged) {
      yield put(actions.loadStoreDetails(action.data));
    }
  } catch (error) {
    // Fallback mode even if zip code API is failing.
    yield put(actions.latLangDetailsForMap(action.data));
    if (!mySelectedStore || isStoreIdChanged) {
      yield put(actions.loadStoreDetails(action.data));
    }
    yield put(actions.findZipCodeGapiError(error));
  }
}
/**
 * @param {*} action
 * Find Lat/Lang from IP API
 */
export function* getGeoFromIp(action) {
  try {
    const { radius, storeId } = action.data;
    const requestURL = `${GET_IP_BY_NETWORK}`;
    const geoApiResp = yield call(axios, requestURL);
    if (geoApiResp.data && geoApiResp.data.zip) {
      const extractedZip = geoApiResp.data.zip;
      const cords = {
        lat: geoApiResp.data.lat,
        lang: geoApiResp.data.lon,
        radius,
        storeId
      };
      yield put(actions.fetchFromIpSuccess(extractedZip));
      yield put(actions.loadStoreDetails(cords));
      yield put(actions.latLangDetailsForMap(cords));
    } else {
      yield put(actions.fetchFromIpError(''));
    }
  } catch (error) {
    yield put(actions.fetchFromIpError(error));
  }
}
/**
 * Saga call for getting Cart data
 */
export function* getCartDetails(action) {
  const requestURL = `${miniCartAPI}000000/summary`;
  const { data } = action;
  const { isBopisEligible, source, storeEligibility } = data;
  try {
    const response = yield call(axios, requestURL);
    const extractedResponse = inventoryData(response.data, source);
    const coordinates = yield select(selectors.coordinates);
    let payload = {
      ...coordinates,
      isBopisEligible,
      source,
      storeEligibility
    };
    const { radius } = yield select(selectors.cms);
    if (radius) {
      payload = {
        ...payload,
        radius
      };
    }
    const myStoreData = yield select(selectors.mystoreData);
    if (myStoreData && myStoreData.isCompleted) {
      payload = {
        ...payload,
        storeId: appendStoreName(myStoreData.storeId, true)
      };
    }
    if (!checkNullObject(extractedResponse)) {
      payload = {
        ...payload,
        skus: extractedResponse.skus
      };
    }
    yield put(actions.loadStoreDetails(payload));
    yield put(actions.getCartSuccess(extractedResponse));
  } catch (error) {
    yield put(actions.getCartError(error));
  }
}
/**
 * @param {*} action
 * Whenever there is data in cart, need to call update order API
 * befor making make mystore CTA, if Order API fails it will not
 * update make my store
 */
export function* updateOrderId(action) {
  try {
    const options = {
      method: 'POST'
    };
    const { sessionToStore, storeId, loggedInState, makeMyStoreBody } = action.data;
    const requestURL = orderUpdateAPI(storeId);
    const response = yield call(axios, requestURL, options);
    if (response.status === 201) {
      yield put(actions.updateOrderIdSuccess(response));
      if (loggedInState !== 'R') {
        // Storage.setCookie(COOKIE_STORE_ID, sessionToStore.gx_id);
        yield all([put(actions.myStoreDetails(sessionToStore)), put(actions.makeMyStoreDetailsUpdated())]);
      } else {
        yield put(
          actions.makeMyStore({
            makeMyStoreBody
          })
        );
      }
    }
  } catch (error) {
    yield put(actions.updateOrderIdError(error));
  }
}

/**
 * For fetching lat/lang from Akamai Headers
 */
function* fetchFromAkamai(action) {
  try {
    const { storeId, radius, mySelectedStore, cookieInStore } = action.data;
    const akamaiResponse = yield call(axios, akamaiCoordURL);
    if (akamaiResponse.status === 200) {
      const { latitude, longitude } = akamaiResponse.data;
      if (latitude && longitude) {
        yield put(actions.latLangDetailsForMap({ lat: Number(latitude) || 0, lang: Number(longitude) || 0 }));
        Storage.setCookie(LAT_LONG, `${latitude},${longitude}`);
        if (checkCallStoreAPI(mySelectedStore, cookieInStore)) {
          yield put(actions.loadStoreDetails({ storeId, radius, lat: latitude, lang: longitude }));
        }
      } else {
        yield put(actions.latLangDetailsForMapError({}));
      }
    }
  } catch (error) {
    yield put(actions.latLangDetailsForMapError(error));
  }
}

export default function* productDta() {
  yield takeLatest(LOAD_STORE_DETAILS_REQUEST, getProductData);
  yield takeLatest(MAKE_MY_STORE, setmystore);
  yield takeLatest(FIND_LAT_LANG_ZIPCODE_REQUEST, findLatLangZipCode);
  yield takeLatest(FETCH_ZIP_CODE_GAPI_REQUEST, findZipCode);
  yield takeLatest(FETCH_GEO_FROMIP_REQUEST, getGeoFromIp);
  yield takeLatest(GET_CART_DETAILS, getCartDetails);
  yield takeLatest(UPDATE_ORDER_ID_REQUEST, updateOrderId);
  yield takeLatest(FETCH_GEO_FROM_AKAMAI, fetchFromAkamai);
}
