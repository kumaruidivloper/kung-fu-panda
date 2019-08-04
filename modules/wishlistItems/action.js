import {
  FETCH_WISHLIST_ITEMS,
  FETCH_WISHLIST_ITEMS_SUCCESS,
  FETCH_WISHLIST_ITEMS_FAILURE,
  REMOVE_WISHLIST_ITEM,
  REMOVE_WISHLIST_ITEM_SUCCESS,
  REMOVE_WISHLIST_ITEM_FAILURE,
  ADD_ITEM_CART,
  ADD_ITEM_CART_SUCCESS,
  ADD_ITEM_CART_FAILURE,
  FETCH_MINI_CART_SUCCESS
} from './constants';
export const fetchWishlistItems = (profileID, wishlistId) => ({ type: FETCH_WISHLIST_ITEMS, profileID, wishlistId });
export const fetchWishlistItemsSuccess = data => ({ type: FETCH_WISHLIST_ITEMS_SUCCESS, data });
export const fetchWishlistItemsFailure = data => ({ type: FETCH_WISHLIST_ITEMS_FAILURE, data });
export const removeWishlistItem = (profileID, wishlistId, itemId) => ({ type: REMOVE_WISHLIST_ITEM, profileID, wishlistId, itemId });
export const removeWishlistItemSuccess = data => ({ type: REMOVE_WISHLIST_ITEM_SUCCESS, data });
export const removeWishlistItemFailure = data => ({ type: REMOVE_WISHLIST_ITEM_FAILURE, data });
export const addItemToCart = data => ({ type: ADD_ITEM_CART, data });
export const addItemToCartSuccess = data => ({ type: ADD_ITEM_CART_SUCCESS, data });
export const addItemToCartFailure = data => ({ type: ADD_ITEM_CART_FAILURE, data });
export const fetchMiniCartSuccess = data => ({ type: FETCH_MINI_CART_SUCCESS, data });
