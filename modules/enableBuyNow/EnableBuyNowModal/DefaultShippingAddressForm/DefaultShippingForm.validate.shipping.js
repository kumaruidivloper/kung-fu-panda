import { isValidZipCode, isValidCity, isValidAddress, isValidName, isValidPhoneNumber, isValidEmail } from '../../../../utils/validationRules';

const SHIPPING_FIRST_NAME = 'shippingFirstName';
const SHIPPING_LAST_NAME = 'shippingLastName';
const SHIPPING_ADDRESS = 'shippingAddress';
const SHIPPING_ZIP_CODE = 'shippingZipCode';
const SHIPPING_CITY = 'shippingCity';
const SHIPPING_STATE = 'shippingState';
const SHIPPING_PHONE = 'shippingPhone';
const SHIPPING_EMAIL = 'shippingEmail';

export const validateShippingForm = values => {
  const errors = {};

  if (!values[SHIPPING_FIRST_NAME]) {
    errors[SHIPPING_FIRST_NAME] = 'Required';
  } else if (
    (values[SHIPPING_FIRST_NAME] && values[SHIPPING_FIRST_NAME].length < 2) ||
    (values[SHIPPING_FIRST_NAME] && !isValidName(values[SHIPPING_FIRST_NAME]))
  ) {
    errors[SHIPPING_FIRST_NAME] = 'Not a valid name';
  }

  if (!values[SHIPPING_LAST_NAME]) {
    errors[SHIPPING_LAST_NAME] = 'Required';
  } else if (
    (values[SHIPPING_LAST_NAME] && values[SHIPPING_LAST_NAME].length < 2) ||
    (values[SHIPPING_LAST_NAME] && !isValidName(values[SHIPPING_LAST_NAME]))
  ) {
    errors[SHIPPING_LAST_NAME] = 'Not a valid name';
  }

  if (!values[SHIPPING_ADDRESS]) {
    errors[SHIPPING_ADDRESS] = 'Required';
  } else if (values[SHIPPING_ADDRESS] && !isValidAddress(values[SHIPPING_ADDRESS])) {
    errors[SHIPPING_ADDRESS] = 'Not a valid address';
  }

  if (!values[SHIPPING_ZIP_CODE]) {
    errors[SHIPPING_ZIP_CODE] = 'Required';
  } else if (values[SHIPPING_ZIP_CODE]) {
    const zipCode = values[SHIPPING_ZIP_CODE].replace(/[^\d]/g, '');
    if (!isValidZipCode(zipCode)) {
      errors[SHIPPING_ZIP_CODE] = 'Invalid zip code';
    }
  }

  if (!values[SHIPPING_CITY]) {
    errors[SHIPPING_CITY] = 'Required';
  } else if (!isValidCity(values[SHIPPING_CITY])) {
    errors[SHIPPING_CITY] = 'Invalid city name';
  }

  if (!values[SHIPPING_STATE] || values[SHIPPING_STATE] === 'Select') {
    errors[SHIPPING_STATE] = 'Required';
  } else if (!isValidName(values[SHIPPING_STATE])) {
    errors[SHIPPING_STATE] = 'Invalid state name';
  }

  if (!values[SHIPPING_PHONE]) {
    errors[SHIPPING_PHONE] = 'Required';
  } else if (!isValidPhoneNumber(values[SHIPPING_PHONE])) {
    errors[SHIPPING_PHONE] = 'Invalid phone number';
  }

  if (!values[SHIPPING_EMAIL]) {
    errors[SHIPPING_EMAIL] = 'Required';
  } else if (!isValidEmail(values[SHIPPING_EMAIL])) {
    errors[SHIPPING_EMAIL] = 'Invalid email';
  }

  return errors;
};
