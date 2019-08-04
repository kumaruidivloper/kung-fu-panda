import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import headerJson from './header.component.json';
import Header from './header.component';

describe('<Header />', () => {
  const { cms } = headerJson.context.data;
  it('renders <Header /> component', () => {
    const wrapper = shallow(<Header cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Header works!');
  });
});
