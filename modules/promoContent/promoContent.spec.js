import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Json from './promoContent.component.json';
import PromoContent from './promoContent.component';

describe('PromoContent', () => {
    const { cms } = Json.context.data;
    const props = { cms };

    it('renders <PromoContent /> component', () => {
      const wrapper = shallow(<PromoContent {...props} />);
      expect(wrapper.find('div .promo-content-wrapper').at(0)).to.have.length(1);
    });

    it('should have button', () => {
      const wrapper = shallow(<PromoContent {...props} />);
      expect(wrapper.find('button').at(0)).to.have.length(1);
    });

    it('should have image', () => {
      const wrapper = shallow(<PromoContent {...props} />);
      expect(wrapper.find('img').at(0)).to.have.length(1);
    });
});
