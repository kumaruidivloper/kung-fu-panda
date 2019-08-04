import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

const logPubSubEventsName = eventName => {
  window.PubSubRegistries = window.PubSubRegistries || [];
  window.PubSubRegistries.push(eventName);
};

const clearPubSubEventsName = eventName => {
  window.PubSubRegistries = window.PubSubRegistries || [];
  if (!eventName) {
    window.PubSubRegistries.length = 0;
  }
};

class PubSub {
  constructor() {
    throw new Error('Cannot construct PubSub!');
  }

  /**
   *
   * @param eventName {String} Name of the event to register with
   * @param data {Object} Data to be sent to the subscriber
   */
  static publish(eventName, data) {
    if (!ExecutionEnvironment.canUseDOM) return;
    if (window.ASOData.EventBus.shouldDefer) {
      window.ASOData.EventBus.deferPublish(eventName, data);
    } else {
      window.PubSub.publish(eventName, data);
    }
  }

  /**
   *
   * @param eventName {String} Name of the event to register with
   * @param fnCallback {Function} The callback function
   */
  static subscribe(eventName, fnCallback) {
    if (!ExecutionEnvironment.canUseDOM) return;
    logPubSubEventsName(eventName);
    window.PubSub.subscribe(eventName, fnCallback);
  }

  /**
   *
   * @param eventName {String} Name of the event to register with
   * @param fnCallback {Function} The callback function
   */
  static subscribeOnce(eventName, fnCallback) {
    if (!ExecutionEnvironment.canUseDOM) return;
    logPubSubEventsName(eventName);
    window.PubSub.clearAllSubscriptions(eventName, fnCallback);
  }

  /**
   *
   */
  static clearAllSubscriptions() {
    if (!ExecutionEnvironment.canUseDOM) return;
    clearPubSubEventsName();
    window.PubSub.clearAllSubscriptions();
  }

  /**
   *
   * @param eventName {String} Name of the event to register with
   */
  static clearSubscriptions(eventName) {
    if (!ExecutionEnvironment.canUseDOM) return;
    clearPubSubEventsName(eventName);
    window.PubSub.clearSubscriptions(eventName);
  }

  /**
   *
   * @param token {Object} The token/reference of the subscriber
   */
  static unsubscribe(token) {
    if (!ExecutionEnvironment.canUseDOM) return;
    window.PubSub.unsubscribe(token);
  }
}

export default PubSub;
