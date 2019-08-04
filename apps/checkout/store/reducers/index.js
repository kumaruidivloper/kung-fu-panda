import { combineReducers } from 'redux';
import {
  MARK_SECTION_COMPLETED,
  MARK_SECTION_EDIT,
  PAGE_SECTIONS,
  FETCH_PAGE_DATA_REQUEST,
  FETCH_PAGE_DATA_SUCCESS,
  FETCH_PAGE_DATA_FAILURE,
  INVALIDATE_PAGE_DATA_FAILURE,
  SET_AUTH_STATUS
} from './../../checkout.constants';
import { savedShippingAddress, addShippingAddress } from './savedShippingAddress';
import { validateAddress } from './validateAddress';
import { savedBillingAddress } from './savedBillingAddress';
import { fetchCityStateFromZipCode } from './getCityStateReducer';
import { savedCreditCards, changeBillingAddress } from './savedCreditCards';
import { postPaymentData } from './postPaymentData';
import { giftCardData } from './giftCard';
import { savedGiftCards } from './fetchGiftCard';
import { savedShippingModes, validateShippingModes } from './shippingModes';
import { placeOrder } from './placeOrder';
import { globalLoader } from './globalLoader';
import { pickupInStore } from './pickupInStore';
import { shipToStore } from './shipToStore';
import { checkoutInventory } from './checkoutInventory';
import { storeAddress } from './getStoreAddress';
import { postPayPalData } from './postPayPalData';
import { getStoreId } from './getStoreId';
import { checkoutRemoveOrderItem } from './removeOrderItem';
let filteredSections;

const pageState = (state = {}, action) => {
  switch (action.type) {
    case FETCH_PAGE_DATA_SUCCESS: {
      const { checkoutStates } = action.data.orders[0];
      let pageObj = {};
      filteredSections = PAGE_SECTIONS.filter(item => Object.keys(checkoutStates).includes(item));
      // filter checkoutStates coming from Order Details json based on the PAGE_SECTIONS so that it has only those drawers defined in the constants
      // const availableDrawers = Object.keys(checkoutStates).filter(drawer => (PAGE_SECTIONS.indexOf(drawer) > -1)); // eslint-disable-line
      Object.keys(filteredSections).forEach((prop, index) => {
        // get all the drawers present above the current one
        const prevDrawers = filteredSections.slice(0, (index + 1));
        // check if any of the drawers has require=true state
        const isAnyDrawerStatRequired = prevDrawers.find(section => (checkoutStates[section] === true));
        // get the current drawer based on the index
        const pageSec = filteredSections[index];
        // set edit=false for all the drawers
        // set required state based on checkoutStates from Order Details json
        // set showEditLink=true if any of the above drawers have required=true
        pageObj = Object.assign({}, pageObj, { [pageSec]: { required: checkoutStates[pageSec], edit: false, showEditLink: (typeof isAnyDrawerStatRequired === typeof undefined) } });
      });

      // get the first drawer with required=true
      const nextSectionName = filteredSections.find(section => (pageObj[section].required === true));
      // for the first item nextSectionName is undefined, so return pageObj else return the pageObj with first drawer set t0 edit=true
      if (typeof nextSectionName === typeof undefined) {
        return pageObj;
      }
      return Object.assign({}, pageObj, { [nextSectionName]: Object.assign({}, pageObj[nextSectionName], { edit: true }) });
    }
    case MARK_SECTION_COMPLETED: {
      // on submit of a section
      const currentSection = Object.assign({}, state, { [action.pageSection]: { required: false, edit: false } });
      const updatedState = Object.assign({}, state, currentSection);
      const nextSectionName = filteredSections.find(section => updatedState[section].required === true);
      if (nextSectionName !== undefined) {
        // if any of the sections is yet to be filled in
        const resetCurrentSection = Object.assign({}, updatedState, { [nextSectionName]: Object.assign({}, state[nextSectionName], { edit: true }) });
        return Object.assign({}, state, resetCurrentSection);
      }
      return Object.assign({}, state, updatedState); // if all the sections are filled
    }
    case MARK_SECTION_EDIT: {
      // on click of edit link present in any other section
      const getCurrentSection = filteredSections.find(section => state[section].edit === true);
      const resetCurrentSection = Object.assign({}, state, { [getCurrentSection]: Object.assign({}, state[getCurrentSection], { edit: false }) });
      const toggleTaregtSection = Object.assign({}, resetCurrentSection, {
        [action.pageSection]: Object.assign({}, state[action.pageSection], { edit: true })
      });
      return toggleTaregtSection;
    }
    default:
      return state;
  }
};
export const orderDetails = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case FETCH_PAGE_DATA_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false });

    case FETCH_PAGE_DATA_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case FETCH_PAGE_DATA_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true });

    case INVALIDATE_PAGE_DATA_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.error });
    default:
      return state;
  }
};
export const authStatus = (state = { isLoggedIn: false }, action) => {
  switch (action.type) {
    case SET_AUTH_STATUS: {
      return Object.assign({}, state, { isLoggedIn: action.flag });
    }
    default:
      return state;
  }
};

export default combineReducers({
  orderDetails,
  authStatus,
  pageState,
  savedShippingModes,
  addShippingAddress,
  validateShippingModes,
  savedShippingAddress,
  validateAddress,
  savedBillingAddress,
  giftCardData,
  savedGiftCards,
  fetchCityStateFromZipCode,
  savedCreditCards,
  changeBillingAddress,
  postPaymentData,
  placeOrder,
  globalLoader,
  pickupInStore,
  shipToStore,
  storeAddress,
  postPayPalData,
  getStoreId,
  checkoutRemoveOrderItem,
  checkoutInventory
});
