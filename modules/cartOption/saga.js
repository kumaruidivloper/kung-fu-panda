import { checkoutUrl, inventoryCheck, onCheckout } from '@academysports/aso-env';
import axios from 'axios';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { PUT_SUCCESS_CODE } from '../../apps/cart/cart.constants';
import { hideLoader, loadCart, showLoader } from '../../apps/cart/store/actions';
import * as selectors from '../../apps/cart/store/selectors';
import { INVENTORY_CHECK, ONLINE_INVENTORY_FAIL, PICKUP_INVENTORY_FAIL, BUNDLE_INVENTORY_FAIL } from './constants';
import { setCheckoutCookie, isUnAuthorized } from '../../utils/helpers';

const dataAnalyticsObject = {
  event: 'checkoutsteps',
  eventCategory: 'checkout',
  eventAction: 'error in checkout cart',
  eventLabel: '',
  customerleadlevel: null,
  customerleadtype: null,
  leadsubmitted: 0,
  newslettersignupcompleted: 0
};

/**
 * Method to set labels for analytics object on a failure scenario.
 * @param {string} error Error label to be used in analytics object
 */
function createAnalyticsObjectForErrorScenario(error) {
  const errorAnalyticsObj = dataAnalyticsObject;
  errorAnalyticsObj.eventLabel = error.toLowerCase();
  return errorAnalyticsObj;
}

/**
 * Method to navigate to checkout page
 * @param {obj} action
 * @param {obj} analyticsContent
 * @param {string} eventLabel
 */
export function* fnOnCheckout(action, analyticsContent, eventLabel) {
  try {
    const resp = yield call(axios, onCheckout(action.data), {
      method: 'POST',
      data: { orderId: action.data }
    });
    const zipcode = yield select(selectors.deliveryZipcode);
    if (resp.status === PUT_SUCCESS_CODE) {
      setCheckoutCookie(action.data);
      let successAnalyticsObj = {};
      successAnalyticsObj = dataAnalyticsObject;
      successAnalyticsObj.eventLabel = eventLabel.toLowerCase();
      successAnalyticsObj.eventAction = 'checkout cart';
      analyticsContent(successAnalyticsObj);
      window.location.href = `${checkoutUrl}?orderId=${action.data}&deliveryzip=${zipcode || ''}`;
    }
  } catch (error) {
    if (isUnAuthorized(error)) {
      return;
    }
    // If inventory API failed to detect, for a fallback we reloading cart
    analyticsContent(createAnalyticsObjectForErrorScenario(JSON.stringify(error)));
    yield all([put(loadCart()), put(hideLoader())]);
  }
}

/**
 * Method to trigger api call to do an inventory check.
 * @param {*} action
 */
export function* fnInventoryCheck(action) {
  try {
    yield put(showLoader());
    const response = yield call(axios, inventoryCheck(action.data.dataObj.storeId), {
      method: 'POST',
      data: {
        onlineskus: {
          skus: action.data.dataObj.onlineSkus.map(item => ({
            skuId: item.productId,
            requestedQuantity: item.quantity
          }))
        },
        pickupskus: {
          storeId: action.data.dataObj.storeId,
          skus: action.data.dataObj.pickupSkus.map(item => ({
            skuId: item.skuId,
            requestedQuantity: item.quantity
          }))
        },
        bundleskus: [...action.data.dataObj.bundleSkusOnline, ...action.data.dataObj.bundleSkusPickup]
      }
    });
    yield handleInventoryResponse(response.data, action.data.dataObj, action.data.analyticsContent, action.data.eventLabel);
  } catch (error) {
    if (isUnAuthorized(error)) {
      return;
    }
    yield put(hideLoader());
    action.data.analyticsContent(createAnalyticsObjectForErrorScenario(JSON.stringify(error)));
    console.error('Inventory Check Failed', error);
  }
}

/**
 * Method to find any item is OOS or Partial available, then to retrigger getCartApi,
 * else, proceed with checkout.
 */
export function* handleInventoryResponse(response, requestParams, analyticsContent, eventLabel) {
  if (!response) {
    yield fnOnCheckout({ data: requestParams.orderId }, analyticsContent, eventLabel);
    return;
  }
  const items = response.onlineskus && response.onlineskus.skus && response.onlineskus.skus.filter(i => i.inventoryStatus !== 'AVAILABLE');
  if (items && items.length) {
    yield put(loadCart());
    analyticsContent(createAnalyticsObjectForErrorScenario(ONLINE_INVENTORY_FAIL));
    return;
  }

  let isNotAvilable = false;
  if (response.pickupskus) {
    response.pickupskus.map(item => {
      const pickupSkus = item.skus.filter(i => i.inventoryStatus !== 'AVAILABLE');
      if (pickupSkus.length) {
        isNotAvilable = true;
      }
      return item;
    });
  }
  if (isNotAvilable) {
    yield put(loadCart());
    analyticsContent(createAnalyticsObjectForErrorScenario(PICKUP_INVENTORY_FAIL));
    return;
  }

  if (response.bundleskus) {
    response.bundleskus.map(item => {
      const bundleSkus = item.skus.filter(i => i.inventoryStatus !== 'AVAILABLE');
      if (bundleSkus.length) {
        isNotAvilable = true;
      }
      return item;
    });
  }
  if (isNotAvilable) {
    yield put(loadCart());
    analyticsContent(createAnalyticsObjectForErrorScenario(BUNDLE_INVENTORY_FAIL));
    return;
  }

  yield fnOnCheckout({ data: requestParams.orderId }, analyticsContent, eventLabel);
}

export default function* cartOption() {
  yield takeLatest(INVENTORY_CHECK, fnInventoryCheck);
}
