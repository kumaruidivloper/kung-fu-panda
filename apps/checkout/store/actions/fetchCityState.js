import { LOAD_CITY_STATE_DATA, CITY_STATE_DATA_LOADED, ERASE_CITY_STATE_DATA, LOAD_CITY_STATE_FAILURE } from './../../checkout.constants';


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
