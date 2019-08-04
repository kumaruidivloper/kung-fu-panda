import { updateSOFOrderItems } from '@academysports/aso-env';
import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { GET_SUCCESS_CODE } from '../../apps/cart/cart.constants';
import { loadCart } from '../../apps/cart/store/actions';
import { fetchMiniCart } from '../../modules/header/actions';
import { toggleSOFModal } from './actions';
import { PLACE_SOF_LIMITEDSTOCK } from './constants';

export function* updateOrderItems(action) {
  try {
    const response = yield call(axios, updateSOFOrderItems, {
      method: 'POST',
      data: action.data
    });
    if (response.status === GET_SUCCESS_CODE) {
      yield all([put(loadCart()), put(fetchMiniCart()), put(toggleSOFModal({ status: false, sofItems: [], error: false }))]);
    }
  } catch (error) {
    yield put(toggleSOFModal({ error: true }));
  }
}

export default function* specialOrderItems() {
  yield takeLatest(PLACE_SOF_LIMITEDSTOCK, updateOrderItems);
}
