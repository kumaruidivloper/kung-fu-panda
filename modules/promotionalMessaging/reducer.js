import { combineReducers } from 'redux';
import { PROMOCODE_ERROR, PROMOCODE_SUCCESS } from './constants';

export const promocodeAPIDetails = (state = {}, action) => {
  switch (action.type) {
    case PROMOCODE_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false });
    case PROMOCODE_ERROR:
      return Object.assign({}, state, { isFetching: false, error: true, errorInfo: action.data && action.data.data });
    default:
      return state;
  }
};

export default combineReducers({ promocodeAPIDetails });
