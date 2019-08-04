import { isValidZipCode, isValidCity, isValidAddress, isValidPhoneNumber } from './../../apps/checkout/checkout.constants';
import { isValidName } from '../../utils/validationRules';
import { REQUIRED, NOT_A_VALID_NAME, NOT_A_VALID_ADDRESS, INVALID_ZIPCODE, PHONE_NUMBER, INVALID_STATE_NAME } from './constants';

export const validate = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = REQUIRED;
  }
  if (!values.lastName) {
    errors.lastName = REQUIRED;
  }
  if (values.firstName && !isValidName(values.firstName)) {
    errors.firstName = NOT_A_VALID_NAME;
  }
  if (values.lastName && !isValidName(values.lastName)) {
    errors.lastName = NOT_A_VALID_NAME;
  }
  if (!values.address) {
    errors.address = REQUIRED;
  } else if (!isValidAddress(values.address)) {
    errors.address = NOT_A_VALID_ADDRESS;
  }
  if (!values.zipCode) {
    errors.zipCode = REQUIRED;
  } else if (!isValidZipCode(values.zipCode)) {
    errors.zipCode = INVALID_ZIPCODE;
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = REQUIRED;
  } else if (!isValidPhoneNumber(values.phoneNumber)) {
    errors.phoneNumber = PHONE_NUMBER;
  }
  if (!values.city) {
    errors.city = REQUIRED;
  } else if (!isValidCity(values.city)) {
    errors.city = REQUIRED;
  }
  if (!values.state || values.state === 'Select') {
    errors.state = REQUIRED;
  } else if (!isValidName(values.state)) {
    errors.state = INVALID_STATE_NAME;
  }
  return errors;
};

export default validate;
