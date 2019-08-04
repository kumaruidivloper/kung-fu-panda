import { combineReducers } from 'redux';
import { fetchCityStateFromZipCode } from './addressBookReducers/getCityStateReducer';
import { shareWishlist, createWishListStatus, userWishListStatus, deleteWishlist } from '../../../../modules/wishList/reducer';
import { notificationStatus, fetchInformation, updatePassword, updateProfileInfo } from '../../../../modules/profileInformation/reducer';
import { validateAddress } from './addressBookReducers/validateAddress';
import { fetchAddress } from './addressBookReducers/fetchAddress';
import { fetchAccountData } from './fetchAccountData';
import { userCreditCardList, userGiftCards, addGiftCardData, deleteGiftCardData } from '../../../../modules/myAccountPayment/reducer';
import fetchWishlistItems from '../../../../modules/wishlistItems/reducer';
import { orderList } from './orderDetailsReducers/orderList';
import { orderDetails, getStoreAddressDetails } from './orderDetailsReducers/orderDetails';
import { orderDetailsById } from './orderDetailsReducers/orderDetailsById';
import { globalLoader } from './globalLoader';
import { cancelOrder, orderDetailsByIdCancel } from '../../../../modules/orderCancellation/reducer';
import { initiateOrder } from '../../../../modules/orderReturn/reducer';
import { breadCrumb } from './breadCrumb';
export default combineReducers({
  fetchCityStateFromZipCode,
  userWishListStatus,
  createWishListStatus,
  shareWishlist,
  validateAddress,
  fetchAddress,
  notificationStatus,
  fetchInformation,
  updatePassword,
  fetchAccountData,
  userCreditCardList,
  userGiftCards,
  fetchWishlistItems,
  updateProfileInfo,
  orderList,
  orderDetails,
  orderDetailsById,
  orderDetailsByIdCancel,
  globalLoader,
  cancelOrder,
  initiateOrder,
  breadCrumb,
  getStoreAddressDetails,
  addGiftCardData,
  deleteGiftCardData,
  deleteWishlist
});
