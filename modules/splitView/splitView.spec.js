import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import splitViewJson from './splitView.component.json';
import SplitView from './splitView.component';

describe('<SplitView />', () => {
  const { cms } = splitViewJson.context.data;
  it('renders <SplitView /> component', () => {
    const wrapper = shallow(<SplitView cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Split View works!');
  });
});
