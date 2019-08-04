import { SHARE_WISHLIST, SHARE_WISHLIST_SUCCESS, SHARE_WISHLIST_FAILURE } from './constants';
export const shareWishlist = data => ({ type: SHARE_WISHLIST, data });
export const shareWishlistSuccess = data => ({ type: SHARE_WISHLIST_SUCCESS, data });
export const shareWishlistFailure = data => ({ type: SHARE_WISHLIST_FAILURE, data });
