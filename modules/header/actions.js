import {
  FETCH_AUTO_SUGGESTIONS,
  SAVE_AUTO_SUGGESTIONS,
  SAVE_VISUAL_CATEGORIES_BRANDS,
  FETCH_MINI_CART,
  FETCH_MINI_CART_SUCCESS,
  FETCH_MINI_CART_ERROR,
  TOGGLE_HAMBURGER,
  TOGGLE_MYACCOUNT_POPOVER,
  MOBILE_MENU_ITEMS,
  FOCUS_SEARCH_INPUT_DEFAULT,
  BREADCRUMB_STATE,
  TOGGLE_GLOBAL_LOADER
} from './constants';

/* **** Header Search Actions **** */
export const fetchAutoSuggestions = params => ({ type: FETCH_AUTO_SUGGESTIONS, params });
export const saveAutoSuggestions = data => ({ type: SAVE_AUTO_SUGGESTIONS, data });
export const saveVisualGuidedCategoriesBrands = data => ({ type: SAVE_VISUAL_CATEGORIES_BRANDS, data });
/* **** Header MiniCart Actions **** */
export const fetchMiniCart = () => ({ type: FETCH_MINI_CART });
export const fetchMiniCartSuccess = data => ({ type: FETCH_MINI_CART_SUCCESS, data });
export const fetchMiniCartError = error => {
  const err = error;
  return {
    type: FETCH_MINI_CART_ERROR,
    err
  };
};
/* ***** Header Hamburger Menu Icon Toggle ***** */
export const toggleHamburger = () => ({ type: TOGGLE_HAMBURGER });
/* ***** Header Find A Store ***** */

/* ****** My Account PopOver  ***** */
export const toggleMyAccountPopOver = params => ({ type: TOGGLE_MYACCOUNT_POPOVER, params });

export const getMobileMenuItems = params => ({ type: MOBILE_MENU_ITEMS, params });
export const setSearchInputFocus = params => ({ type: FOCUS_SEARCH_INPUT_DEFAULT, params });

export const getBreadCrumb = data => ({ type: BREADCRUMB_STATE, data });

export const toggleLoder = flag => ({
  type: TOGGLE_GLOBAL_LOADER,
  flag
});
