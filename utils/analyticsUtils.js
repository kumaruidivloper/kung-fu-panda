/* analyticsUtils.js - All analytics based utlility functions reside here. Authored by @tejas.upmanyu */
import { get } from '@react-nitro/error-boundary';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { EVENT_NAME, EVENT_CATEGORY, EVENT_LABEL } from '../apps/myaccount/myaccount.constants';
/**
 * Utility function to collate analytics data and return the formatted object with all the required details.
 * @param {object} orderDetails response of orderDetails API
 * @param {object} shippingGroups specific shipping groups for which analytics data object has to be obtained.
 * @returns {object} analytics data object, containing key,value pairs required as per specs.
 */
export const collateAnalyticsData = (orderDetails, shippingGroups) => {
  if (shippingGroups && Object.keys(shippingGroups).length > 0) {
    const orderIds = shippingGroups.map(method => collateOrderIds(method));
    return getRefinedOrderItems(orderDetails, getAllOrderIds(orderIds));
  }
  return orderDetails.orderItems;
};
/**
 * helper function to collasce orderIdArray.
 * @param {array} orderIdArray
 * @returns {array} containing all order Ids.
 */
const getAllOrderIds = orderIdArray => {
  const orderIds = [];
  orderIdArray.map(orderId => orderIds.push(...orderId));
  return orderIds;
};
/**
 * helper function to extract order Ids from each shipment Method.
 * @param {object} shipmentMethod for which orderIds have to be extracted.
 * @returns {array} of orderIds in a shipment method.
 */
const collateOrderIds = shipmentMethod => {
  const { orderItems } = shipmentMethod;
  const result = orderItems.map(item => item.orderItemId);
  return result;
};
/**
 * gets orderItems from orderDetails based on passed orderIds - performs subsequent mapping according to analytics specs.
 * @param {object} orderDetails API response.
 * @param {array} orderItemIds list of orderIds.
 */
const getRefinedOrderItems = (orderDetails, orderItemIds) => {
  const { orderItems } = orderDetails;
  const refinedOrderItems = orderItems && orderItems.filter(item => orderItemIds.indexOf(item.orderItemId) > -1);
  return mapOrderItems(refinedOrderItems);
};
/**
 * map orderItem key values according to analytic object specs.
 * @param {object} orderItems list of order items.
 * @param {object} additionalAttributes additonal attributes to be added to each product object.
 */
export const mapOrderItems = (orderItems, additionalAttributes = {}) => {
  // map orderItems to the key, value structure in analytics specs.
  // TODO :- Replace blank string & hardcoded values, not available from API as of now.
  let analyticsObj = {};
  const mappedOrderItems = orderItems.map(item => {
    const adBug = get(item, 'skuDetails.skuInfo.adBug', []) || [];
    analyticsObj = {
      name: get(item, 'skuDetails.skuInfo.name', ''),
      id: get(item, 'skuDetails.skuInfo.parentSkuId', ''),
      price: item.unitPrice ? item.unitPrice * item.quantity : '',
      brand: get(item, 'skuDetails.skuInfo.manufacturer', ''), // to be changed when brand is available in API response everywhere.
      category: get(item, 'skuDetails.skuInfo.categoryName', ''), // category sku id to go here.
      variant: item.skuId || '',
      quantity: item.quantity || '',
      dimension4: '',
      dimension25: adBug.length > 0 ? adBugMapper(adBug[0]) : 'regular',
      dimension29: null,
      dimension72: item.skuId,
      dimension74: `${get(item, 'skuDetails.skuInfo.parentSkuId', '')} – ${get(item, 'skuDetails.skuInfo.name', '')}`, // parent sku id to go here.
      dimension70: sportsTeamName(item),
      dimension77: get(item, 'skuDetails.skuInfo.sofItem', 'false'),
      dimension68: colorForProduct(item),
      dimension34: getStockStatus(item, shipment.ONLINE),
      dimension35: getStockStatus(item, shipment.STORE),
      dimension86: typeOfOrder(item.availableShippingMethods) || '', // order type to go here.
      dimension87: orderType(item.isBundleItem).toString(),
      metric22: item.unitPrice.toString(),
      ...additionalAttributes // additional attributes to add.
    };
    return analyticsObj;
  });
  return mappedOrderItems;
};

export const analyticsDataConstructor = (item, quantity) => {
  const { skuInfo = {} } = item.skuDetails;
  const { manufacturer = '', categoryName = '' } = skuInfo;
  try {
    const analyticsObj = {
      name: item.skuDetails.skuInfo.name || '',
      id: item.skuDetails.skuInfo.parentSkuId || '',
      price: item.unitPrice ? item.unitPrice * quantity : '',
      brand: manufacturer || '',
      category: categoryName || '',
      variant: item.skuId || '',
      quantity: quantity || '',
      dimension4: item.skuDetails.inventory.store && item.skuDetails.inventory.store.length > 0,
      dimension5: item.orderItemId || '',
      dimension25: skuInfo.adBug && skuInfo.adBug.length > 0 ? adBugMapper(skuInfo.adBug[0]) : 'regular',
      dimension72: item.skuId || '',
      dimension74: `${item.skuDetails.skuInfo.parentSkuId || ''} – ${item.skuDetails.skuInfo.name || ''}`, // parent sku id to go here.
      dimension70: sportsTeamName(item),
      dimension68: colorForProduct(item),
      metric22: item.unitPrice ? item.unitPrice : '',
      metric46: 0
    };
    return analyticsObj;
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const sportsTeamName = product => {
  const skuAttributes = get(product, 'skuDetails.skuInfo.skuAttributes', {});
  const sportsTeam = skuAttributes.find(attr => attr.name === 'Team');
  return sportsTeam ? sportsTeam.values : 'n/a';
};
/**
 * helper function to get color attribute of a product, if present.
 * @param {object} product object containing all the details about a product
 */
export const colorForProduct = product => {
  const skuAttributes = get(product, 'skuDetails.skuInfo.skuAttributes', {});
  const color = skuAttributes.find(attr => attr.name === 'Color');
  return color ? color.value : 'n/a';
};
/**
 * helper function to get stock status for a given type of shipment method for a product.
 * @param {object} pro duct object containing all the details about a product
 * @param {string} type signifies the type of shipment. Online/Store
 */
const getStockStatus = (product, type) => get(product, `skuDetails.inventory[${type}].inventoryStatus`, 'n/a');

/* enum for shipmentMethods */
const shipment = {
  ONLINE: 'online',
  STORE: 'store'
};
/* computed property for order Type */
const orderType = flag => (flag ? 'bundled' : 'single');
/* computed property for pathname */
export const getPathName = () => (ExecutionEnvironment.canUseDOM ? document.location.pathname : '');

/* Filteration values for offer types. */
const offerTypes = ['Hot Sale', 'Clearance'];
/* To be incorporated, when API response contains AdBug */
const offerType = offer => offer.filter(type => offerTypes.includes(type)); // eslint-disable-line
/**
 * gets order fulfillment types based on shipping Mode from Order API response
 * @param {string} type shiping type recieved from API.
 */
const orderFulfillmentTypes = type => {
  switch (type) {
    case 'PICKUPINSTORE':
      return 'bopis';
    case 'STS':
      return 'ship to store';
    default:
      return 'ship to home';
  }
};

export const adBugMapper = (adBug = '') => {
  switch (adBug) {
    case 'Clearance':
      return 'clearance';
    case 'Hot Deal':
      return 'Hot Deal';
    default:
      return 'regular';
  }
};

/**
 * utility function to return pipe delimited string of order fulfillment types.
 * @param {object} availableShippingMethods for a product.
 */
export const typeOfOrder = availableShippingMethods => {
  const shippingMethods = availableShippingMethods.map(method => method.shippingType);
  const uniqueValuesOfShippingMethods = shippingMethods.filter((value, index) => shippingMethods.indexOf(value) === index);
  return uniqueValuesOfShippingMethods.length > 1
    ? uniqueValuesOfShippingMethods.reduce(
        (accumulator, shippingMethod) => `${orderFulfillmentTypes(accumulator)}|${orderFulfillmentTypes(shippingMethod)}`
      )
    : orderFulfillmentTypes(uniqueValuesOfShippingMethods[0]);
};

/* Spec sheet for reference. */

// {
//     'name': 'Triblend Android T-Shirt',       // Name (in sentence case) or ID is required.
//     'id': '12345',                           // ID will be the parent SKU of the product
//     'price': '15.25',
//     'brand': 'Google',
//     'category': 'Apparel',
//     'variant': '2323',                        // Variant will be the child SKU of the product
//     'quantity': <product quantity>,
//      'dimension4': 'true',                           //Set to “true” if product available in visitor’s store else 'false
//      'dimension25': 'regular',                       //Offer type
//      'dimension29': 'global search',                 // Product finding method
//      'dimension72': '<child SKU> e.g. 3452',
//      'dimension74': '(Parent Sku – Product Name (Product)) – set to the concatenation of parent sku and product name>',
//      'dimension70': 'LA Laker',                       //sports team if product belongs to a particular team or sporting event:NA if not applicable,
//      'dimension77': 'true or false',                                                  //special order firearm - true or false,
//      'dimension68': 'Blue',                                                             //color of the product, if not applicable send NA
//      'dimension34': 'Ships to my Store'                                         //online stock status (informs about the online stock status with the messaging as can be seen in the B11-750 - Shipping/Delivery          Related Messaging)
//       'dimension35': '<store stock status>'                      //store stock status details below (informs about the store stock status with the messaging as can be seen in the B11-750 - Shipping/Delivery Related Messaging)
//       'dimension86' : '<type of order> e.g. ship to home,bopis or ship to store.If more than one fulfillment are present pass the value with pipe separated delimiter',
//       'dimension87' : '<bundled/single>',                                            // if the product is purchased as a bundle pass the value as "bundled" else "single"
//       'metric22': '13.00',                                                                             / / Set to the price of the product
// }

/**
 * Utility function to collate analytics data for wishlist section.
 * @param {object} orderItems list of products in order/wishlist.
 */
export const collateWishlistProductsData = orderItems =>
  orderItems.map((item, index) => {
    const analyticsObj = {
      name: item.name || '',
      id: item.parentSkuId || '',
      price: item.price.salePrice && item.price.salePrice < item.price.listPrice ? item.price.salePrice : item.price.listPrice,
      brand: item.manufacturer || 'n/a',
      category: item.categoryName || 'n/a',
      variant: item.partNumber || '',
      list: 'wishlist',
      position: index + 1,
      dimension25: item.adBug ? adBugMapper(item.adBug[0]) : 'regular',
      metric43: 1
    };
    return analyticsObj;
  });

/*
 * Utility function to get error messages from DOM.
 * @param {*} testForms form elements from DOM
 * @param {*} errorSelectors errorSelectors to be selected from DOM.
 */
export const getErrorMessagesFromDOM = async (testForms, errorSelectors) =>
  new Promise(resolve => {
    const fieldErrors = [];
    // setTimeOut required for DOM commits to reflect.
    setTimeout(() => {
      [...testForms].forEach(form => {
        const invalidFields = form.querySelectorAll(errorSelectors);
        [...invalidFields].forEach(field => {
          if (field.textContent.trim()) {
            fieldErrors.push(field.textContent);
          }
        });
      });
      resolve(fieldErrors);
    }, 300);
  });
/**
 * return analytics data for client side error
 * @param {string} event - event name
 * @param {string} eventCategory - event category
 * @param {string} eventAction - event action
 * @param {object} errors - client side error
 * @param {} dispatch - optional parameter
 * @param {} submitError - optional parameter
 * @param {object} props - contains analyticsContent function
 */
export const analyticsErrorTracker = (event, eventCategory, eventAction, errors, dispatch, submitError, props) => {
  const { analyticsContent } = props;
  if (errors && Object.keys(errors).length !== 0) {
    const analyticsData = {
      event,
      eventCategory,
      eventAction,
      eventLabel: errorFormatter(errors)
    };
    analyticsContent(analyticsData);
  }
};
/**
 * return analytics data for client side error
 * @param {string} event - event name
 * @param {string} eventCategory - event category
 * @param {string} eventAction - event action
 * @param {object} errors - client side error
 * @param {} dispatch - optional parameter
 * @param {} submitError - optional parameter
 * @param {object} props - contains gtmDataLayer function
 */
export const gtmDataLayerErrorTracker = (event, eventCategory, eventAction, errors, dispatch, submitError, props) => {
  const { gtmDataLayer } = props;
  if (errors && Object.keys(errors).length !== 0) {
    const analyticsData = {
      event,
      eventCategory,
      eventAction,
      eventLabel: errorFormatter(errors)
    };
    gtmDataLayer.push(analyticsData);
  }
};
/**
 * convert error object in error values string.
 * @param {object} errors - client side error object
 */
const errorFormatter = errors =>
  errors &&
  Object.keys(errors).length !== 0 &&
  Object.keys(errors)
    .map(data => errors[data])
    .toString()
    .replace(/,/g, ', ')
    .toLowerCase();
/**
 * method push analytics data for my account click label(orders, payment, wishlist, profile, address book)
 * @param {string} label - myaccount click label
 * @param {function} analyticsContent - analytics function for data push
 */
export const myAccountClicksAnalyticsData = (label, analyticsContent) => {
  const data = {
    event: EVENT_NAME,
    eventCategory: EVENT_CATEGORY,
    eventAction: label,
    eventLabel: `${EVENT_LABEL}${label}`
  };
  analyticsContent(data);
};
