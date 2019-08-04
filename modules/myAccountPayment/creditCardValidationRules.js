/**
 * This function validates the credit card from credit card field
 * @param {object} values - object for creditcard form field value
 * @param {object} errorMsg - list of associated error messages
 */
export const validateCreditCard = (values, errorMsg) => {
  const cardError = {};
  if (!values.creditcardField) {
    cardError.creditcardField = errorMsg.mandatoryCardNumber;
  } else if (values.creditcardField) {
    const filterCreditcardNums = values && values.creditcardField.replace(/[^\d]/g, '');
    if (filterCreditcardNums && !validCreditCard(filterCreditcardNums)) {
      cardError.creditcardField = errorMsg.invalidCardNumberLength;
    }
  }
  return Object.assign({}, cardError);
};

/**
 * This function matches the credit card value with the regular expression pattern
 * @param {string} value - creditcard form field value
 * @param {regular expression} pattern
 */
export const validateCard = (value, pattern) => value.match(pattern);

/**
 * This fuction matches the condition whether the given card input value is of
 * amex, mastercard, visa, discover
 * @param {string} creditcardInputVal - creditcard form field value
 */
export const validCreditCard = creditcardInputVal => {
  if (validateCard(creditcardInputVal, typeAmex) || validateCard(creditcardInputVal, typeMaster) || validateCard(creditcardInputVal, typeVisa) || validateCard(creditcardInputVal, typeDiscover)) {
    return true;
  }
  return false;
};
/**
 * This function validates the expiry date of the credit card. i.e user can't enter
 * the past expiry date and handles the error message accordingly.
 * @param {object} values - object for expiry form field value
 * @param {object} errorMsg - list of error messages
 */
export const validateExpiry = (values, errorMsg) => {
  const expiryError = {};
  if (!values.expiryField) {
    expiryError.expiryField = errorMsg.mandatoryExpDate;
  } else if (values.expiryField) {
    const filterExpiryNums = values && values.expiryField.replace(/[^\d]/g, '');
    if (!filterExpiryNums || filterExpiryNums.length < 3) {
      expiryError.expiryField = errorMsg.invalidExpirationDate;
    } else {
      const now = new Date();
      const currentyear = now
        .getFullYear()
        .toString()
        .substr(2, 4);
      const expiryDate = values.expiryField.split('/');
      if (Number(expiryDate[1]) < Number(currentyear) || (Number(expiryDate[1]) === Number(currentyear) && expiryDate[0] < now.getMonth() + 1)) {
        expiryError.expiryField = errorMsg.pastExpirationDate;
      }

      if (Number(expiryDate[0]) > 12) {
        expiryError.expiryField = errorMsg.invalidExpirationDate;
      }
    }
  }
  return expiryError;
};
/**
 * This function checks that the cvv entered by the user is valid or not. Handles the
 * error message accordingly. This function expects cvv of 4 digit for amex and 3 for other cards.
 * @param {object} values - object for cvv form field value
 * @param {object} errorMsg - list of error messages
 * @param {Number} cardMaxLength - cvv max length of a crad. For amex its value is 4 and 3 for other cards
 */
export const validateCvv = (values, errorMsg, cardMaxLength) => {
  const cvvError = {};
  if (!values.cvvField) {
    cvvError.cvvField = errorMsg.mandatoryCVV;
  } else if (values.cvvField) {
    const filterCvvNums = values && values.cvvField.replace(/[^\d]/g, '');
    if (!filterCvvNums || filterCvvNums.length < cardMaxLength) {
      cvvError.cvvField = errorMsg.invalidCVVLength;
    }
  }
  return cvvError;
};
/**
 * This function validates the payment form and returns the error message
 * @param {object} values - value object for creditcard/expiry date/cvv form fields
 * @param {object} props - props values
 */
export const validatePaymentForm = (values, props) => {
  const { errorMsg } = props.cms;
  const { cardMaxLength } = props;
  const cardValidationError = validateCreditCard(values, errorMsg);
  const expiryValidationError = validateExpiry(values, errorMsg);
  const cvvValidationError = validateCvv(values, errorMsg, cardMaxLength);
  const errors = Object.assign({}, cardValidationError, expiryValidationError, cvvValidationError);
  return errors; // combine all validation rules in one place. This is essential for validation rules to work as expected.
};
/**
 * FUNCTION returns only numeric value entered by the user
 * @param {string} value
 */
export const normalizePhone = value => {
  if (!value) {
    return value;
  }
  const onlyNum = value.replace(/[^\d]/g, '');
  return onlyNum;
};
/**
 * This function separates the credit card value with -
 * @param {string} value - user entered creditcard value
 */
export const normalizeCard = value => {
  if (!value) {
    return value;
  }
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,20}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' - ');
  }
  return v;
};
/**
 * This function handles the correct expiry date format entered by the user.
 * User is allowed to enter the valid date format.
 * @param {object} value - value object for credit card expiry
 * @param {object} prevValue
 */
export const normalizeExpiry = (value, prevValue) => {
  if (prevValue && prevValue.indexOf('/') !== -1 && value.indexOf('/') === -1) {
    return value;
  }

  if (value.indexOf('/') !== -1 && prevValue && prevValue.indexOf('/') !== -1) {
    return value;
  }

  if (value) {
    const expiryValue = value.replace(
      /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
    ).replace(
      /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
    ).replace(
      /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
    ).replace(
      /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
    ).replace(
      /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
    ).replace(
      /[^\d\/]|^[\/]*$/g, '' // eslint-disable-line
    ).replace(
      /\/\//g, '/' // Prevent entering more than 1 `/`
    );
    return expiryValue;
  }
  return value;
};

/**
 *
 * @param {string} value - user entered cvv value
 */
export const normalizeCvv = value => {
  if (!value) {
    return value;
  }
  return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
};

export const isValidPhoneNumber = phone => (/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/i.test(phone));
export const isValidEmail = value => (/^(([^<>()\[\]\\.,;:\s@\+"]+(\.[^<>()\[\]\\.,;:\s@\+"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value)); // eslint-disable-line
/**
 * added Features not to accept Special characters like Plus
 * @param {*} name
 */
export const isValidCity = name => (/^[a-zA-Z-][a-zA-Z-' ]*$/.test(name));
export const isValidZipCode = ZipCode => (/^\d{5}-\d{4}$|^\d{5}$/.test(ZipCode));
export const isValidAddress = AddressOne => (/^[a-zA-Z0-9\-\. ',#&;/\s]+$/i.test(AddressOne)); // eslint-disable-line
export const isValidName = name => (/^[a-zA-Z-][a-zA-Z-' ]*$/.test(name));
export const isValidPassword = password => (/^.{8,}$/.test(password));
export const typeAmex = /^3[47][0-9]{13}$/;
export const typeMaster = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
export const typeVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
export const typeDiscover = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
export const typeAmexTwoChars = /^(?:3[47])$/;
export const typeMasterTwoChars = /^(?:5[1-5])$/;
export const typeVisaTwoChars = /^(?:4[0-9]{1}?)$/;
export const typeDiscoverTwoChars = /^(?:6(?:0|5))$/;
