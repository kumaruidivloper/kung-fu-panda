import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import BackgroundImage from '../backgroundImage';

describe('<BackgroundImage/>', () => {
  it('should have a background image div to display all child components', () => {
    const wrapper = shallow(<BackgroundImage src="image path" />);
    expect(wrapper.find('BackgroundImageContainer')).to.have.length(1);
  });

  it('should have a content div containers for images and content', () => {
    const wrapper = mount(<BackgroundImage src="image path" />);
    expect(wrapper.find('Content')).to.have.length(1);
  });

  it('should have props for `src`', () => {
    const wrapper = mount(<BackgroundImage src="image path" />);
    expect(wrapper.props().src).to.not.be.undefined; // eslint-disable-line
  });
});
