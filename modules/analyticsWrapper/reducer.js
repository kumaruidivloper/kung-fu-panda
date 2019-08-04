import { combineReducers } from 'redux';
import { UPDATE_ANALYTICS } from './constants';

export const updateAnalytics = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ANALYTICS:
    return Object.assign({}, action.data);
    default:
      return state;
  }
};

export default combineReducers({
  updateAnalytics
});
