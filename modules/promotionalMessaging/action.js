import { ADD_PROMOCODE, LOAD_CART, REMOVE_PROMOCODE, PROMOCODE_ERROR, PROMOCODE_SUCCESS } from './constants';

export const addPromoCode = data => ({ type: ADD_PROMOCODE, data });
export const removePromoCode = data => ({ type: REMOVE_PROMOCODE, data });
export const loadCartData = data => ({ type: LOAD_CART, data });
export const promocodeError = data => ({ type: PROMOCODE_ERROR, data });
export const promocodeSuccess = data => ({ type: PROMOCODE_SUCCESS, data });
