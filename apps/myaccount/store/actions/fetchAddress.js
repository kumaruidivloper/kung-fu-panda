import { SET_DEFAULT, LOAD_ADDRESS_DATA, TOGGLE_ALERT, LOAD_ADDRESS_DATA_FAILURE, LOAD_ADDRESS_DATA_SUCCESS, POST_ADDRESS_DATA, ADDRESS_DATA_ERROR, TOGGLE_FORM_DATA, TOGGLE_EDIT_FORM, DELETE_ADDRESS, EDIT_ADDRESS } from './../../myaccount.constants';


export function fetchAddress(data) {
 return {
   type: LOAD_ADDRESS_DATA,
   data
 };
}
export function fetchAddressSuccess(data) {
    return {
      type: LOAD_ADDRESS_DATA_SUCCESS,
      data
    };
   }
export function fetchAddressError() {
    return {
      type: LOAD_ADDRESS_DATA_FAILURE
    };
   }
export function postAddress(data, profileID) {
    return {
        type: POST_ADDRESS_DATA,
        data,
        profileID
    };
}
export function addressError(data) {
    return {
        type: ADDRESS_DATA_ERROR,
        data
    };
}
export function toggleForm(data) {
    return {
        type: TOGGLE_FORM_DATA,
        data
    };
}
export function toggleEditForm(data) {
    return {
        type: TOGGLE_EDIT_FORM,
        data
    };
}
export function deleteAddress(addressID, profileID) {
    return {
        type: DELETE_ADDRESS,
        addressID,
        profileID
    };
}
export function editAddress(selectedAddress, addressID, profileID) {
    return {
        type: EDIT_ADDRESS,
        selectedAddress,
        addressID,
        profileID
    };
}
export function setAlert(data, flag) {
    return {
        type: TOGGLE_ALERT,
        data,
        flag
    };
}
export function setAsDefault(profileId, addressId, nickName) {
    return {
        type: SET_DEFAULT,
        profileId,
        addressId,
        nickName
    };
}

