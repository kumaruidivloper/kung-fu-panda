import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import baitVariantJson from './baitVariant.component.json';
import BaitVariant from './baitVariant.component';
// import QuantityCard from './components/qua';

describe('<BaitVariant />', () => {
  const { cms } = baitVariantJson.context.data;
  it('renders <BaitVariant /> component', () => {
    const wrapper = shallow(<BaitVariant cms={cms} />);
    expect(wrapper.find('div')).to.have.length(2);
  });

  it('should have an intial state', () => {
    const wrapper = shallow(<BaitVariant />);
    expect(wrapper.state('tabIndex')).to.equal(1);
    expect(wrapper.state('positionCarousel')).to.equal(0);
  });

  it('should update on clicking slideRight', () => {
    const wrapper = shallow(<BaitVariant />);
    wrapper.find('.btn-right').simulate('click');
    expect(wrapper.state('positionCarousel')).to.equal(-84);
    expect(wrapper.state('tabIndex')).to.equal(1);
  });

  it('should update on clicking slideLeft', () => {
    const wrapper = shallow(<BaitVariant />);
    wrapper.find('.btn-left').simulate('click');
    expect(wrapper.state('selectedQty')).to.equal(0);
    expect(wrapper.state('tabIndex')).to.equal(0);
  });
});

