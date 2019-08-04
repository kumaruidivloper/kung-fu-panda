import {
  LOAD_CART,
  LOAD_CART_ERROR,
  LOAD_CART_SUCCESS,
  CART_ZIPCODE_IP,
  CART_ZIPCODE_GEO,
  UPDATE_ZIPCODE,
  SHOW_LOADER_CART,
  HIDE_LOADER_CART,
  UPDATE_STORE_ZIPCODE
} from '../../cart.constants';
import { UNDO_ACTION } from '../../../../modules/productBlade/constants';

export const loadCart = data => ({ type: LOAD_CART, data });

export const cartLoaded = data => ({ type: LOAD_CART_SUCCESS, data });

export const cartLoadError = error => ({
  type: LOAD_CART_ERROR,
  error
});

export const showLoader = () => ({
  type: SHOW_LOADER_CART
});

export const hideLoader = () => ({
  type: HIDE_LOADER_CART
});

export const getZipCodeByIP = data => ({
  type: CART_ZIPCODE_IP,
  data
});

export const getZipCodeByGeo = data => ({
  type: CART_ZIPCODE_GEO,
  data
});

export const updateZipCode = data => ({
  type: UPDATE_ZIPCODE,
  data
});

export const undoAction = data => ({
  type: UNDO_ACTION,
  data
});

/**
 * Update store zipcode in reducer.
 * @param {object} data Store Zipcode
 */
export const updateStoreZipcode = data => ({
  type: UPDATE_STORE_ZIPCODE,
  data
});
