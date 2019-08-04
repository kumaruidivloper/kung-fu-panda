import { ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAILURE, ORDER_CANCEL_SUCCESS, ORDER_CANCEL_FAILURE, ORDER_CANCEL_REDIRECT, CLEAR_ORDER_CANCEL_ERRORS } from './constants';

export const orderDetailsByIdCancel = (state = { data: {}, errorKey: '', error: false }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_SUCCESS:
      return Object.assign({}, state, { data: action.data, errorKey: '', error: false });
    case ORDER_DETAILS_FAILURE:
      return Object.assign({}, state, { data: {}, errorKey: action.data, error: true });
    default:
      return state;
  }
};

export const cancelOrder = (state = { data: {}, errorKey: '', error: false, errorMsg: undefined, redirect: false }, action) => {
  switch (action.type) {
    case ORDER_CANCEL_SUCCESS:
      return Object.assign({}, state, { data: action.data, errorKey: '', error: false, errorMsg: undefined, redirect: true });
    case ORDER_CANCEL_FAILURE:
      return Object.assign({}, state, { data: {}, errorKey: action.data, error: true, errorMsg: action.errorMsg, redirect: false });
    case ORDER_CANCEL_REDIRECT:
      return Object.assign({}, state, { redirect: false });
    case CLEAR_ORDER_CANCEL_ERRORS:
      return Object.assign({}, state, { data: {}, errorKey: '', error: false, errorMsg: undefined, redirect: false });
    default:
      return state;
  }
};
