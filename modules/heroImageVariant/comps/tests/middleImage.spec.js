import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import MiddleImage from '../middleImage';

describe('<MiddleImage/>', () => {
  it('should have a div to display the background image', () => {
    const wrapper = shallow(<MiddleImage src="bgImagePath" position="left" />).dive();
    expect(wrapper.find('div')).to.have.length(1);
  });
  it("should have props for `src` and `position` with value of position equal to 'right'", () => {
    const wrapper = mount(<MiddleImage src="bgImagePath" position="right" />);
    expect(wrapper.props().src).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.equal('right');
  });
  it("should have props for `src` and `position` with value of position equal to 'left'", () => {
    const wrapper = mount(<MiddleImage src="bgImagePath" position="left" />);
    expect(wrapper.props().src).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.equal('left');
  });
});
