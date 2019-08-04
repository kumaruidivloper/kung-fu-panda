import { combineReducers } from 'redux';
import { FETCH_WISHLIST_ITEMS_SUCCESS, FETCH_WISHLIST_ITEMS_FAILURE, REMOVE_WISHLIST_ITEM_SUCCESS, REMOVE_WISHLIST_ITEM_FAILURE, ADD_ITEM_CART_SUCCESS, ADD_ITEM_CART_FAILURE } from './constants';

const fetchWishlistItems = (state = { error: false, errorKey: '', data: {} }, action) => {
  switch (action.type) {
    case FETCH_WISHLIST_ITEMS_SUCCESS:
      return Object.assign({}, state, { data: action.data });
    case FETCH_WISHLIST_ITEMS_FAILURE:
      return Object.assign({}, state, { error: true, errorKey: action.data, data: {} });
    default:
      return state;
  }
};

const deleteWishlistItem = (state = { error: false, errorKey: '', data: {} }, action) => {
  switch (action.type) {
    case REMOVE_WISHLIST_ITEM_SUCCESS:
      return Object.assign({}, state, { data: action.data });
    case REMOVE_WISHLIST_ITEM_FAILURE:
      return Object.assign({}, state, { error: true, errorKey: action.data, data: {} });
    default:
      return state;
  }
};

const addItemToCart = (state = { error: false, errorKey: '', data: {} }, action) => {
  switch (action.type) {
    case ADD_ITEM_CART_SUCCESS:
     return Object.assign({}, state, { data: action.data });
    case ADD_ITEM_CART_FAILURE:
     return Object.assign({}, state, { error: true, errorKey: action.data, data: {} });
    default:
    return state;
  }
};

export default combineReducers({
  fetchWishlistItems,
  deleteWishlistItem,
  addItemToCart
});
