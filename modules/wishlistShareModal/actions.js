import { SHARE_WISHLIST, SHARE_WISHLIST_SUCCESS, SHARE_WISHLIST_FAILURE } from './constants';
export const shareWishlist = (data, profileId, wishListId) => ({ type: SHARE_WISHLIST, data, profileId, wishListId });
export const shareWishlistFailure = () => ({ type: SHARE_WISHLIST_FAILURE });
export const shareWishlistSuccess = data => ({ type: SHARE_WISHLIST_SUCCESS, data });
