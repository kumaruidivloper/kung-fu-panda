import { isValidZipCode, isValidCity, isValidAddress, isValidName, isValidPhoneNumber, isValidSSN, isValidIncome, isValidDate, isValidEmail } from './../../utils/validationRules';

/**
 *
 * @param {Object} values - It gets the values from redux form and returns the validation message according to value entered.
 *
 */
// TODO - Replace all hardcoded error messages with CMS labels
export const validate = (values, props) => {
  const errors = {};
  const { cms } = props;
  if (values.firstName && !isValidName(values.firstName)) {
    errors.firstName = 'FirstName is not valid';
  } else if (!values.firstName) {
    errors.firstName = 'First Name is required';
  }
  if (values.lastName && !isValidName(values.lastName)) {
    errors.lastName = 'LastName is not valid';
  } else if (!values.lastName) {
    errors.lastName = 'Last Name is required';
  }
  if (values.middleName && !isValidName(values.middleName)) {
    errors.middleName = 'MI is not valid';
  }
  if (values.zipCode && !isValidZipCode(values.zipCode)) {
    errors.zipCode = 'Please provide a valid zipcode';
  } else if (!values.zipCode) {
    errors.zipCode = 'Zipcode is required';
  }
  if (values.mobilePhone && !isValidPhoneNumber(values.mobilePhone)) {
    errors.mobilePhone = 'Please provide a valid phone number';
  } else if (!values.mobilePhone) {
    errors.mobilePhone = 'Phone number is required';
  }
  if (values.alternatePhone && !isValidPhoneNumber(values.alternatePhone)) {
    errors.alternatePhone = 'Please provide a valid phone number';
  } else if ((values.mobilePhone === values.alternatePhone) && (values.mobilePhone)) {
    errors.alternatePhone = 'Alternate number cannot be as same as Phone number';
  }
  if (values.city && !isValidCity(values.city)) {
    errors.city = 'Please provide a valid city name!';
  } else if (!values.city) {
    errors.city = 'City name is required';
  }
  if (!values.state) {
    errors.state = 'Required';
  }
  if (values.ssn && !isValidSSN(values.ssn)) {
    errors.ssn = 'Please provide a valid SSN';
  } else if (!values.ssn) {
    errors.ssn = 'SSN is required';
  }
  if (values.dateOfBirth && !isValidDate(values.dateOfBirth)) {
    errors.dateOfBirth = 'Please provide a valid date';
  } else if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }
  if (values.annualIncome && !isValidIncome(values.annualIncome)) {
    errors.annualIncome = 'Only upto 7 digits are allowed';
  } else if (!values.annualIncome) {
    errors.annualIncome = 'Income is required';
  }
  if (!values.agreeTermsAndConditions) {
    errors.agreeTermsAndConditions = '';
  }

  if (values.streetAddres && !isValidAddress(values.streetAddres)) {
    errors.streetAddres = 'Please provide a valid address';
  } else if (!values.streetAddres) {
    errors.streetAddres = 'Address is required';
  }

  if (values.suiteOrApartment && !isValidAddress(values.suiteOrApartment)) {
    errors.suiteOrApartment = 'Please provide valid data';
  }
  if (values.emailAddress && !isValidEmail(values.emailAddress)) {
    errors.emailAddress = 'Please provide a valid email address!';
  } else if (!values.emailAddress) {
    errors.emailAddress = 'Email address is required';
  }
  if (values.confirmEmailAddress && !isValidEmail(values.confirmEmailAddress)) {
    errors.confirmEmailAddress = 'Please provide a valid email address!';
  } else if (!values.confirmEmailAddress) {
    errors.confirmEmailAddress = 'This field is required';
  } else if ((values.emailAddress !== values.confirmEmailAddress) && (values.emailAddress)) {
    errors.confirmEmailAddress = 'Value is not matching with email address';
  }
    return errors;
};

export default validate;

