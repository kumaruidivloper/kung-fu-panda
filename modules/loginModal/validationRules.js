import { isValidEmail } from './../../utils/validationRules';

/**
 * This function will return the error object with relevant error keys and values.
 * @param  {object} values form field values
 * @param  {object} props cms object
 */
const rules = (values, props) => {
  const { cms: { errorMsg } } = props;
  const errors = {};
  if (!values.logonId) {
    errors.logonId = errorMsg.blankEmailAddress;
  } else if (!isValidEmail(values.logonId)) {
    errors.logonId = errorMsg.emailFormatIncorrect;
  }
  if (!values.logonPassword) {
    errors.logonPassword = errorMsg.passwordBlank;
  }
  return errors;
};

export default rules;
