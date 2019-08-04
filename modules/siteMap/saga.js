import { siteMapAPI } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { siteMapLoaded, siteMapLoadingError } from './actions';
import { SITE_MAP_DETAILS } from './constants';

function* getSiteMapData() {
  // const siteMapAPI = 'http://127.0.0.1:8081/sitemap.json';
  const requestURL = `${siteMapAPI}`;
  try {
    const siteMapData = yield call(axios, requestURL);
    yield put(siteMapLoaded(siteMapData.data));
  } catch (error) {
    yield put(siteMapLoadingError(error));
  }
}

export default function* productDta() {
  yield takeLatest(SITE_MAP_DETAILS, getSiteMapData);
}
