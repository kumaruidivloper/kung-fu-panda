/* eslint-disable no-useless-escape */
/**
 *
 * @param {object} values - object for creditcard form field value
 * @param {object} props
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
 *
 * @param {string} value - creditcard form field value
 * @param {regular expression} pattern
 */
export const validateCard = (value, pattern) => value.match(pattern);

/**
 *
 * @param {string} creditcardInputVal - creditcard form field value
 */
export const validCreditCard = creditcardInputVal => {
  const exactCreditCardType = getExactCreditCardType(creditcardInputVal);
  return (exactCreditCardType !== undefined);
};

/**
 *
 * @param {object} values - object for expiry form field value
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
 *
 * @param {object} values - object for cvv form field value
 */
export const validateCvv = (values, errorMsg) => {
  const cvvError = {};
  if (!values.cvvField) {
    cvvError.cvvField = errorMsg.mandatoryCVV;
  } else if (values.cvvField) {
    const filterCvvNums = values && values.cvvField.replace(/[^\d]/g, '');
    if (!filterCvvNums || filterCvvNums.length < 3) {
      cvvError.cvvField = errorMsg.invalidCVVLength;
    } else if (values.creditcardField && validateCard(values.creditcardField.substr(0, 2), typeAmexTwoChars) && filterCvvNums.length < 4) { // for AMEX cvv should return an error if user entered less than 4 characters
      cvvError.cvvField = errorMsg.invalidCVVLength;
    }
  }
  return cvvError;
};
/**
 *
 * @param {object} values - value object for creditcard/expiry date/cvv form fields
 * @param {object} props
 */
export const validatePaymentForm = (values, props) => {
  const { errorMsg } = props.cms;
  const cardValidationError = validateCreditCard(values, errorMsg);
  const expiryValidationError = validateExpiry(values, errorMsg);
  const cvvValidationError = validateCvv(values, errorMsg);
  const errors = Object.assign({}, cardValidationError, expiryValidationError, cvvValidationError);
  return errors; // combine all validation rules in one place. This is essential for validation rules to work as expected.
};
/**
 *
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

export const isValidPhoneNumber = phone => (/[0-9]{10}/.test(phone));
// export const isValidEmail = value => (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value)); // eslint-disable-line
export const isValidEmail = value => (/^(([^<>()\[\]\\.,;:\s@\+"]+(\.[^<>()\[\]\\.,;:\s@\+"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value)); // eslint-disable-line

/**
 * added Features not to accept Special characters like Plus
 * @param {*} name
 */
export const isValidCity = name => (/^[a-zA-Z-][a-zA-Z-' ]*$/.test(name));
export const isValidZipCode = ZipCode => (/^\d{5}-\d{4}$|^\d{5}$/.test(ZipCode));
export const isValidAddress = AddressOne => (/^[a-zA-Z0-9\-\. ',#&;/\s]+$/i.test(AddressOne)); // eslint-disable-line
export const isValidName = name => (/^[a-zA-Z\-'-][a-zA-Z-' ]*$/.test(name));
export const isValidPassword = password => (/^.{8,}$/.test(password));

/*
* checking the format of SSN
*/
export const isValidSSN = ssn => (/[0-9]{4}/.test(ssn));

/*
* checking the format of SSN
*/
export const isValidIncome = income => (/[0-9]{1,7}/.test(income));

/*
*
*/
// const dateFormat = ;
export const isValidDate = date => (/^((0[13578]|1[02])[\/.]31[\/.](19|20)[0-9]{2})$|^((01|0[3-9]|1[1-2])[\/.](29|30)[\/.](19|20)[0-9]{2})$|^((0[1-9]|1[0-2])[\/.](0[1-9]|1[0-9]|2[0-8])[\/.](19|20)[0-9]{2})$|^((02)[\/.]29[\/.](((19|20)(04|08|[2468][048]|[13579][26]))|2000))$/.test(date));

// CREDIT CARD REGEXPs

export const typeAmex = /^3[47][0-9]{13}$/;
export const typeMaster = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
export const typeVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
export const typeDiscover = /^6(?:011|5[0-9]{2})[0-9]{12}$/;

export const typeAmexTwoChars = /^(?:3[47])$/;
export const typeMasterTwoChars = /^(?:5[1-5])$/;
export const typeVisaTwoChars = /^(?:4[0-9]{1}?)$/;
export const typeDiscoverTwoChars = /^(?:6(?:0|5))$/;


export const typePartialAmex = /^(?:3[47])/;
export const typePartialMaster = /^(?:5[1-5])/;
export const typePartialVisa = /^(?:4[0-9]{1}?)/;
export const typePartialDiscover = /^(?:6(?:0|5))/;


export const VISA = 'visa';
export const AMEX = 'amex';
export const MASTER = 'master';
export const DISCOVER = 'discover';

const creditCardTypes = [VISA, AMEX, MASTER, DISCOVER];

const creditCardTypeExactRegExs = {
  [VISA]: typeVisa,
  [AMEX]: typeAmex,
  [MASTER]: typeMaster,
  [DISCOVER]: typeDiscover
};

const creditCardTypePartialRegExs = {
  [VISA]: typePartialVisa,
  [AMEX]: typePartialAmex,
  [MASTER]: typePartialMaster,
  [DISCOVER]: typePartialDiscover
};

/**
 * @description Determines Credit Card Type based upon passed in credit card number.
 * @param  {string} ccNum
 * @returns {string} credit card type if match is found else undefined.
 */
export const getCreditCardType = ccNum => {
  const partialMatchType = creditCardTypes.find(type => creditCardTypePartialRegExs[type].test(ccNum)) || undefined;
  return partialMatchType;
};

/**
 * @description Determines Credit Card Type expecting that the complete credit card number has been passed.
 * @param  {string} ccNum
 * @returns {string} credit card type if match is found else undefined.
 */
export const getExactCreditCardType = ccNum => {
  const partialMatchType = creditCardTypes.find(type => creditCardTypeExactRegExs[type].test(ccNum)) || undefined;
  return partialMatchType;
};

export const getCVVMaxLength = ccType => (!ccType || ccType === AMEX ? 4 : 3);
