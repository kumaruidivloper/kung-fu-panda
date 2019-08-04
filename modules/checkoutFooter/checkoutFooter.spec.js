import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import checkoutFooterJson from './checkoutFooter.component.json';
import CheckoutFooter from './checkoutFooter.component';

describe('<CheckoutFooter />', () => {
  const { cms } = checkoutFooterJson.context.data;
  it('renders <CheckoutFooter  /> component', () => {
    const wrapper = mount(<CheckoutFooter cms={cms} />);
    expect(wrapper.find('div')).to.have.length(15);
    expect(wrapper.find('hr')).to.have.length(1);
    expect(wrapper.find('img')).to.have.length(cms.cardsAccepted.length);
    expect(wrapper.find('a')).to.have.length((cms.legalLinks.length) + 2);
    // expect(wrapper.find('img')).at(1).to.have.length((cms.legalLinks.length) + 2);


    // expect(wrapper.find('div h3')).to.have.length(1);
    // expect(wrapper.find('div h3').text()).to.equal('Checkout Footer works!');
  });
});
