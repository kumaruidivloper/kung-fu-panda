import { isValidZipCode, isValidCity, isValidAddress, isValidName, isValidPhoneNumber } from '../../../../utils/validationRules';

const BILLING_FIRST_NAME = 'billingFirstName';
const BILLING_LAST_NAME = 'billingLastName';
const BILLING_PHONE = 'billingPhone';
const BILLING_ADDRESS = 'billingAddress';
const BILLING_ZIP_CODE = 'billingZipCode';
const BILLING_CITY = 'billingCity';
const BILLING_STATE = 'billingState';

/**
 * @description Handles redux form validation for billing address fields on Default Payment Method Form (Enable Buy Now)
 * @param  {object} values - the form values object
 * @returns {object} errors object tying error message to input field key.
 */
export const validateBillingForm = values => {
  const errors = {};

  if (!values[BILLING_FIRST_NAME]) {
    errors[BILLING_FIRST_NAME] = 'Required';
  } else if (
    (values[BILLING_FIRST_NAME] && values[BILLING_FIRST_NAME].length < 2) ||
    (values[BILLING_FIRST_NAME] && !isValidName(values[BILLING_FIRST_NAME]))
  ) {
    errors[BILLING_FIRST_NAME] = 'Not a valid name';
  }

  if (!values[BILLING_LAST_NAME]) {
    errors[BILLING_LAST_NAME] = 'Required';
  } else if (
    (values[BILLING_LAST_NAME] && values[BILLING_LAST_NAME].length < 2) ||
    (values[BILLING_LAST_NAME] && !isValidName(values[BILLING_LAST_NAME]))
  ) {
    errors[BILLING_LAST_NAME] = 'Not a valid name';
  }

  if (!values[BILLING_PHONE]) {
    errors[BILLING_PHONE] = 'Required';
  } else if (!isValidPhoneNumber(values[BILLING_PHONE])) {
    errors[BILLING_PHONE] = 'Invalid phone number';
  }

  if (!values[BILLING_ADDRESS]) {
    errors[BILLING_ADDRESS] = 'Required';
  } else if (values[BILLING_ADDRESS] && !isValidAddress(values[BILLING_ADDRESS])) {
    errors[BILLING_ADDRESS] = 'Not a valid address';
  }

  if (!values[BILLING_ZIP_CODE]) {
    errors[BILLING_ZIP_CODE] = 'Required';
  } else if (values[BILLING_ZIP_CODE]) {
    const zipCode = values[BILLING_ZIP_CODE].replace(/[^\d]/g, '');
    if (!isValidZipCode(zipCode)) {
      errors[BILLING_ZIP_CODE] = 'Invalid zip code';
    }
  }

  if (!values[BILLING_CITY]) {
    errors[BILLING_CITY] = 'Required';
  } else if (!isValidCity(values[BILLING_CITY])) {
    errors[BILLING_CITY] = 'Invalid city name';
  }

  if (!values[BILLING_STATE] || values[BILLING_STATE] === 'Select') {
    errors[BILLING_STATE] = 'Required';
  } else if (!isValidName(values[BILLING_STATE])) {
    errors[BILLING_STATE] = 'Invalid state name';
  }

  return errors;
};
