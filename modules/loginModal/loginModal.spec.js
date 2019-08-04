import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import loginModalJson from './loginModal.component.json';
import { LoginModal } from './loginModal.component';


describe('<LoginModal />', () => {
  const { cms } = loginModalJson.context.data;
  const initialstore = { };
  const store = configureStore();
  it('renders <LoginModal /> component', () => {
    const wrapper = mount(<LoginModal cms={cms} store={store(initialstore)} />);
    expect(wrapper.find('h5')).to.have.length(1);
  });
  it('text check for heading', () => {
    const wrapper = mount(<LoginModal cms={cms} store={store(initialstore)} />);
    expect(wrapper.find('h5').text()).to.equal('WELCOME BACK!');
  });
  it('Tests the component render life cycle', () => {
    sinon.spy(LoginModal.prototype, 'render');
    mount(<LoginModal cms={cms} store={store(initialstore)} />);
    expect(LoginModal.prototype.render.calledOnce).to.equal(true);
  });
  it('Validate toggleModal', () => {
    const wrapper = mount(<LoginModal cms={cms} store={store(initialstore)} />);
    expect(wrapper.instance().toggleModal).to.be.a('function');
  });
  it('Validate modalContent', () => {
    const wrapper = mount(<LoginModal cms={cms} store={store(initialstore)} />);
    expect(wrapper.instance().modalContent).to.be.a('function');
  });
  it('Validate onEmailSubmit', () => {
    const wrapper = mount(<LoginModal cms={cms} store={store(initialstore)} />);
    expect(wrapper.instance().onEmailSubmit).to.be.a('function');
  });
  it('Validate onChangeinput', () => {
    const wrapper = mount(<LoginModal cms={cms} store={store(initialstore)} />);
    expect(wrapper.instance().onChangeinput).to.be.a('function');
  });
  it('Validate validateForm', () => {
    const wrapper = mount(<LoginModal cms={cms} store={store(initialstore)} />);
    expect(wrapper.instance().validateForm).to.be.a('function');
  });
  it('Validate validateForm', () => {
    const wrapper = mount(<LoginModal cms={cms} store={store(initialstore)} />);
    wrapper.setState({ formErrors: [{ emailId: true }] });
    expect(wrapper.instance().validateForm).to.be.a('function');
  });
});
