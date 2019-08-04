import { DELETE_WISHLIST, DELETE_WISHLIST_SUCCESS, DELETE_WISHLIST_FAILURE } from './constants';
export const deleteWishlist = (wishlistId, profileID) => ({ type: DELETE_WISHLIST, wishlistId, profileID });
export const deleteWishlistFailure = data => ({ type: DELETE_WISHLIST_FAILURE, data });
export const deleteWishlistSuccess = data => ({ type: DELETE_WISHLIST_SUCCESS, data });
