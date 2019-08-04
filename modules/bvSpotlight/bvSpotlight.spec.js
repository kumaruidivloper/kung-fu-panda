import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import bvSpotlightJson from './bvSpotlight.component.json';
import BvSpotlight from './bvSpotlight.component';

describe('<BvSpotlight />', () => {
  const { cms } = bvSpotlightJson.context.data;
  it('renders <BvSpotlight /> component', () => {
    const wrapper = shallow(<BvSpotlight cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Bv Spotlight works!');
  });
});
