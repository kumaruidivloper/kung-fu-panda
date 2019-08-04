import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import componentJson from './heroCarousel.component.json';
import HeroCarousel from './heroCarousel.component';

describe('Test if <HeroCarousel /> renders properly', () => {
    it('render <HeroCarousel />', () => {
        const wrapper = shallow(<HeroCarousel cms={componentJson.context.data.cms} />);
        expect(wrapper.find('div')).to.have.length(1);
        expect(wrapper.find('div Slider')).to.have.length(1);
    });
});
describe('Test if <HeroCarousel /> is mounted in enzyme', () => {
    it('mounts <HeroCarousel /> component', () => {
        const wrapper = mount(<HeroCarousel cms={componentJson.context.data.cms} />);
        expect(wrapper.find('HeroCarousel')).to.have.length(1);
        expect(wrapper.contains(constructor)).to.equal(true);
        expect(wrapper.find('HeroCarousel Slider')).to.have.length(1);
    });
});
