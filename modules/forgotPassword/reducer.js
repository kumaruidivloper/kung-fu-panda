// import { combineReducers } from 'redux';
import { FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_ERROR, CLEAR_DATA } from './constants';
/**
 * Handling Error Code
 */
/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const forgotPasswordInfoStatus = (state = { userId: '', serverError: false, successPage: false, errorCode: null }, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD_SUCCESS:
      return Object.assign({}, state, { userId: action.data, serverError: false, successPage: true, errorCode: '' });
    case FORGOT_PASSWORD_ERROR:
      return Object.assign({}, state, { userId: '', serverError: true, successPage: false, errorCode: action.data });
    case CLEAR_DATA:
      return Object.assign({}, state, { userId: '', serverError: false, successPage: false, errorCode: '' });
    default:
      return state;
  }
};

// export default combineReducers({
//   forgotPasswordInfoStatus
// });
