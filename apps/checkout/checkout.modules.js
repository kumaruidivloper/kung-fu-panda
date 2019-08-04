import React from 'react';
import Loadable from 'react-loadable';

export const ShippingAddressExpanded = Loadable({
  loader: () => import('./../../modules/shippingAddress/shippingAddress.component'),
  loading: () => <div></div>
});

export const ShippingAddressCollapsed = Loadable({
  loader: () => import('./../../modules/showShippingInfo/showShippingInfo.component'),
  loading: () => <div></div>
});

export const ShippingMethodExpanded = Loadable({
  loader: () => import('../../modules/shippingMethods/shippingMethods.component'),
  loading: () => <div></div>
});

export const ShippingMethodCollapsed = Loadable({
  loader: () => import('./../../modules/showShippingMethod/showShippingMethod.component'),
  loading: () => <div></div>
});
export const InStorePickUpExpanded = Loadable({
  loader: () => import('./../../modules/inStorePickup/inStorePickup.component'),
  loading: () => <div></div>
});
export const InStorePickUpCollapsed = Loadable({
  loader: () => import('./../../modules/showInStorePickup/showInStorePickup.component'),
  loading: () => <div></div>
});
export const ShipToStoreExpanded = Loadable({
  loader: () => import('./../../modules/shipToStore/shipToStore.component'),
  loading: () => <div></div>
});
export const ShipToStoreCollapsed = Loadable({
  loader: () => import('./../../modules/showShipToStore/showShipToStore.component'),
  loading: () => <div></div>
});

export const PaymentOptionsExpanded = Loadable({
  loader: () => import('./../../modules/checkoutPaymentOptions/checkoutPaymentOptions.component'),
  loading: () => <div></div>
});

export const PaymentOptionsCollapsed = Loadable({
  loader: () => import('./../../modules/showPaymentInfo/showPaymentInfo.component'),
  loading: () => <div></div>
});

export const ReviewOrder = Loadable({
  loader: () => import('./../../modules/checkoutReviewOrder/checkoutReviewOrder.component'),
  loading: () => <div></div>
});

export const OrderSummamry = Loadable({
  loader: () => import('./../../modules/checkoutOrderSummary/checkoutOrderSummary.component'),
  loading: () => <div></div>
});

export const GlobalError = Loadable({
  loader: () => import('./../../modules/globalError/globalError.component'),
  loading: () => <div></div>
});

export const Loader = Loadable({
  loader: () => import('./../../modules/loader/loader.component'),
  loading: () => <div></div>
});
