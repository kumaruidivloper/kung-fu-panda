import {
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  UPDATE_INFORMATION_SUCCESS,
  UPDATE_INFORMATION_FAILURE,
  SET_EDIT_INFO,
  SET_PASSWORD,
  CLOSE_MESSAGE,
  CLOSE_PROFILE_MESSAGE
} from './constants';

export const updatePassword = (state = { editProfile: false, editPassword: false, error: false, errorCode: '' }, action) => {
  switch (action.type) {
    case UPDATE_PASSWORD_SUCCESS:
      return { editPassword: false, error: false, errorCode: ' ', editPasswordSucceeded: true };
    case UPDATE_PASSWORD_FAILURE:
      return { editPassword: true, error: true, errorCode: action.data };
    case SET_PASSWORD:
      return { editPassword: action.flag };
    case CLOSE_MESSAGE:
      return { editPasswordSucceeded: false };
    default:
      return state;
  }
};

export const updateProfileInfo = (state = { editProfile: false, editPassword: false, error: false, errorCode: '' }, action) => {
  switch (action.type) {
    case UPDATE_INFORMATION_SUCCESS:
      return { editProfile: false, error: false, errorCode: ' ', editProfileSucceeded: true };
    case UPDATE_INFORMATION_FAILURE:
      return { editProfile: false, error: true, errorCode: action.data };
    case SET_EDIT_INFO:
      return { editProfile: action.flag };
    case CLOSE_PROFILE_MESSAGE:
    return { editProfileSucceeded: false };
    default:
      return state;
  }
};
