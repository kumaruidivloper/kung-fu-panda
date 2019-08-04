import { SIGNIN_ERROR, SIGNIN_SUCCESS, SIGNIN } from './constants';

export const signinCall = data => ({ type: SIGNIN, data });
export const signinSuccess = data => ({ type: SIGNIN_SUCCESS, data });
export const signinError = data => ({ type: SIGNIN_ERROR, data });

