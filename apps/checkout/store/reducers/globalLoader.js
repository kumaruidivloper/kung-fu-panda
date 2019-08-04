import { LOADING_TRUE, LOADING_FALSE } from './../../checkout.constants';

export const globalLoader = (state = { isFetching: false }, action) => {
    switch (action.type) {
      case LOADING_TRUE:
        return Object.assign({}, state, { isFetching: true });
      case LOADING_FALSE:
        return Object.assign({}, state, { isFetching: false });
      default:
        return state;
    }
  };
