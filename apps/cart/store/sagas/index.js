import { cartIdCookieName, cartZipCodeByGeo, getCartAPI, GOOGLE_APIKEY } from '@academysports/aso-env';
import axios from 'axios';
import { delay } from 'redux-saga';
import { call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '@react-nitro/error-boundary';
import { cartLoaded, cartLoadError, updateZipCode, updateStoreZipcode } from '../actions/index';
import { addMessages } from '../../../../modules/productBlade/actions';
import { LOAD_CART, CART_ZIPCODE_GEO, COOKIE_STORE_ZIPCODE } from '../../cart.constants';
import cartOption from '../../../../modules/cartOption/saga';
import { MAKE_MY_STORE_DETAILS_UPDATED, GEO_LOCATED_ZIP_CODE } from '../../../../modules/findAStoreModalRTwo/constants';
import cartOrderSummary from '../../../../modules/orderSummary/saga';
import { ADD_MSG, CATCH_MSG, REMOVE_CART_MSG, REMOVE_MESSAGE_DELAY } from '../../../../modules/productBlade/constants';
import productBlade from '../../../../modules/productBlade/saga';
import promotionsMessaging from '../../../../modules/promotionalMessaging/saga';
import specialOrderItems from '../../../../modules/specialOrderProceedModal/saga';
import Storage from '../../../../utils/StorageManager';
import * as selectors from '../selectors';
import { isUnAuthorized } from '../../../../utils/helpers';

/**
 * Saga for accumulating zipcodes and calling getCartDetails saga for doing get cart API call.
 */
export function* getCartData(action) {
  try {
    let zipcode = yield select(selectors.deliveryZipcode);
    const storeZipcode = Storage.getCookie(COOKIE_STORE_ZIPCODE);
    if (!zipcode) {
      // if deliveryZipcode not set and already we have geo located zipcode set that or store located zip code
      const geoLocatedZipCode = Storage.getSessionStorage(GEO_LOCATED_ZIP_CODE);
      yield put(updateZipCode(geoLocatedZipCode || storeZipcode));
    }
    yield put(updateStoreZipcode(storeZipcode));
    zipcode = yield select(selectors.deliveryZipcode);
    const cartContents = yield call(getCartDetails, zipcode, storeZipcode);
    if (!cartContents) {
      yield put(cartLoadError('Error'));
      return;
    }
    yield put(cartLoaded(cartContents.data));
    if (action && action.data) {
      yield put(addMessages(action.data));
    }
  } catch (error) {
    // If status is 401/unauthorized we will redirect customer to login page, so we are not hiding loader or displaying any messages.
    if (isUnAuthorized(error)) {
      return;
    }
    if (error.data) {
      yield put(cartLoadError(error.data));
    }
  }
}

/**
 * Saga for performing get cart API call.
 * @param  {string} zipcode param to be used as deliveryZipCode query param.
 * @param  {string} storeZipCode param to be used as query param in API call.
 */
export function getCartDetails(zipcode, storeZipCode) {
  const requestURL = `${getCartAPI}${Storage.getCookie(cartIdCookieName) || '000000'}`;
  let queryParams = `?deliveryZipCode=${zipcode || ''}&storeZipCode=${storeZipCode || ''}`;
  const changedZipCode = Storage.getSessionStorage('cartUserChangedZip');
  if (changedZipCode) {
    queryParams = `${queryParams}&changedZipCode=${changedZipCode}`;
  }
  return axios({
    method: 'GET',
    url: `${requestURL}${queryParams}`
  });
}

/**
 * Saga for calling saga responsible for get cart API call with zipcode obtained from
 * geolocation as delivery zip code.
 * @param  {object} action
 */
export function* getZipCodeByGeo(action) {
  try {
    const response = yield call(axios, `${cartZipCodeByGeo(GOOGLE_APIKEY)}${action.data.geo}`);
    if (!response.data || !response.data.results || !response.data.results.length) {
      yield getCartData();
      return;
    }
    const extractedZip = response.data.results[0].address_components.filter(item => item.types.indexOf('postal_code') > -1);
    if (extractedZip.length && extractedZip[0].long_name) {
      const geoZipCode = extractedZip[0].long_name;
      if (!Storage.getSessionStorage(GEO_LOCATED_ZIP_CODE)) {
        Storage.setSessionStorage(GEO_LOCATED_ZIP_CODE, geoZipCode);
      }
      yield put(updateZipCode(extractedZip[0].long_name));
    }
    yield getCartData();
  } catch (error) {
    yield getCartData();
  }
}

/**
 * Saga for triggering display of messages like 'Moved to wishlist', 'Removed from cart',
 * and removing the messages after a delay of 5 seconds.
 * @param  {object} action
 */
function* displayMessages(action) {
  const id = get(action, 'data.id', false);
  if (!id) {
    return;
  }
  yield put({ type: CATCH_MSG, data: action.data });
}

/**
 * Saga for delay 5 secs and remove message
 */
function* removeMessageWithDelay(action) {
  const { data } = action;
  if (!data) {
    return;
  }
  yield call(delay, 5000);
  yield put({ type: REMOVE_CART_MSG, data });
}

/**
 * Method will trigger on change of store in cart page
 */
function* getCartDetailsOnChangeOfStore() {
  const storeZipCode = yield select(selectors.storeZipcode);
  const cookieZipcode = Storage.getCookie(COOKIE_STORE_ZIPCODE);
  if (storeZipCode === cookieZipcode) {
    return;
  }

  yield put(updateStoreZipcode(storeZipCode));
  yield getCartData();
}

/**
 * Saga at cart parent level; covers components in blade and get cart API.
 */
function* rootLevel() {
  yield takeLatest(LOAD_CART, getCartData);
  yield takeLatest(MAKE_MY_STORE_DETAILS_UPDATED, getCartDetailsOnChangeOfStore);
  yield takeEvery(ADD_MSG, displayMessages);
  yield takeLatest(CART_ZIPCODE_GEO, getZipCodeByGeo);
  yield takeLatest(REMOVE_MESSAGE_DELAY, removeMessageWithDelay);
}

/**
 * Saga for root cart page, including all cart page components.
 */
export default function* root() {
  yield [fork(rootLevel), fork(promotionsMessaging), fork(productBlade), fork(cartOption), fork(cartOrderSummary), fork(specialOrderItems)];
}
