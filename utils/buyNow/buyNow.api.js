import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import axios from 'axios';
import { postAddress, addCreditCardAPI, profileInfo, ordersAPI, orderAPI, getCityState, validateAddress } from '@academysports/aso-env';
import { getXhrErrorMessageFrom } from '../xhrError';

// need to move these API to environment file
// const address = '/address/';
// const creditCard = '/creditCard';
const confirmedOrder = '/confirmedOrder';

/**
 * @description makes an ajax request to provile api to get current logged in user's profile.
 * @param  {string} profileId user id of currently logged in user.
 * @param  {Function} onSuccess function to be executed upon successful fetch request
 * @param  {Function} onFail  function to be executed upon failed fetch request
 */
export const fetchProfile = (profileId, onSuccess, onFail) => {
  if (ExecutionEnvironment.canUseDOM) {
    axios
      .get(`${profileInfo(profileId)}`)
      .then(onSuccess)
      .catch(onFail);
  }
};

export const fetchShippingAddresses = (profileId, onSuccess, onFail) => {
  if (ExecutionEnvironment.canUseDOM) {
    axios
      .get(`${postAddress(profileId)}`)
      .then(onSuccess)
      .catch(onFail);
  }
};

export const postShippingDetails = (profileId, submittedResponse, onSuccess, onFail) => {
  if (ExecutionEnvironment.canUseDOM) {
    axios
      .post(`${postAddress(profileId)}`, submittedResponse)
      .then(onSuccess)
      .catch(onFail);
  }
};

export const postPaymentDetails = (profileId, data, onSuccess, onFail) => {
  if (ExecutionEnvironment.canUseDOM) {
    axios
      .post(`${addCreditCardAPI(profileId)}`, data)
      .then(onSuccess)
      .catch(onFail);
  }
};

export const postBuyNow = (requestObj, onSuccess, onFail) => {
  if (ExecutionEnvironment.canUseDOM) {
    axios
      .post(ordersAPI, requestObj)
      .then(onSuccess)
      .catch(onFail);
  }
};

export const getOrderConfirmation = (orderId, onSuccess, onFail) => {
  if (ExecutionEnvironment.canUseDOM) {
    axios
      .get(`${orderAPI}${orderId}${confirmedOrder}`)
      .then(onSuccess)
      .catch(onFail);
  }
};

/**
 * @description makes an ajax request to address api to the city/state that match the passed in zipcode.
 * @param  {string} zipCode
 * @param  {Function} onSuccess function to be executed upon successful fetch request
 * @param  {Function} onFail  function to be executed upon failed fetch request
 */
export const fetchCityStateByZipCode = (zipCode, onSuccess, onFail) => {
  if (ExecutionEnvironment.canUseDOM) {
    axios
      .get(getCityState(zipCode))
      .then(onSuccess)
      .catch(onFail);
  }
};

export const postValidateAddress = (requestObj, onSuccess, onFail) => {
  if (ExecutionEnvironment.canUseDOM) {
    axios
      .post(validateAddress, requestObj)
      .then(onSuccess)
      .catch(onFail);
  }
};

/**
 * @deprecated
 */
export const getErrorMessageFrom = getXhrErrorMessageFrom;

/*
SAMPLE ADD DEFAULT CREDITCARD REQUEST OBJECT
https://academysports.atlassian.net/wiki/spaces/KER/pages/75170810/2.4.1.3.1.61+API-Profile+Add+Credit+Card

{
"billingAddress": {
"addressLine1": "sss",
"addressLine2": "33 square",
"addressType": "B",
"city": "plano",
"country": "US",
"email1": "asd@dkf.com",
"firstName": "santosh",
"lastName": "kumar",
"phone1": "9898909123",
"state": "TX",
"zipCode": "75025"
},
"correlationId": "12345777",
"creditCardHolderName": "santosh",
"creditCardNumber": "4111111111111122",
"defaultFlag": true,
"expiryDate": "0220",
"token": "0245152126058291",
"type": "VISA"
}

Sample Response:

{
"success": true,
"xwalletId": "412"
}
*/
