import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import orderSumaryCheckoutJson from './checkoutOrderSummary.component.json';
import CheckoutOrderSummary from './checkoutOrderSummary.component';

describe('<OrderSummary />', () => {
  const { cms, orderDetails, cartUrl } = orderSumaryCheckoutJson.context.data;
  it('renders <OrderSummary /> component', () => {
    const wrapper = mount(<CheckoutOrderSummary cms={cms} orderDetails={orderDetails} cartUrl={cartUrl} />);
    expect(wrapper.find('h6')).to.have.length(1);
  });

  it('renders <OrderSummary /> component', () => {
    const wrapper = mount(<CheckoutOrderSummary cms={cms} orderDetails={orderDetails} cartUrl={cartUrl} />);
    expect(wrapper.find('h6').text()).to.equal('Order Summary');
  });
});
