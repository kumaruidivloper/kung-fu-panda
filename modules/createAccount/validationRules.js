import { isValidPassword, isRepeatedChars } from './../../apps/checkout/checkout.constants';
/**
 * function which checks for cases for password validation
 * @param {object} values object containing redux form values.
 * @param {object} props object containing props suchas cms, etc.
 */
export const validate = (values, props) => {
  const errors = {};
  const { errorMsg } = props.cms;
  if (!values.logonPassword) {
    errors.logonPassword = errorMsg.mandatoryPassword;
  } else if (!isValidPassword(values.logonPassword)) {
    errors.logonPassword = errorMsg.passwordLengthError;
  } else if (isRepeatedChars(values.logonPassword)) {
    errors.logonPassword = errorMsg.passwordCanNotContainACharacterConsecutivelyThanThreeTimes;
  }

  return errors;
};

export default validate;
