import { fork } from 'redux-saga/effects';
import profileSaga from '../../../../modules/profileInformation/saga';
import fetchAccountData from './fetchMyAccountData';
import createWishList from '../../../../modules/wishList/saga/createWishListSaga';
import userWishList from '../../../../modules/wishList/saga/wishListLandingSaga';
import shareWishlist from '../../../../modules/shareDeleteWishlist/saga';
import cancellationOrder from '../../../../modules/orderCancellation/saga';
import returnOrder from '../../../../modules/orderReturn/saga';
import UserInformationData from '../../../../modules/myAccountPayment/saga';
import wishlistDetails from '../../../../modules/wishlistItems/saga';
import deleteWishlist from '../../../../modules/wishlistDeleteModal/saga';
import addressBookSaga from './addressBookSaga/index';
import orderListSaga from '../../../../modules/orders/saga';
import orderDetailsSaga from '../../../../modules/noOrder/saga';
import orderDetailsByIdSaga from '../../../../modules/order/saga';
import orderDetailsAddress from '../../../../modules/orderDetails/saga';
export default function* saga() {
    yield [
        fork(profileSaga),
        fork(fetchAccountData),
        fork(createWishList),
        fork(userWishList),
        fork(shareWishlist),
        fork(UserInformationData),
        fork(wishlistDetails),
        fork(deleteWishlist),
        fork(addressBookSaga),
        fork(orderListSaga),
        fork(orderDetailsSaga),
        fork(orderDetailsByIdSaga),
        fork(orderDetailsAddress),
        fork(cancellationOrder),
        fork(returnOrder)
    ];
  }
