import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { updateQtyAPI } from '@academysports/aso-env';
import {
    REMOVE_ORDER_ITEM_REQUEST,
    PUT_SUCCESS_CODE,
    GET_SUCCESS_CODE
} from './../../checkout.constants';
import { fetchOrderDetails } from './../actions/index';
import { checkoutRemoveOrderItemSuccess, checkoutRemoveOrderItemError } from './../actions/removeOrderItem';
import { showLoader, hideLoader } from '../actions/globalLoader';

function* checkoutRemoveOrderItemCall(action) {
  const { orderItem, orderId } = action.data;
  const data = { orderItem };
  try {
    yield put(showLoader());
    const response = yield call(submitRemoveItem, data, orderId);
    if (response.status === PUT_SUCCESS_CODE || GET_SUCCESS_CODE) {
      yield put(checkoutRemoveOrderItemSuccess(response.data));
      yield put(fetchOrderDetails(data.orderId));
    } else {
      yield put(checkoutRemoveOrderItemError());
      yield put(hideLoader());
    }
  } catch (error) {
    if (error.data) {
      yield put(checkoutRemoveOrderItemError(error));
    }
    yield put(hideLoader());
  }
}

function submitRemoveItem(data, orderId) {
  return axios({
    method: 'post', url: updateQtyAPI(orderId), data
  });
}

export default function* checkoutRemoveItemSagas() {
  yield takeLatest(REMOVE_ORDER_ITEM_REQUEST, checkoutRemoveOrderItemCall);
}
