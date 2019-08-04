import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import higherOrderJson from './higherOrder.component.json';
import HigherOrder from './higherOrder.component';

describe('<HigherOrder />', () => {
  const { cms } = higherOrderJson.context.data;
  it('renders <HigherOrder /> component', () => {
    const wrapper = shallow(<HigherOrder cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Higher Order works!');
  });
});
