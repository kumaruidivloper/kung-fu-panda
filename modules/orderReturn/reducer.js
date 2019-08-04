import { INITIATE_ORDER_SUCCESS, INITIATE_ORDER_FAILURE, INITIATE_ORDER_RESET } from './constants';

// export const orderDetailsByIdCancel = (state = { data: {} }, action) => {
//   switch (action.type) {
//     case ORDER_DETAILS_SUCCESS:
//       return Object.assign({}, state, { data: action.data });
//     case ORDER_DETAILS_FAILURE:
//       return Object.assign({}, state, { data: {} });
//     default:
//       return state;
//   }
// };

export const initiateOrder = (state = { data: {}, error: false, errorKey: '', showSucessScreen: false }, action) => {
  switch (action.type) {
    case INITIATE_ORDER_SUCCESS:
      return Object.assign({}, state, { data: action.data, error: false, errorKey: '', showSucessScreen: true });
    case INITIATE_ORDER_FAILURE:
      return Object.assign({}, state, { data: {}, error: true, errorKey: action.errorKey, showSucessScreen: false });
    case INITIATE_ORDER_RESET:
      return Object.assign({}, state, { data: {}, error: false, errorKey: '', showSucessScreen: false });
    default:
      return state;
  }
};
