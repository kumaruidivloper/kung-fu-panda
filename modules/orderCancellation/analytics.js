import { get } from '@react-nitro/error-boundary';
import { getOrderType } from './../../utils/analytics/ordersAnalyticsHelpers';
import { analyticsContent } from '../analyticsWrapper/utils';
import { EVENT_NAME, EVENT_CATEGORY, EVENT_ACTION, EVENT_LABEL } from './constants';

export const logAnalyticsCancelOrder = (orderId, orderItem) => {
  if (orderId && orderItem) {
    const analyticsObject = {
      event: EVENT_NAME,
      eventCategory: EVENT_CATEGORY,
      eventAction: EVENT_ACTION,
      eventLabel: `${EVENT_LABEL}${orderId}`,
      ordertype: getOrderType(orderItem),
      orderid: orderId,
      'cancelled/return revenue': get(orderItem, 'price.total', '')
    };
    analyticsContent(analyticsObject);
  }
};
