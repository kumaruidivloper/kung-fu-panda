import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderDetailsJson from './orderDetails.component.json';
import OrderDetails from './orderDetails.component';

describe('<OrderDetails />', () => {
  const { cms } = orderDetailsJson.context.data;
  it('renders <OrderDetails /> component', () => {
    const wrapper = shallow(<OrderDetails cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Details works!');
  });
});
