import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import componentJson from './heroImage.component.json';
import HeroImage from './heroImage.component';

describe('<HeroImage />', () => {
  it('renders <HeroImage /> component', () => {
    const wrapper = mount(<HeroImage cms={componentJson.context.data.cms} />);
    expect(wrapper.find('div')).to.have.length(8);
    expect(wrapper.find('div a button')).to.have.length(2);
  });
  it('renders heroImage component without legallink and ctapath', () => {
    const { cms } = componentJson.context.data;
    cms.legalLink = '';
    cms.cta[0].ctaPath = '';
    cms.cta[1].ctaPath = '';
    const wrapper = mount(<HeroImage cms={cms} />);
    expect(wrapper.find('div')).to.have.length(8);
    expect(wrapper.find('div a button')).to.have.length(0);
  });
});
