import { get } from '@react-nitro/error-boundary';
import { isValidName, isValidEmail } from './../../../../utils/validationRules';
import { FIELD_REQUIRED_LABEL, CMS_LABEL_UNAVAILABLE } from './../../constants';
/**
 *
 * @param {Object} values - It gets the values from redux form and returns the validation message according to value entered.
 *
 */
export const validate = (values, props) => {
  const errors = {};
  const { cms, syncErrors } = props;
  if (!values.firstName) {
    errors.firstName = FIELD_REQUIRED_LABEL;
  }
  if (values.firstName && !isValidName(values.firstName)) {
    errors.firstName = getErrorLabel(cms, syncErrors, 'firstName');
  }
  if (!values.lastName) {
    errors.lastName = FIELD_REQUIRED_LABEL;
  }
  if (values.lastName && !isValidName(values.lastName)) {
    errors.lastName = getErrorLabel(cms, syncErrors, 'lastName');
  }
  if (!values.mobile) {
    errors.mobile = FIELD_REQUIRED_LABEL;
  } else if (values.mobile.length !== 16) {
    errors.mobile = getErrorLabel(cms, syncErrors, 'mobile');
  }
  if (!values.email) {
    errors.email = FIELD_REQUIRED_LABEL;
  } else if (!isValidEmail(values.email)) {
    errors.email = getErrorLabel(cms, syncErrors, 'email');
  }
  return errors;
};

/**
 * Method to generate the right error label for the particular field.
 * @param {*} cms cms object
 * @param {*} syncErrors syncErrors object in props, used as fallback to provide error msg whenever cms does not appear.
 * @param {*} fieldName Name corresponding to one of (first name, last name, email or mobile) used to get correct error label.
 */
const getErrorLabel = (cms, syncErrors, fieldName) => {
  const mapErrorLabelToObject = {
    firstName: {
      cms: 'errorMsg.firstNameLastNameContainLetters',
      syncErrors: 'firstName'
    },
    lastName: {
      cms: 'errorMsg.firstNameLastNameContainLetters',
      syncErrors: 'lastName'
    },
    mobile: {
      cms: 'errorMsg.phoneNumberInvalid',
      syncErrors: 'mobile'
    },
    email: {
      cms: 'errorMsg.invalidEmailText',
      syncErrors: 'email'
    }
  };
  return cms
    ? get(cms, mapErrorLabelToObject[fieldName].cms, CMS_LABEL_UNAVAILABLE)
    : get(syncErrors, mapErrorLabelToObject[fieldName].syncErrors, CMS_LABEL_UNAVAILABLE);
};

export default validate;
