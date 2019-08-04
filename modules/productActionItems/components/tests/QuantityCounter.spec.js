import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { Quantity } from './../styles';
import QuantityCounter from './../QuantityCounter';
import componentJson from '../../productActionItems.component.json';

class FauxState {
  constructor() {
    this.quantity = 1;
    this.updateQuantity = this.updateQuantity.bind(this);
  }

  updateQuantity(quantity) {
    this.quantity = quantity;
  }
}

const myFauxState = new FauxState();

describe('<QuantityCounter />', () => {
  const { cms } = componentJson.context.data;
  const props = { cms };
  it('renders <QuantityCounter /> component', () => {
    const wrapper = shallow(<QuantityCounter cms={cms} />);
    expect(wrapper.find(Quantity.NumberContainer)).to.have.length(1);
    expect(wrapper.find(Quantity.ButtonsLeft)).to.have.length(1);
    expect(wrapper.find(Quantity.ButtonsRight)).to.have.length(1);
    expect(wrapper.find(Quantity.NumberInput)).to.have.length(1);
  });

  it('increments testing with mount', () => {
    const wrapper = mount(<QuantityCounter {...props} quantity={myFauxState.quantity} updateQuantity={myFauxState.updateQuantity} />);
    const incButton = wrapper.find(Quantity.ButtonsRight);
    incButton.simulate('click');
    expect(myFauxState.quantity).to.equal(2);
  });
  it('decrements testing with mount', () => {
    const wrapper = mount(<QuantityCounter {...props} quantity={myFauxState.quantity} updateQuantity={myFauxState.updateQuantity} />);
    const decButton = wrapper.find(Quantity.ButtonsLeft);
    decButton.simulate('click');
    expect(myFauxState.quantity).to.equal(1);
  });
});

