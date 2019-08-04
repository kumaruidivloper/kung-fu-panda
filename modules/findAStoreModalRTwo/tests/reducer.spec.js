import { expect } from 'chai';
import {
  FIND_A_MODAL_STORE_STATUS,
  LOAD_STORE_DETAILS_SUCCESS,
  LOAD_STORE_DETAILS_REQUEST,
  MAKE_MY_STORE_UPDATED,
  MY_STORE_DETAILS,
  LOAD_STORE_DETAILS_ERROR,
  FIND_LAT_LANG_ZIPCODE_REQUEST,
  FIND_LAT_LANG_ZIPCODE_SUCCESS,
  FETCH_GEO_FROMIP_REQUEST,
  FETCH_GEO_FROMIP_SUCCESS,
  FETCH_ZIP_CODE_GAPI_REQUEST,
  FETCH_ZIP_CODE_GAPI_SUCCESS,
  FETCH_ZIP_CODE_GAPI_ERROR,
  LAT_LANG_DETAILS_FOR_MAP,
  PDP_PRODUCT_ITEM_ID,
  MY_STORE_REG_USER_DATA,
  GET_CART_DETAILS,
  GET_CART_SUCCESS,
  GET_CART_ERROR
} from '../constants';

import {
  storeDetails,
  mystoreDetails,
  getMystoreDetails,
  storeDetailsError,
  findAStoreModalIsOpen,
  latLangDetails,
  zipCodeDetails,
  zipCodeFromGapi,
  latLangDetailsForMap,
  pdpProductItemId,
  myStoreRegUserData,
  getCartData
} from '../reducer';

const initState = {};

describe('findAStoreModal reducer test', () => {
  it('reducer mystoreDetails should return action data', () => {
    const action = {
      type: MAKE_MY_STORE_UPDATED,
      data: 'mystoreDetails test data'
    };
    expect(mystoreDetails(initState, action)).to.deep.equal('mystoreDetails test data');
  });

  it('getMystoreDetails should handle MY_STORE_DETAILS action', () => {
    const action = {
      type: MY_STORE_DETAILS,
      data: { name: 'john' }
    };
    const expectedData = { name: 'john', isCompleted: true };
    expect(getMystoreDetails({}, action)).to.deep.equal(expectedData);
  });

  it('storeDetailsError should handle LOAD_STORE_DETAILS_ERROR action', () => {
    const action = {
      type: LOAD_STORE_DETAILS_ERROR,
      error: 'storeDetailsError test data'
    };
    expect(storeDetailsError({}, action)).to.deep.equal('storeDetailsError test data');
  });

  it('findAStoreModalIsOpen should handle FIND_A_MODAL_STORE_STATUS action', () => {
    const action = {
      type: FIND_A_MODAL_STORE_STATUS,
      data: 'findAStoreModalIsOpen test data'
    };
    expect(findAStoreModalIsOpen({}, action)).to.deep.equal('findAStoreModalIsOpen test data');
  });

  it('pdpProductItemId should handle PDP_PRODUCT_ITEM_ID action', () => {
    const action = {
      type: PDP_PRODUCT_ITEM_ID,
      data: 'pdpProductItemId test data'
    };
    expect(pdpProductItemId({}, action)).to.deep.equal('pdpProductItemId test data');
  });

  it('latLangDetails should handle FIND_LAT_LANG_ZIPCODE_REQUEST', () => {
    const action = {
      type: FIND_LAT_LANG_ZIPCODE_REQUEST,
      data: 'latLangDetails request test data'
    };
    const expectedObj = { isFetching: true, error: false, data: {} };
    expect(latLangDetails(initState, action)).to.deep.equal(expectedObj);
  });

  it('latLangDetails should handle FIND_LAT_LANG_ZIPCODE_SUCCESS', () => {
    const action = {
      type: FIND_LAT_LANG_ZIPCODE_SUCCESS,
      data: 'latLangDetails success test data'
    };
    const expectedObj = { isFetching: false, error: false, data: action.data };
    expect(latLangDetails(initState, action)).to.deep.equal(expectedObj);
  });

  it('storeDetails should handle LOAD_STORE_DETAILS_REQUEST', () => {
    const action = {
      type: LOAD_STORE_DETAILS_REQUEST,
      data: 'storeDetails request test data'
    };
    const expectedObj = { isFetching: true, error: false, data: [] };
    expect(storeDetails(initState, action)).to.deep.equal(expectedObj);
  });

  it('storeDetails should handle LOAD_STORE_DETAILS_SUCCESS', () => {
    const action = {
      type: LOAD_STORE_DETAILS_SUCCESS,
      data: 'storeDetails success test data'
    };
    const expectedObj = { isFetching: false, error: false, data: action.data.stores };
    expect(storeDetails(initState, action)).to.deep.equal(expectedObj);
  });

  it('storeDetails should handle LOAD_STORE_DETAILS_ERROR', () => {
    const action = {
      type: LOAD_STORE_DETAILS_ERROR,
      error: 'storeDetails error test data'
    };
    const expectedObj = { isFetching: false, error: true, data: [] };
    expect(storeDetails(initState, action)).to.deep.equal(expectedObj);
  });

  it('zipCodeDetails should handle FETCH_GEO_FROMIP_REQUEST', () => {
    const action = {
      type: FETCH_GEO_FROMIP_REQUEST,
      data: 'zipCodeDetails request test data'
    };
    const expectedObj = { isFetching: true, error: false, data: '' };
    expect(zipCodeDetails(initState, action)).to.deep.equal(expectedObj);
  });

  it('zipCodeDetails should handle FETCH_GEO_FROMIP_SUCCESS', () => {
    const action = {
      type: FETCH_GEO_FROMIP_SUCCESS,
      data: 'zipCodeDetails success test data'
    };
    const expectedObj = { isFetching: false, error: false, data: action.data };
    expect(zipCodeDetails(initState, action)).to.deep.equal(expectedObj);
  });

  it('zipCodeDetails should handle FETCH_ZIP_CODE_GAPI_ERROR', () => {
    const action = {
      type: FETCH_ZIP_CODE_GAPI_ERROR,
      error: 'zipCodeDetails error test data'
    };
    const expectedObj = { isFetching: false, error: true, data: '' };
    expect(zipCodeDetails(initState, action)).to.deep.equal(expectedObj);
  });

  it('latLangDetailsForMap should handle LAT_LANG_DETAILS_FOR_MAP', () => {
    const action = {
      type: LAT_LANG_DETAILS_FOR_MAP,
      error: 'latLangDetailsForMap error test data'
    };
    const expectedObj = { isCompleted: true, data: action.data };
    expect(latLangDetailsForMap(initState, action)).to.deep.equal(expectedObj);
  });

  it('myStoreRegUserData should handle MY_STORE_REG_USER_DATA', () => {
    const action = {
      type: MY_STORE_REG_USER_DATA,
      error: 'myStoreRegUserData test data'
    };
    const expectedObj = { isCompleted: true, data: action.data };
    expect(myStoreRegUserData(initState, action)).to.deep.equal(expectedObj);
  });

  it('zipCodeFromGapi should handle FETCH_ZIP_CODE_GAPI_REQUEST', () => {
    const action = {
      type: FETCH_ZIP_CODE_GAPI_REQUEST,
      data: 'zipCodeFromGapi request test data'
    };
    const expectedObj = { isFetching: true, error: false, data: '' };
    expect(zipCodeFromGapi(initState, action)).to.deep.equal(expectedObj);
  });

  it('zipCodeFromGapi should handle FETCH_ZIP_CODE_GAPI_SUCCESS', () => {
    const action = {
      type: FETCH_ZIP_CODE_GAPI_SUCCESS,
      data: 'zipCodeFromGapi success test data'
    };
    const expectedObj = { isFetching: false, error: false, data: action.data };
    expect(zipCodeFromGapi(initState, action)).to.deep.equal(expectedObj);
  });

  it('getCartData handle GET_CART_DETAILS action', () => {
    const action = {
      type: GET_CART_DETAILS,
      data: 'GET_CART_DETAILS test data'
    };
    const expectedData = { isFetching: true, error: false, data: {} };
    expect(getCartData(initState, action)).to.deep.equal(expectedData);
  });

  it('getCartData handle GET_CART_SUCCESS action', () => {
    const action = {
      type: GET_CART_SUCCESS,
      data: 'GET_CART_SUCCESS test data'
    };
    const expectedData = { isFetching: false, error: false, data: action.data };
    expect(getCartData(initState, action)).to.deep.equal(expectedData);
  });

  it('getCartData handle GET_CART_ERROR action', () => {
    const action = {
      type: GET_CART_ERROR,
      data: 'GET_CART_ERROR test data'
    };
    const expectedData = { isFetching: false, error: true, data: {} };
    expect(getCartData(initState, action)).to.deep.equal(expectedData);
  });
});
