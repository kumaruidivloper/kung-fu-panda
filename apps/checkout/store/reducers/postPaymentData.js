import { POST_PAYMENT_REQUEST, POST_PAYMENT_SUCCESS, POST_PAYMENT_FAILURE } from './../../checkout.constants';

export const postPaymentData = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case POST_PAYMENT_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false, data: action.data });

    case POST_PAYMENT_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case POST_PAYMENT_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: action.error });

    default:
      return state;
  }
};
