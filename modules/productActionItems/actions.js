import * as actions from './constants';

export const toggleFindAStore = data => ({ type: actions.FIND_A_MODAL_STORE_STATUS, data });
export const fetchMiniCartSuccess = data => ({ type: actions.FETCH_MINI_CART_SUCCESS, data });
export const getProductItemId = data => ({ type: actions.PDP_PRODUCT_ITEM_ID, data });

