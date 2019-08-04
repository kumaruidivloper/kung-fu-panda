import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderReturnDropdownJson from './orderReturnDropdown.component.json';
import OrderReturnDropdown from './orderReturnDropdown.component';

describe('<OrderReturnDropdown />', () => {
  const { cms } = orderReturnDropdownJson.context.data;
  it('renders <OrderReturnDropdown /> component', () => {
    const wrapper = shallow(<OrderReturnDropdown cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Return Dropdown works!');
  });
});
