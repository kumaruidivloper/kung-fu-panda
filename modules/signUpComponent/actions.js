import { USER_REGISTER, USER_REGISTER_SUCCESS, USER_REGISTER_FAILURE, VALIDATE_ADDRESS_SIGNUP_REQUEST, VALIDATE_ADDRESS_SIGNUP_FAILURE, VALIDATE_ADDRESS_SIGNUP_SUCCESS,LOAD_CITY_STATE_DATA, CITY_STATE_DATA_LOADED,LOAD_CITY_STATE_FAILURE,ERASE_CITY_STATE_DATA } from './constants';
export const signup = data => ({ type: USER_REGISTER, data });
export const signupFailure = data => ({ type: USER_REGISTER_FAILURE, data });
export const signupSuccess = data => ({ type: USER_REGISTER_SUCCESS, data });
export const validateAddress = data => ({ type: VALIDATE_ADDRESS_SIGNUP_REQUEST, data });
export const validateAddressFailure = data => ({ type: VALIDATE_ADDRESS_SIGNUP_FAILURE, data });
export const validateAddressSuccess = data => ({ type: VALIDATE_ADDRESS_SIGNUP_SUCCESS, data });

/* Actions for getting city from zipcode */
export function loadCityStateFromZipCode(data) {
 return {
   type: LOAD_CITY_STATE_DATA,
   data
 };
}

export function fetchCityStateFromZipCodeSuccess(data) {
 return {
   type: CITY_STATE_DATA_LOADED,
   data
 };
}

export function fetchCityStateFromZipCodeError(error) {
 return {
   type: LOAD_CITY_STATE_FAILURE,
   error
 };
}

export function eraseCityStateData() {
 return {
   type: ERASE_CITY_STATE_DATA
 };
}