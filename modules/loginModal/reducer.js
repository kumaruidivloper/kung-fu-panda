import { combineReducers } from 'redux';
import {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  INVALIDATE_SIGN_IN,
  HIDE_SIGNIN_MODAL,
  SHOW_SIGNIN_MODAL
} from './constants';

const loginInfoStatus = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case SIGN_IN_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false });
    case SIGN_IN_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
    case SIGN_IN_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true, data: action.error });
    case INVALIDATE_SIGN_IN:
      return Object.assign({}, state, { isFetching: false, error: false, data: {} });
    case HIDE_SIGNIN_MODAL:
      return Object.assign({}, state, { modalStatus: false });
    case SHOW_SIGNIN_MODAL:
      return Object.assign({}, state, { modalStatus: true });
    default:
      return state;
  }
};

export default combineReducers({
  loginInfoStatus
});
