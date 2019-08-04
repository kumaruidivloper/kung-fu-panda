import {
  FETCH_BILLING_ADDRESS_REQUEST,
  FETCH_BILLING_ADDRESS_SUCCESS,
  FETCH_BILLING_ADDRESS_FAILURE,
  INVALIDATE_BILLING_ADDRESS
} from './../../checkout.constants';

export const savedBillingAddress = (state = { isFetching: false, error: false, data: {}, changeBillingAddress: false }, action) => {
  switch (action.type) {
    case FETCH_BILLING_ADDRESS_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false });

    case FETCH_BILLING_ADDRESS_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case FETCH_BILLING_ADDRESS_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true });

    case INVALIDATE_BILLING_ADDRESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: {} });
    default:
      return state;
  }
};
