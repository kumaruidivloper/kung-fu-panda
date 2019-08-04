import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { inventoryCheck } from '@academysports/aso-env';
import {
    CHECKOUT_INVENTORY_REQUEST,
    AVAILABLE_CONSTANT
} from './../../checkout.constants';
import { checkoutInventoryError } from './../actions/checkoutInventory';
import { postPlaceOrder } from '../actions/placeOrder';
// import { showLoader, hideLoader } from '../actions/globalLoader';
/**
 * it handle innevtory request call.if api return some error we are not blocking to user for placing order
 * @param {object} action - contains post request data
 */
function* checkoutInventoryData(action) {
  const { data, storeId, placeOrderData } = action.data;
  try {
    const response = yield call(submitCheckoutInventoryAPI, data, storeId);
    yield handleInventoryResponseCheck(response && response.data, placeOrderData);
  } catch (error) {
    yield put(postPlaceOrder({ data: placeOrderData }));
  }
}
/**
 * it handle the check of out of stock items.if any out of stock item,user is not able to place order
 * @param {object} response - contains response data
 * @param {object} placeOrderData -contains place order data
 */
function* handleInventoryResponseCheck(response, placeOrderData) {
  if (response && Object.keys(response).length === 0) {
    yield put(postPlaceOrder({ data: placeOrderData }));
    return;
  }
  const onlineSku =
  response &&
  response.onlineskus &&
  response.onlineskus.skus &&
  response.onlineskus.skus.filter(sku => sku.inventoryStatus !== AVAILABLE_CONSTANT);
  const bundleSku =
  response &&
  response.bundleskus &&
  response.bundleskus.filter(sku => sku.inventoryStatus !== AVAILABLE_CONSTANT);
  const pickupSku =
  response &&
  response.pickupskus &&
  response.pickupskus.length &&
  response.pickupskus[0].skus &&
  response.pickupskus[0].skus.filter(sku => sku.inventoryStatus !== AVAILABLE_CONSTANT);
  const checkoutInventoryStatus = (onlineSku && onlineSku.length) || (bundleSku && bundleSku.length) || (pickupSku && pickupSku.length);
  if (checkoutInventoryStatus) {
    yield put(checkoutInventoryError(response));
  } else {
    yield put(postPlaceOrder({ data: placeOrderData }));
  }
  }
/**
 * it handles the inventory api call
 * @param {object} data - request data
 * @param {*} storeId -store id for inventory api
 */
function submitCheckoutInventoryAPI(data, storeId) {
  return axios({
    method: 'post', url: inventoryCheck(storeId), data
  });
}
/**
 * it handles the request action call
 */
export default function* checkoutInventorySagas() {
  yield takeLatest(CHECKOUT_INVENTORY_REQUEST, checkoutInventoryData);
}
