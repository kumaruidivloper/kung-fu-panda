import {
  FETCH_SHIPPING_ADDRESS_REQUEST,
  FETCH_SHIPPING_ADDRESS_SUCCESS,
  FETCH_SHIPPING_ADDRESS_FAILURE,
  INVALIDATE_SHIPPING_ADDRESS,
  ADD_SHIPPING_ADDRESS_REQUEST,
  ADD_SHIPPING_ADDRESS_SUCCESS,
  ADD_SHIPPING_ADDRESS_FAILURE
} from './../../checkout.constants';

export const savedShippingAddress = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case FETCH_SHIPPING_ADDRESS_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false });

    case FETCH_SHIPPING_ADDRESS_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case FETCH_SHIPPING_ADDRESS_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true });

    case INVALIDATE_SHIPPING_ADDRESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: {} });
    default:
      return state;
  }
};

export const addShippingAddress = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case ADD_SHIPPING_ADDRESS_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false });

    case ADD_SHIPPING_ADDRESS_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case ADD_SHIPPING_ADDRESS_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true, data: action.data });
    default:
      return state;
  }
};
