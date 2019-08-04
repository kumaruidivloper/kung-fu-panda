import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { scrollIntoView } from './scroll';

class FormErrorScrollManager {
  constructor(cssSelector = '.form-scroll-to-error') {
    this.cssSelector = cssSelector;
  }

  /**
   * @description Attemps to find form errors on DOM and scroll to them.
   * @param  {Object} params - optional
   * @param  {Element} params.container - optional - only needed if you are scrolling inside an element instead of page body.
   */
  scrollToError(params = {}) {
    const { container } = params;
    if (ExecutionEnvironment.canUseDOM) {
      setTimeout(() => {
        const firstError = document.querySelector(this.cssSelector);
        if (firstError) {
          scrollIntoView(firstError, {}, container);
        }
      }, 1);
    }
  }
}

export default FormErrorScrollManager;
