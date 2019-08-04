import { combineReducers } from 'redux';
import {
  CATCH_MSG,
  REMOVE_CART_MSG,
  SHOW_LOADER,
  HIDE_LOADER,
  PICKUP_SELECTED,
  PICKUP_UNSELECTED,
  UPDATE_QTY_SUCCESS,
  UPDATE_QTY_ERROR
} from '../../../../modules/productBlade/constants';
import {
  LOAD_CART,
  LOAD_CART_SUCCESS,
  LOAD_CART_ERROR,
  UPDATE_ZIPCODE,
  CART_ZIPCODE_GEO,
  SHOW_LOADER_CART,
  HIDE_LOADER_CART,
  UPDATE_STORE_ZIPCODE
} from '../../cart.constants';
import { promocodeAPIDetails } from '../../../../modules/promotionalMessaging/reducer';
import { zipCodeValidation } from '../../../../modules/orderSummary/reducer';
import { toggleSOFModalStatus } from '../../../../modules/specialOrderProceedModal/reducer';

export const cartAPIDetails = (state = {}, action) => {
  switch (action.type) {
    case SHOW_LOADER_CART:
      return Object.assign({}, state, { isFetching: true, error: false });
    case HIDE_LOADER_CART:
      return Object.assign({}, state, { isFetching: false, error: false });
    case CART_ZIPCODE_GEO:
      return Object.assign({}, state, { isFetching: true, error: false });
    case LOAD_CART:
      return Object.assign({}, state, { isFetching: true, error: false });
    case LOAD_CART_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false });
    case LOAD_CART_ERROR:
      return Object.assign({}, state, { isFetching: false, error: true, errorInfo: action.error });
    default:
      return state;
  }
};

export const orderSummary = (state = {}, action) => {
  switch (action.type) {
    case LOAD_CART_SUCCESS:
      if (!action.data || !action.data.orders || !action.data.orders.length) {
        return state;
      }
      return action.data.orders[0].totals;
    default:
      return state;
  }
};

export const orderId = (state = '', action) => {
  switch (action.type) {
    case LOAD_CART_SUCCESS:
      if (!action.data || !action.data.orders || !action.data.orders.length) {
        return state;
      }
      return action.data.orders[0].orderId;
    default:
      return state;
  }
};

export const recordSetTotal = (state = 0, action) => {
  switch (action.type) {
    case LOAD_CART_SUCCESS:
      if (!action.data || !action.data.orders || !action.data.orders.length) {
        return state;
      }
      return action.data.orders[0].numberOfItems;
    default:
      return state;
  }
};

export const grandTotal = (state = 0, action) => {
  switch (action.type) {
    case LOAD_CART_SUCCESS:
      if (!action.data || !action.data.orders || !action.data.orders.length) {
        return state;
      }
      return action.data.orders[0].totals.orderTotal;
    default:
      return state;
  }
};

export const orderItem = (state = [], action) => {
  switch (action.type) {
    case LOAD_CART_SUCCESS:
      if (!action.data || !action.data.orders || !action.data.orders.length) {
        return state;
      }
      return action.data.orders[0].orderItems;
    default:
      return state;
  }
};

export const bundleProductInfo = (state = [], action) => {
  switch (action.type) {
    case LOAD_CART_SUCCESS:
      if (!action.data || !action.data.orders || !action.data.orders.length || !action.data.orders[0].bundleProductInfo) {
        return state;
      }
      return action.data.orders[0].bundleProductInfo;
    default:
      return state;
  }
};

export const promotions = (state = [], action) => {
  switch (action.type) {
    case LOAD_CART_SUCCESS:
      if (!action.data || !action.data.orders || !action.data.orders.length) {
        return state;
      }
      return action.data.orders[0].promotions;
    default:
      return state;
  }
};

export const cartMessages = (state = [], action) => {
  switch (action.type) {
    case CATCH_MSG: {
      return [...state, action.data];
    }
    case REMOVE_CART_MSG: {
      return state.filter(({ id }) => id !== action.data);
    }
    default:
      return state;
  }
};

export const qtyUpdateLoader = (state = [], action) => {
  switch (action.type) {
    case SHOW_LOADER:
      return [...state, action.data];
    case HIDE_LOADER:
      return state.filter(id => id !== action.data);
    default:
      return state;
  }
};

export const isPickUPStoreSelected = (state = false, action) => {
  switch (action.type) {
    case PICKUP_SELECTED:
      return action.data;
    case PICKUP_UNSELECTED:
      return action.data;
    default:
      return state;
  }
};

export const deliveryZipcode = (state = '', action) => {
  switch (action.type) {
    case LOAD_CART_SUCCESS:
      if (!action.data || !action.data.orders || !action.data.orders.length) {
        return state;
      }
      return action.data.orders[0].zipCode;
    case UPDATE_ZIPCODE:
      return action.data;
    default:
      return state;
  }
};

/**
 * Method will trigger after qunatity update.
 * Based on type state will set value for error.
 * @param {object} state default object
 * @param {object} action response from API
 */
export const productUpdate = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_QTY_SUCCESS:
      return Object.assign({}, state, { error: false });
    case UPDATE_QTY_ERROR:
      return Object.assign({}, state, { error: true, data: action.error || {} });
    default:
      return state;
  }
};

/**
 * Method to update the store zipcode in reducer
 * @param {string} state default value
 * @param {object} action value from saga, store zipcode
 */
export const selectedStoreZipCode = (state = '', action) => {
  switch (action.type) {
    case UPDATE_STORE_ZIPCODE:
      return action.data;
    default:
      return state;
  }
};

export default combineReducers({
  cartAPIDetails,
  orderSummary,
  orderId,
  recordSetTotal,
  grandTotal,
  promotions,
  orderItem,
  bundleProductInfo,
  cartMessages,
  qtyUpdateLoader,
  promocodeAPIDetails,
  isPickUPStoreSelected,
  deliveryZipcode,
  zipCodeValidation,
  toggleSOFModalStatus,
  productUpdate,
  selectedStoreZipCode
});
