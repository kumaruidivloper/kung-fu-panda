import { combineReducers } from 'redux';
import { SAVE_PRODUCT_SUCCESS } from '../types';

export const productItem = (state = null, action) => {
  switch (action.type) {
    case SAVE_PRODUCT_SUCCESS:
      return action.data;
    default:
      return state;
  }
};

export default combineReducers({
  productItem
});
