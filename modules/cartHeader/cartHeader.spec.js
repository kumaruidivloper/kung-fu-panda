import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import cartHeaderJson from './cartHeader.component.json';
import CartHeader from './cartHeader.component';

describe('<CartHeader />', () => {
  const { cms } = cartHeaderJson.context.data;
  const initialState = { cart: { recordSetTotal: 0, grandTotal: '$12.12' } };
  const store = configureStore();
  let wrapper;

  before(() => {
    wrapper = mount(<CartHeader cms={cms} store={store(initialState)} />);
  });

  it('renders <CartHeader /> component', () => {
    expect(wrapper.find('a')).to.have.length(1);
    expect(wrapper.find('div')).to.have.length(1);
  });

  it('No of header', () => {
    expect(wrapper.find('h4')).to.have.length(1);
  });
});
