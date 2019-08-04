import { ZIP_CODE_MAX_DISPLAY } from './constants';

/**
 * utility funtion to convert a string to titleCased string, i.e ('ACademy sports AND outdoors') => 'Academy Sports And Outdoors'
 * @param {string} str is the string to be converted to title casing.
 */
export const titleCase = str => {
  if (str && str.length > 1) {
    try {
      return str
        .toLowerCase()
        .split(' ')
        .map(word => word.replace(word[0], word[0].toUpperCase()))
        .join(' ');
    } catch (err) {
      return str;
    }
  }
  return str;
};

/**
 * @param {string} value to be searched for characters and replaced with blank.
 */
export const replaceCharactersInString = value => {
  const reg = new RegExp(/\D/g);
  return value.replace(reg, '');
};

/**
 * Util method to format given string to phone nubmer format(123-456-7890)
 * @param {*} phoneNumberString
 */
export const formatPhoneNumber = (phoneNumberString = '') => {
  const cleaned = phoneNumberString.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phoneNumberString;
};

/**
 * Replaces placeholder string globally
 * @param inputStr
 * @param searchStr
 * @param value
 * @returns {string}
 */
export const replaceGlobalCharacters = (inputStr, searchStr, value) => inputStr.replace(new RegExp(`\\${searchStr}`, 'gm'), value);

export const cleanPrice = val => {
  if (val === null || val === undefined) {
    return val;
  }
  // assume val is number || string
  let result = typeof val === 'number' ? val.toString() : val;
  let floatResult = parseFloat(result.replace(/[^\d\.]/gi, ''), 10); // eslint-disable-line no-useless-escape
  floatResult = floatResult.toFixed(2);
  result = floatResult.toString();
  return result;
};

/**
 * Restrict Zip Code display across different form
 * this method purely to make sure zipcode display to be max limit configured
 * @param {string} value
 */
export const restrictZipCodeFieldValue = (value = '') => value.substring(0, ZIP_CODE_MAX_DISPLAY);
