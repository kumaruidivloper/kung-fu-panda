export const NODE_TO_MOUNT = 'orderDetails';
export const DATA_COMP_ID = 'data-compid';
export const PICK_UP_INSTORE = 'PICKUPINSTORE';
export const SHIP_TO_STORE = 'STS';
export const SHIPPING_ITEMS = 'SG';
export const GET_STORE_REQUEST = 'GET_STORE_REQUEST';
export const GET_STORE_SUCCESS = 'GET_STORE_SUCCESS';
export const GET_STORE_FAILURE = 'GET_STORE_FAILURE';
export const API_SUCCESS_CODE = 200;
/**
 * B - Back order , status will occur if any existing order is merged with the new data.
 * G - OMS confirmation of order transfer
 * C - payment completed
 * N - CSR edited order → order changed by customer care
 * K - BOPIS order , ready for pickup
 */
export const CANCEL_ELIGIBLE = ['B', 'N', 'G', 'C', 'K'];
export const DATE_YEAR_FORMAT = 'MMDDYYYY';
export const FREE = 'FREE';
export const PICKUP_DATE = 'pickedUpDate';
export const READY_FOR_PICKUP = 'readyToPickDate';
export const MAX_PICKUP_DATE = 'maxPickByDate';
export const ESTIMATED_TO_DATE = 'estimatedToDate';
export const SHIP_TO_STORE_PRICE = 'Special Order Ship To Store';
export const ESTIMATED_FROM_DATE = 'estimatedFromDate';

export const EVENT_NAME = 'myaccount';
export const EVENT_CATEGORY = 'user account';
export const BOPIS_RETURN_VALUE = 'bopis';
export const SHIP_TO_STORE_RETURN_VALUE = 'ship to store';
export const SHIP_TO_HOME_RETURN_VALUE = 'ship to home';
export const NOT_ELIGIBLE_ERROR_KEY = '_ORDER_INELIGIBLE_CANCEL_OMS';
export const PACK_SLIP_LABEL = 'PRINT PACKSLIP';
export const CANCELLED_LABEL = 'Order Cancelled';
export const SUBMITTED_LABEL = 'Order Submitted';
export const SHIPPED_LABEL = 'Order Shipped';
export const INITIATE_ORDER_RESET = 'initiateOrderReset';

// Order status labels goes here
export const STATUS_CANCELLED = 'X';
