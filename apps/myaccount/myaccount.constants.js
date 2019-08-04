export const NODE_TO_MOUNT = 'myaccount';
export const DATA_COMP_ID = 'data-compid';
// Address book related constants
// fetch city/state via zip code
export const LOAD_CITY_STATE_DATA = 'my account/load city state';
export const CITY_STATE_DATA_LOADED = 'my account/city state loaded';
export const LOAD_CITY_STATE_FAILURE = 'my account/city state loading failure';
export const ERASE_CITY_STATE_DATA = 'my account/erase city state data';
// validate address
export const VALIDATE_ADDRESS_REQUEST = 'my account/validate new address';
export const VALIDATE_ADDRESS_SUCCESS = 'my account/validate new success';
export const VALIDATE_ADDRESS_FAILURE = 'my account/validate new fail';
export const INVALIDATE_ADDRESS_VALIDATION = 'my account/invalidate address validation';
// api error codes
export const API_SUCCESS_CODE = 200;
export const POST_API_SUCCESS_CODE = 201;
export const DELETE_API_SUCCESS_CODE = 204;
// address book details
export const LOAD_ADDRESS_DATA = 'my account/load address';
export const LOAD_ADDRESS_DATA_SUCCESS = 'my account/load address data success';
export const LOAD_ADDRESS_DATA_FAILURE = 'my account/load address data fail';
export const POST_ADDRESS_DATA = 'my account/post address data';
export const ADDRESS_DATA_ERROR = 'my account/address data error';
export const TOGGLE_FORM_DATA = 'my account/toggle address form';
export const TOGGLE_EDIT_FORM = 'my account/toggle edit adddress form';
export const DELETE_ADDRESS = 'my account/delete adddress';
export const EDIT_ADDRESS = 'my account/ edit address';
export const TOGGLE_ALERT = 'my account/show remove alert';
export const MY_ACCOUNT_DATA = 'my account/my account initial data';
export const MY_ACCOUNT_DATA_SUCCESS = 'my account/my account data fetch success';
export const MY_ACCOUNT_DATA_FAILURE = 'my account/my account data fetch failure';
export const SET_DEFAULT = 'my account/set address as default';
export const DEFAULT_KEY = '_ERR_DEFAULT_KEY';

export const LOADING_TRUE = 'myaccount/loading data';
export const LOADING_FALSE = 'myaccount/loaded data';

export const SHOW_LABEL = 'SHOW';
export const HIDE_LABEL = 'HIDE';

export const CREATE_PASSWORD_LINK = '/shop/createpassword';
// for bread crumb state
export const BREAD_CRUMB = 'bread-crumb';
export const BTN_LABEL_FONT_SIZE = '1rem';
export const INLINE_BUTTON_FONT_SIZE = '0.75rem';
export const MOBILE_BREAD_CRUMB_TITLE = 'Academy';

export const PAGE_TOP_ELEMENT_QUERY_SELECTOR = '[data-component="myaccount"]';
export const SCROLL_TO_TOP_OFFSET_DESKTOP = -180;
export const SCROLL_TO_TOP_OFFSET_MOBILE = -180;
export const SCROLL_TO_TOP_OFFSET = SCROLL_TO_TOP_OFFSET_DESKTOP;

export const withScrollProps = {
  pageTopElementQuerySelector: PAGE_TOP_ELEMENT_QUERY_SELECTOR,
  pageTopOffsetMobile: SCROLL_TO_TOP_OFFSET_MOBILE,
  pageTopOffsetDesktop: SCROLL_TO_TOP_OFFSET_DESKTOP
};

// for analytics data
export const EVENT_NAME = 'myaccount';
export const EVENT_CATEGORY = 'user account';
export const EVENT_LABEL = 'myaccount/';

export const MOBILE_MAX_WIDTH = 767;
export const DESKTOP_MIN_WIDTH = 768;
