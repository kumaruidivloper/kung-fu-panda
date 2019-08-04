import { LOAD_CITY_STATE_DATA, ERASE_CITY_STATE_DATA, LOADED_CITY_STATE_DATA, SAVE_ZIP_CODE, LOAD_BILLING_ADDRESSES, BILLING_ADDRESSES_LOADED } from '../../apps/checkout/checkout.constants';

export const loadCityStateData = data => ({ type: LOAD_CITY_STATE_DATA, data });
export const cityStateDataLoaded = data => ({ type: LOADED_CITY_STATE_DATA, data });
export const eraseCityStateData = () => ({ type: ERASE_CITY_STATE_DATA });
export const saveZipCode = data => ({ type: SAVE_ZIP_CODE, data });
export const loadSavedBillingAddresses = data => ({ type: LOAD_BILLING_ADDRESSES, data });
export const billingAddressesLoaded = data => ({ type: BILLING_ADDRESSES_LOADED, data });
