import {
  OPEN_MODAL_FOR_PRODUCT,
  OPEN_MODAL_FOR_PRODUCT_ID,
  SET_ON_CLOSE_FOCUS_ID,
  CLOSE_MODAL,
  SET_PRODUCT,
  FETCH_PRODUCT,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_ERROR,
  FETCH_INVENTORY_ERROR
} from './constants';

export const openModalForProduct = product => ({ type: OPEN_MODAL_FOR_PRODUCT, product });
export const openModalForProductId = (productId, seoURL, onCloseFocusId, bopisEnabled) => ({
  type: OPEN_MODAL_FOR_PRODUCT_ID,
  productId,
  seoURL,
  onCloseFocusId,
  bopisEnabled
});
export const closeModal = () => ({ type: CLOSE_MODAL });
export const clearOnCloseFocusId = () => ({ type: SET_ON_CLOSE_FOCUS_ID, onCloseFocusId: null });

export const setProduct = data => ({ type: SET_PRODUCT, data });
export const fetchProduct = options => ({ type: FETCH_PRODUCT, options });
export const fetchProductSucess = data => ({ type: FETCH_PRODUCT_SUCCESS, data });
export const fetchProductError = errorObject => ({ type: FETCH_PRODUCT_ERROR, error: errorObject });
export const fetchInventoryError = errorObject => ({ type: FETCH_INVENTORY_ERROR, error: errorObject });
