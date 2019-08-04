import {
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  UPDATE_INFORMATION_REQUEST,
  UPDATE_INFORMATION_SUCCESS,
  UPDATE_INFORMATION_FAILURE,
  SET_EDIT_INFO,
  SET_PASSWORD,
  CLOSE_MESSAGE,
  CLOSE_PROFILE_MESSAGE
} from './constants';

// Update password
export const updatePasswordRequest = (data, profileId, logonId) => ({ type: UPDATE_PASSWORD_REQUEST, data, profileId, logonId });
export const updatePasswordSuccess = data => ({ type: UPDATE_PASSWORD_SUCCESS, data });
export const updatePasswordFailure = data => ({ type: UPDATE_PASSWORD_FAILURE, data });
export const setPassword = flag => ({ type: SET_PASSWORD, flag });
export const closeMessage = () => ({ type: CLOSE_MESSAGE });
// Update Info
export const updateInformationRequest = (profileId, data) => ({ type: UPDATE_INFORMATION_REQUEST, profileId, data });
export const updateInformationSuccess = data => ({ type: UPDATE_INFORMATION_SUCCESS, data });
export const updateInformationFailure = data => ({ type: UPDATE_INFORMATION_FAILURE, data });
export const setEditInfo = flag => ({ type: SET_EDIT_INFO, flag });
export const closeProfileMessage = () => ({ type: CLOSE_PROFILE_MESSAGE });

