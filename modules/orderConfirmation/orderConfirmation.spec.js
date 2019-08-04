import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderConfirmationJson from './orderConfirmation.component.json';
import OrderConfirmation from './orderConfirmation.component';

describe('<OrderConfirmation />', () => {
  const { cms } = orderConfirmationJson.context.data;
  const props = { cms };
  it('renders <OrderConfirmation /> component', () => {
    const wrapper = shallow(<OrderConfirmation {...props} />);
    expect(wrapper.find('div')).to.have.length(3);
  });
  it('should have image', () => {
    const wrapper = shallow(<OrderConfirmation {...props} />);
    expect(wrapper.find('img')).to.have.length(1);
  });
});
