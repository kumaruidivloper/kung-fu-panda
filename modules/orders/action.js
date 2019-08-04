import { ORDER_DATA, ORDER_DATA_SUCCESS,
    ORDER_DATA_FAILURE, BACK_TO_ORDERS } from './constants';

export const fetchOrderData = options => ({ type: ORDER_DATA, options });
export const fetchOrderDataSuccess = data => ({ type: ORDER_DATA_SUCCESS, data });
export const fetchOrderDataError = () => ({ type: ORDER_DATA_FAILURE });
export const handleBackToOrders = () => ({ type: BACK_TO_ORDERS });
