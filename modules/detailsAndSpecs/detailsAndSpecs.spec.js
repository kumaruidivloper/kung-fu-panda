import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import DetailsAndSpecs from './detailsAndSpecs.component';

describe('<DetailsAndSpecs />', () => {
  it('renders <DetailsAndSpecs /> component', () => {
    const productSpecifications = [{ A: ['a1', 'a2'] }, { B: ['b1', 'b2'] }, { C: ['c1', 'c2'] }, { D: ['d1', 'd2'] }, { E: ['e1', 'e2'] }];
    const description = 'Sample product description';
    const wrapper = shallow(<DetailsAndSpecs productSpecifications={productSpecifications} description={description} />);
    expect(wrapper).to.have.length(1);
  });

  it('renders when no specifications', () => {
    const productSpecifications = [];
    const description = 'Sample product description';
    const wrapper = mount(<DetailsAndSpecs productSpecifications={productSpecifications} description={description} />);
    expect(wrapper).to.have.length(1);
  });
});
