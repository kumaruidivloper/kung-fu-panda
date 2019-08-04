import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import Storage from '../utils/StorageManager';

/**
 * BIG HACKS BELOW
 * This should be replaced within 3 days (from 7/29/2018) with cookie provided by API team
 * The only function below that should remain is "isLoggedIn"
 * It should only consist of one line of code that checks the new cookie for logged in value.
 */

/**
 * @returns {boolean} True if user is logged in, false if user is not logged in
 */
export const isLoggedIn = () => {
  const WC_USERACTIVITY_KEY = getWcUserActivityCookieKey();
  return WC_USERACTIVITY_KEY && hasWcUserActivityExpiryTime(WC_USERACTIVITY_KEY);
};

/**
 * gets registration status (login) of user.
 * @returns {boolean} true if user has logged in atleast once in past 30 days else false.
 */
export const getRegistrationStatus = () => {
  const analyticsRegistrationStatus = Storage.getCookie('ANALYTICS_REGISTERED');
  return analyticsRegistrationStatus;
};

/**
 * HACK
 * @todo remove as soon as possible
 * @returns {string} the WC_USERACTIVITY_ cookie key
 */
const getWcUserActivityCookieKey = () => {
  let result = null;
  if (ExecutionEnvironment.canUseDOM) {
    const matches = decodeURIComponent(document.cookie).match(/WC_USERACTIVITY_\d+(?==)/);
    result = matches ? matches[0] : null;
  }
  return result;
};

/**
 * HACK
 * @todo remove as soon as possible
 * @param {string} WC_USERACTIVITY_KEY
 */
const hasWcUserActivityExpiryTime = WC_USERACTIVITY_KEY => {
  const userActivity = Storage.getCookie(WC_USERACTIVITY_KEY, false);
  const expiryTime = userActivity.split(',')[5];
  return expiryTime && expiryTime !== '' && expiryTime !== 'null';
};

export const hasItemsInCart = () => {
  const userActivityCookie = Storage.getCookie('USERACTIVITY');
  return userActivityCookie && userActivityCookie > 0;
};

const getFallBackProfileId = () => Storage.getCookie('USERACTIVITY');

/**
 * @todo change if current global implementation to get profileId changes.
 * @returns {string} the userId session storage key
 */
export const getProfileId = () => {
  const userActivityKey = getWcUserActivityCookieKey();
  const userActivityCookie = Storage.getCookie(userActivityKey, false);
  return userActivityCookie.split(',')[0] || getFallBackProfileId();
};
