import { isValidName, isValidEmail } from './../../utils/validationRules';

const validateForm = (values, props) => {
  const errors = {};
  const { firstName, lastName, logonId, confirmEmail } = values;
  const { errorMsg } = props;
  if (!firstName) {
    errors.firstName = errorMsg.firstNameCannotBeBlank;
  } else if ((firstName && firstName.length < 1) || (firstName && !isValidName(firstName))) {
    errors.firstName = 'Not a valid name';
  }
  if (!lastName) {
    errors.lastName = errorMsg.lastNameCannotBeBlank;
  } else if ((lastName && lastName.length < 1) || (lastName && !isValidName(lastName))) {
    errors.lastName = 'Not a valid name';
  }
  if (confirmEmail && !logonId) {
    errors.logonId = 'Required';
  } else if (logonId && !isValidEmail(logonId)) {
    errors.logonId = errorMsg.emailFormatInvalid;
  }
  if (logonId && !confirmEmail) {
   errors.confirmEmail = 'Required';
 } else if (confirmEmail && !isValidEmail(confirmEmail)) {
  errors.confirmEmail = errorMsg.emailFormatInvalid;
} else if (confirmEmail && (confirmEmail !== logonId)) {
  errors.confirmEmail = errorMsg.emailAddressDoNotMatch;
 }
  return errors;
};
export default validateForm;
