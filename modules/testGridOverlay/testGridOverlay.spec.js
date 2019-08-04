import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import testGridOverlayJson from './testGridOverlay.component.json';
import TestGridOverlay from './testGridOverlay.component';

describe('<TestGridOverlay />', () => {
  const { cms } = testGridOverlayJson.context.data;
  it('renders <TestGridOverlay /> component', () => {
    const wrapper = shallow(<TestGridOverlay cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Test Grid Overlay works!');
  });
});
