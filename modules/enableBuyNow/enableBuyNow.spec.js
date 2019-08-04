import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import enableBuyNowJson from './enableBuyNow.component.json';
import EnableBuyNow from './enableBuyNow.component';

describe('<EnableBuyNow />', () => {
  const { cms } = enableBuyNowJson.context.data;
  it('renders <EnableBuyNow /> component', () => {
    const wrapper = shallow(<EnableBuyNow cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Enable Buy Now works!');
  });
});
