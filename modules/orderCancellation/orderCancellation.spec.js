import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderCancellationJson from './orderCancellation.component.json';
import OrderCancellation from './orderCancellation.component';

describe('<OrderCancellation />', () => {
  const { cms } = orderCancellationJson.context.data;
  it('renders <OrderCancellation /> component', () => {
    const wrapper = shallow(<OrderCancellation cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Cancellation works!');
  });
});
