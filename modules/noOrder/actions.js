import { ORDER_DETAILS_DATA, ORDER_DETAILS_DATA_SUCCESS,
    ORDER_DETAILS_DATA_FAILURE } from './constants';


export function getOrderDetails(orderId, zipCode) {
 return {
   type: ORDER_DETAILS_DATA,
   orderId,
   zipCode
 };
}
export function getOrderDetailsSuccess(data) {
    return {
      type: ORDER_DETAILS_DATA_SUCCESS,
      data
    };
   }
export function getOrderDetailsError(data) {
    return {
      type: ORDER_DETAILS_DATA_FAILURE,
      data
    };
   }

