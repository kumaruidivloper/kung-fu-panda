import { combineReducers } from 'redux';
import { LOAD_SITE_MAP_DETAILS_SUCCESS } from './constants';

/**
 * gettign site map details
 * @param state
 * @param action
 * @returns {*}
 */
export const siteMapdetails = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SITE_MAP_DETAILS_SUCCESS:
      return action.data;
    default:
      return state;
  }
};

/**
 * combine the reducers
 */
export default combineReducers({
  siteMapdetails
});
