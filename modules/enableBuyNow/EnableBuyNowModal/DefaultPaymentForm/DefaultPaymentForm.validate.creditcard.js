const CREDIT_CARD_NUMBER_FIELD = 'creditCardNumber';
const CREDIT_CARD_EXPIRATION_FIELD = 'creditCardExpiration';
const CREDIT_CARD_CVV_FIELD = 'creditCardCVV';

const VISA = 'visa';
const AMEX = 'amex';
const MASTER = 'master';
const DISCOVER = 'discover';

/**
 *
 * @param {object} values - value object for creditcard/expiry date/cvv form fields
 * @param {object} props
 */
export const validatePaymentForm = (values, props) => {
  const { buyNow = {} } = props.cms;
  const { errorMsg } = buyNow;
  const cardValidationError = validateCreditCard(values, errorMsg);
  const expiryValidationError = validateExpiry(values, errorMsg);
  const cvvValidationError = validateCvv(values, errorMsg);
  const errors = Object.assign({}, cardValidationError, expiryValidationError, cvvValidationError);
  return errors; // combine all validation rules in one place. This is essential for validation rules to work as expected.
};

/**
 *
 * @param {object} values - object for creditcard form field value
 * @param {object} props
 */
export const validateCreditCard = (values, errorMsg) => {
  const value = values[CREDIT_CARD_NUMBER_FIELD];
  if (!value || !isValidCreditCardNumber(value)) {
    return {
      [CREDIT_CARD_NUMBER_FIELD]: errorMsg.invalidCardNumberLength
    };
  }

  return {};
};

export const isValidCreditCardNumber = ccNum => !!getCreditCardType(ccNum);

const getCreditCardType = ccNum => {
  const types = [VISA, AMEX, MASTER, DISCOVER];
  return types.find(type => isCreditCardType(ccNum, CreditCardTypeRegExp[type]));
};

export const isCreditCardType = (ccNum, typePattern) => removeNonNumericChars(ccNum).match(typePattern);

/**
 *
 * @param {object} values - object for expiry form field value
 */
export const validateExpiry = (values, errorMsg) => {
  const value = values[CREDIT_CARD_EXPIRATION_FIELD];

  if (!value || removeNonNumericChars(value).length < 3) {
    return {
      [CREDIT_CARD_EXPIRATION_FIELD]: errorMsg.invalidExpirationDate
    };
  }

  const now = new Date();
  const currentyear = getYear2Digit(now);
  const expiryDate = value.split('/');
  if (Number(expiryDate[1]) < Number(currentyear) || (Number(expiryDate[1]) < Number(currentyear) && expiryDate[0] < now.getMonth() + 1)) {
    return { [CREDIT_CARD_EXPIRATION_FIELD]: errorMsg.pastExpirationDate };
  }

  if (Number(expiryDate[0]) > 12) {
    return { [CREDIT_CARD_EXPIRATION_FIELD]: errorMsg.invalidExpirationDate };
  }

  return {};
};

const getYear2Digit = date =>
  date
    .getFullYear()
    .toString()
    .substr(2, 4);

/**
 *
 * @param {object} values - object for cvv form field value
 */
export const validateCvv = (values, errorMsg) => {
  const value = values[CREDIT_CARD_CVV_FIELD];
  if (!value || removeNonNumericChars(value).length < 3) {
    return { [CREDIT_CARD_CVV_FIELD]: errorMsg.invalidCVVLength };
  }
  return {};
};

/**
 *
 * @param {string} value - user entered creditcard value
 */
export const normalizeCard = value => {
  if (!value) {
    return value;
  }
  const v = removeNonNumericChars(value);
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

const removeNonNumericChars = val => (val || '').replace(/[^\d]/g, '');

/**
 *
 * @param {string} value - user entered expiry date value
 */
export const normalizeExpiry = value => {
  const v = removeNonNumericChars(value);
  const matches = v.match(/\d{2,4}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 2) {
    parts.push(match.substring(i, i + 2));
  }
  if (parts.length) {
    return parts.join('/');
  }
  return v;
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

export const isValidPhoneNumber = phone =>
  /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/i.test(phone);
export const isValidEmail = value =>
  // eslint-disable-next-line
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    value
  );
export const isValidCity = name => /^[a-zA-Z\s]+$/.test(name);
export const isValidZipCode = ZipCode => /^\d{5}-\d{4}$|^\d{5}$/.test(ZipCode);
export const isValidAddress = AddressOne => /^[a-zA-Z0-9\-\. ',#&;/\s]+$/i.test(AddressOne); // eslint-disable-line
export const isValidName = name => /^[a-zA-Z-']+$/.test(name);
export const isValidPassword = password => /^.{8,}$/.test(password);

const CreditCardTypeRegExp = {
  [VISA]: /^4[0-9]{12}(?:[0-9]{3})?$/,
  [AMEX]: /^3[47][0-9]{13}$/,
  [MASTER]: /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
  [DISCOVER]: /^6(?:011|5[0-9]{2})[0-9]{12}$/
};
