import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderSumaryCheckoutJson from './orderSumaryCheckout.component.json';
import OrderSumaryCheckout from './orderSumaryCheckout.component';

describe('<OrderSumaryCheckout />', () => {
  const { cms } = orderSumaryCheckoutJson.context.data;
  it('renders <OrderSumaryCheckout /> component', () => {
    const wrapper = shallow(<OrderSumaryCheckout cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Sumary Checkout works!');
  });
});
