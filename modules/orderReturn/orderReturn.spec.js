import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderReturnJson from './orderReturn.component.json';
import OrderReturn from './orderReturn.component';

describe('<OrderReturn />', () => {
  const { cms } = orderReturnJson.context.data;
  it('renders <OrderReturn /> component', () => {
    const wrapper = shallow(<OrderReturn cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Return works!');
  });
});
