import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import PopoverStateless from '@academysports/fusion-components/dist/PopoverStateless';
import Popover from './popover';
import * as emo from './popover.emotion';
import * as emoPopoverModal from '../PopoverModal/popoverModal.emotion';

// import * as util from '../../testUtil';

const initialProps = {
  direction: 'left',
  children: 'button text',
  modalContent: 'modal content',
  onToggleClick: undefined,
  onClose: undefined,
  open: false
};

describe('<Popover />', () => {
  it('renders <Popover /> wrapper when closed', () => {
    const props = { ...initialProps, open: false };
    const wrapper = shallow(<Popover {...props} />);
    expect(wrapper.find(PopoverStateless.Wrapper)).to.have.length(1);
  });

  it('renders <Popover /> wrapper when open', () => {
    const props = { ...initialProps, open: true };
    const wrapper = shallow(<Popover {...props} />);
    expect(wrapper.find(PopoverStateless.Wrapper)).to.have.length(1);
  });

  it('<Popover /> open/close working on click', () => {
    const props = { ...initialProps, open: undefined };
    const wrapper = mount(<Popover {...props} />);

    // util.consoleLogDebug(wrapper);
    // util.consoleLogHtml(wrapper);

    expect(wrapper.find(PopoverStateless.Wrapper)).to.have.length(1);
    expect(wrapper.find(PopoverStateless.Modal).children().length).to.be.equal(0);

    // open on click
    wrapper.find(emo.ContentWrapper).simulate('click');
    expect(wrapper.find(PopoverStateless.Modal).children().length).to.be.greaterThan(0);

    // close on click
    expect(wrapper.find(emoPopoverModal.Close)).to.have.length(1);
    wrapper.find(emoPopoverModal.Close).simulate('click');
    expect(wrapper.find(PopoverStateless.Modal).children().length).to.be.equal(0);

    // open on enter press
    // wrapper.find(emo.ContentWrapper).simulate('keyDown', { keyCode: 13 });
    // expect(wrapper.find(PopoverStateless.Modal).children().length).to.be.greaterThan(0);
  });
});
