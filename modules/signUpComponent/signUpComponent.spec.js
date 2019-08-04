import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import signUpComponentJson from './signUpComponent.component.json';
import SignUpComponent from './signUpComponent.component';

describe('<SignUpComponent />', () => {
  const { cms } = signUpComponentJson.context.data;
  it('renders <SignUpComponent /> component when isregistered is true', () => {
    const wrapper = shallow(<SignUpComponent cms={cms} isRegistered />);
    const mockButtonClick = sinon.spy(wrapper.instance(), 'redirectToHome');
    expect(wrapper.find('div')).to.have.length(2);
    expect(wrapper.find('h4')).to.have.length(1);
    wrapper.find('y').props().onClick();
    expect(mockButtonClick.calledOnce).equals(true);
  });
  it('renders <SignUpComponent /> component when isregistered is false', () => {
    const wrapper = mount(<SignUpComponent cms={cms} />);
    const updatePinClick = sinon.spy();
    wrapper
      .find('button')
      .at(0)
      .prop('onClick')();
    expect(updatePinClick.calledOnce).to.be.equal(false);
    expect(wrapper.find('button')).to.have.length(2);
    expect(wrapper.find('input')).to.have.length(5);
  });
  it('checking onchange functions for input value of first name', () => {
    const wrapper = shallow(<SignUpComponent cms={cms} />);
    const updatePinClick = sinon.spy(wrapper.instance(), 'firstName');
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };
    expect(wrapper.find('u')).to.have.length(3);
    wrapper.find('u').at(0).props().onChange(event);
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
  });
  it('checking onchange functions for input value of last name', () => {
    const wrapper = shallow(<SignUpComponent cms={cms} />);
    const updatePinClick = sinon.spy(wrapper.instance(), 'lastName');
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };
    expect(wrapper.find('u')).to.have.length(3);
    wrapper.find('u').at(1).props().onChange(event);
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
  });
  it('checking onchange functions for input value of logonid', () => {
    const wrapper = shallow(<SignUpComponent cms={cms} />);
    const updatePinClick = sinon.spy(wrapper.instance(), 'logonId');
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };
    expect(wrapper.find('u')).to.have.length(3);
    wrapper.find('u').at(2).props().onChange(event);
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
  });
  it('checking onchange functions for input value of password field', () => {
    const wrapper = shallow(<SignUpComponent cms={cms} />);
    const updatePinClick = sinon.spy(wrapper.instance(), 'logonPassword');
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };
    wrapper.find('t').at(0).props().onChange(event);
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
  });
  it('checking onchange functions for input value of checkbox field', () => {
    const wrapper = shallow(<SignUpComponent cms={cms} />);
    const updatePinClick = sinon.spy(wrapper.instance(), 'checkbox');
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };
    wrapper.find('t').at(1).props().onChange(event);
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
  });
  it('checking onclick functions for sign in button', () => {
    const updatePinClick = sinon.spy();
    const wrapper = shallow(<SignUpComponent cms={cms} handleRedirect={updatePinClick} />);
    wrapper.find('button').at(0).props().onClick();
  });
  it('checking when there errorsignup true', () => {
    const wrapper = shallow(<SignUpComponent cms={cms} errorSignUp />);
    expect(wrapper.find('p')).to.have.length(1);
  });
  it('checking when there errorsignup false and then true', () => {
    const wrapper = shallow(<SignUpComponent cms={cms} />);
    expect(wrapper.state().submitButtonActive).equals(false);
    wrapper.instance().checkValidation();
    expect(wrapper.state().submitButtonActive).equals(true);
  });
});
