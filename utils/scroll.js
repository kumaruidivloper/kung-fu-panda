/**
 * WIP - currently just a proof of concept
 * npm sweet-scroll wrapper.
 * Wraps sweet-scroll as an interface, allowing us to interact with sweet-scroll as if it were the native Element.scrollIntoView method.
 */
import SweetScroll from 'sweet-scroll';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

const baseSweetScrollOptions = {
  offset: -120,
  after(props, isCancel, scroller) {
    scroller.destroy();
  }
};

/**
 * @param  {Element} el - the element to scroll into view
 * @param  {boolean|Object} param - can either be a boolean for alignToTop or it can be an object of scrollIntoViewOptions - https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 * @param  {Element} container - element whose scroll bar will be scrolled.  If null, will scroll body.
 */
export const scrollIntoView = (el, param = {}, container) => {
  if (!el) {
    return null;
  }

  const alignToTop = param === true;
  const alignToBottom = param === false;
  if (alignToTop) {
    return scrollAlignToTop(el);
  }

  if (alignToBottom) {
    return scrollAlignToBottom(el);
  }

  if (ExecutionEnvironment.canUseDOM) {
    const options = { ...baseSweetScrollOptions, ...param };
    const scroller = new SweetScroll(options, container);
    return scroller.toElement(el);
  }

  return null;
};

/**
 * @description WIP
 * @param  {Element} el - the element to scroll into view
 * @param  {Element} container - element whose scroll bar will be scrolled.  If null, will scroll body.
 */
const scrollAlignToTop = (el, container) => {
  if (ExecutionEnvironment.canUseDOM) {
    const options = { ...baseSweetScrollOptions };
    const scroller = new SweetScroll(options, container);
    return scroller.toElement(el);
  }
  return null;
};

/**
 * @description WIP
 * @param  {Element} el - the element to scroll into view
 * @param  {Element} container - element whose scroll bar will be scrolled.  If null, will scroll body.
 */
const scrollAlignToBottom = (el, container) => {
  if (ExecutionEnvironment.canUseDOM) {
    const options = { ...baseSweetScrollOptions };
    const scroller = new SweetScroll(options, container);
    return scroller.toElement(el);
  }
  return null;
};
/**
 * utility function to scroll to top of page.
 */
export const scrollToTop = () => {
  if (ExecutionEnvironment.canUseDOM) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

/**
 * Forces page to render at top when back button is used to navigate to it.
 */
export const forcePageToRenderAtTop = () => {
  if (ExecutionEnvironment.canUseDOM) {
    window.addEventListener('unload', () => {});
  }
};
/**
 * Forces page to render at top when back button is used to navigate to it for PDP page
 * forcePageToRenderAtTop is not working for PDP page
 */
export const forcePageToRenderAtTopPDP = () => {
  if (ExecutionEnvironment.canUseDOM) {
    window.addEventListener('beforeunload', () => {
      window.scrollTo(0, 0);
    });
  }
};

