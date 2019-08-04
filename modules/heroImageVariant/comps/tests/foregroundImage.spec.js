import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import ForegroundImage from '../foregroundImage';

describe('<ForegroundImage/>', () => {
  it('should have an image to display in the foreground', () => {
    const wrapper = shallow(<ForegroundImage src="image path" />);
    expect(wrapper.find('img')).to.have.length(1);
  });

  it('should have props `src` and `position="center"`', () => {
    const wrapper = mount(<ForegroundImage src="image path" position="center" />);
    expect(wrapper.props().src).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.not.be.undefined; //eslint-disable-line
  });
  it('should have props `src` and `position="bottom"`', () => {
    const wrapper = mount(<ForegroundImage src="image path" position="bottom" />);
    expect(wrapper.props().src).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.not.be.undefined; //eslint-disable-line
  });
});
