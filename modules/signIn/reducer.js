import { SIGNIN_SUCCESS, SIGNIN_ERROR } from './constants';

const initialState = {
  token: {},
  error: false,
  redirect: false,
  errorCode: ''
};
/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const formSubmitStatus = (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return { token: action.data, error: false, redirect: true, errorCode: '' };
    case SIGNIN_ERROR:
      return { token: {}, error: true, redirect: false, errorCode: action.data };
    default:
      return state;
  }
};

