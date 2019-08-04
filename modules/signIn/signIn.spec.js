import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import Button from '@academysports/fusion-components/dist/Button';
import signInJson from './signIn.component.json';
import SignIn from './signIn.component';

describe('<SignIn />', () => {
  const { cms, passwordExpiredFlag, redirect, formSubmitStatus, error } = signInJson.context.data;
  it('renders <SignIn /> component', () => {
    const wrapper = shallow(
      <SignIn cms={cms} passwordExpiredFlag={passwordExpiredFlag} redirect={redirect} formSubmitStatus={formSubmitStatus} error={error} />
    );
    expect(wrapper.find('div')).to.have.length(11);
  });
  it('<SignIn /> component should have 2 button tags', () => {
    const wrapper = shallow(
      <SignIn cms={cms} passwordExpiredFlag={passwordExpiredFlag} redirect={redirect} formSubmitStatus={formSubmitStatus} error={error} />
    );
    expect(wrapper.find(Button)).to.have.length(1);
  });
  it('<SignIn /> component should have 2 input fields', () => {
    const wrapper = mount(
      <SignIn cms={cms} passwordExpiredFlag={passwordExpiredFlag} redirect={redirect} formSubmitStatus={formSubmitStatus} error={error} />
    );
    expect(wrapper.find('input')).to.have.length(2);
  });
  it('<SignIn /> component in case of error true', () => {
    const wrapper = shallow(
      <SignIn cms={cms} passwordExpiredFlag={passwordExpiredFlag} redirect={redirect} formSubmitStatus={formSubmitStatus} error />
    );
    expect(wrapper.find('p')).to.have.length(1);
  });
  it('checking onchange functions for input value of email address field and password', () => {
    const wrapper = shallow(
      <SignIn cms={cms} passwordExpiredFlag={passwordExpiredFlag} redirect={redirect} formSubmitStatus={formSubmitStatus} error={error} />
    );
    const updatePinClick = sinon.spy(wrapper.instance(), 'onChangeinput');
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };
    wrapper
      .find('u')
      .at(0)
      .props()
      .onChange(event);
    wrapper
      .find('t')
      .at(0)
      .props()
      .onChange(event);
    expect(updatePinClick.calledTwice).equals(true);
    updatePinClick.restore();
  });
  it('checking onclick functionality for forgot password and sign in', () => {
    const mockfunc = value => value;
    const wrapper = shallow(
      <SignIn
        handleRedirection={mockfunc}
        cms={cms}
        passwordExpiredFlag={passwordExpiredFlag}
        redirect={redirect}
        formSubmitStatus={formSubmitStatus}
        error={error}
        fnShowLoader={() => {}}
        fnHideLoader={() => {}}
      />
    );
    expect(
      wrapper
        .find('a')
        .at(0)
        .props()
        .href
    ).equals('/myaccount/shop/LogonForm?pageState=forgotPassword');
    expect(
      wrapper
        .find('a')
        .at(1)
        .props()
        .href
    ).equals('/myaccount/shop/LogonForm?pageState=signUp');
  });
  it('checking sign in button click', () => {
    const wrapper = shallow(
      <SignIn cms={cms} fnShowLoader={() => {}} fnHideLoader={() => {}} passwordExpiredFlag={passwordExpiredFlag} redirect={redirect} formSubmitStatus={formSubmitStatus} error={error} />
    );
    const updatePinClick = sinon.spy(wrapper.instance(), 'onEmailSubmit');
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };
    wrapper.find('y').simulate('click', event);
    expect(updatePinClick.calledOnce).equals(true);
    updatePinClick.restore();
  });
});
describe('componentWillReceiveProps()', () => {
  const { cms, formSubmitStatus, error } = signInJson.context.data;
  it('checking is the props changing', () => {
    let redirect = true;
    let passwordExpiredFlag = true;
    const component = shallow(
      <SignIn cms={cms} passwordExpiredFlag={passwordExpiredFlag} redirect={redirect} formSubmitStatus={formSubmitStatus} error={error} />
    );
    expect(component.instance().props.redirect).equals(true);
    expect(component.instance().props.passwordExpiredFlag).equals(true);
    redirect = false;
    passwordExpiredFlag = false;
    // triggers componentWillReceiveProps
    component.setProps({ redirect, passwordExpiredFlag });
    expect(component.instance().props.redirect).equals(false);
    expect(component.instance().props.passwordExpiredFlag).equals(false);
  });
});
