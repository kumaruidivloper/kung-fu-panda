import { N_A } from './constants';

/**
 * @description removes need for null checks when trying to convert a possible string to lowercase
 * @param  {string} val='' a string to be converted to lowercase
 * @returns  {string} the passed in value converted to lowercase, if passed in value is null or undefined it returns passed in value.
 */
export const toLowerCase = val => (val === undefined || val === null ? val : val.toString().toLowerCase());

/**
 * @description Returns 'n/a' instead of null, undefined, or empty string inorder to preserve analytics properties.  Otherwise it returns the passed in value.
 * @param  {any} val
 * @returns {any|string} the passed in value or 'n/a' if passed in value is null, undefined, or empty string.
 */
export const naFallback = val => {
  if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
    return N_A;
  }
  return val;
};

/**
 * @description Returns a copy of the passed in object with all property values wrapped with naFallback.
 * @param  {obj} val
 * @returns {any|string} a copy of the passed in object with all property values wrapped with naFallback.
 */
export const naFallbackWrapProps = (obj = {}) =>
  Object.keys(obj).reduce(
    (result, key) => ({
      ...result,
      [key]: naFallback(obj[key])
    }),
    {}
  );
