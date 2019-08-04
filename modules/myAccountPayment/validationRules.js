import { isValidZipCode, isValidCity, isValidAddress, isValidName, isValidPhoneNumber } from './../../apps/checkout/checkout.constants';
import { validateBillingForm } from '../billingInfoForm/validationRules';
import { validatePaymentForm } from './creditCardValidationRules';

export const validate = (values, props) => {
  const { errorMsg } = props.cms;
  const errors = {};
  const billingErrors = validateBillingForm(values, props);
  const paymentFormErrors = validatePaymentForm(values, props);
  if (!values.firstName) {
    errors.firstName = errorMsg.mandatoryFirstName;
  }
  if (!values.lastName) {
    errors.lastName = errorMsg.mandatoryLastName;
  }
  if (values.firstName && !isValidName(values.firstName)) {
    errors.firstName = errorMsg.invalidFirstName;
  }
  if (values.lastName && !isValidName(values.lastName)) {
    errors.lastName = errorMsg.invalidLastName;
  }
  if (!values.address) {
    errors.address = errorMsg.mandatoryStreetAddress;
  } else if (!isValidAddress(values.address)) {
    errors.address = errorMsg.invalidAddress;
  }
  if (!values.zipCode) {
    errors.zipCode = errorMsg.mandatoryZipCode;
  } else if (!isValidZipCode(values.zipCode)) {
    errors.zipCode = errorMsg.zipCodeInvalid;
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = errorMsg.mandatoryPhoneNumber;
  } else if (!isValidPhoneNumber(values.phoneNumber)) {
    errors.phoneNumber = errorMsg.myAccountPhoneNumberInvalid;
  }
  if (!values.city) {
    errors.city = errorMsg.mandatoryCityName;
  } else if (!isValidCity(values.city)) {
    errors.city = errorMsg.invalidCityName;
  }
  if (!values.state || values.state === 'Select') {
    errors.state = errorMsg.mandatoryStateName;
  }
  return Object.assign({}, errors, billingErrors, paymentFormErrors);
};

export default validate;
