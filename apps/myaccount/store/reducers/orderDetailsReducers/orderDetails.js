import { ORDER_DETAILS_DATA_FAILURE, ORDER_DETAILS_DATA_SUCCESS } from '../../../../../modules/noOrder/constants';
import { GET_STORE_FAILURE, GET_STORE_SUCCESS, GET_STORE_REQUEST } from '../constant';
import { BACK_TO_ORDERS } from '../../../../../modules/orders/constants';
export const orderDetails = (state = { data: {}, success: false, redirect: false, error: false, errorKey: '' }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_DATA_SUCCESS:
      return Object.assign({}, state, { data: action.data, success: true, redirect: true, error: false, errorKey: '' });
    case ORDER_DETAILS_DATA_FAILURE:
      return Object.assign({}, state, { data: {}, success: false, redirect: false, error: true, errorKey: action.data });
    case BACK_TO_ORDERS:
      return Object.assign({}, state, { ...state, success: false, redirect: false, errorKey: '' });
    default:
      return state;
  }
};

export const getStoreAddressDetails = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case GET_STORE_REQUEST:
      return Object.assign({}, state, { isFetching: true, error: false });

    case GET_STORE_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case GET_STORE_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true });
    default:
      return state;
  }
};
