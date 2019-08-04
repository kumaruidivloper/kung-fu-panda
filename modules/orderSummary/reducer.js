import { combineReducers } from 'redux';
import { ZIP_VALIDATION_SUCCESS, ZIP_VALIDATION_FAILED, ZIP_VALIDATION } from './constants';

export const zipCodeValidation = (state = {}, action) => {
  switch (action.type) {
    case ZIP_VALIDATION:
      return Object.assign({}, state, { isFetching: true, error: false, errorInfo: {} });
    case ZIP_VALIDATION_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, errorInfo: {} });
    case ZIP_VALIDATION_FAILED:
      return Object.assign({}, state, { isFetching: false, error: true, errorInfo: action.data });
    default:
      return state;
  }
};

export default combineReducers({
  zipCodeValidation
});
