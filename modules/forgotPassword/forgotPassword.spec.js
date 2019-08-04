import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import forgotPasswordJson from './forgotPassword.component.json';
import ForgotPassword from './forgotPassword.component';

describe('<ForgotPassword />', () => {
  const { cms } = forgotPasswordJson.context.data;
  it('renders <ForgotPassword /> component', () => {
    const wrapper = shallow(<ForgotPassword cms={cms} serverError />);
    expect(wrapper.find('div')).to.have.length(7);
    expect(wrapper.find('section')).to.have.length(1);
  });
  it('renders <ForgotPassword /> component with ', () => {
    const wrapper = mount(<ForgotPassword cms={cms} serverError />);
    expect(wrapper.find('button')).to.have.length(1);
    expect(wrapper.find('input')).to.have.length(1);
  });
  it('renders <ForgotPassword /> component with success page as false', () => {
    const wrapper = shallow(<ForgotPassword cms={cms} />);
    expect(wrapper.find('h4')).to.have.length(1);
    expect(wrapper.find('h4').text()).equals(cms.forgotYourPasswordHeadingLabel);
    let updatePinClick = sinon.spy(wrapper.instance(), 'handleEmailChange');
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };
    wrapper.find('u').props().onChange(event);
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
    updatePinClick = sinon.spy(wrapper.instance(), 'handleSubmit');
    wrapper.find('y').props().onClick();
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
  });
  it('renders <ForgotPassword /> component with successpage as true', () => {
    const wrapper = shallow(<ForgotPassword cms={cms} successPage fnClearData={() => 'test'} handleRedirect={value => value} />);
    expect(wrapper.find('h4')).to.have.length(1);
    expect(wrapper.find('h4').text()).equals(cms.sentNewPassword);
    const updatePinClick = sinon.spy(wrapper.instance(), 'handleSubmit');
    wrapper.find('button').props().onClick();
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
  });
});
