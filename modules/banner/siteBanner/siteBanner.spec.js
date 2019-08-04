
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import SiteBanner from './siteBanner';
import Json from '../banner.component.json';
import { SiteBannerAnchor, SiteTitle, CloseBtn } from '../styles';

describe('SiteBanner', () => {
    const { cms } = Json.context.data;
    const props = { cms };

    it('renders <SiteBanner /> component', () => {
        const wrapper = shallow(<SiteBanner {...props} />);
        expect(wrapper.find(SiteBannerAnchor)).to.have.length(1);
    });

    it('should display the sitebanner initially', () => {
        const wrapper = shallow(<SiteBanner {...props} />);
        expect(wrapper.state().displayBanner).to.equal(true);
    });

    it('should have site banner title', () => {
        const wrapper = shallow(<SiteBanner {...props} />);
        expect(wrapper.find(SiteTitle)).to.have.length(1);
    });

    it('should have a cross button to close the sitebanner', () => {
        const wrapper = mount(<SiteBanner {...props} />);
        expect(wrapper.find(CloseBtn)).to.have.length(1);
    });
    it('Check color', () => {
        const wrapper = mount(<SiteBanner {...props} />);
        expect(wrapper.find('div').at(0)).to.have.length(1);
    });

    it('should call routeToOffer on clicking cross', () => {
        const wrapper = shallow(<SiteBanner {...props} />);
        const crossButton = wrapper.find(CloseBtn);
        crossButton.simulate('click');
        expect(wrapper.state().displayBanner).to.equal(false);
    });
});
