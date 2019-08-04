import { FETCH_BILLING_ADDRESS_REQUEST, FETCH_BILLING_ADDRESS_SUCCESS, FETCH_BILLING_ADDRESS_FAILURE } from './../../checkout.constants';


export function fetchSavedBillingAddress() {
  return {
    type: FETCH_BILLING_ADDRESS_REQUEST
  };
}

export function fetchSavedBillingAddressSuccess(data) {
  return {
    type: FETCH_BILLING_ADDRESS_SUCCESS,
    data
  };
}

export function fetchSavedBillingAddressError(error) {
  return {
    type: FETCH_BILLING_ADDRESS_FAILURE,
    error
  };
}
