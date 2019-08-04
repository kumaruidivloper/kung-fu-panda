import configureStore from 'redux-mock-store';
import Storage from '../../../utils/StorageManager';
import productStoreJson from '../../../../mock_server/routes/productAPI/productStore';
import resultsForFetchWishListsJson from '../fauxAPI/get.response.json';
import { getProductItem as helperGetProductItem } from '../../../utils/productDetailsUtils';

export const createMockStore = (initialState = {}, middleware = []) => configureStore(middleware)(initialState);

export const getProductItem = testProductId => helperGetProductItem(productStoreJson[testProductId], { productId: testProductId });

const iterConsoleLog = (arr = []) => {
  arr.forEach(item => console.log(item));
};

export const consoleLogDebug = mountedElement => iterConsoleLog([' ', '*************', ' ', mountedElement.debug(), ' ']);

export const consoleLogHtml = mountedElement => iterConsoleLog([' ', '*************', ' ', mountedElement.html(), ' ']);

export const getWishListsFromJson = () => {
  const response = { data: resultsForFetchWishListsJson };
  const { data } = response;
  const rawLists = data && data.queryWishlist && data.queryWishlist.GiftList;
  return rawLists && rawLists.map(list => ({ descriptionName: list.descriptionName, uniqueID: list.uniqueID }));
};

export const modifyStorageAPI = () => {
  const getLoggedOutCookie = () => undefined;
  const getLoggedInCookie = () => 'R';
  Storage.setLoggedIn = isLoggedIn => {
    if (isLoggedIn) {
      Storage.getCookie = getLoggedInCookie;
    } else {
      Storage.getCookie = getLoggedOutCookie;
    }
  };
  Storage.setLoggedIn(false);
};
