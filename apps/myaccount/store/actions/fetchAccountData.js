import { MY_ACCOUNT_DATA, MY_ACCOUNT_DATA_SUCCESS,
    MY_ACCOUNT_DATA_FAILURE } from './../../myaccount.constants';


export function fetchMyAccountData(profileId) {
 return {
   type: MY_ACCOUNT_DATA,
   profileId
 };
}
export function fetchMyAccountDataSuccess(data) {
    return {
      type: MY_ACCOUNT_DATA_SUCCESS,
      data
    };
   }
export function fetchMyAccountDataError() {
    return {
      type: MY_ACCOUNT_DATA_FAILURE
    };
   }

