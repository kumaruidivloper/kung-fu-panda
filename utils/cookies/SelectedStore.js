import Storage from '../StorageManager';

const COOKIE_SELECTED_STORE = 'WC_StLocId_Selected';
const COOKIE_SELECTED_STORE_XT = 'XT_StLocId_Selected';

export const setSelectedStoreCookies = storeObject => {
  Storage.setCookie(COOKIE_SELECTED_STORE, encode(storeObject));
  Storage.setCookie(COOKIE_SELECTED_STORE_XT, encode(storeObject));
};

export const getSelectedStoreFromCookies = () => {
  const encodedSelectedStore = Storage.getCookie(COOKIE_SELECTED_STORE) || Storage.getCookie(COOKIE_SELECTED_STORE_XT);
  return encodedSelectedStore ? decode(encodedSelectedStore) : undefined;
};

export const deleteSelectedStoreCookies = () => {
  Storage.deleteCookie(COOKIE_SELECTED_STORE);
  Storage.deleteCookie(COOKIE_SELECTED_STORE_XT);
};

export const deleteBackupSelectedStoreCookie = () => {
  Storage.deleteCookie(COOKIE_SELECTED_STORE_XT);
};

/**
 * According to this stack overflow post, we only need to encode comma, white space, and semi-colon
 * https://stackoverflow.com/questions/1969232/allowed-characters-in-cookies/1969339#1969339
 */
const encodeMappings = [[/\s/g, '%20'], [/,/g, '%2C'], [/;/g, '%3B']];
const decodeMappings = [[/%20/g, ' '], [/%2C/g, ','], [/%3B/g, ';']];

const encode = obj => {
  const str = JSON.stringify(obj);
  return encodeMappings.reduce((result, encodePair) => {
    const [re, encodedVal] = encodePair;
    return result.replace(re, encodedVal);
  }, str);
};

const decode = strObj => {
  const jsonStr = decodeMappings.reduce((result, decodePair) => {
    const [re, decodedVal] = decodePair;
    return result.replace(re, decodedVal);
  }, strObj);
  return JSON.parse(jsonStr);
};
