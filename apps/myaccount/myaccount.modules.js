import React from 'react';
import Loadable from 'react-loadable';

export const Sidebar = Loadable({
  loader: () => import('./../../modules/sidebar/sidebar.component'),
  loading: () => <div></div>
});
export const AddressBook = Loadable({
    loader: () => import('./../../modules/addressBook/addressBook.component'),
    loading: () => <div></div>
});
export const Wishlist = Loadable({
  loader: () => import('./../../modules/wishList/wishList.component'),
  loading: () => <div></div>
});
export const ProfileInformation = Loadable({
  loader: () => import('./../../modules/profileInformation/profileInformation.component'),
  loading: () => <div></div>
});
export const MyAccountPayment = Loadable({
  loader: () => import('./../../modules/myAccountPayment/myAccountPayment.component'),
  loading: () => <div></div>
});

export const Loader = Loadable({
  loader: () => import('./../../modules/loader/loader.component'),
  loading: () => <div></div>
});
