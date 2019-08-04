import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import videoPlayerJson from './videoPlayer.component.json';
import VideoPlayer from './videoPlayer.component';

describe('<VideoPlayer />', () => {
  const { cms } = videoPlayerJson.context.data;
  it('renders <VideoPlayer /> component', () => {
    const wrapper = shallow(<VideoPlayer cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Video Player works!');
  });
});
