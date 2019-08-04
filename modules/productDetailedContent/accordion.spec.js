import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Accordion from './accordion';

describe('<Accordion />', () => {
  it('renders <Accordion /> is open', () => {
    const props = {
      title: 'test',
      isOpen: true,
      isBundle: true
    };
    const wrapper = shallow(<Accordion {...props}><div>test content</div></Accordion>);
    expect(wrapper).to.have.length(1);
  });

  it('renders <Responsive /> not open', () => {
    const props = {
      title: 'test',
      isOpen: true,
      isBundle: false
    };
    const wrapper = shallow(<Accordion {...props}><div>test content</div></Accordion>);
    expect(wrapper.length).to.equal(1);
  });
  it('renders <Accordion /> is open', () => {
    const props = {
      title: 'test',
      isOpen: true,
      isBundle: true
    };
    const wrapper = mount(<Accordion {...props}><div>test content</div></Accordion>);
    expect(wrapper).to.have.length(1);
  });

  it('renders <Responsive /> not open', () => {
    const props = {
      title: 'test',
      isOpen: true,
      isBundle: false
    };
    const wrapper = mount(<Accordion {...props}><div>test content</div></Accordion>);
    expect(wrapper.length).to.equal(1);
  });

  it('renders <Responsive /> should be clicked', () => {
    const props = {
      title: 'test',
      isOpen: true,
      isBundle: false
    };
    const wrapper = mount(<Accordion {...props}><div>test content</div></Accordion>);
    wrapper.find('div').find('div').at(0).simulate('click');
    expect(wrapper.length).to.equal(1);
  });
});
