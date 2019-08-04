import { fork } from 'redux-saga/effects';
import createWishList from './createWishListSaga';
import userWishList from './wishListLandingSaga';
import shareWishlistSaga from './../../shareDeleteWishlist/saga';
import wishListDetails from '../../wishlistItems/saga';

export default function* rootSaga() {
    yield [
        fork(createWishList),
        fork(userWishList),
        fork(shareWishlistSaga),
        fork(wishListDetails)
    ];
  }
