import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import myaccountJson from './myaccount.component.json';
import Myaccount from './myaccount.component';

describe('<Myaccount />', () => {
  const { cms } = myaccountJson;
  const store = configureStore();
  const initialStore = {};
  it('renders <Myaccount /> component', () => {
    const wrapper = shallow(<Myaccount cms={cms} store={store(initialStore)} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Myaccount works!');
  });
});
