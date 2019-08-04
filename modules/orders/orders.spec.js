import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ordersJson from './orders.component.json';
import Orders from './orders.component';

describe('<Orders />', () => {
  const { cms } = ordersJson.context.data;
  it('renders <Orders /> component', () => {
    const wrapper = shallow(<Orders cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Orders works!');
  });
});
