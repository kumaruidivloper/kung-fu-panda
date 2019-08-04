import { combineReducers } from 'redux';
import {
  SET_OPEN,
  ERROR,
  CLEAR_ERROR,
  SET_SEOURL,
  SET_PRODUCT,
  SET_ON_CLOSE_FOCUS_ID,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_ERROR,
  FETCH_INVENTORY_ERROR
} from './constants';

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const open = (state = false, action) => {
  switch (action.type) {
    case SET_OPEN:
      return action.open;
    default:
      return state;
  }
};

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const product = (state = null, action) => {
  switch (action.type) {
    case SET_PRODUCT:
      return action.data;
    case FETCH_PRODUCT_SUCCESS:
      return action.data;
    default:
      return state;
  }
};

const error = (state = null, action) => {
  switch (action.type) {
    case FETCH_PRODUCT_ERROR:
      return action.error;
    case ERROR:
      return action.error;
    case CLEAR_ERROR:
      return null;
    default:
      return state;
  }
};

const errorInventoryRequest = (state = null, action) => {
  switch (action.type) {
    case FETCH_INVENTORY_ERROR:
      return action.error;
    case CLEAR_ERROR:
      return null;
    default:
      return state;
  }
};

const seoURL = (state = null, action) => {
  switch (action.type) {
    case SET_SEOURL:
      return action.seoURL;
    default:
      return state;
  }
};

const onCloseFocusId = (state = null, action) => {
  switch (action.type) {
    case SET_ON_CLOSE_FOCUS_ID:
      return action.onCloseFocusId;
    default:
      return state;
  }
};

/**
 * combine the reducers
 */
export default combineReducers({
  open,
  product,
  error,
  errorInventoryRequest,
  seoURL,
  onCloseFocusId
});
