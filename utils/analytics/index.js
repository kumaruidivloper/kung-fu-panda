import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { toLowerCase, naFallbackWrapProps, naFallback } from './generic';
import { getCategoryFromBreadcrumb } from '../breadCrumb';
import {
  N_A,
  INTERNAL_SEARCH,
  IN_PAGE_BROWSE,
  OTHER,
  TEAM,
  REGULAR,
  SPECIAL_ORDER,
  TRUE_STRING,
  KEY_WAS_NOW_PRICE,
  KEY_PRICE_IN_CART,
  KEY_HOT_DEALS,
  KEY_CLEARANCE,
  KEY_PRICE_DROP,
  KEY_REGULAR,
  ATTR_KEY_COLOR
} from './constants';

const PROMO_TEXT = {};
PROMO_TEXT[toLowerCase(KEY_CLEARANCE)] = 'clearance';
PROMO_TEXT[toLowerCase(KEY_HOT_DEALS)] = 'hot deal';
PROMO_TEXT[toLowerCase(KEY_PRICE_IN_CART)] = 'map price';
PROMO_TEXT[toLowerCase(KEY_WAS_NOW_PRICE)] = 'was price';
PROMO_TEXT[toLowerCase(KEY_PRICE_DROP)] = REGULAR;
PROMO_TEXT[toLowerCase(KEY_REGULAR)] = REGULAR;

/**
 * @param  {Array} gtmDataLayer=[] - array that contains object to be pushed to GTM.
 * @param  {Object} analyticsData={} - object to be pushed to GTM
 */
export const pushAnalyticsData = (gtmDataLayer = [], analyticsData = {}) => {
  if (Array.isArray(gtmDataLayer)) {
    const data = Object.keys(analyticsData).reduce(
      (obj, key) => ({
        ...obj,
        [key]: toLowerCase(naFallback(analyticsData[key]))
      }),
      {}
    );
    return gtmDataLayer.push(data);
  }

  console.error('GTM DataLayer not found'); //eslint-disable-line
  return false;
};

/**
 * @description Searches the ProductItem data object for a Color attribute and returns the color if it exists.
 * @param  {Object} productItem
 * @returns {string} the Color associated with the productItem if found.  Returns n/a if not found;
 */
const getColor = (productItem = {}) => {
  const attrColorId = (productItem.selectedIdentifier || {})[ATTR_KEY_COLOR];
  if (attrColorId) {
    const attrColor = ((productItem.identifiersMap || {})[ATTR_KEY_COLOR] || []).find(attr => attr && attr.itemId === attrColorId);
    return attrColor && attrColor.text ? attrColor.text : N_A;
  }
  return N_A;
};

/**
 * @param  {Object} productItem={}
 * @
 */
export const getPromotionText = (productItem = {}) => {
  const { price = {} } = productItem;
  const firstMatchingAdBug = getFirstAdBugMatching([KEY_HOT_DEALS, KEY_CLEARANCE, KEY_PRICE_DROP], productItem);

  if (firstMatchingAdBug) {
    return PROMO_TEXT[toLowerCase(firstMatchingAdBug)];
  }

  if (price.priceMessage === KEY_PRICE_IN_CART || price.priceMessage === KEY_WAS_NOW_PRICE) {
    return PROMO_TEXT[toLowerCase(price.priceMessage)];
  }

  return PROMO_TEXT[toLowerCase(REGULAR)];
};

export const getFirstAdBugMatching = (keys, productItem = {}) => {
  const { adBug = [] } = productItem;
  return adBug.find(key => keys.find(key2 => toLowerCase(key2) === toLowerCase(key)));
};

export const getProductFirstAdBug = (productItem = {}) => {
  const { adBug = [] } = productItem;
  return adBug[0];
};

/**
 * @description Removes the protocol & domain from a URL if it is an internal URL (i.e. matches www.academy.com).  This allows us to create relative URLs for logging purposes.
 * @param  {string} url='' A URL string to format.
 * @returns  {string} If an external URL was passed in via params, this returns the external URL.  If an internal URL was passed in via params, this returns the relative URL.
 */
const stripOutProtocalAndDomain = (url = '') =>
  ExecutionEnvironment.canUseDOM ? url.replace(`${document.location.protocol}//${document.location.hostname}`, '') : url;

/**
 * @description Attempts to determine the product finding method based upon the referral URL.
 * @param  {string} path='' A URL string as returned from stripOutProtocalAndDomain, originally the document.referrer path.  If it receives an absolute URL, it will assume that an external URL was passed in.
 * @returns  {string} The product finding method used to reach the current PDP page.
 */
const getProductFindingMethod = (path = '') => {
  const isInternal = path.substr(0, 1) === '/';
  if (isInternal && /searchterm=/i.test(path)) {
    return INTERNAL_SEARCH;
  }

  if (isInternal) {
    return IN_PAGE_BROWSE;
  }

  return OTHER;
};

/**
 * @description Searches the ProductItem data object for the online inventory message object and returns it if exists.
 * @param  {Object} productItem
 * @return {Object} online inventory messages object matching productItem.skuid
 */
const getOnlineInventoryMessagesBySkuId = (productItem = {}) => {
  const { skuId, inventory = {} } = productItem;
  const { online: inventoryMessages = [] } = inventory;
  return inventoryMessages.find(msg => msg.skuId === skuId);
};

/**
 * @description Searches the ProductItem data object for the online delivery message string and returns it if exists.
 * @param  {Object} productItem
 * @return {string} online delivery message as seen on pdp
 */
const getOnlineDeliveryMessage = productItem => {
  const messages = getOnlineInventoryMessagesBySkuId(productItem);
  return (
    (messages &&
      messages.deliveryMessage &&
      messages.deliveryMessage.onlineDeliveryMessage &&
      messages.deliveryMessage.onlineDeliveryMessage.value) ||
    null
  );
};

/**
 * @description Searches the ProductItem data object for the store delivery message string and returns it if exists.
 * @param  {Object} productItem
 * @return store deliver message as seen on pdp
 */
const getStoreDeliveryMessage = productItem => {
  const messages = getOnlineInventoryMessagesBySkuId(productItem);
  return (
    (messages && messages.deliveryMessage && messages.deliveryMessage.storeDeliveryMessage && messages.deliveryMessage.storeDeliveryMessage.value) ||
    null
  );
};

/**
 * @description Searches the ProductItem data object for store delivery message in order to determine if the product is available in stores.
 * @param  {Object} productItem
 * @return {boolean} - true if item is available in store or false
 */
const getIsAvailableInStore = productItem => {
  const messages = getOnlineInventoryMessagesBySkuId(productItem);
  return (
    (messages &&
      messages.deliveryMessage &&
      messages.deliveryMessage.storeDeliveryMessage &&
      messages.deliveryMessage.storeDeliveryMessage.showTick === TRUE_STRING) ||
    false
  );
};

/**
 * @description Searches the ProductItem data object for a Team attribute and returns the team name if it exists.
 * @param  {Object} productItem
 * @returns {string} the Team associated with the productItem if found.  Returns n/a if not;
 */
const getProductItemTeam = (productItem = {}) => {
  const { productAttributes = [] } = productItem;
  const attribute = productAttributes.find(attr => toLowerCase(attr.key) === TEAM);
  return attribute ? attribute.value : N_A;
};

const getPath = isQuickView => (ExecutionEnvironment.canUseDOM ? (isQuickView ? document.location.href.toString() : document.referrer) : null); // eslint-disable-line

export const createEnhancedAnalyticsProductItem = (productItem, isQuickView = false) => {
  const { partNumber, name, price, breadCrumb, itemId, productType, bvRating, manufacturer, id, productPrice = {} } = productItem;
  const { listPrice, salePrice } = price || productPrice;
  const productFindingMethodPath = getPath(isQuickView);
  const result = {
    notApplicable: N_A,

    productFindingMethod:
      ExecutionEnvironment.canUseDOM && productFindingMethodPath ? getProductFindingMethod(stripOutProtocalAndDomain(productFindingMethodPath)) : N_A,

    name,
    brand: toLowerCase(manufacturer),
    category: toLowerCase(getCategoryFromBreadcrumb(breadCrumb)),
    isSpecialOrder: toLowerCase(productType) === SPECIAL_ORDER,
    promoText: toLowerCase(getPromotionText(productItem)),

    rating: bvRating,
    price: listPrice || salePrice,
    salePrice: salePrice || listPrice,

    parentSku: partNumber,
    childSku: itemId || id,
    parentSkuProductName: `${partNumber || N_A} - ${name}`,

    adBug: toLowerCase(getProductFirstAdBug(productItem) || REGULAR),

    isAvailableInStore: getIsAvailableInStore(productItem),
    onlineDeliveryMessage: toLowerCase(getOnlineDeliveryMessage(productItem)),
    storeDeliveryMessage: toLowerCase(getStoreDeliveryMessage(productItem)),

    color: toLowerCase(getColor(productItem)),
    team: toLowerCase(getProductItemTeam(productItem))
  };
  return naFallbackWrapProps(result);
};

// push enhancedAnalytics for pdp page
export const enhancedAnalyticsPDP = ({ gtmDataLayer, productItem, isQuickView }) => {
  if (!productItem) return false;

  const analyticsProductItem = createEnhancedAnalyticsProductItem(productItem, isQuickView);
  const eventObj = isQuickView ? { event: 'pdpLoad' } : {};
  if (gtmDataLayer) {
    return gtmDataLayer.push({
      /* event: PDP_LOAD, commenting out the event due to KER-13195 */
      ...eventObj,
      ecommerce: {
        detail: {
          products: [
            {
              name: analyticsProductItem.name,
              id: analyticsProductItem.parentSku,
              price: analyticsProductItem.salePrice,
              brand: analyticsProductItem.brand,
              category: analyticsProductItem.category,
              variant: analyticsProductItem.childSku,
              dimension4: analyticsProductItem.isAvailableInStore,
              dimension25: analyticsProductItem.promoText,
              dimension77: analyticsProductItem.isSpecialOrder,
              dimension29: analyticsProductItem.productFindingMethod,
              dimension68: analyticsProductItem.color,
              dimension31: analyticsProductItem.notApplicable,
              dimension42: analyticsProductItem.notApplicable,
              dimension43: analyticsProductItem.rating,
              dimension34: analyticsProductItem.onlineDeliveryMessage,
              dimension35: analyticsProductItem.storeDeliveryMessage,
              dimension70: analyticsProductItem.team,
              dimension74: analyticsProductItem.parentSkuProductName
            }
          ]
        }
      },
      dimension24: analyticsProductItem.promoText,
      dimension76: analyticsProductItem.isSpecialOrder,
      dimension28: analyticsProductItem.productFindingMethod,
      dimension40: analyticsProductItem.notApplicable,
      dimension41: analyticsProductItem.notApplicable
    });
  }
  return null;
};

// return true or false if enhanced analytics has been added to dataLayer for a given product
// that has been added to cart
export const hasProductBeenAddedToCart = ({ gtmDataLayer, product }) => {
  let ecommerceProduct;
  const eCommerceObjects = gtmDataLayer.filter(obj => obj.ecommerce);
  const found = eCommerceObjects.find(obj => {
    const newObj = obj.ecommerce.add || obj.ecommerce.detail;
    ecommerceProduct = newObj && newObj.products[0];
    return (
      ecommerceProduct && ecommerceProduct.id === product.id && ecommerceProduct.name === product.name && ecommerceProduct.variant === product.skuId
    );
  });
  return !!found;
};
/**
 * @description method to create promotional Impression for Enhanced Ecommerce Analytics
 * @param  {array} gtmDataLayer an array containing object to be pushed to google tag manager
 * @param  {object} cms an object containing analytics data setup in AEM
 */
export const enhancedAnalyticsPromoImpression = (gtmDataLayer, cms, sendEvent = true) => {
  let enhancedEcommerce = '';
  const { dimension83, name, id, position, creative } = cms;
  if ((name || id || cms.promotions) && gtmDataLayer) {
    const promoName = `${name || id}|${dimension83}`;
    const promotions =
      cms.promotions && cms.promotions.length > 0
        ? cms.promotions
        : [
            {
              id: id || name,
              name: promoName,
              creative,
              position
            }
          ];
    enhancedEcommerce = {
      ecommerce: {
        promoView: {
          promotions
        }
      }
    };
    if (sendEvent) {
      enhancedEcommerce.event = 'promotionImpression';
    }
    return gtmDataLayer.push(enhancedEcommerce);
  }
  return false;
};
/**
 * @description method to create promotional Click for Enhanced Ecommerce Analytics
 * @param  {array} gtmDataLayer an array containing object to be pushed to google tag manager
 * @param  {object} cms an object containing analytics data setup in AEM
 * @param  {string} eventAction a string containing promotion name
 * @param  {string} eventLabel a string containing clicked URL
 */
export const enhancedAnalyticsPromoClick = (gtmDataLayer, cms, eventLabel = N_A) => {
  const { dimension83, name, id, position, creative } = cms;
  let enhancedEcommerceClick = '';
  if ((name || id) && gtmDataLayer) {
    const promoName = `${name || id}|${dimension83}`;
    const promotions = [
      {
        id: id || name,
        name: promoName,
        creative,
        position
      }
    ];
    enhancedEcommerceClick = {
      event: 'promotionClick',
      eventCategory: 'internal promo',
      eventAction: `promo|${name || id}`,
      eventLabel: eventLabel ? decodeURIComponent(eventLabel).split('?')[0] : N_A,
      ecommerce: {
        promoClick: {
          promotions
        }
      }
    };
    return gtmDataLayer.push(enhancedEcommerceClick);
  }
  return false;
};
