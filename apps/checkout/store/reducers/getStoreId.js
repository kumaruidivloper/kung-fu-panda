import {
    MY_STORE_DETAILS
  } from './../../../../modules/findAStoreModalRTwo/constants';
  export const getStoreId = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case MY_STORE_DETAILS:
        return Object.assign({}, state, { isFetching: true, error: false, data: action.data });
      default:
        return state;
    }
  };
