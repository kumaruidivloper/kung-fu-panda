export const NODE_TO_MOUNT = 'profileInformation';
export const DATA_COMP_ID = 'data-compid';
export const MOBILE_MAX_WIDTH = 992;
export const DESKTOP_MIN_WIDTH = 993;
// Get register User details
export const FETCH_INFORMATION_REQUEST = 'fetchInformationRequest';
export const FETCH_INFORMATION_SUCCESS = 'fetchInformationSuccess';
export const FETCH_INFORMATION_ERROR = 'fetchInformationError';
// Update password
export const UPDATE_PASSWORD_REQUEST = 'updatePasswordRequest';
export const UPDATE_PASSWORD_SUCCESS = 'updatePasswordSuccess';
export const UPDATE_PASSWORD_FAILURE = 'updatePasswordFailure';
export const SET_PASSWORD = 'setPasswordFlag';
export const CLOSE_MESSAGE = 'closePasswordMessage';
// Update Info
export const UPDATE_INFORMATION_REQUEST = 'updateInformationRequest';
export const UPDATE_INFORMATION_SUCCESS = 'updateInformationSuccess';
export const UPDATE_INFORMATION_FAILURE = 'updateInformationFailure';
export const SET_EDIT_INFO = 'setEditInfoFlag';
export const CLOSE_PROFILE_MESSAGE = 'closeProfileMessafe';
// api error codes
export const API_SUCCESS_CODE = 200;
export const POST_API_SUCCESS_CODE = 201;
export const DELETE_API_SUCCESS_CODE = 204;
export const BACK_TO_PROFILE_LABEL = 'Back to Profile';
export const PROFILE_EDIT_FORM = 'profileNameForm';
export const UPDATE_PASSWORD = 'updatePassword';
export const BACK_TO_PROFILE_PAGE = 'backToProfilePage';
// storeID
export const STORE_ID = 'storeId';
export const SHOW_LABEL = 'SHOW';
export const HIDE_LABEL = 'HIDE';
// editPass for alert box
export const EDIT_PASS = 'editPass';
// time out const
export const TIME_OUT_SEC = 5000;
// analytics constants
export const ANALYTICS_EVENT_IN = 'myaccount';
export const ANALYTICS_EVENT_CATEGORY = 'user account';
export const analyticsEventAction = {
  PROFILE: 'profile',
  CHANGE_PERSONAL_INFO: 'change personal information'
};
export const analyticsEventLabel = {
  PASSWORD_CHANGED: 'password changed',
  EDIT_PERSONAL_INFO: 'edit personal information'
};
export const ANALYTICS_ERR_EVENT_NAME = 'errormessage';
export const ANALYTICS_ERR_EVENT_CATEGORY = 'error message';
export const ANALYTICS_ERR_EVENT_ACTION = 'validation error|profile edit';
