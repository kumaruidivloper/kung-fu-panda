/**
 * This function can be used to remove any unwanted data from array. eg. null, NaN or undefined.
 * @param {Array} tempArray The array to be cleanedup
 */
const cleanup = tempArray => {
  let index = 0;
  const arrLength = tempArray ? tempArray.length : 0;
  let resIndex = -1;
  const result = [];

  while (index < arrLength) {
    const value = tempArray[index];

    if (value) {
      result[(resIndex += 1)] = value;
    }
    index += 1;
  }

  return result;
};

const ArrayUtils = {
  cleanup
};

export default ArrayUtils;
