import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import ModalContent from './../AddToCart/ModalContent';

describe('<ModalContent />', () => {
  const props = {
    cartURL: 'http://localhost/cart',
    checkoutURL: 'http://localhost/checkout',
    onClickAddToCartLogGA: () => {},
    items: [
      {
        price: '100.00',
        skuId: '123',
        SKUs: [
          {
            skuId: '123,'
          }
        ]
      }
    ]
  };

  beforeEach(() => {});

  it('renders <ModalContent /> component', () => {
    const wrapper = shallow(<ModalContent {...props} />);
    expect(wrapper.length).to.equal(1);
  });
  it('mount <ModalContent /> component', () => {
    const wrapper = mount(<ModalContent {...props} />);
    expect(wrapper.length).to.equal(1);
  });
  it('should redirect to cart when clicked', () => {
    const wrapper = mount(<ModalContent {...props} />);
    const btnToCart = wrapper.find('button').at(0);
    btnToCart.simulate('click');
  });
  it('should redirect to checkout when clicked', () => {
    const wrapper = mount(<ModalContent {...props} />);
    const btnToCart = wrapper.find('button').at(1);
    btnToCart.simulate('click');
  });
});
