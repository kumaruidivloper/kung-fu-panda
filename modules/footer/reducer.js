import { combineReducers } from 'redux';
import { SHOW_SIGNUP_MODAL, HIDE_SIGNUP_MODAL } from './constants';

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const modalStatus = (state = false, action) => {
  switch (action.type) {
    case SHOW_SIGNUP_MODAL:
      return true;
    case HIDE_SIGNUP_MODAL:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  modalStatus
});
