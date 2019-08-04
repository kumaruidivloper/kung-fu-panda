import {
  autoSuggestionsBrandsCategoriesAPI,
  headerAutoSuggestAPI,
  visualGuidedAutoSuggestAPI
} from '@academysports/aso-env';
import axios from 'axios';
import { expect } from 'chai';
import { all, call, put } from 'redux-saga/effects';
import sinon from 'sinon';

import * as actions from './actions';
import { SEARCH_ACTION_REGEX } from './constants';
import * as sagas from './saga';

// import { cloneableGenerator } from 'redux-saga/utils';
describe('getAutoSuggest saga', () => {
  const searchText = 'testing';
  const ignoreSpecialChars = searchText.replace(SEARCH_ACTION_REGEX, '');
  const autoSuggestResponse = { data: { typeAheadResults: ['test1'] } };
  const visualGuideResponse = { data: ['test2'] };
  const autoSuggestBrandResponse = { data: ['test3'] };
  let axiosGetStub;

  before(() => {
    axiosGetStub = sinon.stub(axios, 'get');
    axiosGetStub.withArgs(`${headerAutoSuggestAPI}/${ignoreSpecialChars}`).returns(autoSuggestResponse);
    axiosGetStub.withArgs(`${autoSuggestionsBrandsCategoriesAPI}/${ignoreSpecialChars}`).returns(autoSuggestBrandResponse);
    axiosGetStub.withArgs(`${visualGuidedAutoSuggestAPI}/${ignoreSpecialChars}`).returns(visualGuideResponse);
    axiosGetStub.callsFake = () => null;
  });

  after(() => {
    axiosGetStub.restore();
  });

  it('returns yields the expected effect', () => {
    const action = {
      data: {
        searchText,
        mobile: false
      }
    };

    // const saveAutoSuggestEffect = put(actions.saveAutoSuggestions(autoSuggestResponse.data.typeAheadResults));
    // const saveVisualGuideAutoSuggestEffect = put(actions.saveVisualGuideAutoSuggest(visualGuideResponse.data));
    // const saveAutoSuggestionsBrandEffect = put(actions.saveAutoSuggestionsBrand(autoSuggestBrandResponse.data));

    const autoSuggestGenerator = sagas.getAutoSuggest(action);

    expect(autoSuggestGenerator.next().value).to.deep.equal(all([
        call(sagas.apiReq, `${headerAutoSuggestAPI}/${ignoreSpecialChars}`),
        call(sagas.apiReq, `${autoSuggestionsBrandsCategoriesAPI}/${ignoreSpecialChars}`),
        call(sagas.apiReq, `${visualGuidedAutoSuggestAPI}/${ignoreSpecialChars}`)
      ]));
  });

  it('returns yields the expected effect when searchText is empty', () => {
    const action = {
      data: {
        searchText: ''
      }
    };

    const saveAutoSuggestEffect = put(actions.saveAutoSuggestions(null));
    const saveVisualGuideAutoSuggestEffect = put(actions.saveVisualGuideAutoSuggest(null));
    const saveAutoSuggestionsBrandEffect = put(actions.saveAutoSuggestionsBrand(null));

    const autoSuggestGenerator = sagas.getAutoSuggest(action);

    const autoSuggestions = autoSuggestGenerator.next().value;
    const visualSuggestions = autoSuggestGenerator.next().value;
    const autoSuggestionsBrand = autoSuggestGenerator.next().value;

    expect(autoSuggestions).to.deep.equal(saveAutoSuggestEffect);
    expect(visualSuggestions).to.deep.equal(saveVisualGuideAutoSuggestEffect);
    expect(autoSuggestionsBrand).to.deep.equal(saveAutoSuggestionsBrandEffect);
  });
});

describe('getCategories saga', () => {
  it('returns yields the expected effect', () => {});
});

describe('getSelectedItem saga', () => {
  it('returns yields the expected effect', () => {
    const action = {
      selectedItem: 'testing'
    };
    const effect = put(actions.getSelectedItemSuccess(action.selectedItem));
    expect(sagas.getSelectedItem(action).next().value).to.deep.equal(effect);
  });
});

describe('getSubSelectedItem saga', () => {
  it('returns yields the expected effect', () => {
    const action = {
      selectedItem: 'testing'
    };
    const effect = put(actions.getSubSelectedItemSuccess(action.selectedItem));
    expect(sagas.getSubSelectedItem(action).next().value).to.deep.equal(effect);
  });
});

describe('getMenuForward saga', () => {
  it('returns yields the expected effect', () => {
    const action = {
      testKey: 'testing'
    };
    const effect = put(actions.menuForward(action));
    expect(sagas.getMenuForward(action).next().value).to.deep.equal(effect);
  });
});
