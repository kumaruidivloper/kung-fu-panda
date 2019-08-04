import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import emptyCartJson from './emptyCart.component.json';
import EmptyCart from './emptyCart.component';
import './style';

describe('<EmptyCart />', () => {
  const { cms } = emptyCartJson.context.data;
  const mockstore = configureStore();
  const store = mockstore({});
  const wrapper = mount(
    <Provider store={store}>
      <EmptyCart cms={cms} analyticsContent={() => {}} />
    </Provider>
  );
  it('renders <EmptyCart /> component', () => {
    expect(wrapper.find('.subHeading').text()).to.equal(cms.emptyCartSubHeading);
  });
  it('should contain Continue Shoping Link with arrow icon', () => {
    expect(wrapper.find('a.cntShoping')).to.have.length(1);
    expect(wrapper.find('.academyicon')).to.have.length(1);
  });
  it('renders h4 ', () => {
    expect(wrapper.find('h4')).to.have.length(1);
    expect(wrapper.find('h4').text()).to.equal(cms.emptyCartHeading);
  });
  it('renders button container ', () => {
    expect(wrapper.find('button')).to.have.length(2);
  });
  it('simulate sign-in button', () => {
    const submitBtn = wrapper.find('button.signIn');
    submitBtn.simulate('click');
  });
  it('simulate continue shopping button', () => {
    const submitBtn = wrapper.find('button.cntShoping');
    submitBtn.simulate('click');
  });
});
