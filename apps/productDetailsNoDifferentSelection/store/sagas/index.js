import { takeLatest } from 'redux-saga/effects';
import { SAVE_PRODUCT_INFO } from '../types';

function* saveProductInfo(action) {
  yield action;
}

export default function* rootSaga() {
  yield takeLatest(SAVE_PRODUCT_INFO, saveProductInfo);
}
