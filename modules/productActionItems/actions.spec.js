import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { toggleFindAStore } from './actions';
import { FIND_A_MODAL_STORE_STATUS } from './constants';

const mockStore = configureStore();
let store;
describe('Product Action Items actions', () => {
  beforeEach(() => {
    store = mockStore({});
  });
  it('toggleFindStore', () => {
    store.dispatch(toggleFindAStore('test'));
    const expectedActions = store.getActions();
    console.log(expectedActions);
    expect(expectedActions.length).to.equal(1);
    expect(expectedActions[0]).to.deep.equal({ type: FIND_A_MODAL_STORE_STATUS, data: 'test' });
  });
});

