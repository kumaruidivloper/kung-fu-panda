import { CREATE_WISHLIST, RENAME_WISHLIST, RENAME_WISHLIST_SUCCESS, RENAME_WISHLIST_FAILURE, CREATE_WISHLIST_SUCCESS, CREATE_WISHLIST_FAILURE } from './constants';
export const addWishList = (data, profileID) => ({ type: CREATE_WISHLIST, data, profileID });
export const renameWishList = (profileID, wishlistId, data) => ({ type: RENAME_WISHLIST, profileID, wishlistId, data });
export const renameWishlistSuccess = data => ({ type: RENAME_WISHLIST_SUCCESS, data });
export const renameWishlistFailure = data => ({ type: RENAME_WISHLIST_FAILURE, data });
export const createWishlistSuccess = data => ({ type: CREATE_WISHLIST_SUCCESS, data });
export const createWishlistFailure = data => ({ type: CREATE_WISHLIST_FAILURE, data });
