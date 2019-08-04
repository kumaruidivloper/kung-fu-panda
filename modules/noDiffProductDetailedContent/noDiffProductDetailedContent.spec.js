import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import noDiffProductDetailedContentJson from './noDiffProductDetailedContent.component.json';
import NoDiffProductDetailedContent from './noDiffProductDetailedContent.component';

describe('<NoDiffProductDetailedContent />', () => {
  const { cms } = noDiffProductDetailedContentJson.context.data;
  it('renders <NoDiffProductDetailedContent /> component', () => {
    const wrapper = shallow(<NoDiffProductDetailedContent cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('No Diff Product Detailed Content works!');
  });
});
