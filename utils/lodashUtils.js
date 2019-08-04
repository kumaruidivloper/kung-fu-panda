import $get from 'lodash.get';

/**
 * Function that notifies the developer of any errors due to path not available in an object
 * @param {string} path The path to the variable needed for the compoenent
 * @param {*} defaultValue The default value to be returned
 * @returns {*} Returns the resolved value.
 */
const fallbackFn = (object, path, defaultValue) => {
  console.error(`${path} not found in Object:`, object);
  return defaultValue;
};
/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 * @param {string} path The path to the variable needed for the compoenent
 * @param {*} defaultValue The default value to be returned
 * @returns {*} Returns the resolved value.
 * @example
  *
  * var object = { 'a': [{ 'b': { 'c': 3 } }] };
  *
  * _.get(object, 'a[0].b.c');
  * // => 3
  *
  * _.get(object, ['a', '0', 'b', 'c']);
  * // => 3
  *
  * _.get(object, 'a.b.c', 'default');
  * // => 'default'
  * // Console error -> 'a.b.c' not found in Object: { 'a': [{ 'b': { 'c': 3 } }] }
 */
export const get = (object, path, defaultValue) => {
  const result = $get(object, path, 'getError');
  if (result === 'getError') {
    return fallbackFn(object, path, defaultValue);
  }
  return result;
};
