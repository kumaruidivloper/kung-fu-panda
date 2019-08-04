import { put, takeLatest } from 'redux-saga/effects';
import fetchJsonp from 'fetch-jsonp';
import { SAVE_PRODUCT_INFO, SAVE_PRODUCT_SUCCESS, SAVE_PRODUCT_FAILURE } from '../types';
import { SCENE7_DOMAIN_URL, SCENE7_META_DATA } from '../../../../../endpoints';

function* saveProductItem(action) {
  const { data: productItem } = action;
  const { multiMediaSetName } = productItem;

  try {
    // This is to fetch mixed media meta data from scene7 server using multiMediaSetName
    if (multiMediaSetName) {
      let setData = null;
      yield fetchJsonp(`${SCENE7_DOMAIN_URL}${SCENE7_META_DATA}${multiMediaSetName}?req=set,json`, {
        jsonpCallbackFunction: 's7jsonResponse'
      })
        .then(response => response.json())
        .then(json => {
          setData = json;
        })
        .catch(ex => {
          console.log('parsing failed', ex);
        });
      yield put({ type: SAVE_PRODUCT_SUCCESS, data: { mixedMediaMetaData: setData, ...productItem } });
    } else {
      yield put({ type: SAVE_PRODUCT_SUCCESS, data: { mixedMediaMetaData: null, ...productItem } });
    }
  } catch (e) {
    yield put({
      type: SAVE_PRODUCT_FAILURE,
      data: {
        mixedMediaMetaData: null,
        ...productItem
      }
    });
  }
}

export default function* rootSaga() {
  yield takeLatest(SAVE_PRODUCT_INFO, saveProductItem);
}
