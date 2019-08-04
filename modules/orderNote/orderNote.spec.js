import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import orderNoteJson from './orderNote.component.json';
import OrderNote from './orderNote.component';

describe('<OrderNote />', () => {
  const { cms } = orderNoteJson.context.data;
  it('renders <OrderNote /> component', () => {
    const wrapper = shallow(<OrderNote cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Order Note works!');
  });
});
