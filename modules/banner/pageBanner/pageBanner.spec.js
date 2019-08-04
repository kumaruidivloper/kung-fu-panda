
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PageBanner from './pageBanner';
import Json from '../banner.component.json';
import { PageBannerAnchor } from '../styles';


describe('PageBanner', () => {
    const { cms } = Json.variants[0].context.data;
    const props = { cms };

    it('renders <PageBanner /> component', () => {
        const wrapper = shallow(<PageBanner {...props} />);
        expect(wrapper.find(PageBannerAnchor)).to.have.length(1);
    });

    it('should display the pagebanner', () => {
        const wrapper = shallow(<PageBanner {...props} />);
        expect(wrapper.state().displayBanner).to.equal(true);
    });

    it('should not display pagebanner if displaybanner state is false', () => {
        const wrapper = shallow(<PageBanner {...props} />);
        wrapper.setState({ displayBanner: false });
        expect(wrapper.children()).to.have.length(0);
    });
});
