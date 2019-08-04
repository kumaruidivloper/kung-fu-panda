import { combineReducers } from 'redux';
import { PRE_SCREEN_CALL_SUCCESS, PRE_SCREEN_CALL_REQUEST, PRE_SCREEN_CALL_FAILURE } from './constants';

export const preScreen = (state = { data: {}, isRegistered: false, error: false, errorCode: '' }, action) => {
  switch (action.type) {
    case PRE_SCREEN_CALL_SUCCESS:
      return Object.assign({}, state, { data: action.data, error: false, errorCode: '' });
    case PRE_SCREEN_CALL_REQUEST:
      return Object.assign({}, state, { data: action.data, error: false, errorCode: '' });
    case PRE_SCREEN_CALL_FAILURE:
    return Object.assign({}, state, { data: {}, error: true, errorCode: action.data });
    default:
      return state;
  }
};

export default combineReducers({
  preScreen
});
