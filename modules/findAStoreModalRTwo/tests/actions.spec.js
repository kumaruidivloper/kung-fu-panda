import { expect } from 'chai';
import {
  makeMyStore,
  makeMyStoreUpdate,
  myStoreDetails,
  toggleFindAStore,
  findLatLangZipCodeRequest,
  findLatLangZipCodeSuccess,
  findLatLangZipCodeError,
  findZipCodeGapiRequest,
  findZipCodeGapiSuccess,
  findZipCodeGapiError,
  fetchFromIpRequest,
  fetchFromIpSuccess,
  fetchFromIpError,
  latLangDetailsForMap,
  getProductItemID,
  makeMyStoreDetailsUpdated,
  myStoreRegUserData,
  getCartDetails,
  getCartSuccess,
  storeDetailsLoaded,
  storeLoadingError,
  getCartError,
  loadStoreDetails
} from '../actions';

import {
  LOAD_STORE_DETAILS_REQUEST,
    LOAD_STORE_DETAILS_SUCCESS,
    LOAD_STORE_DETAILS_ERROR,
    MAKE_MY_STORE,
    MAKE_MY_STORE_UPDATED,
    MY_STORE_DETAILS,
    FIND_A_MODAL_STORE_STATUS,
    FIND_LAT_LANG_ZIPCODE_REQUEST,
    FIND_LAT_LANG_ZIPCODE_SUCCESS,
    FIND_LAT_LANG_ZIPCODE_ERROR,
    FETCH_ZIP_CODE_GAPI_ERROR,
    FETCH_ZIP_CODE_GAPI_REQUEST,
    FETCH_ZIP_CODE_GAPI_SUCCESS,
    FETCH_GEO_FROMIP_SUCCESS,
    FETCH_GEO_FROMIP_ERROR,
    FETCH_GEO_FROMIP_REQUEST,
    LAT_LANG_DETAILS_FOR_MAP,
    PDP_PRODUCT_ITEM_ID,
    MAKE_MY_STORE_DETAILS_UPDATED,
    MY_STORE_REG_USER_DATA,
    GET_CART_DETAILS,
    GET_CART_SUCCESS,
    GET_CART_ERROR
} from '../constants';

describe('findAStoreModal Action Test', () => {
  it('call makeMyStore', () => {
    const data = 'test data';
    const expectedAction = {
      type: MAKE_MY_STORE,
      data
    };
    expect(makeMyStore(data)).to.deep.equal(expectedAction);
  });

  it('call makeMyStoreUpdate', () => {
    const data = 'test data';
    const expectedAction = {
      type: MAKE_MY_STORE_UPDATED,
      data
    };
    expect(makeMyStoreUpdate(data)).to.deep.equal(expectedAction);
  });

  it('call myStoreDetails', () => {
    const data = 'test data';
    const expectedAction = {
      type: MY_STORE_DETAILS,
      data
    };
    expect(myStoreDetails(data)).to.deep.equal(expectedAction);
  });

  it('call toggleFindAStore', () => {
    const data = 'toggleFindAStore action data';
    const expectedAction = {
      type: FIND_A_MODAL_STORE_STATUS,
      data
    };
    expect(toggleFindAStore(data)).to.deep.equal(expectedAction);
  });

  it('call findLatLangZipCodeRequest', () => {
    const data = 'findLatLangZipCodeRequest action data';
    const expectedAction = {
      type: FIND_LAT_LANG_ZIPCODE_REQUEST,
      data
    };
    expect(findLatLangZipCodeRequest(data)).to.deep.equal(expectedAction);
  });

  it('call findLatLangZipCodeSuccess', () => {
    const data = 'findLatLangZipCodeSuccess action data';
    const expectedAction = {
      type: FIND_LAT_LANG_ZIPCODE_SUCCESS,
      data
    };
    expect(findLatLangZipCodeSuccess(data)).to.deep.equal(expectedAction);
  });

  it('call findLatLangZipCodeError', () => {
    const data = 'findLatLangZipCodeError action data';
    const expectedAction = {
      type: FIND_LAT_LANG_ZIPCODE_ERROR,
      data
    };
    expect(findLatLangZipCodeError(data)).to.deep.equal(expectedAction);
  });

  it('call findZipCodeGapiRequest', () => {
    const data = 'findZipCodeGapiRequest action data';
    const expectedAction = {
      type: FETCH_ZIP_CODE_GAPI_REQUEST,
      data
    };
    expect(findZipCodeGapiRequest(data)).to.deep.equal(expectedAction);
  });

  it('call findZipCodeGapiSuccess', () => {
    const data = 'findZipCodeGapiSuccess action data';
    const expectedAction = {
      type: FETCH_ZIP_CODE_GAPI_SUCCESS,
      data
    };
    expect(findZipCodeGapiSuccess(data)).to.deep.equal(expectedAction);
  });

  it('call findZipCodeGapiError', () => {
    const data = 'findZipCodeGapiError action data';
    const expectedAction = {
      type: FETCH_ZIP_CODE_GAPI_ERROR,
      data
    };
    expect(findZipCodeGapiError(data)).to.deep.equal(expectedAction);
  });

  it('call fetchFromIpRequest', () => {
    const data = 'fetchFromIpRequest action data';
    const expectedAction = {
      type: FETCH_GEO_FROMIP_REQUEST,
      data
    };
    expect(fetchFromIpRequest(data)).to.deep.equal(expectedAction);
  });

  it('call fetchFromIpSuccess', () => {
    const data = 'fetchFromIpSuccess action data';
    const expectedAction = {
      type: FETCH_GEO_FROMIP_SUCCESS,
      data
    };
    expect(fetchFromIpSuccess(data)).to.deep.equal(expectedAction);
  });

  it('call fetchFromIpError', () => {
    const data = 'fetchFromIpError action data';
    const expectedAction = {
      type: FETCH_GEO_FROMIP_ERROR,
      data
    };
    expect(fetchFromIpError(data)).to.deep.equal(expectedAction);
  });

  it('call latLangDetailsForMap', () => {
    const data = 'latLangDetailsForMap action data';
    const expectedAction = {
      type: LAT_LANG_DETAILS_FOR_MAP,
      data
    };
    expect(latLangDetailsForMap(data)).to.deep.equal(expectedAction);
  });

  it('call getProductItemID', () => {
    const data = 'getProductItemID action data';
    const expectedAction = {
      type: PDP_PRODUCT_ITEM_ID,
      data
    };
    expect(getProductItemID(data)).to.deep.equal(expectedAction);
  });

  it('call makeMyStoreDetailsUpdated', () => {
    const data = 'makeMyStoreDetailsUpdated action data';
    const expectedAction = {
      type: MAKE_MY_STORE_DETAILS_UPDATED
    };
    expect(makeMyStoreDetailsUpdated(data)).to.deep.equal(expectedAction);
  });

  it('call myStoreRegUserData', () => {
    const data = 'myStoreRegUserData action data';
    const expectedAction = {
      type: MY_STORE_REG_USER_DATA,
      data
    };
    expect(myStoreRegUserData(data)).to.deep.equal(expectedAction);
  });

  it('call getCartDetails', () => {
    const data = 'getCartDetails action data';
    const expectedAction = {
      type: GET_CART_DETAILS,
      data
    };
    expect(getCartDetails(data)).to.deep.equal(expectedAction);
  });

  it('call getCartSuccess', () => {
    const data = 'getCartSuccess action data';
    const expectedAction = {
      type: GET_CART_SUCCESS,
      data
    };
    expect(getCartSuccess(data)).to.deep.equal(expectedAction);
  });

  it('call loadStoreDetails', () => {
    const data = 'loadStoreDetails action data';
    const expectedAction = {
      type: LOAD_STORE_DETAILS_REQUEST,
      data
    };
    expect(loadStoreDetails(data)).to.deep.equal(expectedAction);
  });

  it('call storeDetailsLoaded', () => {
    const data = 'storeDetailsLoaded action data';
    const expectedAction = {
      type: LOAD_STORE_DETAILS_SUCCESS,
      data
    };
    expect(storeDetailsLoaded(data)).to.deep.equal(expectedAction);
  });

  it('call storeLoadingError', () => {
    const data = 'storeLoadingError action data';
    const expectedAction = {
      type: LOAD_STORE_DETAILS_ERROR,
      error: data
    };
    expect(storeLoadingError(data)).to.deep.equal(expectedAction);
  });

  it('call getCartError', () => {
    const data = 'getCartError action data';
    const expectedAction = {
      type: GET_CART_ERROR,
      data
    };
    expect(getCartError(data)).to.deep.equal(expectedAction);
  });
});
