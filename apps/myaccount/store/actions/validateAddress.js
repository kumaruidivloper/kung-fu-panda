import { VALIDATE_ADDRESS_REQUEST, VALIDATE_ADDRESS_SUCCESS, VALIDATE_ADDRESS_FAILURE, INVALIDATE_ADDRESS_VALIDATION } from './../../myaccount.constants';

export function validateAddress(data) {
 return {
   type: VALIDATE_ADDRESS_REQUEST,
   data
 };
}
export function validateAddressSuccess(data) {
 return {
   type: VALIDATE_ADDRESS_SUCCESS,
   data
 };
}
export function validateAddressError(data) {
 return {
   type: VALIDATE_ADDRESS_FAILURE,
   data
 };
}
export function inValidateAddressVerification() {
  return {
    type: INVALIDATE_ADDRESS_VALIDATION
  };
}
