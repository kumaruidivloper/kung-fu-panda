import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import quickViewJson from './quickView.component.json';
import QuickView from './quickView.component';

describe('<QuickView />', () => {
  const { cms } = quickViewJson.context.data;
  it('renders <QuickView /> component', () => {
    const wrapper = shallow(<QuickView cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Quick View works!');
  });
});
