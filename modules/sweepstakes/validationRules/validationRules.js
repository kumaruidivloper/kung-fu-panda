import { isValidName, isValidEmail, isValidZipCode } from './../../../apps/checkout/checkout.constants';

export const validate = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  } else if (!isValidName(values.firstName)) {
    errors.firstName = 'Not a valid name';
  }
  if (!values.lastName) {
    errors.lastName = 'Required';
  } else if (!isValidName(values.lastName)) {
    errors.lastName = 'Not a valid name';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.zipCode) {
    errors.zipCode = 'Required';
  } else if (!isValidZipCode(values.zipCode)) {
    errors.zipCode = 'Invalid zip code';
  }
  return errors;
};

export default validate;
