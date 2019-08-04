import { SAVE_ZIP_CODE, LOAD_CITY_STATE_DATA, ERASE_CITY_STATE_DATA, LOADED_CITY_STATE_DATA, LOAD_BILLING_ADDRESSES } from './../../checkout.constants';

export const loadCityStateReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_CITY_STATE_DATA:
      return action.data;
    case ERASE_CITY_STATE_DATA:
      return [];
    case LOADED_CITY_STATE_DATA:
      return action.data;
    default:
      return state;
  }
};

export const loadSavedBillingAddresses = (state = [], action) => {
  switch (action.type) {
    case LOAD_BILLING_ADDRESSES:
      return action.data;
    default:
      return state;
  }
};

export const saveZipCodeReducer = (state = [], action) => {
  switch (action.type) {
    case SAVE_ZIP_CODE:
      return action.data;
    default:
      return state;
  }
};
