import { facetSearchAPI, SEARCHTERM_API } from '@academysports/aso-env';
import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { APPLY_SELECTED_FACETS, FETCH_PRODUCTS, FETCH_PRODUCTS_ERROR, FETCH_PRODUCTS_SUCCESS, UPDATE_SELECTED_FACETS } from './constants';

const getSelectedFacets = state => {
  const selectedFacets = state.productGrid && state.productGrid.selectedFacets;
  const strSelectedFacets = selectedFacets.map(item => item.selectedLabelId).join(',');
  return strSelectedFacets;
};

function* fetchProductGrid(action) {
  const { options } = action;
  const selectedFacets = yield select(getSelectedFacets);
  let searchAPIUrl = `${facetSearchAPI}?displayFacets=true&facets=`;

  if (options) {
    if (options.preventRequest) return;
    if (options.isSearch) {
      searchAPIUrl = `${SEARCHTERM_API}${encodeURIComponent(decodeURIComponent(options.searchTerm))}&facet=`;
    }
    const queryFilter = `${selectedFacets}&orderBy=${options.selectedSortValue}&categoryId=${options.categoryId}&pageSize=${
      options.pageSize
    }&pageNumber=${options.pageNumber}`;
    const requestURL = `${searchAPIUrl}${queryFilter}`;
    console.log('product grid : Request URL: ', requestURL);
    try {
      const response = yield call(axios, requestURL);
      yield put({ type: FETCH_PRODUCTS_SUCCESS, data: response.data });
    } catch (e) {
      yield put({ type: FETCH_PRODUCTS_ERROR, message: e.message });
    }
  } else {
    console.error('data not available!'); // eslint-disable-line
  }
}

function* productGridSaga() {
  yield takeLatest([FETCH_PRODUCTS, UPDATE_SELECTED_FACETS, APPLY_SELECTED_FACETS], fetchProductGrid);
}

export default productGridSaga;
