import { VALIDATE_ADDRESS_REQUEST, VALIDATE_ADDRESS_SUCCESS, VALIDATE_ADDRESS_FAILURE, INVALIDATE_ADDRESS_VALIDATION } from './../../checkout.constants';

export function validateAddress(data, orderId) {
 return {
   type: VALIDATE_ADDRESS_REQUEST,
   data,
   orderId
 };
}
export function validateAddressSuccess(data) {
 return {
   type: VALIDATE_ADDRESS_SUCCESS,
   data
 };
}
export function validateAddressError(error) {
 return {
   type: VALIDATE_ADDRESS_FAILURE,
   error
 };
}
export function inValidateAddressVerification() {
  return {
    type: INVALIDATE_ADDRESS_VALIDATION
  };
}
