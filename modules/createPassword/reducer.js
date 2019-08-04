import { SAVE_PASSWORD_SUCCESS, SAVE_PASSWORD_ERROR } from './constants';

const savePasswordStatus = (state = { data: { userID: '' }, error: false, errorCode: '' }, action) => {
  switch (action.type) {
    case SAVE_PASSWORD_SUCCESS:
      return { ...state, data: action.data };
    case SAVE_PASSWORD_ERROR:
      return { ...state, data: {}, error: true, errorCode: action.data };
    default:
      return state;
  }
};
export default savePasswordStatus;
