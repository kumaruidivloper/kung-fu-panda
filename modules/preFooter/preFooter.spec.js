import { expect } from 'chai';
import { UPDATE_SEO_BLOCK, UPDATE_FEATURED_BLOCK, INIT_STATE } from './constants';
import reducer from './reducer';
import * as actions from './actions';

describe('actions', () => {
  it('Should have an action to update the eSpot content', () => {
    const payload = {};
    const expectedAction = {
      type: UPDATE_SEO_BLOCK,
      payload
    };
    expect(actions.updateSeoBlock(payload)).to.deep.equal(expectedAction);
  });
  it('Should have an action to update the searchDex links', () => {
    const payload = '';
    const expectedAction = {
      type: UPDATE_FEATURED_BLOCK,
      payload
    };
    expect(actions.updateFeaturedBlock(payload)).to.deep.equal(expectedAction);
  });
  it('Should have an action to initialize state', () => {
    const payload = {};
    const expectedAction = {
      type: INIT_STATE,
      payload
    };
    expect(actions.initCompState(payload)).to.deep.equal(expectedAction);
  });
});

describe('reducer', () => {
  it('should return the initial state', () => {
    const initialState = { textBlock: { categoryespot: { marketingText: '' } }, linkBlock: '' };
    expect(reducer(undefined, {})).to.deep.equal(initialState);
  });
  it('Should handle UPDATE_SEO_BLOCK', () => {
    const initialState = { textBlock: { categoryespot: { marketingText: '' } }, linkBlock: '' };
    const payload = { categoryespot: { marketingText: '' } };
    const updateAction = {
      type: UPDATE_SEO_BLOCK,
      payload
    };
    expect(reducer(initialState, updateAction)).to.deep.equal({ ...initialState, ...{ textBlock: payload } });
  });
  it('Should handle UPDATE_FEATURED_BLOCK', () => {
    const initialState = { textBlock: { categoryespot: { marketingText: '' } }, linkBlock: '' };
    const payload = 'Some data';
    const updateAction = {
      type: UPDATE_FEATURED_BLOCK,
      payload
    };
    expect(reducer(initialState, updateAction)).to.deep.equal({ ...initialState, ...{ linkBlock: payload } });
  });
});
