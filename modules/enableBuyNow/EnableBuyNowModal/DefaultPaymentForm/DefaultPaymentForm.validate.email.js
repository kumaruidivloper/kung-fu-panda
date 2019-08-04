import { isValidEmail } from '../../../../utils/validationRules';
const BILLING_EMAIL = 'billingEmail';

/**
 * @description Handles redux form validation for email field on Default Payment Method Form (Enable Buy Now)
 * @param  {object} values - the form values object
 * @returns {object} errors object tying error message to input field key.
 */
export const validateEmail = values => {
  const errors = {};

  if (!values[BILLING_EMAIL]) {
    errors[BILLING_EMAIL] = 'Required';
  } else if (!isValidEmail(values[BILLING_EMAIL])) {
    errors[BILLING_EMAIL] = 'Invalid email';
  }

  return errors;
};
