import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderCancelModalJson from './orderCancelModal.component.json';
import OrderCancelModal from './orderCancelModal.component';

describe('<OrderCancelModal />', () => {
  const { cms } = orderCancelModalJson.context.data;
  it('renders <OrderCancelModal /> component', () => {
    const wrapper = shallow(<OrderCancelModal cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Cancel Modal works!');
  });
});
