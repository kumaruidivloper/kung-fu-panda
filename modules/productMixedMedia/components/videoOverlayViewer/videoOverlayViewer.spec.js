import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import VideoViewerOverlay from './index';

describe('<VideoViewerOverlay />', () => {
  it('renders <VideoViewerOverlay /> component', () => {
    const wrapper = mount(<VideoViewerOverlay openPlayer videoAssetName="Sample_Asset_Name" />);
    expect(wrapper).to.have.length(1);
  });
});
