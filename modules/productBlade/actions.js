import {
  UPDATE_SHIPPING_MODE,
  UPDATE_SHIPPING_MODE_ERROR,
  LOAD_CART,
  UPDATE_QTY,
  UPDATE_QTY_ERROR,
  REMOVE_ITEM,
  REMOVE_ITEM_ERROR,
  REMOVE_CART_MSG,
  ADD_MSG,
  ADD_TO_WISH_LIST,
  WISH_LIST_ERROR,
  UNDO_ACTION_ERROR,
  SHOW_LOADER,
  HIDE_LOADER,
  PICKUP_SELECTED,
  PICKUP_UNSELECTED,
  UPDATE_QTY_SUCCESS,
  REMOVE_ITEM_WISHLIST,
  REMOVE_MESSAGE_DELAY
} from './constants';

/**
 * Action to reload the cart, if changes occured in product blade.
 * @param {object} data Object will be a information of product
 */
export const loadCart = data => ({
  type: LOAD_CART,
  data
});

export const updateShippingMode = data => ({
  type: UPDATE_SHIPPING_MODE,
  data
});

export const updateShippingModeError = error => ({
  type: UPDATE_SHIPPING_MODE_ERROR,
  error
});

export const addMessages = data => ({
  type: ADD_MSG,
  data
});

export const removeMessages = data => ({
  type: REMOVE_CART_MSG,
  data
});

export const removeMessageWithDelay = data => ({
  type: REMOVE_MESSAGE_DELAY,
  data
});

export const updateQty = data => ({
  type: UPDATE_QTY,
  data
});

export const qtyUpdatingError = error => ({
  type: UPDATE_QTY_ERROR,
  error
});

/**
 * Action will trigger after the quantity update in product blade
 * @param {object} data
 */
export const qtyUpdateSuccess = data => ({
  type: UPDATE_QTY_SUCCESS,
  data
});

export const removeItem = data => ({
  type: REMOVE_ITEM,
  data
});

export const removeItemError = error => ({
  type: REMOVE_ITEM_ERROR,
  error
});

export const addToWishList = data => ({
  type: ADD_TO_WISH_LIST,
  data
});

export const wishListError = error => ({
  type: WISH_LIST_ERROR,
  error
});

export const undoError = error => ({
  type: UNDO_ACTION_ERROR,
  error
});

export const showLoader = data => ({
  type: SHOW_LOADER,
  data
});

export const hideLoader = data => ({
  type: HIDE_LOADER,
  data
});

export const pickUpStoreSelected = () => ({
  type: PICKUP_SELECTED,
  data: true
});

export const pickUpStoreUnSelected = () => ({
  type: PICKUP_UNSELECTED,
  data: false
});

/**
 * Action trigger for remove item from wishlist
 * @param {object} data Contains wishlist ids
 */
export const removeWishListItem = data => ({
  type: REMOVE_ITEM_WISHLIST,
  data
});
