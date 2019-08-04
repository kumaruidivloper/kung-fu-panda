import { POST_PAYPAL_REQUEST, POST_PAYPAL_SUCCESS, POST_PAYPAL_FAILURE } from './../../checkout.constants';

export const postPayPalData = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case POST_PAYPAL_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false, data: action.data });

    case POST_PAYPAL_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case POST_PAYPAL_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true });

    default:
      return state;
  }
};
