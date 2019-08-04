import { combineReducers } from 'redux';
import { SAVE_PRODUCT_INFO } from '../types';

export const info = (state = {}, action) => {
  switch (action.type) {
    case SAVE_PRODUCT_INFO:
      return action.data;
    default:
      return state;
  }
};

export default combineReducers({
  info
});
