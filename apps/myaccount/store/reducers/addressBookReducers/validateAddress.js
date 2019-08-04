import {
 VALIDATE_ADDRESS_SUCCESS,
  INVALIDATE_ADDRESS_VALIDATION,
  VALIDATE_ADDRESS_FAILURE
} from './../../../myaccount.constants';

export const validateAddress = (state = { isFetching: false, error: false, data: {} }, action) => {
 switch (action.type) {
   case VALIDATE_ADDRESS_SUCCESS:
     return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
   case INVALIDATE_ADDRESS_VALIDATION:
     return Object.assign({}, state, { isFetching: false, error: false, data: {} });
   case VALIDATE_ADDRESS_FAILURE:
     return Object.assign({}, state, { isFetching: false, error: true, data: action.data });
   default:
     return state;
 }
};
