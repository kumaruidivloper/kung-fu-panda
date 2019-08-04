import React from 'react';
import Loadable from 'react-loadable';

export const CartHeader = Loadable({
  loader: () => import('../../modules/cartHeader/cartHeader.component'),
  loading: () => <div> </div>
});

export const ProductBlade = Loadable({
  loader: () => import('../../modules/productBlade/productBlade.component'),
  loading: () => <div> </div>
});

export const OrderSummary = Loadable({
  loader: () => import('../../modules/orderSummary/orderSummary.component'),
  loading: () => <div> </div>
});

export const EmptyCart = Loadable({
  loader: () => import('../../modules/emptyCart/emptyCart.component'),
  loading: () => <div> </div>
});

export const CartOption = Loadable({
  loader: () => import('../../modules/cartOption/cartOption.component'),
  loading: () => <div> </div>
});

export const SpecialOrderProceedModal = Loadable({
  loader: () => import('../../modules/specialOrderProceedModal/specialOrderProceedModal.component'),
  loading: () => <div> </div>
});

export const Loader = Loadable({
  loader: () => import('./../../modules/loader/loader.component'),
  loading: () => <div> </div>
});

export const GlobalError = Loadable({
  loader: () => import('./../../modules/globalError/globalError.component'),
  loading: () => <div> </div>
});
