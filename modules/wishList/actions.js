import { USER_WISHLIST } from './constants';
export const getUserWishlist = profileID => ({ type: USER_WISHLIST, profileID });
