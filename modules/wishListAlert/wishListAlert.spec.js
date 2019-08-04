import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import wishListAlertJson from './wishListAlert.component.json';
import WishListAlert from './wishListAlert.component';

describe('<WishListAlert />', () => {
  const { cms } = wishListAlertJson.context.data;
  it('renders <WishListAlert /> component', () => {
    const wrapper = mount(<WishListAlert cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Wish List Alert works!');
  });
});
