import { FORGOT_PASSWORD_ERROR, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD, CLEAR_DATA } from './constants';

export const forgotPassword = data => ({ type: FORGOT_PASSWORD, data });
export const clearData = () => ({ type: CLEAR_DATA });
export const forgotPasswordSuccess = data => ({ type: FORGOT_PASSWORD_SUCCESS, data });
export const forgotPasswordError = data => ({ type: FORGOT_PASSWORD_ERROR, data });

