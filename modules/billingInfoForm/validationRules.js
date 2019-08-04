import { isValidZipCode, isValidCity, isValidAddress, isValidName, isValidEmail, isValidPhoneNumber } from './../../utils/validationRules';

// TODO - Replace all hardcoded error messages with CMS labels
export const validateBillingForm = (values, props) => {
  const errors = {};
  const { cms } = props;
  const { errorMsg } = cms;
  if (!values.billingFirstName) {
    errors.billingFirstName = errorMsg.mandatoryFirstName;
  } else if ((values.billingFirstName && values.billingFirstName.length < 2) || (values.billingFirstName && !isValidName(values.billingFirstName))) {
    errors.billingFirstName = errorMsg.invalidFirstName;
  }
  if (!values.billingLastName) {
    errors.billingLastName = errorMsg.mandatoryLastName;
  } else if ((values.billingLastName && values.billingLastName.length < 2) || (values.billingLastName && !isValidName(values.billingLastName))) {
    errors.billingLastName = errorMsg.invalidLastName;
  }
  if (!values.billingAddress1) {
    errors.billingAddress1 = errorMsg.addressLine1Mandatory;
  } else if (values.billingAddress1 && !isValidAddress(values.billingAddress1)) {
    errors.billingAddress1 = errorMsg.invalidAddress;
  }
  if (!values.billingPhoneNumber) {
    errors.billingPhoneNumber = errorMsg.mandatoryPhoneNumber;
  } else if (values.billingPhoneNumber) {
    const phoneNum = values.billingPhoneNumber.replace(/[^\d]/g, '');
    if (!isValidPhoneNumber(phoneNum)) {
      errors.billingPhoneNumber = errorMsg.phoneNumberInvalid;
    }
  }
  if (!values.billingZipCode) {
    errors.billingZipCode = errorMsg.mandatoryZipCode;
  } else if (values.billingZipCode) {
    const zipCode = values.billingZipCode.replace(/[^\d]/g, '');
    if (!isValidZipCode(zipCode)) {
      errors.billingZipCode = errorMsg.invalidZipCode;
    }
  }
  if (!values.billingCity) {
    errors.billingCity = 'Required';
  } else if (!isValidCity(values.billingCity)) {
    errors.billingCity = errorMsg.invalidCityName;
  }
  if (!values.billingState || values.billingState === 'Select') {
    errors.billingState = 'Required';
  } else if (!isValidName(values.billingState)) {
    errors.billingState = 'Invalid state name';
  }
  if (!values.email) {
    errors.email = errorMsg.blankEmailAddress;
  } else if (!isValidEmail(values.email)) {
    errors.email = errorMsg.invalidEmailAddress;
  }
  return errors;
};
