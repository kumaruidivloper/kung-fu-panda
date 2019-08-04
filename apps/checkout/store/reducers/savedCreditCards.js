import {
  FETCH_SAVED_CARDS_REQUEST,
  FETCH_SAVED_CARDS_SUCCESS,
  FETCH_SAVED_CARDS_FAILURE,
  INVALIDATE_SAVED_CARDS,
  CHANGE_BILLING_ADDRESS
} from './../../checkout.constants';

export const savedCreditCards = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case FETCH_SAVED_CARDS_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false });

    case FETCH_SAVED_CARDS_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case FETCH_SAVED_CARDS_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true });

    case INVALIDATE_SAVED_CARDS:
      return Object.assign({}, state, { isFetching: false, error: false, data: {} });
    default:
      return state;
  }
};

export const changeBillingAddress = (state = false, action) => {
  switch (action.type) {
    case CHANGE_BILLING_ADDRESS: {
      return action.flag;
    }
    default:
      return state;
  }
};
