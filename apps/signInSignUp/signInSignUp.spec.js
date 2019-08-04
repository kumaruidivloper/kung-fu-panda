import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import signInSignUpJson from './signInSignUp.component.json';
import SignInSignUp from './signInSignUp.component';

describe('<SignInSignUp />', () => {
  const { cms } = signInSignUpJson;
  it('renders <SignInSignUp /> component', () => {
    const wrapper = shallow(<SignInSignUp cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Sign In Sign Up works!');
  });
});
