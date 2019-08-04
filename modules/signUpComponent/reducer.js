import { USER_REGISTER_SUCCESS, USER_REGISTER, USER_REGISTER_FAILURE, VALIDATE_ADDRESS_SIGNUP_REQUEST, VALIDATE_ADDRESS_SIGNUP_FAILURE, VALIDATE_ADDRESS_SIGNUP_SUCCESS } from './constants';

export const registerUser = (state = { data: {}, isRegistered: false, error: false, errorCode: '' }, action) => {
  switch (action.type) {
    case USER_REGISTER_SUCCESS:
      return Object.assign({}, state, { data: action.data, isRegistered: true, error: false, errorCode: '' });
    case USER_REGISTER:
      return Object.assign({}, state, { data: action.data, isRegistered: false, error: false, errorCode: '' });
    case USER_REGISTER_FAILURE:
    return Object.assign({}, state, { data: {}, isRegistered: false, error: true, errorCode: action.data });
    case VALIDATE_ADDRESS_SIGNUP_SUCCESS:
    return Object.assign({}, state, { addressData: action.data, addressError: false, errorCode: '' });
    case VALIDATE_ADDRESS_SIGNUP_REQUEST:
      return Object.assign({}, state, { addressData: action.data, addressError: false, errorCode: '' });
    case VALIDATE_ADDRESS_SIGNUP_FAILURE:
    return Object.assign({}, state, { addressData: {}, addressError: true, errorCode: action.data });
    default:
      return state;
  }
};
