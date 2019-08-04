import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import passwordStrengthMeterJson from './passwordStrengthMeter.component.json';
import PasswordStrengthMeter from './passwordStrengthMeter.component';

describe('<PasswordStrengthMeter />', () => {
  const { cms } = passwordStrengthMeterJson.context.data;
  it('renders <PasswordStrengthMeter /> component', () => {
    const wrapper = shallow(<PasswordStrengthMeter cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Password Strength Meter works!');
  });
});
