import { combineReducers } from 'redux';
import { TOGGLE_SOF_MODAL } from './constants';

export const toggleSOFModalStatus = (state = { status: false, sofItems: [] }, action) => {
  switch (action.type) {
    case TOGGLE_SOF_MODAL:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
};

export default combineReducers({ toggleSOFModalStatus });
