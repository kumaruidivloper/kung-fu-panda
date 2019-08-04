import 'core-js/fn/object/assign';
import 'core-js/fn/set';
import 'core-js/fn/map';
import 'core-js/fn/promise';
import 'core-js/fn/array/find';
import 'core-js/fn/array/from';
import 'core-js/es6/symbol';
import 'core-js/fn/string/starts-with';
import 'core-js/fn/array/find-index';
import 'core-js/fn/array/includes';
// polyfill for intersection-observer
require('intersection-observer');
/**
 * Polyfills for Element.matches and Element.closest
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = s => {
    let ancestor = this;
    // eslint-disable-next-line
    if (!document.documentElement.contains(el)) {
      return null;
    }
    do {
      if (ancestor.matches(s)) return ancestor;
      ancestor = ancestor.parentElement;
    } while (ancestor !== null);
    // eslint-disable-next-line
    return el;
  };
}
