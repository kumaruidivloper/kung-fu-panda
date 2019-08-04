import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import createAccountJson from './createAccount.component.json';
import CreateAccount from './createAccount.component';
import { createAccount } from './reducer';
import * as types from './constants';

describe('<CreateAccount /> basic component rendering checks', () => {
  const { cms } = createAccountJson.context.data;
  const mockStore = configureMockStore();
  let wrapper = {};
  beforeEach(() => {
    const initialState = { createAccount: { isFetching: false, error: false, data: {}, modal: true } };
    const store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <CreateAccount cms={cms} />
      </Provider>
    );
  });
  it('it should have 10 sections in total after mount', () => {
    expect(wrapper.find('section')).to.have.length(10);
  });
  it('when Modal is not opened of cancel order, the total number of Button should be 2', () => {
    expect(wrapper.find('button')).to.have.length(2);
  });
  it('it should have 2 buttons when we click on cancel order, as MOdal also opens', () => {
    wrapper
      .find('span')
      .at(2)
      .simulate('click');
    expect(wrapper.find('button')).to.have.length(2);
  });
  it('it should trigger action call of create account, by trigering onsubmithandler function', () => {
    wrapper
      .find('button')
      .at(0)
      .simulate('click');
  });
  it('it should trigger action call of toggle create account modal', () => {
    expect(
      wrapper
        .find('i')
        .at(0)
        .props()
        .onClick().type
    ).equals(types.TOGGLE_CREATE_ACCOUNT_MODAL);
  });
});
describe('<CreateAccount /> checks for functions', () => {
  const { cms } = createAccountJson.context.data;
  const mockStore = configureMockStore();
  const initialState = { createAccount: { isFetching: false, error: false, data: {}, modal: false } };
  const store = mockStore(initialState);
  it('togglemodal function call', () => {
    const wrapper = shallow(<CreateAccount cms={cms} store={store} state={initialState} />).dive();
    const mockCallBack = sinon.spy(wrapper.instance(), 'toggleModal');
    expect(wrapper.find('span')).to.have.length(3);
    wrapper
      .find('span')
      .at(1)
      .simulate('click');
    expect(mockCallBack.calledOnce).equals(true);
    wrapper
      .find('t')
      .props()
      .closeIcon.props.onClick();
    expect(mockCallBack.calledTwice).equals(true);
    mockCallBack.restore();
  });
  it('get order id function', () => {
    const wrapper = shallow(<CreateAccount cms={cms} store={store} state={initialState} />).dive();
    const mockCallBack = sinon.spy(wrapper.instance(), 'getOrderId');
    wrapper
      .find('span')
      .at(1)
      .simulate('click');
    expect(mockCallBack.calledOnce).equals(true);
    mockCallBack.restore();
  });
  it(' cancel order modal to close on cancel button click', () => {
    const wrapper = shallow(<CreateAccount store={store} cms={cms} state={initialState} />).dive();
    const mockCallBack = sinon.spy(wrapper.instance(), 'toggleModal');
    wrapper
      .find('span')
      .at(1)
      .simulate('click');
    wrapper
      .find('y')
      .at(0)
      .props()
      .onClick();
    expect(mockCallBack.calledTwice).equals(true);
    mockCallBack.restore();
  });
  it('store hours open/close function functionality check', () => {
    const wrapper = shallow(<CreateAccount store={store} cms={cms} state={initialState} />).dive();
    const pcount = wrapper.find('p').length;
    wrapper
      .find('span')
      .at(0)
      .simulate('click');
    expect(wrapper.find('p').length).equals(pcount + 1);
    wrapper
      .find('span')
      .at(0)
      .simulate('click');
    expect(wrapper.find('p').length).equals(pcount);
  });
  it('checking create account succes modal close functionality', () => {
    const wrapper = shallow(<CreateAccount store={store} cms={cms} state={initialState} />).dive();
    const pcount = wrapper.find('p').length;
    wrapper
      .find('span')
      .at(0)
      .simulate('click');
    expect(wrapper.find('p').length).equals(pcount + 1);
    wrapper
      .find('span')
      .at(0)
      .simulate('click');
    expect(wrapper.find('p').length).equals(pcount);
  });
});
describe('createAccount reducer', () => {
  const initialstate = { isFetching: false, error: false, data: {}, modal: false };
  it('should return the initial state', () => {
    expect(createAccount(undefined, {}).isFetching).to.equal(initialstate.isFetching);
    expect(createAccount(undefined, {}).error).to.equal(initialstate.error);
    expect(createAccount(undefined, {}).modal).to.equal(initialstate.modal);
    expect(createAccount(undefined, { type: types.TOGGLE_CREATE_ACCOUNT_MODAL }).modal).to.equal(!initialstate.modal);
    expect(createAccount(undefined, { type: types.CREATE_ACCOUNT_FAILURE }).error).to.equal(true);
  });
  it('should toggle modal', () => {
    expect(createAccount(undefined, { type: types.TOGGLE_CREATE_ACCOUNT_MODAL }).modal).to.equal(!initialstate.modal);
  });
  it('should return error as true when failure', () => {
    expect(createAccount(undefined, { type: types.CREATE_ACCOUNT_FAILURE }).error).to.equal(true);
  });
});
