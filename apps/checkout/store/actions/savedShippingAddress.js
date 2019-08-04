import { FETCH_SHIPPING_ADDRESS_REQUEST, FETCH_SHIPPING_ADDRESS_SUCCESS, FETCH_SHIPPING_ADDRESS_FAILURE, ADD_SHIPPING_ADDRESS_REQUEST, ADD_SHIPPING_ADDRESS_SUCCESS, ADD_SHIPPING_ADDRESS_FAILURE, INVALIDATE_SHIPPING_ADDRESS } from './../../checkout.constants';


export function fetchSavedShippingAddress(userId) {
  return {
    type: FETCH_SHIPPING_ADDRESS_REQUEST,
    userId
  };
}

export function fetchSavedShippingAddressSuccess(data) {
  return {
    type: FETCH_SHIPPING_ADDRESS_SUCCESS,
    data
  };
}

export function invalidateShippingAddress() {
  return {
    type: INVALIDATE_SHIPPING_ADDRESS
  };
}

export function fetchSavedShippingAddressError(error) {
  return {
    type: FETCH_SHIPPING_ADDRESS_FAILURE,
    error
  };
}

export function addshippingAddress(data, orderid, isAddressVerified) {
  return {
    type: ADD_SHIPPING_ADDRESS_REQUEST,
    data,
    orderid,
    isAddressVerified
  };
}

export function addshippingAddressSuccess(data) {
  return {
    type: ADD_SHIPPING_ADDRESS_SUCCESS,
    data
  };
}

export function addshippingAddressError(data) {
  return {
    type: ADD_SHIPPING_ADDRESS_FAILURE,
    data
  };
}
