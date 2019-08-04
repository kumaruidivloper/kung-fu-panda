import { combineReducers } from 'redux';
import { forgotPasswordInfoStatus } from '../../../../modules/forgotPassword/reducer';
import { formSubmitStatus } from '../../../../modules/signIn/reducer';
import { registerUser } from '../../../../modules/signUpComponent/reducer';
import { fetchCityStateFromZipCode } from '../../../../modules/signUpComponent/fetchCityReducer';
import { globalLoader } from './globalLoader';
export default combineReducers({
    forgotPasswordInfoStatus,
    formSubmitStatus,
    registerUser,
	fetchCityStateFromZipCode,
    globalLoader
  });
