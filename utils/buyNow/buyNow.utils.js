import { isLoggedIn } from '../UserSession';

export const MULTIPLE_STEPS = 'multipleSteps';
export const SOLO_STEP = 'soloStep';
const STEP_ONE_OF_TWO = 'stepOneOfTwo';
const STEP_TWO_OF_TWO = 'stepTwoOfTwo';
const ELIGIBLE_BUYNOW_VARIANTS = ['regular', 'giftcard'];
// PROFILE UTILS

export const showEnableBuyNowButton = (productItem, profile) => isLoggedIn() && isBuyNowProduct(productItem) && !profileHasBuyNowEnabled(profile);

export const showBuyNowButton = (productItem, profile) => isLoggedIn() && isBuyNowProduct(productItem) && profileHasBuyNowEnabled(profile);

const profileHasBuyNowEnabled = profile => profileHasDefaultShippingMethod(profile) && profileHasDefaultBillingCreditCard(profile);

export const getEnableFlowType = profile =>
  !profileHasDefaultShippingMethod(profile) && !profileHasDefaultBillingCreditCard(profile) ? MULTIPLE_STEPS : SOLO_STEP;

export const profileHasDefaultShippingMethod = profile => {
  const buyNow = (profile || {}).buyNow || {};
  return buyNow.addressPresent;
};

export const profileHasDefaultBillingCreditCard = profile => {
  const buyNow = (profile || {}).buyNow || {};
  return buyNow.paymentPresent;
};

// PRODUCT ITEM UTILS

/**
 * @description determines if the passed in product is eligible for BuyNow
 * @param  {Object} productItem
 * @returns {boolean} True if the product is eligible for BuyNow, false if not eligible.
 */
const isBuyNowProduct = productItem => {
  const { isBuyNowEligible } = productItem || {};
  return isBuyNowEligible !== 'N' && (ELIGIBLE_BUYNOW_VARIANTS.indexOf(productItem.varianttype) > -1);
  // const { isBuyNowEligible = true } = productItem || {};
  // return isBuyNowEligible;
};

// LABEL UTILS

export const getCommonLabel = (cms, key) => {
  const labels = getLabelsOjbect(cms).common || {};
  return labels[key];
};

export const getShippingAddressLabel = (cms, key) => {
  const labels = getLabelsOjbect(cms).shippingAddress || {};
  return labels[key];
};

export const getCreditCardLabel = (cms, key) => {
  const labels = getLabelsOjbect(cms).creditCard || {};
  return labels[key];
};

export const getBillingAddressLabel = (cms, key) => {
  const labels = getLabelsOjbect(cms).billingAddress || {};
  return labels[key];
};

export const getShippingModalLabel = (cms, key, flowType = MULTIPLE_STEPS) => {
  const shippingModal = getLabelsOjbect(cms).shippingModal || {};
  const flowTypeKey = flowType === MULTIPLE_STEPS ? STEP_ONE_OF_TWO : SOLO_STEP;
  const labels = shippingModal[flowTypeKey];
  return labels[key];
};

export const getPaymentModalLabel = (cms, key, flowType = MULTIPLE_STEPS) => {
  const paymentModal = getLabelsOjbect(cms).paymentModal || {};
  const flowTypeKey = flowType === MULTIPLE_STEPS ? STEP_TWO_OF_TWO : SOLO_STEP;
  const labels = paymentModal[flowTypeKey];
  return labels[key];
};

export const getAddressSuggestionLabel = (cms, key) => {
  const labels = getLabelsOjbect(cms).addressSuggestion || {};
  return labels[key];
};

export const getData = (cms, key) => {
  const data = getDataObject(cms).data || {};
  return data[key];
};

const getLabelsOjbect = (cms = {}) => {
  const buyNow = cms.buyNow || {};
  return buyNow.labels || {};
};

const getDataObject = (cms = {}) => {
  const buyNow = cms.buyNow || {};
  return buyNow.data || {};
};
