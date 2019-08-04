import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ScrollTop, { StyledButton } from './scrollTop';

describe('<ScrollTop />', () => {
  it('renders <ScrollTop /> components', () => {
    const scrollToTopStub = sinon.stub(ScrollTop.prototype, 'scrollToTop');
    const wrapper = shallow(<ScrollTop />);
    const wrapperInstance = wrapper.instance();
    const windowAddEventListenerSpy = sinon.spy(window, 'addEventListener');
    const windowRemoveEventListenerSpy = sinon.spy(window, 'removeEventListener');
    // call fake since original uses document.getElementById
    scrollToTopStub.callsFake(() => null);
    const scrollFunctionSpy = sinon.spy(wrapperInstance, 'scrollFunction');
    const styledButtonComponent = wrapper.find(StyledButton);

    styledButtonComponent.simulate('click');
    expect(windowAddEventListenerSpy.calledWith(scrollFunctionSpy));
    expect(scrollToTopStub.called);

    wrapper.unmount();
    expect(windowRemoveEventListenerSpy.calledWith(scrollFunctionSpy));
  });
});
