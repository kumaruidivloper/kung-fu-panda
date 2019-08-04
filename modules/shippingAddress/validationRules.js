import { isValidZipCode, isValidCity, isValidAddress, isValidName, isValidPhoneNumber } from './../../utils/validationRules';

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
    errors.firstName = cms.errorMsg.firstNameLastNameContainLetters;
  } else if (!values.firstName) {
    errors.firstName = cms.errorMsg.mandatoryFirstName;
  }
  if (values.lastName && !isValidName(values.lastName)) {
    errors.lastName = cms.errorMsg.firstNameLastNameContainLetters;
  } else if (!values.lastName) {
    errors.lastName = cms.errorMsg.mandatoryLastName;
  }
  if (values.address && !isValidAddress(values.address)) {
    errors.address = cms.errorMsg.addressLine1Mandatory;
  } else if (!values.address) {
    errors.address = cms.errorMsg.mandatoryStreetAddress;
  }
  if (values.zipCode && !isValidZipCode(values.zipCode)) {
    errors.zipCode = cms.errorMsg.zipcode;
  } else if (!values.zipCode) {
    errors.zipCode = cms.errorMsg.mandatoryZipCode;
  }
  if (values.phoneNumber && !isValidPhoneNumber(values.phoneNumber)) {
    errors.phoneNumber = cms.errorMsg.phoneNumberInvalid;
  } else if (!values.phoneNumber) {
    errors.phoneNumber = cms.errorMsg.mandatoryPhoneNumber;
  }
  if (values.city && !isValidCity(values.city)) {
    errors.city = cms.errorMsg.invalidCityName;
  } else if (!values.city) {
    errors.city = 'Required';
  }
  if (!values.state || values.state === 'Select') {
    errors.state = 'Required';
  }
    return errors;
};

export default validate;
