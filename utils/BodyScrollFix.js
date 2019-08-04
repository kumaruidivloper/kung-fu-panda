/* eslint-disable */
/**
 * Prevent body scroll and overscroll.
 * Tested on mac, iOS chrome / Safari, Android Chrome.
 *
 * Use in combination with:
 * html, body {overflow: hidden;}
 *
 * and: -webkit-overflow-scrolling: touch; for the element that should scroll.
 *
 * disableBodyScroll('.scrollContent');
 * enableBodyScroll('.scrollContent');
 */
let _selector = false;
let _element = false;
let _clientY;
let scrollPos = '0px';
const BodyScrollFix = {
  /**
   * Prevent default unless within _selector
   *
   * @param {Object} event event
   * @return void
   */
  preventBodyScroll: function(event) {
    if (false === _element || !event.target.closest(_selector)) {
      event.preventDefault();
    }
  },
  /**
   * Cache the clientY co-ordinates for
   * comparison
   *
   * @param {Object} event event
   * @return void
   */
  captureClientY: function(event) {
    // only respond to a single touch
    if (event.targetTouches.length === 1) {
      _clientY = event.targetTouches[0].clientY;
    }
  },
  /**
   * Detect whether the element is at the top
   * or the bottom of their scroll and prevent
   * the user from scrolling beyond
   *
   * @param {Object} event event
   * @return void
   */
  preventOverscroll: function(event) {
    // only respond to a single touch
    if (event.targetTouches.length !== 1) {
      return;
    }

    const clientY = event.targetTouches[0].clientY - _clientY;

    // The element at the top of its scroll,
    // and the user scrolls down
    if (_element && _element.scrollTop === 0 && clientY > 0) {
      event.preventDefault();
    }

    // The element at the bottom of its scroll,
    // and the user scrolls up
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
    if ((_element && _element.scrollHeight) - (_element && _element.scrollTop) <= (_element && _element.clientHeight && clientY < 0)) {
      event.preventDefault();
    }
  },
  /**
   * Disable body scroll. Scrolling with the selector is
   * allowed if a selector is porvided.
   *
   * @param {String} selector Selector to element to change scroll permission
   * @return void
   */
  disableBodyScroll: function(selector) {
    if (typeof selector !== 'undefined') {
      _selector = selector;
      _element = document.querySelector(selector);
    }
    const bodyElStyle = document.getElementsByTagName('body')[0].style;
    bodyElStyle.overflow = 'hidden';
    scrollPos = `${-window.scrollY}px`;
    bodyElStyle.top = scrollPos;
    bodyElStyle.position = 'fixed';
    if (_element && false !== _element) {
      _element.addEventListener('touchstart', this.captureClientY, { passive: false });
      _element.addEventListener('touchmove', this.preventOverscroll, { passive: false });
    }
    document.body.addEventListener('touchmove', this.preventBodyScroll, { passive: false });
  },
  /**
   * Enable body scroll. Scrolling with the selector is
   * allowed if a selector is porvided.
   *
   * @param {String} selector Selector to element to change scroll permission
   * @return void
   */
  enableBodyScroll: function(selector) {
    if (typeof selector !== 'undefined') {
      _selector = selector;
      _element = document.querySelector(selector);
    }
    const bodyEl = document.getElementsByTagName('body')[0];
    bodyEl.removeAttribute('style');
    // const bodyElStyle = bodyEl.style;
    // bodyElStyle.top = 0;
    window.scrollTo(0, Math.abs(parseInt(scrollPos, 10)));
    // bodyElStyle.position = 'absolute';
    if (_element && false !== _element) {
      _element.removeEventListener('touchstart', this.captureClientY, { passive: false });
      _element.removeEventListener('touchmove', this.preventOverscroll, { passive: false });
    }
    document.body.removeEventListener('touchmove', this.preventBodyScroll, { passive: false });
  }
};
export default BodyScrollFix;
