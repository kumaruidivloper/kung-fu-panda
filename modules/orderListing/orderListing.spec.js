import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderListingJson from './orderListing.component.json';
import OrderListing from './orderListing.component';

describe('<OrderListing />', () => {
  const { cms } = orderListingJson.context.data;
  it('renders <OrderListing /> component', () => {
    const wrapper = shallow(<OrderListing cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Listing works!');
  });
});
