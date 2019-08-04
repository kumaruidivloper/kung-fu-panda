import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ProductVideoViewer from './productVideoViewer.component';

describe('<ProductVideoViewer />', () => {
  it('renders <ProductVideoViewer /> component', () => {
    const wrapper = mount(<ProductVideoViewer autoPlay videoAssetName="Sample_Asset_Name" />);
    expect(wrapper).to.have.length(1);
  });
});
