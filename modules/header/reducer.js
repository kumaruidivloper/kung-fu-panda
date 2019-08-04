import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { combineReducers } from 'redux';
import {
  SAVE_AUTO_SUGGESTIONS,
  SAVE_VISUAL_CATEGORIES_BRANDS,
  FETCH_MINI_CART_SUCCESS,
  TOGGLE_HAMBURGER,
  MOBILE_MENU_ITEMS,
  FOCUS_SEARCH_INPUT_DEFAULT,
  BREADCRUMB_STATE,
  TOGGLE_GLOBAL_LOADER
} from './constants';
/* **** Header --- Search Defaults **** */
const searchDefaults = {
  autoSuggestions: null,
  visualBrandsSuggestions: null
};
export const search = (state = searchDefaults, action) => {
  switch (action.type) {
    case SAVE_AUTO_SUGGESTIONS:
      return { ...state, autoSuggestions: action.data };
    case SAVE_VISUAL_CATEGORIES_BRANDS:
      return { ...state, visualCategoriesBrands: action.data };
    default:
      return state;
  }
};
/* **** Header --- Mini Cart **** */
export const miniCart = (state = {}, action) => {
  switch (action.type) {
    case FETCH_MINI_CART_SUCCESS:
      return (action && action.data) || null;
    default:
      return state;
  }
};
/* **** Header Hamburger **** */
export const isHamburgerActive = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_HAMBURGER:
      return {
        ...state,
        active: !state.active
      };
    default:
      return state;
  }
};
/* ***** Header Find A Store ***** */

/* ***** Header Find A Store ***** */
export const mobileMenu = (state = {}, action) => {
  switch (action.type) {
    case MOBILE_MENU_ITEMS:
      return action.params;
    case FOCUS_SEARCH_INPUT_DEFAULT:
      return action.params;
    default:
      return state;
  }
};
export const breadCrumb = (state = '/', action) => {
  switch (action.type) {
    case BREADCRUMB_STATE:
      if (ExecutionEnvironment.canUseDOM) {
        return window.location.pathname;
      }
      return state;
    default:
      return state;
  }
};

export const showLoader = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_GLOBAL_LOADER: {
      return action.flag;
    }
    default:
      return state;
  }
};
export default combineReducers({
  search,
  miniCart,
  isHamburgerActive,
  mobileMenu,
  breadCrumb,
  showLoader
});
