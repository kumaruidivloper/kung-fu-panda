import { USER_WISHLIST_DATA, USER_WISHLIST_DATA_ERROR } from './constants';
export const getUserWishListSuccess = data => ({ type: USER_WISHLIST_DATA, data });
export const getUserWishListFailure = data => ({ type: USER_WISHLIST_DATA_ERROR, data });
