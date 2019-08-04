/* global PaymentJS */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import {
  FIRSTDATA_DOMAIN,
  FIRSTDATA_PAYMENTJS,
  FIRSTDATA_API_KEY,
  FIRSTDATA_JS_SECURITY_TOKEN,
  FIRSTDATA_FD_TOKEN,
  FIRSTDATA_TA_TOKEN
} from '@academysports/aso-env';
import {
  PAYMENT_JS_IFRAME_ID,
  EVENT_MESSAGE,
  EVENT_GENERATE_TOKEN
} from './constants';

export { EVENT_GENERATE_TOKEN };

const removeNonNumericChars = (val = '') => val.replace(/[^\d]+/gi, '');

class PaymentJsAPI {
  constructor(config) {
    this.observers = {
      [EVENT_GENERATE_TOKEN]: []
    };

    // Config
    this.apiKey = config.apiKey;
    this.jsSecurityToken = config.jsSecurityToken;
    this.taToken = config.taToken;
    this.fdToken = config.fdToken;

    // State
    this.scriptsInjected = false;

    // Guarantee Scope
    this.injectScripts = this.injectScripts.bind(this);
    this.onInjectScriptsLoad = this.onInjectScriptsLoad.bind(this);
    this.forwardEventDataToObservers = this.forwardEventDataToObservers.bind(this);
  }

  getReceiver() {
    if (ExecutionEnvironment.canUseDOM) {
      const iframe = document.getElementById(PAYMENT_JS_IFRAME_ID);
      return iframe && iframe.contentWindow;
    }
    return undefined;
  }

  saveCreditCard(num, exp, cvv) {
    const creditCardCredentials = {
      cc: removeNonNumericChars(num),
      exp_date: removeNonNumericChars(exp),
      cvv: removeNonNumericChars(cvv)
    };

    const receiver = this.getReceiver();
    if (receiver) {
      receiver.postMessage(creditCardCredentials, FIRSTDATA_DOMAIN);
    }
  }

  /**
   * @description Subscribes observer to a particular event
   * @param  {string} eventKey such as 'generateToken'
   * @param  {Function} observer to be subscribed
   * @returns {undefined}
   */
  subscribe(eventKey, observer) {
    const observers = this.observers[eventKey];
    observers.push(observer);
  }

  /**
   * @description Unsubscribes observer from a particular event
   * @param  {string} eventKey such as 'generateToken'
   * @param  {Function} observer to be unsubscribed
   * @returns {undefined}
   */
  unsubscribe(eventKey, observer) {
    const observers = this.observers[eventKey];
    const index = observers.indexOf(observer);
    if (index > -1) {
      observers.slice(index, 1);
    }
  }

  /**
   * @description Accepts any payload, attempts to identify the event based upon parameters passed, and notify obervers subscribed to that event.
   * @param  {RestParam} ...args
   */
  forwardEventDataToObservers(event) {
    const payload = event || {};
    const data = payload.data || {};
    const messageData = typeof data === 'string' ? JSON.parse(data) : data;
    if (this.isGenerateTokenEvent(messageData)) {
      this.notifyAllGenerateToken(messageData);
    }
  }

  /**
   * @description Tries to determine if the payload is a Generate Token event.
   * @param  {RestParam} ...args
   * @returns {boolean} True if the payload implies Generate Token event, else false.
   */
  isGenerateTokenEvent(messageData) {
    const { status: httpStatus, results } = messageData || {};
    const { status, type: payloadType } = results || {};
    return httpStatus && status && payloadType === FIRSTDATA_FD_TOKEN;
  }

  notifyAllGenerateToken(messageData) {
    const observers = this.observers[EVENT_GENERATE_TOKEN];
    observers.forEach(observer => observer(messageData));
  }

  /**
   * @description Determines if the PaymentJs libs / iframe are accessible.
   */
  isApiLoaded() {
    return this.isScriptsInjected() && this.getReceiver();
  }

  /**
   * @description Determines if the PaymentJs libs have been injected via scripts tag.
   */
  isScriptsInjected() {
    return this.scriptsInjected;
  }

  /**
   * @description Adds PaymentJs libs to dom. Says nothing to whether they have completed loading or not.
   */
  injectScripts() {
    if (ExecutionEnvironment.canUseDOM && !this.isScriptsInjected()) {
      const script = document.createElement('script');
      script.src = FIRSTDATA_PAYMENTJS;
      script.async = true;
      script.onload = this.onInjectScriptsLoad;
      document.head.appendChild(script);
      this.scriptsInjected = true;
    }
  }

  /**
   * @description Attaches an event listener to allow us to parse PaymentJs events payloads and notify appropriate subscribers.
   */
  onInjectScriptsLoad() {
    if (ExecutionEnvironment.canUseDOM) {
      const fdc = new PaymentJS(this.apiKey, this.jsSecurityToken, this.taToken, this.fdToken);
      fdc.dsg();
      window.addEventListener(EVENT_MESSAGE, this.forwardEventDataToObservers, false);
    }
  }
}

export default new PaymentJsAPI({ apiKey: FIRSTDATA_API_KEY, jsSecurityToken: FIRSTDATA_JS_SECURITY_TOKEN, taToken: FIRSTDATA_TA_TOKEN, fdToken: FIRSTDATA_FD_TOKEN });
