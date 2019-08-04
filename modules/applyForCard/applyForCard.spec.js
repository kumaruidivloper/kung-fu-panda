import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import applyForCardJson from './applyForCard.component.json';
import ApplyForCard from './applyForCard.component';

describe('<ApplyForCard />', () => {
  const { cms } = applyForCardJson.context.data;
  it('renders <ApplyForCard /> component', () => {
    const wrapper = shallow(<ApplyForCard cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Apply For Card works!');
  });
});