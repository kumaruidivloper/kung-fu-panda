/* eslint no-underscore-dangle: [2, { "allow": ["_cc"] }] */
import { IN_AUTH_COLLECTOR_HOST, FIRSTDATA_SID } from '@academysports/aso-env';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

class BrowserDataCollector {
  constructor() {
    if (!BrowserDataCollector.instance) {
      this.transactionId = null;
      this.scriptsInjected = false;
      BrowserDataCollector.instance = this;
    }
    return BrowserDataCollector.instance;
  }

  /**
   * set transaction id
   * @param transactionId
   */
  set transactionIdentifier(transactionId) {
    this.transactionId = transactionId;
  }

  /**
   * Inject inAuth script into DOM
   * @returns {Promise}
   */
  injectScripts() {
    if (!ExecutionEnvironment.canUseDOM) {
      return Promise.reject(new Error('DOM is not available!'));
    }
    if (!this.isScriptsInjected()) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${document.location.protocol === 'https:' ? 'https://' : 'http://'}${IN_AUTH_COLLECTOR_HOST}/cc.js?sid=${FIRSTDATA_SID}&ts=${
          this.transactionId
        }`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Error occurred while loading collector script!'));
        document.head.appendChild(script);
        this.scriptsInjected = true;
      });
    }
    return Promise.reject(new Error('Browser data collector script is already available in DOM!'));
  }

  /**
   * Returns injected state of the script
   * @returns {boolean}
   */
  isScriptsInjected() {
    return this.scriptsInjected;
  }

  /**
   * Start collecting browser data
   * @returns {Promise}
   */
  beginCollectingData() {
    if (ExecutionEnvironment.canUseDOM) {
      return new Promise((resolve, reject) => {
        this.injectScripts()
          .then(() => {
            this.initBrowserCollector();
            this.dataCollectionComplete().then(info => {
              resolve(info);
            });
          })
          .catch(err => {
            reject(err);
          });
      });
    }
    return this;
  }

  /**
   * Init browser collector with required params
   * ci - Set custom identifiers to be included in the collected data
   * run - Tells the collector to start collecting data from the user's browser
   */
  initBrowserCollector() {
    if (ExecutionEnvironment.canUseDOM) {
      window._cc = window._cc || [];
      // tells the collector to start collecting data from the user's browser
      window._cc.push([
        'ci',
        {
          sid: FIRSTDATA_SID,
          tid: this.transactionId
        }
      ]);
      window._cc.push(['run', (document.location.protocol === 'https:' ? 'https://' : 'http://') + IN_AUTH_COLLECTOR_HOST]);
    }
  }

  /**
   * Adds a callback to retrieve device information in the browser
   * crdi - Adds a callback to retrieve device information in the browser
   * @returns {Promise}
   */
  dataCollectionComplete() {
    return new Promise(resolve => {
      window._cc.push([
        'crdi',
        info => {
          resolve(info);
        }
      ]);
    });
  }
}

const instance = new BrowserDataCollector();

export default instance;
