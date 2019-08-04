import {
  LOAD_CITY_STATE_DATA,
  CITY_STATE_DATA_LOADED,
  LOAD_CITY_STATE_FAILURE,
  ERASE_CITY_STATE_DATA
} from './../../checkout.constants';

export const fetchCityStateFromZipCode = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case LOAD_CITY_STATE_DATA:
      return Object.assign({}, state, { isFetching: true, error: false });

    case CITY_STATE_DATA_LOADED:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case LOAD_CITY_STATE_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true, data: action.error });

    case ERASE_CITY_STATE_DATA:
      return Object.assign({}, state, { isFetching: false, error: true, data: {} });

    default:
      return state;
  }
};
