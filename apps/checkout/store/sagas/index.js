import { put, takeLatest, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import { getOrderDetails, basenameCart } from '@academysports/aso-env';
import { fetchOrderDetailsSuccess, fetchOrderDetailsError } from './../actions';
import { FETCH_PAGE_DATA_REQUEST, GET_SUCCESS_CODE, STORE_ZIP_CODE } from './../../checkout.constants';
import savedShippingAddress from './savedShippingAddress';
import validateAddress from './validateAddress';
import fetchCityState from './fetchCityState';
import savedBillingAddress from './savedBillingAddress';
import savedCreditCards from './savedCreditCards';
import shippingModesSagas from './shippingModes';
import addGiftCard from './giftCard';
import placeOrderSagas from './placeOrder';
import pickupInStoreSagas from './pickupInstore';
import shipToStoreSagas from './shipToStore';
import checkoutRemoveOrderItemCall from './removeOrderItem';
import getStoreAdressSagas from './getStoreAddress';
import checkoutInventorySagas from './checkoutInventory';
import postPaymentsData from './postPaymentData';
import postPayPalData from './postPayPalData';
import { showLoader, hideLoader } from '../actions/globalLoader';
import { getURLparam } from './../../../../utils/helpers';
import Storage from './../../../../utils/StorageManager';
/**
 * get params that is present in the url
 * @returns {{orderId: (*|string), deliveryZipCode: (*|string)}}
 */
function getURLparams() {
  const orderId = getURLparam('orderId') || '';
  const deliveryZipCode = getURLparam('deliveryzip') || '';
  const storeZipCode = Storage.getCookie(STORE_ZIP_CODE);
  return { orderId, deliveryZipCode, storeZipCode };
}

export function* manageCheckoutStates() {
  yield takeLatest(FETCH_PAGE_DATA_REQUEST, fetchPageDataWorkerSaga);
}

export function* fetchPageDataWorkerSaga() {
  const params = getURLparams();
  try {
    yield put(showLoader());
    const response = yield call(fetchPageDataAPI, params);
    if (response.status === GET_SUCCESS_CODE) {
      // re-direct the user to cart page in case of empty body
      if (Object.keys(response.data).length === 0) {
        window.location.href = basenameCart;
      }
      yield put(fetchOrderDetailsSuccess(response.data));
    } else {
      yield put(fetchOrderDetailsError(true));
    }
    yield put(hideLoader());
  } catch (err) {
    if (err.data) {
      yield put(fetchOrderDetailsError(err.data));
    }
    yield put(hideLoader());
  }
}

export function fetchPageDataAPI(params) {
  const { orderId, deliveryZipCode, storeZipCode } = params;
  return axios({ method: 'get', url: getOrderDetails(orderId), params: { deliveryZipCode, storeZipCode } });
}

export default function* rootSaga() {
  yield [
      fork(manageCheckoutStates),
      fork(savedShippingAddress),
      fork(validateAddress),
      fork(savedBillingAddress),
      fork(savedCreditCards),
      fork(shippingModesSagas),
      fork(placeOrderSagas),
      fork(postPaymentsData),
      fork(postPayPalData),
      fork(fetchCityState),
      fork(addGiftCard),
      fork(pickupInStoreSagas),
      fork(shipToStoreSagas),
      fork(getStoreAdressSagas),
      fork(checkoutRemoveOrderItemCall),
      fork(checkoutInventorySagas)
  ];
}
