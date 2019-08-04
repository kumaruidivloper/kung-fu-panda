import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sweepstakesJson from './sweepstakes.component.json';
import Sweepstakes from './sweepstakes.component';

describe('<Sweepstakes />', () => {
  const { cms } = sweepstakesJson.context.data;
  it('renders <Sweepstakes /> component', () => {
    const wrapper = shallow(<Sweepstakes cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Sweepstakes works!');
  });
});
