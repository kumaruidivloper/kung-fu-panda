import {
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERROR,
  UPDATE_SELECTED_FACETS,
  UPDATE_FACETS,
  APPLY_SELECTED_FACETS,
  FIND_A_MODAL_STORE_STATUS
} from './constants';
export const loadProducts = options => ({ type: FETCH_PRODUCTS, options });
export const productsLoaded = data => ({ type: FETCH_PRODUCTS_SUCCESS, data });
export const productsLoadingError = error => ({
  type: FETCH_PRODUCTS_ERROR,
  error
});

export const updateSelectedFacets = (options, data, mode) => ({
  type: UPDATE_SELECTED_FACETS,
  options,
  data,
  mode
});

export const applyFacets = options => ({
  type: APPLY_SELECTED_FACETS,
  options
});

export const updateFacets = facets => ({ type: UPDATE_FACETS, facets });

export const toggleFindAStore = data => ({ type: FIND_A_MODAL_STORE_STATUS, data });
