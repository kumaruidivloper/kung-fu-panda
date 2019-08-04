import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import showShippingInfoJson from './showShippingInfo.component.json';
import ShowShippingInfo from './showShippingInfo.component';

describe('<ShowShippingInfo />', () => {
  const { cms } = showShippingInfoJson.context.data;
  it('renders <ShowShippingInfo /> component', () => {
    const wrapper = shallow(<ShowShippingInfo cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Show Shipping Info works!');
  });
});
