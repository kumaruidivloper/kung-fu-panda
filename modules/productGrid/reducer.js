import { combineReducers } from 'redux';
import {
  FETCH_PRODUCTS_SUCCESS,
  UPDATE_SELECTED_FACETS,
  UPDATE_FACETS,
  LABEL_REMOVE,
  LABEL_ADD,
  LABEL_REPLACE
} from './constants';

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const recordSetCount = (state = '0', action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return action.data.recordSetCount || state;
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
const recordSetTotal = (state = '0', action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return action.data.recordSetTotal || state;
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
const productinfo = (state = [], action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return action.data.productinfo || state;
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
const sortByInfo = (state = [], action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return action.data.sortByInfo || state;
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
const facets = (state = [], action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return (action.data && action.data.facets) || state;
    case UPDATE_FACETS:
      return action.facets || state;
    default:
      return state;
  }
};

/**
 * The reducer method to update selected facets in sore
 * @param state
 * @param action
 * @returns {*}
 */
const selectedFacets = (state = [], action) => {
  const { data, mode } = action;
  if (action.type === UPDATE_SELECTED_FACETS) {
    if (data && mode === LABEL_ADD) {
      return state.concat(data);
    } else if (data && mode === LABEL_REMOVE) {
      return state.filter(item => item.selectedLabelId !== data.selectedLabelId);
    } else if (data && mode === LABEL_REPLACE) {
      return [...state.filter(item => item.selectedLabelId !== data.currentSelectedLabelId), data];
    }
    return [];
  }
  return state;
};

/**
 * combine the reducers
 */
export default combineReducers({
  recordSetCount,
  recordSetTotal,
  productinfo,
  sortByInfo,
  facets,
  selectedFacets
});
