import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import showShippingMethodJson from './showShippingMethod.component.json';
import ShowShippingMethod from './showShippingMethod.component';

describe('<ShowShippingMethod />', () => {
  const { cms, orderDetails } = showShippingMethodJson.context.data;
  let imagesNumber = 0;
  orderDetails.shippingGroups.map(mode => {
    imagesNumber += mode.orderItems.length;
    return true;
   });
  it('renders <ShowShippingMethod /> component', () => {
    const wrapper = mount(<ShowShippingMethod cms={cms} orderDetails={orderDetails} />);
    expect(wrapper.find('div')).to.have.length(45);
    expect(wrapper.find('img')).to.have.length(imagesNumber);
  });
});
