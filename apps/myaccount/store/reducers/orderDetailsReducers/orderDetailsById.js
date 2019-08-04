import {
    ORDER_DETAILS_BY_ID_DATA_FAILURE,
    ORDER_DETAILS_BY_ID_DATA_SUCCESS
  } from '../../../../../modules/order/constants';
import {
  BACK_TO_ORDERS
} from '../../../../../modules/orders/constants';
  export const orderDetailsById = (state = { data: { }, success: false }, action) => {
    switch (action.type) {
      case ORDER_DETAILS_BY_ID_DATA_SUCCESS:
        return Object.assign({}, state, { data: action.data, success: true });
      case ORDER_DETAILS_BY_ID_DATA_FAILURE:
        return Object.assign({}, state, { data: {}, success: false });
      case BACK_TO_ORDERS:
      return Object.assign({}, state, { ...state, success: false });
      default:
        return state;
    }
  };
