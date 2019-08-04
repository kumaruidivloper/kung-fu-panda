import { getMessageDataCorrelationId, getMessageDataTokenValue, getMessageDataCreditCardType } from '../../../utils/PaymentJs/utils/MessageData';

const ADDRESS_TYPE_BILLING = 'B';
const COUNTRY = 'US';

export const createAddShippingAddressRequestObject = formValues => getShippingAddressForRequestObject(formValues);

export const createAddPaymentMethodRequestObject = (defaultShippingAddress, formValues, selectedAddress, messageData) => {
  const { sameAsShipping } = formValues;
  const creditCard = getCreditCardForRequestObject(formValues, defaultShippingAddress, messageData);
  const billingAddress = !sameAsShipping
    ? getBillingAddressFromFormForRequestObject(formValues, selectedAddress)
    : getBillingAddressFromShippingForRequestObject(defaultShippingAddress, formValues, selectedAddress);
  return {
    ...creditCard,
    billingAddress
  };
};

export const createValidateShippingAddressRequestObject = formValues => ({
  street: formValues.shippingAddress,
  city: formValues.shippingCity,
  state: formValues.shippingState,
  zipCode: formValues.shippingZipCode,
  country: COUNTRY
});

export const createValidateBillingAddressRequestObject = (formValues, defaultShippingAddress) => {
  if (formValues.sameAsShipping && defaultShippingAddress) {
    return {
      street: defaultShippingAddress.addressLine[0],
      city: defaultShippingAddress.city,
      state: defaultShippingAddress.state,
      zipCode: defaultShippingAddress.zipCode,
      country: COUNTRY
    };
  }
  return {
    street: formValues.billingAddress,
    city: formValues.billingCity,
    state: formValues.billingState,
    zipCode: formValues.billingZipCode,
    country: COUNTRY
  };
};

const getShippingAddressForRequestObject = (formValues = {}) => ({
  firstName: formValues.shippingFirstName,
  lastName: formValues.shippingLastName,
  addressLine: [formValues.shippingAddress, formValues.shippingAddressLine2 || ''],
  companyName: formValues.shippingAddressLine2 || '',
  city: formValues.shippingCity,
  state: formValues.shippingState,
  zipCode: formValues.shippingZipCode,
  phoneNumber: formValues.shippingPhone,
  primary: true,
  country: COUNTRY
});

const getBillingAddressFromFormForRequestObject = (formValues = {}, selectedAddress = {}) => ({
  addressType: ADDRESS_TYPE_BILLING,
  firstName: formValues.billingFirstName,
  lastName: formValues.billingLastName,
  addressLine: [selectedAddress.address || formValues.billingAddress, formValues.billingAddressLine2 || ''],
  companyName: formValues.billingAddressLine2 || '',
  city: selectedAddress.city || formValues.billingCity,
  state: selectedAddress.state || formValues.billingState,
  zipCode: selectedAddress.zipcode || formValues.billingZipCode,
  email: formValues.billingEmail,
  phoneNumber: formValues.billingPhone,
  country: COUNTRY
});

const getBillingAddressFromShippingForRequestObject = (defaultShippingAddress, formValues = {}, selectedAddress = {}) => {
  const { firstName, lastName, addressLine, companyName, city, state, zipCode, phoneNumber } = defaultShippingAddress;
  const [addressLine1, addressLine2] = addressLine;
  return {
    firstName,
    lastName,
    addressLine: [selectedAddress.address || addressLine1, addressLine2 || companyName || ''],
    city: selectedAddress.city || city,
    state: selectedAddress.state || state,
    zipCode: selectedAddress.zipcode || zipCode,
    phoneNumber,
    email: formValues.billingEmail
  };
};

const getCreditCardForRequestObject = (formValues = {}, defaultShippingAddress, messageData) => {
  const creditCardHolderName = formValues.sameAsShipping
    ? `${defaultShippingAddress.firstName} ${defaultShippingAddress.lastName}`.trim()
    : `${formValues.billingFirstName} ${formValues.billingLastName}`.trim();

  return {
    correlationId: getMessageDataCorrelationId(messageData),
    token: getMessageDataTokenValue(messageData),
    creditCardHolderName,
    creditCardNumber: trimCreditcard(removeNonNumericChars(formValues.creditCardNumber)),
    expiryDate: removeNonNumericChars(formValues.creditCardExpiration),
    type: getMessageDataCreditCardType(messageData),
    defaultFlag: true
  };
};

const removeNonNumericChars = (val = '') => val.replace(/[^\d]+/gi, '');
const trimCreditcard = card => card.substr(card.length - 4);

export const getAddressSuggestionsFromResponse = response => {
  const { data } = response || {};
  const { avsErrors } = data || {};
  const { altAddresList } = avsErrors || {};
  return altAddresList || [];
};

export const convertShippingAddressToSimpleAddress = (formValues = {}) => ({
  address: formValues.shippingAddress,
  city: formValues.shippingCity,
  state: formValues.shippingState,
  zipcode: formValues.shippingZipCode
});

export const convertSimpleAddressToShippingAddress = (formValues = {}, simpleAddress) => ({
  ...formValues,
  shippingAddress: simpleAddress.address,
  shippingCity: simpleAddress.city,
  shippingState: simpleAddress.state,
  shippingZipCode: simpleAddress.zipcode
});

export const convertBillingAddressToSimpleAddress = (formValues = {}, defaultShippingAddress) => {
  if (formValues.sameAsShipping && defaultShippingAddress) {
    return {
      address: defaultShippingAddress.addressLine[0],
      city: defaultShippingAddress.city,
      state: defaultShippingAddress.state,
      zipcode: defaultShippingAddress.zipCode
    };
  }
  return {
    address: formValues.billingAddress,
    city: formValues.billingCity,
    state: formValues.billingState,
    zipcode: formValues.billingZipCode
  };
};
