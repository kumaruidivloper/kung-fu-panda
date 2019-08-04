import React from 'react';
// import { CategoryGridComponent } from 'fusion-components';
// import axios from 'axios';
import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';
import { EmailSignup } from './emailSignup.component';
import emailSignupJson from './emailSignup.component.json';

describe('EmailSignup Component', () => {
  const { cms } = emailSignupJson.context.data.cms;
  const props = {
    cms,
    api: {}
  };
  const initialState = { modalStatus: true };
  const store = configureStore();
  let MountedEmailSignup;
  it('always renders the emailSignup component', () => {
    const Wrapper = shallow(<EmailSignup {...props} store={store(initialState)} />);
    expect(Wrapper.length).to.eql(1);
  });

  const ShallowSEmailSignup = () => {
    if (!MountedEmailSignup) {
      MountedEmailSignup = mount(<EmailSignup {...props} store={store(initialState)} />);
    }
    return MountedEmailSignup;
  };

  it('always renders a Modal component', () => {
    expect(ShallowSEmailSignup().find('div').length).to.not.equal(0);
  });

  it('Tests the component render life cycle', () => {
    sinon.spy(EmailSignup.prototype, 'render');
    mount(<EmailSignup {...props} store={store(initialState)} />);
    expect(EmailSignup.prototype.render.calledOnce).to.equal(true);
  });

  it('Calls modalContent', () => {
    mount(<EmailSignup {...props} store={store(initialState)} />).setState({
      modalStatus: true
    });
    sinon.spy(EmailSignup.prototype, 'modalContent');
    expect(EmailSignup.prototype.modalContent).to.be.a('function');
  });

  it('validate onChangeinput', () => {
    const wrapper = shallow(<EmailSignup {...props} store={store(initialState)} />).setState({
      formSubmitted: true,
      modalStatus: true,
      modelShow: 'success'
    });
    expect(wrapper.instance().onChangeinput).to.be.a('function');
  });

  it('Calls toggleModal', () => {
    const wrapper = mount(<EmailSignup {...props} store={store(initialState)} />);
    expect(wrapper.instance().toggleModal).to.be.a('function');
  });

  it('Calls validateForm', () => {
    const wrapper = mount(<EmailSignup {...props} store={store(initialState)} />);
    wrapper.instance().validateForm();
    expect(wrapper.instance().validateForm).to.be.a('function');
  });

  it('Calls modalSuccessful', () => {
    const wrapper = mount(<EmailSignup {...props} store={store(initialState)} />).setState({
      formSubmitted: true,
      modalStatus: true,
      modelShow: 'success'
    });
    expect(wrapper.instance().modalSuccessful).to.be.a('function');
  });

  it('Calls modalError', () => {
    const wrapper = mount(<EmailSignup {...props} store={store(initialState)} />).setState({
      formSubmitted: true,
      modalStatus: true,
      modelShow: 'failed'
    });
    expect(wrapper.instance().modalError).to.be.a('function');
  });

  it('validate onEmailSubmit', () => {
    const wrapper = shallow(<EmailSignup {...props} store={store(initialState)} />).setState({
      formSubmitted: true,
      modalStatus: true,
      modelShow: 'success'
    });
    expect(wrapper.instance().onEmailSubmit).to.be.a('function');
  });
});
