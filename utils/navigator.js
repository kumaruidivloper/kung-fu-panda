import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

export const isMobile = onlyPhone => {
  let mobileDevice = false;
  if (ExecutionEnvironment.canUseDOM) {
    mobileDevice = onlyPhone
      ? window.navigator.userAgent
          .toLowerCase()
          .match(
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
          ) !== null
      : window.navigator.userAgent.toLowerCase().match(/android|blackberry|tablet|mobile|iphone|ipad|ipod|opera mini|iemobile/i) !== null;
  }
  return mobileDevice;
};

/**
 *  utility function to check whether device is Mac/ios based or not.
 *  @returns true if devices is mac/ios based else returns false
 */
export const isMacLike = () => (!ExecutionEnvironment.canUseDOM ? null : window.navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) !== null);
/**
 * utility function to check if the device is an iPad.
 * @returns true if devices is an iPad
 */
export const isIpad = () => (!ExecutionEnvironment.canUseDOM ? null : window.navigator.platform.match(/(iPod|iPad)/i) !== null);
/**
 *  utility function to check whether device is Mac/ios based or not.
 *  @returns true if devices is iphone else returns false
 */
export const isIphone = () => (!ExecutionEnvironment.canUseDOM ? null : window.navigator.platform.match(/(iPhone)/i) !== null);

export const navigatorOptions = {
  enableHighAccuracy: true,
  timeout: 10000
};

/**
 *  potential singleton implementation
 */

// class Navigator {
//   valIsMobile = null;

//   isMobile() {
//     if (!ExecutionEnvironment.canUseDOM || this.valIsMobile !== null) {
//       return this.valIsMobile;
//     }

//     if (ExecutionEnvironment.canUseDOM && this.valIsMobile === null) {
//       this.valIsMobile = window.navigator.userAgent.toLowerCase().match(/android|blackberry|tablet|mobile|iphone|ipad|ipod|opera mini|iemobile/i) !== null;
//     }
//     return this.valIsMobile;
//   }
// }

// export default new Navigator();
