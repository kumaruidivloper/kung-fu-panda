import { get } from '@react-nitro/error-boundary';
import { DEFAULT_KEY, CHECKOUT_COOKIE, MONTH, UNAUTHORIZED_STATUS } from './constants';
import Storage from './StorageManager';
/**
 * Reads the query params present in the URL and returns it as key value pairs
 * @param param
 * @returns {string | null}
 */
export function getURLparam(param, url) {
  const urlString = url || window.location.href;
  const urlQuery = (urlString.indexOf('?') !== -1) && urlString.split('?')[1].split('&');
  const filterParam = urlQuery && urlQuery.filter(item => item.indexOf(param) !== -1);
  const paramValue = filterParam.length > 0 && filterParam[0].split('=')[1];
  return paramValue;
}

/**
 * Pad a number with leading zeros in JavaScript [duplicate]
 * @param number
 * @param digits
 */
export function padDigits(number, digits) {
  return Array(Math.max((digits - String(number).length) + 1, 0)).join(0) + number;
}

/**
 * Format a number with US currency
 * @param number
 * @returns {string}
 */
export function dollarFormatter(number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
  return formatter.format(number);
}
/**
 * Fetches the error key from api response
 * @param {object} response, response from api
 * @returns {string}, error key from api and if it does not exists , sends a default key
 */
export function getErrorKey(response) {
  if (response.data) {
    if (response.data.errors) {
      return response.data.errors[0].errorKey;
    }
  }
  return DEFAULT_KEY;
}

export function setCheckoutCookie(orderId) {
  Storage.setCookie(CHECKOUT_COOKIE, orderId);
}

export function unsetCheckoutCookie() {
  Storage.setCookie(CHECKOUT_COOKIE, '');
}

/**
 * Get user Id from cookies.
 */
export function getUserId() {
  const matches = decodeURIComponent(document.cookie).match(/WC_USERACTIVITY_\d+(?==)/);
  const result = matches ? matches[0] : null;
  return result ? result.split('_')[2] : null;
}

/**
 * Normalize Phone Number of USA
 * @param {string} value Phonenumber
 */
export const normalizePhoneNumber = value => {
  if (!value) {
    return value;
  }
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{3,10}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 3) {
    if (i === 6) {
      parts.push(match.substring(i, i + 4));
      break;
    }
    parts.push(match.substring(i, i + 3));
  }
  if (parts.length) {
    return parts.join(' - ');
  }
  return v;
};

/**
   * Method return in store pickup date
   * @param {object} pickupInStoreShippingGroup - pick up in store shipping group
   */
  export const handlePickupDates = pickupInStoreShippingGroup => {
    const shippingMode = (pickupInStoreShippingGroup && pickupInStoreShippingGroup.shippingModes && pickupInStoreShippingGroup.shippingModes.length !== 0 && pickupInStoreShippingGroup.shippingModes[0]) || false;
    const fromDate = shippingMode && shippingMode.estimatedFromDate ? `${getMonthName(shippingMode.estimatedFromDate)} ${shippingMode.estimatedFromDate.split('-')[2]}` : '';
    const toDate = shippingMode && shippingMode.estimatedToDate ? ` ${getMonthName(shippingMode.estimatedToDate)} ${shippingMode.estimatedToDate.split('-')[2]}` : '';
    const valueCheck = shippingMode.estimatedToDate && shippingMode.estimatedFromDate ? '–' : '';
    return `${fromDate} ${valueCheck} ${toDate}`;
  };

  /**
   * Method returns month name
   * @param {string} date - date string format-'2018-07-26'
   */
  export function getMonthName(date) {
    const monthNumber = new Date(date).getMonth();
    return MONTH[monthNumber];
  }

  /**
   * Method to validate the status, whether is authorized or not
   * @param {object} response axios response
   */
  export function isUnAuthorized(response) {
    const status = get(response, 'status', 0);
    return UNAUTHORIZED_STATUS.indexOf(status) > -1;
  }
/**
 *
 * decode the url recursively to get final decoded url
 * @export
 * @param {string} url
 * @returns decoded url
 */
export function decodeURLRecursively(url) {
  try {
    if (decodeURIComponent(url) === url) {
      return url;
    }
    return decodeURLRecursively(decodeURIComponent(url));
  } catch (error) {
    return url;
  }
}
