
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SiteBanner from './siteBanner/siteBanner';
import PageBanner from './pageBanner/pageBanner';
import Json from './banner.component.json';
import Banner from './banner.component';

describe('<Banner />', () => {
    it('should render <SiteBanner/> component for bannerType sitebanner', () => {
        const wrapper = shallow(<Banner cms={Json.context.data.cms} />);
        expect(wrapper.find(SiteBanner)).to.have.length(1);
    });

    it('should render <PageBanner /> component', () => {
        const wrapper = shallow(<Banner cms={Json.variants[0].context.data.cms} />);
        expect(wrapper.find(PageBanner)).to.have.length(1);
    });
});
