const isNull = val => val === null;
const isUndefined = val => val === undefined;
const isEmptyString = val => typeof val === 'string' && val.trim() === '';
const isZero = val => val === 0;

const defaultOptions = {
  defaultValue: undefined,
  nullIsUndefined: true,
  undefinedIUndefined: true,
  emptyStringIsUndefined: false,
  zeroIsUndefined: false
};

const mappedFlagsToFunction = {
  nullIsUndefined: isNull,
  undefinedIUndefined: isUndefined,
  emptyStringIsUndefined: isEmptyString,
  zeroIsUndefined: isZero
};

const getFirstDefined = (arrVals = [], opts = {}) => {
  const options = { ...defaultOptions, ...opts };
  const { defaultValue, ...config } = options;
  const flags = Object.keys(config);
  const nullChecks = flags.reduce(
    (result, key) => (config[key] && mappedFlagsToFunction[key] ? [...result, mappedFlagsToFunction[key]] : result),
    []
  );

  const validValues = arrVals.filter(val => nullChecks.every(isEmpty => !isEmpty(val)));
  return validValues.length > 0 ? validValues[0] : defaultValue;
};

export default getFirstDefined;
