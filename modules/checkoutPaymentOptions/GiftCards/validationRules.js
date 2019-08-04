export const validationRules = values => {
  const errors = {};
  if (!values.cardId) {
    errors.cardId = 'Required';
  }
  if (!values.cardPin) {
    errors.cardPin = 'Required';
  }
  if (values.cardId && (values.cardId.substring(0, 3) === '117' || values.cardId.substring(0, 3) === '507')) {
    // Gift cards starting with 117 and 507 are invalid for online purchase
    errors.cardId = 'The number you entered is an in-store merchandise credit. Please visit your local store to redeem.';
  }
  if (values.cardId && values.cardId.length !== 25 && values.cardId.length !== 22) {
    // valid card Id can be 16 digit(25 with spaces and dashes) or 13 digit(22 with spaces and dashes)
    errors.cardId = 'Invalid GiftCard Number';
  }
  if (values.cardPin && values.cardPin.length !== 8 && values.cardPin.length !== 4) {
    // valid card Pin can be 8 digit or 4 digit
    errors.cardPin = 'Invalid GiftCard Pin';
  }
  return errors;
};

export const normalizeGCNumber = value => {
  if (!value) {
    return value;
  }
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
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

export const normalizeGCPin = value => {
  if (!value) {
    return value;
  }
  return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
};

