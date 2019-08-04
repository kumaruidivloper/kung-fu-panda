import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sidebarJson from './sidebar.component.json';
import Sidebar from './sidebar.component';

describe('<Sidebar />', () => {
  const { cms } = sidebarJson.context.data;
  it('renders <Sidebar /> component', () => {
    const wrapper = shallow(<Sidebar cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Sidebar works!');
  });
});
