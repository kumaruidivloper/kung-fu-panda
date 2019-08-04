import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

export default class EventBus {
  constructor(pubSub, loadCompleteEvtName) {
    this.pubSub = pubSub;
    this.loadCompleteEvtName = loadCompleteEvtName;
    this.shouldDefer = true;
    this.deferredPublish = [];
    this.initialize();
  }

  handleASOLoadComplete() {
    if (!this.deferredPublish) {
      console.warn('No registered events to publish!'); //eslint-disable-line
    }
    if (!ExecutionEnvironment.canUseDOM) return;
    this.deferredPublish.forEach(eventObject => {
        this.pubSub.publish(eventObject.eventType, eventObject.params);
    });
    this.shouldDefer = false;
    // clean the deferredPublish list
    this.deferredPublish.length = 0;
  }

  deferPublish(eventType, params) {
    this.deferredPublish.push({ eventType, params });
  }

  initialize() {
    if (!ExecutionEnvironment.canUseDOM) return;
    this.pubSub.subscribeOnce(this.loadCompleteEvtName, () => this.handleASOLoadComplete());
  }
}
