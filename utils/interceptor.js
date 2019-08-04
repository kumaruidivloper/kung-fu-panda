import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { sessionAPI, cartURL, apporigin } from '@academysports/aso-env';
import { get } from '@react-nitro/error-boundary';
import Storage from './StorageManager';
import { UNAUTHORIZED_STATUS, WCS_PAGE_ID, HTTP_STATUS_CODE_201, HTTP_STATUS_CODE_401 } from './constants';

/**
 * Function to override withCredentials
 * Certain third party API, withCredentials should be false, to not allow pass cookie.
 * If you want to call API with withCredentials=false, please update regex below.
 */
const blockWithCredentials = url => !url.match(/(ip-api|maps\.googleapis|google)\.com/);

const UNKNOWN = 'unknown';
const UNKNOWN_MSG = 'Some unknown error occurred!';
const ERROR_SESSION_KEY = 'error_debug';

const COOKIE_USERTYPE = 'USERTYPE';
const COOKIE_USERACTIVITY = 'USERACTIVITY';
const TAX_SERVICE_URL = /(\/api\/taxes\/order\/\d{0,100}\/tax\b)/;
let FALLBACK_401 = true;
const GUEST_IDENTITY = '/api/identity/guest';

/**
 * This function gets the original array and the parsed error object.
 * If status is unknown, then it shows error object else unknow error message
 * Otherwise the detail of the error object
 * @param {Object} orgError Original error object
 * @param {Object} error The error to be displayed
 */
const showError = (orgError, error, apiUrl) => {
  if (!Storage.getSessionStorage(ERROR_SESSION_KEY)) {
    return;
  }
  const { response } = error;
  if (response.status === UNKNOWN) {
    if (orgError.response && orgError.response.data) {
      const { config, data } = orgError.response;
      console.error(`ERROR :: __status: ${data && data.status} :: __url: ${config && config.url}`);
    }
    // eslint-disable-next-line
    console.error('ERROR :: ', orgError || UNKNOWN_MSG);
    if (apiUrl) {
      // eslint-disable-next-line
      console.error('Above error occurred for API: ', apiUrl);
    }
  } else {
    // eslint-disable-next-line
    console.error(`ERROR :: ${response.status} :: ${response.config.url || response.url}`);
  }
};

const isAuthenticatedPage = url => url.match(/\/shop\/cart|\/checkout|\/myaccount\/.+|\/shop\/OrderConfirmation/);

/** Class representing the axios interceptor */
export default class AxiosInterceptor {
  constructor(axios) {
    this.axios = axios;
    this.axiosResponseErrorOverride = this.axiosResponseErrorOverride.bind(this);
  }
  /**
   * Function to override the request config object
   * @param {object} config The congig object sent by axios.
   */
  axiosRequestOverride(config) {
    // check if isAuthor is true, set the mode to stage in header
    if (window.ASOData.isAuthor) {
      // eslint-disable-next-line
      config.headers.mode = 'stage';
    }
    let configOverride = {};
    // Do merge/override the config before request is sent
    configOverride = Object.assign({}, config, {
      withCredentials: blockWithCredentials(config.url)
    });
    return configOverride;
  }

  axiosRequestThrottler(config) {
    return config;
  }

  /**
   * Function to override the error received from a failed request
   * @param {object} error The error object
   */
  axiosRequestErrorOverride(error) {
    return Promise.reject(error);
  }

  /**
   * Method to validate guest identity API response and reload page for 201/400/401 status
   */
  getGuestIdentityFallBackConfig = () => ({
    validateStatus: validateStatus => {
      if (validateStatus === HTTP_STATUS_CODE_201) {
        window.location.reload(true);
      } else if (validateStatus === HTTP_STATUS_CODE_401) {
        // get all cookies from document
        const cookies = Storage.getAllCookies();
        // delete cookies which starts with WC_
        cookies.forEach(item => {
          if (item.indexOf('WC_') > -1) {
            const cookie = item.split('=');
            if (cookie.length) {
              Storage.deleteCookie(cookie[0]);
            }
          }
        });
        Storage.deleteCookie('USERACTIVITY');
        Storage.deleteCookie('USERTYPE');
        // window.location.reload(true);
      }
      return true;
    }
  });

  /**
   * Function to log the error received from a response
   * @param {object} error The error object
   * @return {boolean} false return to exit the function
   */
  axiosResponseErrorOverride(error) {
    // If `apiError` not found in error object or error object is not available, set the status to unknown
    // to handle it differently
    const {
      config: { url = '' }
    } = error;
    const apiError = (error && error.apiError) || { response: { status: UNKNOWN } };
    showError(error, apiError);
    const status = get(error, 'response.status', 0);
    const isUnauthorized = UNAUTHORIZED_STATUS.indexOf(status) > -1;
    if (isUnauthorized && ExecutionEnvironment.canUseDOM) {
      const decodedCookies = decodeURIComponent(document.cookie);
      const wcUserActivity = decodedCookies.match(/WC_USERACTIVITY_(-)?\d+(?==)/); // Regex to extract cookie name
      const wcAuthentication = decodedCookies.match(/WC_AUTHENTICATION_(-)?\d+(?==)/); // Regex to extract cookie name
      const previousDay = new Date();
      previousDay.setTime(previousDay.getTime() + 0); // create date as previous day

      const isUserActivityCookiePresent = wcUserActivity ? wcUserActivity[0] : null;
      const isUserAuthenticationCookiePresent = wcAuthentication ? wcAuthentication[0] : null;

      if (isUserActivityCookiePresent) {
        Storage.setCookie(`${isUserActivityCookiePresent}`, '', previousDay.toUTCString()); // set expiry date to previous date to delete cookie
      }
      if (isUserAuthenticationCookiePresent) {
        Storage.setCookie(`${isUserAuthenticationCookiePresent}`, '', previousDay.toUTCString()); // set expiry date to previous date to delete cookie
      }
      Storage.setCookie(`${COOKIE_USERTYPE}`, 'G');
      Storage.setCookie(`${COOKIE_USERACTIVITY}`, '-1002');
      let pageURL = window.location.href;
      if (pageURL.indexOf('?') > -1) {
        pageURL = pageURL.indexOf('debug=aso') > -1 ? pageURL : pageURL.split('?').join('?debug=aso&');
      } else {
        pageURL = pageURL.indexOf('#') > -1 ? pageURL.split('#').join('?debug=aso#') : `${pageURL}?debug=aso`;
      }
      pageURL = encodeURI(pageURL);
      // window.location = `/shop/Logoff?debug=aso&rememberMe=true&URL=${pageURL}`;
      // window.location = `/shop/LogonForm?URL=${pageURL}`;
      // window.location = '/shop/LogonForm';
      if (isAuthenticatedPage(window.location.href) || url === cartURL || TAX_SERVICE_URL.test(url)) {
        window.location.href = '/shop/LogonForm?timeout=true';
      } else if (FALLBACK_401) {
        FALLBACK_401 = false;
        this.axios.post(GUEST_IDENTITY, {}, this.getGuestIdentityFallBackConfig()).catch(() => {});
      }
    } /* else if (error && error.response && (error.response.status === 400 || error.response.status === 403) && ExecutionEnvironment.canUseDOM) { // fallback to handle invalid activity and unauthorized query
      window.location.href = '/';
    } */
    if (error.response && error.response.data) {
      return Promise.reject(error.response);
    }
    return false;
  }
  /**
   * This method will returns a promise which is resolved when the right data is available
   * once the page is completely rendered.
   */
  checkGTMScriptData = (testAddtionalConditions = false, addtionalConditions = '') => {
    let gtmTestInterval = null;
    let gtmTestTimeout = null;
    const resolverFn = resolve => {
      clearInterval(gtmTestInterval);
      gtmTestInterval = null;
      resolve();
    };
    return new Promise((resolve, reject) => {
      gtmTestInterval = setInterval(() => {
        if (window.google_tag_manager) {
          const { dataLayer } = window.google_tag_manager;
          if (testAddtionalConditions) {
            if (window.dataLayer && window.dataLayer.find(item => item[addtionalConditions])) {
              resolverFn(resolve);
            }
          } else if (document.readyState === 'complete' && dataLayer && dataLayer.gtmLoad && window.dataLayer) {
            resolverFn(resolve);
          }
        }
      }, 300);
      gtmTestTimeout = setTimeout(() => {
        if (gtmTestInterval) {
          clearInterval(gtmTestInterval);
          reject();
        }
        if (gtmTestTimeout) {
          clearTimeout(gtmTestTimeout);
        }
      }, 15000);
    });
  };

  /**
   * A/B Testing Script
   * This method will returns a promise which is resolved when the right data is available
   * once the page is completely rendered.
   */
  initiateTargeterScript() {
    let atScriptInterval = null;
    const resolverFn = resolve => {
      clearInterval(atScriptInterval);
      atScriptInterval = null;
      resolve();
      document.body.style.opacity = '1';
    };
    return new Promise(resolve => {
      atScriptInterval = setInterval(() => {
        if (window.adobe && window.adobe.target && document.readyState === 'complete') {
          resolverFn(resolve);
        }
      }, 30);
    });
  }

  /**
   * Function to create script tags dynamically for the component JS files.
   */
  createComponentScripts() {
    if (window.ASOData && window.ASOData.componentScripts && Array.isArray(window.ASOData.componentScripts)) {
      if (window.ASOData.messages && window.ASOData.messages.isTargeterEnabled === 'true') {
        document.body.style.opacity = '0';
        this.initiateTargeterScript();
        window.ASOData.componentScripts.push(`${apporigin}/content/dam/academysports/at.js`);
      } else {
        document.body.style.opacity = '1';
      }
      window.ASOData.componentScripts.forEach(src => {
        const componentScriptTag = document.createElement('script');
        componentScriptTag.src = src;
        componentScriptTag.defer = true;
        document.body.appendChild(componentScriptTag);
      });
    }
  }

  /**
   * Function to declare response interceptor for tracking API call errors
   */
  axiosResInterceptor() {
    this.axios.interceptors.response.use(response => response, this.axiosResponseErrorOverride);
  }

  /**
   * Function to initialize the axios interceptor
   */
  axiosReqInterceptor() {
    // Add a request interceptor
    this.axios.interceptors.request.use(this.axiosRequestOverride, this.axiosRequestErrorOverride);
    this.axios.interceptors.request.use(this.axiosRequestThrottler, this.axiosRequestErrorOverride);
  }
  /**
   * Function to set session cookie timer for 30mins.
   */
  setSessionExpiryto30Minutes() {
    const now = new Date();
    const minutes = 30;
    now.setTime(now.getTime() + (minutes * 60 * 1000)); // prettier-ignore
    return now.toUTCString();
  }
  /**
   * Function to get and set session cookies prior to all component calls.
   */
  getSessionInfo() {
    // make session api call only if session_expiry is not available in cookie
    if (!Storage.getCookie('session_expiry')) {
      this.axios
        .get(sessionAPI)
        .then(response => {
          // TODO - temp code to mitigate 401 errors
          if (response === 401 && ExecutionEnvironment.canUseDOM) {
            const matches = decodeURIComponent(document.cookie).match(/WC_USERACTIVITY_(-)?\d+(?==)/);
            const result = matches ? matches[0] : null;
            if (result) {
              document.cookie = `${result}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
              this.getSessionInfo();
            }
          }
          this.createComponentScripts();
        })
        .catch(error => {
          this.createComponentScripts();
          // If `response` not found in error object or error object is not available, set the status to unknown
          // to handle it differently
          const responseError = (error && error.response) || { response: { status: UNKNOWN } };
          showError(error, responseError, sessionAPI);
        });
    } else {
      // load the scripts.
      this.createComponentScripts();
    }
  }

  isReskinPage() {
    if (ExecutionEnvironment.canUseDOM) {
      const elem = document.getElementById(WCS_PAGE_ID);
      return elem && elem.value === WCS_PAGE_ID;
    }
    return false;
  }

  /**
   * Function to initialize the interceptor and the session info
   */
  initialize() {
    this.axiosReqInterceptor();
    this.axiosResInterceptor();
    this.getSessionInfo();
    if (!this.isReskinPage()) {
      this.checkGTMScriptData()
        .then(() => {
          if (window.location.href.match(/\/(checkout|cart|(shop\/cart)|(shop\/pdp)|(shop\/OrderConfirmation))/)) {
            this.checkGTMScriptData(true, 'ecommerce').then(() => {
              window.dataLayer.push({ event: 'gtmready' });
            });
          } else {
            window.dataLayer.push({ event: 'gtmready' });
          }
        })
        .catch(() => {
          window.dataLayer.push({ event: 'gtmready' });
        });
    }
  }
}
