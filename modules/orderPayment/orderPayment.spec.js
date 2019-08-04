import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderPaymentJson from './orderPayment.component.json';
import OrderPayment from './orderPayment.component';

describe('<OrderPayment />', () => {
  const { cms } = orderPaymentJson.context.data;
  it('renders <OrderPayment /> component', () => {
    const wrapper = shallow(<OrderPayment cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Payment works!');
  });
});
