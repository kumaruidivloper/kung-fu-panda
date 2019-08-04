import { wishListAPI } from '@academysports/aso-env';
import axios from 'axios';

import StorageManager from './../../utils/StorageManager';

// import getResponse from './fauxAPI/get.response.json';
// import postResponse from './fauxAPI/post.response.json';
// import putResponse from './fauxAPI/put.response.json';

// export const fetchWishLists = (onSuccess, onFail) => Promise.resolve(getResponse).then(onSuccess, onFail);
const userId = StorageManager.getSessionStorage('userId');
export const fetchWishLists = (onSuccess, onFail) => {
  axios
    .get(wishListAPI(userId))
    .then(onSuccess)
    .catch(onFail);
};

// export const postWishList = (skuId, wishListName, onSuccess, onFail) => Promise.resolve(postResponse).then(onSuccess, onFail);
export const postWishList = (skuId, wishListName, onSuccess, onFail) => {
  const params = {
    description: wishListName,
    descriptionName: wishListName,
    registry: 'false',
    item: [
      {
        productId: skuId,
        quantityRequested: '1'
      }
    ]
  };
  axios
    .post(wishListAPI(userId), params)
    .then(onSuccess)
    .catch(onFail);
};

// export const postSKUToWishList = (skuId, wishListId, onSuccess, onFail) => Promise.resolve(putResponse).then(onSuccess, onFail);
export const postSKUToWishList = (wishListName, skuId, wishListId, onSuccess, onFail) => {
  const params = {
    name: wishListName,
    item: [
      {
        productId: skuId,
        quantityRequested: '1'
      }
    ],
    uniqueID: wishListId
  };
  axios
    .post(`${wishListAPI(userId)}/${wishListId}`, params)
    .then(onSuccess)
    .catch(onFail);
};
