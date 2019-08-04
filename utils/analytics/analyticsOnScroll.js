import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { enhancedAnalyticsPromoImpression } from './index';
import { enhancedPromotions } from './enhancedPromotions';
let isScroll = false;
/**
 *returns true if window is scrolled
 *
 */
const attachScroll = () => {
  isScroll = true;
  window.removeEventListener('scroll', attachScroll);
};
if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener('scroll', attachScroll);
  if ('IntersectionObserver' in window) {
    window.addEventListener('load', () => {
      attachIntersectionObserver();
    });
    window.addEventListener('beforeunload', () => {
      attachIntersectionObserver().disconnect();
      window.removeEventListener('load', attachIntersectionObserver);
      window.removeEventListener('scroll', attachScroll);
    });
  }
}
/**
 *
 *
 * @returns observer for promo elements
 */
const attachIntersectionObserver = () => {
  const elements = [...document.querySelectorAll('.c-promo-impression-tracking')];
  const options = {
    root: null, // avoiding 'root' or setting it to 'null' sets it to default value: viewport
    rootMargin: '0px',
    threshold: 0.5
  };
  const promoObserver = new IntersectionObserver((entries, observer) => analyticstracking(observer, entries), options);

  elements.forEach(element => promoObserver.observe(element));
  window.promoObserver = promoObserver;
  return promoObserver;
};
/**
 *
 *
 * @param {array} elmentEntries array of promo elements
 */
const analyticstracking = (observer, elmentEntries = []) => {
  if (elmentEntries.length > 0 && ExecutionEnvironment.canUseDOM && window.dataLayer) {
    elmentEntries.forEach(element => {
      if (element && element.intersectionRatio > 0.5) {
        let mainElement = element.target;
        let cmsData = '';
        do {
          if (mainElement && mainElement.hasAttribute('data-compid')) {
            cmsData = window.ASOData[mainElement.getAttribute('data-compid')].cms;
            const promotions = enhancedPromotions(mainElement.getAttribute('data-component'), cmsData);
            enhancedAnalyticsPromoImpression(window.dataLayer, promotions, isScroll);
            observer.unobserve(element.target);
          }
          mainElement = mainElement && mainElement.parentElement;
        } while (mainElement !== null || !cmsData);
      }
    });
  }
};
