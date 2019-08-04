import { SAVE_NEW_PASSWORD, SAVE_PASSWORD_SUCCESS, SAVE_PASSWORD_ERROR } from './constants';
export const saveNewPassword = data => ({ type: SAVE_NEW_PASSWORD, data });
export const saveNewPasswordSuccess = data => ({ type: SAVE_PASSWORD_SUCCESS, data });
export const saveNewPasswordError = data => ({ type: SAVE_PASSWORD_ERROR, data });
