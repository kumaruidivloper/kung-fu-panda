import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderJson from './order.component.json';
import Order from './order.component';

describe('<Order />', () => {
  const { cms } = orderJson.context.data;
  it('renders <Order /> component', () => {
    const wrapper = shallow(<Order cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order works!');
  });
});
