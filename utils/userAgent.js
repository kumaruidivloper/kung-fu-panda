import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

export const isMobile = () =>
ExecutionEnvironment.canUseDOM &&
window.navigator.userAgent.toLowerCase().match(/android|blackberry|tablet|mobile|iphone|ipad|ipod|opera mini|iemobile/i) !== null;

export const isIpad = () =>
ExecutionEnvironment.canUseDOM &&
window.navigator.userAgent.toLowerCase().match(/ipad|ipod/i) !== null;
