import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Atc from './../AddToCart/Atc';

describe('<Atc />', () => {
  const props = {
    onClickAddToCartLogGA: () => {},
    item: {
      skuId: '123',
      SKUs: [
        {
          skuId: '123,'
        }
      ]
    }
  };

  beforeEach(() => {});

  it('renders <Atc /> component', () => {
    const wrapper = shallow(<Atc {...props} />);
    expect(wrapper.length).to.equal(1);
  });
  it('mount <Atc /> component', () => {
    const wrapper = mount(<Atc {...props} />);
    expect(wrapper.length).to.equal(1);
  });
  it('should able to handle add to cart', () => {
    const wrapper = shallow(<Atc {...props} />);
    wrapper.instance().createOnClickAddToCart(() => {}, props.item);
    wrapper.setProps({ isNoDiffBundle: true });
    wrapper.instance().createOnClickAddToCart(() => {}, props.item);
  });
  it('should handle openModal/closeModal', () => {
    const wrapper = shallow(<Atc {...props} onRequestOpenAddToCartModal={() => {}} onRequestCloseAddToCartModal={() => {}} />);
    wrapper.instance().openModal();
    expect(wrapper.instance().state.modalIsOpen).to.equal(true);
    wrapper.instance().closeModal();
    expect(wrapper.instance().state.modalIsOpen).to.equal(false);
  });
});
