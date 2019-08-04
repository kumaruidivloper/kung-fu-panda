import { get } from '@react-nitro/error-boundary';
import { STH_LABEL, STS_LABEL, BOPIS_LABEL } from './constants';

/**
 * Method to get string for order type
 */
export const getOrderType = orderItem => {
  const {
    containsBopusItems,
    containsSpecialOrderItem,
    allDropShipItems,
    containsBopusItemsOnly,
    containsStorePickUpItemsOnly,
    shipments
  } = orderItem;
  if (allDropShipItems) {
    return STH_LABEL;
  }
  if (containsBopusItemsOnly) {
    return BOPIS_LABEL;
  }
  if (containsStorePickUpItemsOnly) {
    return STS_LABEL;
  }
  let orderTypeString = '';
  if (containsSGitem(shipments)) {
    orderTypeString += STH_LABEL;
  }
  if (containsBopusItems) {
    orderTypeString += `|${BOPIS_LABEL}`;
  }
  if (containsSpecialOrderItem) {
    orderTypeString += `|${STS_LABEL}`;
  }
  return orderTypeString;
};

const containsSGitem = shipments => shipments && shipments.length > 0 && shipments.find(obj => obj.shipMethodId === 'SG');

/**
 * Method to return an object to be pushed for 'Return' order.
 * @param {string} ctaName CTA name clicked
 * @param {*} orderId order number of the order
 * @param {*} orderTypeString Fulfillment type of the order
 * @param {*} totalPrice Total price of the order
 */
export const getReturnOrderAnalyticsObject = (ctaName, orderId, orderTypeString, totalPrice) => ({
  event: 'myaccount',
  eventCategory: 'user account',
  eventAction: `my orders|return online|${ctaName}`,
  eventLabel: `order|${orderId}`,
  ordertype: orderTypeString,
  orderid: orderId,
  'cancelled/return revenue': totalPrice || ''
});

export const enhancedAnalyticsTrackingOrders = (orderDetails, analyticsContent) => {
  const order = get(orderDetails, 'orders[0]', {});
  const analyticsData = {
    ecommerce: {
      purchase: {
        actionField: {
          id: order.orderNumber || '',
          affiliation: 'online',
          revenue: get(order, 'price.total', ''),
          tax: get(order, 'price.taxes', ''),
          shipping: get(order, 'price.subTotal', ''),
          coupon: get(order, 'promotions.appliedPromoCodes', '') ? order.promotions.appliedPromoCodes.join() : 'n/a'
        },
        products:
          get(order, 'items[0]') &&
          order.items.map(obj => ({
            name: obj.name || '',
            id: obj.skuId || '',
            price: obj.price || '',
            brand: obj.manufacturer || '',
            category: obj.categoryName || '',
            variant: '',
            quantity: -1,
            coupon: ''
          }))
      }
    }
  };
  analyticsContent(analyticsData);
};
