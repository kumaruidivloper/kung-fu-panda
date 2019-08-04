import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import productPriceJson from '../productPrice.component.json';
import ProductPrice from '../productPrice.component';
import Price from '../price';
import {
  KEY_PRICE_IN_CART,
  KEY_CALL_FOR_PRICING,
  KEY_LIVE_CHAT,
  TEXT_OUR_PRICE_IN_CART,
  TEXT_CALL_PRIMARY_MESSAGE,
  TEXT_LIVE_CHAT_MESSAGE
} from '../constants';
import { TitleText } from '../productPrice.styles';

describe('<ProductPrice />', () => {
  const { price } = productPriceJson.context.data;
  it('renders <ProductPrice /> WasNow PriceType component', () => {
    const wrapper = shallow(<ProductPrice price={price} />);
    expect(wrapper).to.have.length(1);
  });
  it('renders <ProductPrice /> WasNow PriceType component isBundle=true', () => {
    const isBundle = true;
    const wrapper = mount(<ProductPrice price={price} isBundle={isBundle} />);
    expect(wrapper).to.have.length(1);
  });
  it('renders <ProductPrice /> return null when price not present', () => {
    const wrapper = mount(<ProductPrice price={undefined} />);
    expect(wrapper.html()).to.equal(null);
  });
  it('renders <ProductPrice /> with message KEY_PRICE_IN_CART', () => {
    price.priceMessage = KEY_PRICE_IN_CART;
    const isTooltip = true;
    const wrapper = mount(<ProductPrice price={price} isTooltip={isTooltip} />);
    const title = wrapper.find(TitleText);
    expect(title.length).to.equal(1);
    expect(title.text()).to.equal(TEXT_OUR_PRICE_IN_CART);
  });
  it('renders <ProductPrice /> with message KEY_CALL_FOR_PRICING', () => {
    price.priceMessage = KEY_CALL_FOR_PRICING;
    const wrapper = mount(<ProductPrice price={price} />);
    const title = wrapper.find(TitleText);
    expect(title.length).to.equal(1);
    expect(title.text()).to.equal(TEXT_CALL_PRIMARY_MESSAGE);
  });
  it('renders <ProductPrice /> with message KEY_LIVE_CHAT', () => {
    price.priceMessage = KEY_LIVE_CHAT;
    const wrapper = mount(<ProductPrice price={price} />);
    const title = wrapper.find(TitleText);
    expect(title.length).to.equal(1);
    expect(title.text()).to.equal(TEXT_LIVE_CHAT_MESSAGE);
  });
  it('renders <ProductPrice /> with standart price', () => {
    price.priceMessage = '';
    const wrapper = mount(<ProductPrice price={price} />);
    const title = wrapper.find(Price);
    expect(title.length).to.equal(1);
  });
});
