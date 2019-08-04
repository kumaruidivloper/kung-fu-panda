import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import productAdditionalDetailsJson from './productAdditionalDetails.component.json';
import ProductAdditionalDetails from './productAdditionalDetails.component';
import { PriceWrapper, PromoMessage } from './styles';

describe('<ProductAdditionalDetails />', () => {
  const { cms, price } = productAdditionalDetailsJson.context.data;
  it('renders <ProductAdditionalDetails /> component', () => {
    const props = {
      cms,
      price,
      shippingMessage: 'test',
      promoMessage: 'test'
    };
    const wrapper = mount(<ProductAdditionalDetails {...props} />);
    const priceWrapper = wrapper.find(PriceWrapper).find('p');
    const promoMessage = wrapper.find(PromoMessage);
    expect(priceWrapper).to.have.length(1);
    expect(priceWrapper.text()).to.equal(props.shippingMessage);
    expect(promoMessage.text()).to.equal(props.promoMessage);
  });
});
