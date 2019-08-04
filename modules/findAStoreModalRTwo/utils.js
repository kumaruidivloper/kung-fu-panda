import { USERACTIVITY, USERTYPE } from './constants';
import Storage from '../../utils/StorageManager';
import { openingHours, getRequiredStoreDetails } from './helpers';
import { getSelectedStoreFromCookies } from '../../utils/cookies/SelectedStore';

export const getStoreInfo = (store, cms) =>
  Object.assign(
    {
      geometry: store.geometry,
      isCompleted: true,
      isFav: false,
      manualSearch: false,
      storeId: store.storeId,
      openhours: `${cms.timeLabel ? cms.timeLabel : ''} ${openingHours(store.properties.todayHours)}`
    },
    getRequiredStoreDetails(store.properties, cms.timeLabel)
  );

export const getCookieValues = () => ({
  selectedStore: getSelectedStoreFromCookies(),
  userId: Storage.getCookie(USERACTIVITY),
  userType: Storage.getCookie(USERTYPE)
});
