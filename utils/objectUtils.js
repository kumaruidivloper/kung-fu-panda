/**
 * Function to check if object is empty
 * @param {Object} obj Object to be tested
 */
export const isEmpty = obj => obj && Object.keys(obj).length === 0 && obj.constructor === Object;
/**
 * Function to check if an object has a certain key
 * @param  {Object} object Object to be tested
 * @param  {string} property Property to be tested if its a part of the object
 */
export const has = (object, property) => object && Object.prototype.hasOwnProperty.call(object, property);

/**
 * takes an object and returns encoded string
 * @param obj
 * @returns {*|string}
 */
export const encodeObject = obj => obj && encodeURI(JSON.stringify(obj));

/**
 * takes encoded string and return object
 * @param encodedStr
 * @returns {*|undefined}
 */
export const decodeObject = encodedStr => (encodedStr && JSON.parse(decodeURI(encodedStr))) || undefined;
