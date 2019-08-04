import { FETCH_STORE_ADDRESS_REQUEST, FETCH_STORE_ADDRESS_SUCCESS, FETCH_STORE_ADDRESS_FAILURE } from './../../checkout.constants';

export function getStoreAddress(data) {
  return {
    type: FETCH_STORE_ADDRESS_REQUEST,
    data
  };
}
export function getStoreAddressSuccess(data) {
  return {
    type: FETCH_STORE_ADDRESS_SUCCESS,
    data
  };
}
export function getStoreAddressError(error) {
  return {
    type: FETCH_STORE_ADDRESS_FAILURE,
    error
  };
}
