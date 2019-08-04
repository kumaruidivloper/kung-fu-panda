import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import prescreenJson from './prescreen.component.json';
import Prescreen from './prescreen.component';

describe('<Prescreen />', () => {
  const { cms } = prescreenJson.context.data;
  it('renders <Prescreen /> component', () => {
    const wrapper = shallow(<Prescreen cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Prescreen works!');
  });
});