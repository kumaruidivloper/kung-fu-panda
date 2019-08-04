import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ProductCarousel from './productCarousel.component';
import componentJson from './productCarousel.component.json';

describe('<ProductCarousel />', () => {
    it('renders <ProductCarousel> component', () => {
        const wrapper = mount(<ProductCarousel cms={componentJson.context.data.cms} />);
        expect(wrapper.find('section')).to.have.length(7);
    });
});
