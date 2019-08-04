import { CREATE_WISHLIST_SUCCESS, RENAME_WISHLIST_SUCCESS, RENAME_WISHLIST_FAILURE, CREATE_WISHLIST_FAILURE } from '../../createWishList/constants';
import { USER_WISHLIST_DATA, USER_WISHLIST_DATA_ERROR } from '../../wishlistLanding/constants';
import { SHARE_WISHLIST_SUCCESS, SHARE_WISHLIST_FAILURE } from '../../shareDeleteWishlist/constants';
import { DELETE_WISHLIST_SUCCESS, DELETE_WISHLIST, DELETE_WISHLIST_FAILURE } from '../../wishlistDeleteModal/constants';
export const createWishListStatus = (state = { createError: false, renameError: false, createErrorKey: '', renameErrorKey: '', data: {} }, action) => {
  switch (action.type) {
    case CREATE_WISHLIST_SUCCESS:
      return Object.assign({}, state, { data: action.data });
    case RENAME_WISHLIST_SUCCESS:
      return Object.assign({}, state, { data: action.data });
    case RENAME_WISHLIST_FAILURE:
      return Object.assign({}, state, { renameError: true, renameErrorKey: action.data });
    case CREATE_WISHLIST_FAILURE:
      return Object.assign({}, state, { createError: true, createErrorKey: action.data });
    default:
        return state;
  }
};

export const userWishListStatus = (state = { data: {} }, action) => {
    switch (action.type) {
        case USER_WISHLIST_DATA:
            return Object.assign({}, state, { data: action.data });
        case USER_WISHLIST_DATA_ERROR:
        return Object.assign({}, state, { error: true, errorKey: action.data });
        default:
            return state;
    }
};


export const shareWishlist = (state = { error: false, data: {} }, action) => {
  switch (action.type) {
    case SHARE_WISHLIST_SUCCESS:
      return Object.assign({}, state, { error: false, data: action.data });
    case SHARE_WISHLIST_FAILURE:
      return Object.assign({}, state, { error: true, errorKey: action.data, data: {} });
    default:
      return state;
  }
};

export const deleteWishlist = (state = { data: {}, isdeleted: false, error: false, errorKey: '' }, action) => {
  switch (action.type) {
    case DELETE_WISHLIST_SUCCESS:
      return Object.assign({}, state, { data: action.data, isdeleted: true, error: false });
    case DELETE_WISHLIST:
      return Object.assign({}, state, { data: action.data, isdeleted: false, error: false });
    case DELETE_WISHLIST_FAILURE:
    return Object.assign({}, state, { data: {}, isdeleted: false, error: true, errorKey: action.data });
    default:
      return state;
  }
};

