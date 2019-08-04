import { FETCH_SAVED_CARDS_REQUEST, FETCH_SAVED_CARDS_SUCCESS, FETCH_SAVED_CARDS_FAILURE, CHANGE_BILLING_ADDRESS } from './../../checkout.constants';


export function fetchSavedCards(userId) {
  return {
    type: FETCH_SAVED_CARDS_REQUEST,
    userId
  };
}

export function fetchSavedCardsSuccess(data) {
  return {
    type: FETCH_SAVED_CARDS_SUCCESS,
    data
  };
}

export function fetchSavedCardsError(error) {
  return {
    type: FETCH_SAVED_CARDS_FAILURE,
    error
  };
}

export function toggleBillingAddress(flag) {
  return {
    type: CHANGE_BILLING_ADDRESS,
    flag
  };
}
