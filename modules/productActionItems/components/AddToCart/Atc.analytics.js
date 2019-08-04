import { printBreadCrumbAndName } from '../../../../utils/breadCrumb';
import { hasItemsInCart as sessionHasItemsInCart } from '../../../../utils/UserSession';
import { naFallback } from '../../../../utils/analytics/generic';
import { createEnhancedAnalyticsProductItem } from '../../../../utils/analytics';

/**
 * @description logs analytics for any cart modal error message
 * @param  {Array} gtmDataLayer
 * @param  {Object} product
 * @param  {String} errorMessage
 * @returns {undefined}
 */
export const logErrorAnalytics = (gtmDataLayer, product, errorMessage) =>
  logAnalytics(gtmDataLayer, product, {
    event: 'errormessage',
    eventCategory: 'error message',
    eventAction: `cart modal error|${product.name}`,
    eventLabel: errorMessage
  });

/**
 * @description logs analytics for view minicart upon successful "add to cart" request
 * @param  {Array} gtmDataLayer
 * @param  {Object} product
 * @returns {undefined}
 */
export const logViewMiniCartAnalytics = (gtmDataLayer, product) =>
  logAnalytics(gtmDataLayer, product, {
    eventAction: 'view mini cart',
    minicartimpressions: 1
  });

/**
 * @description logs analytics for close "add to cart" modal
 * @param  {Array} gtmDataLayer
 * @param  {Object} product
 * @returns {undefined}
 */
export const logMiniCartCloseModalAnalytics = (gtmDataLayer, product) =>
  logAnalytics(gtmDataLayer, product, {
    eventAction: 'mini cart action',
    eventLabel: 'close modal',
    minicartimpressions: 0
  });

/**
 * @description creates an analytics JSON object with default values to be used by other analytics functions
 * @param  {Object} product
 * @returns {Object} the analytics JSON with default values
 */
const createDefaultAnalytics = (product = {}) => {
  const breadCrumbData = product.breadCrumb || '';
  return {
    event: 'shoppingcart',
    eventCategory: 'shopping cart',
    eventLabel: printBreadCrumbAndName(breadCrumbData, product.name, { printEmptyValues: false }).toLowerCase()
  };
};

/**
 * @description a helper function which logs analytics & allows for the defaultAnalytics object to be used when logging anlytics.
 * @param  {Array} gtmDataLayer
 * @param  {Object} product
 * @param  {Object} analytics - object containing new analytics properties to be logged, as well as any properties intended to override the defaultAnalytics props.
 * @returns {undefined}
 */
const logAnalytics = (gtmDataLayer, product, analytics = {}) => {
  gtmDataLayer.push({
    ...createDefaultAnalytics(product),
    ...analytics
  });
};

/**
 * @description logs enhanced analytics for "add to cart" request.
 * @param  {Array} gtmDataLayer
 * @param  {Object} product
 * @param  {string} selectedQuantity
 * @param  {Object} atcResponse
 * @param  {boolean} hasItemsInCart
 * @param  {boolean} isQuickView
 * @returns {boolean} the result of gtmDataLayer.push(...)
 */
export const logAnalyticsEnhanced = (gtmDataLayer, product, selectedQuantity, atcResponse, hasItemsInCart, isQuickView) => {
  try {
    if (!atcResponse || !atcResponse.orderId) return false;
    const isFirstProduct = !hasItemsInCart && sessionHasItemsInCart();
    const analyticsProductItem = createEnhancedAnalyticsProductItem(product);
    const eventAction = isQuickView ? 'add to cart|quick view' : 'add to cart';

    return gtmDataLayer.push({
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction,
      eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name, { printEmptyValues: false }).toLowerCase(),
      ecommerce: {
        currencyCode: 'USD',
        add: {
          products: [
            {
              name: analyticsProductItem.name,
              id: analyticsProductItem.parentSku,
              price: analyticsProductItem.salePrice,
              brand: analyticsProductItem.brand,
              category: analyticsProductItem.category,
              variant: analyticsProductItem.childSku,
              quantity: naFallback(selectedQuantity),
              dimension4: analyticsProductItem.isAvailableInStore,
              dimension5: naFallback(atcResponse.orderId[0]),
              dimension25: analyticsProductItem.promoText,
              dimension29: analyticsProductItem.productFindingMethod,
              dimension72: analyticsProductItem.childSku,
              dimension74: analyticsProductItem.parentSkuProductName,
              dimension68: analyticsProductItem.color,
              dimension70: analyticsProductItem.team,
              dimension77: analyticsProductItem.isSpecialOrder,
              metric22: analyticsProductItem.salePrice,
              metric46: isFirstProduct ? '1' : '0'
            }
          ]
        }
      },
      dimension76: analyticsProductItem.isSpecialOrder,
      dimension24: analyticsProductItem.promoText,
      dimension28: analyticsProductItem.productFindingMethod,
      metric21: analyticsProductItem.salePrice,
      metric45: isFirstProduct ? '1' : '0'
    });
  } catch (e) {
    return null;
  }
};
