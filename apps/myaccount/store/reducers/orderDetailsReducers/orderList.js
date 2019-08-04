import {
    ORDER_DATA_FAILURE,
    ORDER_DATA_SUCCESS
  } from '../../../../../modules/orders/constants';
  export const orderList = (state = { data: { orders: [] } }, action) => {
    switch (action.type) {
      case ORDER_DATA_SUCCESS:
        return Object.assign({}, state, { data: action.data });
      case ORDER_DATA_FAILURE:
        return Object.assign({}, state, { data: {} });
      default:
        return state;
    }
  };
