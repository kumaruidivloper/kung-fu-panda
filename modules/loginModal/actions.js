import { HIDE_SIGNIN_MODAL, SHOW_SIGNIN_MODAL, SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE, INVALIDATE_SIGN_IN } from './constants';

export const beginSignIn = data => ({ type: SIGN_IN_REQUEST, data });
export const signinSuccess = data => ({ type: SIGN_IN_SUCCESS, data });
export const signinError = error => ({ type: SIGN_IN_FAILURE, error });
export const inValidateSignin = () => ({ type: INVALIDATE_SIGN_IN });
export const hideSigninModal = () => ({ type: HIDE_SIGNIN_MODAL });
export const showSigninModal = () => ({ type: SHOW_SIGNIN_MODAL });
