import { takeLatest, select } from 'redux-saga/effects';
// import { updatedAnalytics } from './actions';
import { UPDATE_ANALYTICS } from './constants';

const analyticsObj = state => state.analyticsWrapper.updateAnalytics;

function* updateWindowGtmLayer() {
  const gtmDataLayer = yield select(analyticsObj);
  window.dataLayer.push(gtmDataLayer);
}

export default function* updateGtmLayer() {
  yield takeLatest(UPDATE_ANALYTICS, updateWindowGtmLayer);
}
