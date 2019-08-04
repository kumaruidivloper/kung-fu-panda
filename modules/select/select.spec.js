import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Select from './select.component';
import { Option, Selection } from './styles';

describe('<Select />', () => {
  const options = [
    {
      label: 'Option 1',
      value: 1
    },
    {
      label: 'Option 2',
      secondaryLabel: 'secondaryLabel',
      value: 2
    }
  ];
  it('renders <Select /> component', () => {
    const wrapper = shallow(<Select options={options} />);
    expect(wrapper).to.have.length(1);
  });

  it('test click event', () => {
    const wrapper = mount(<Select options={options} />);
    wrapper.setState({ isOpen: true });
    wrapper
      .find(Option)
      .first()
      .simulate('click');
    expect(wrapper).to.have.length(1);
  });

  it('test click event on selection', () => {
    const wrapper = mount(<Select options={options} />);
    wrapper.setState({ isOpen: true });
    wrapper
      .find(Selection)
      .first()
      .simulate('click');
    expect(wrapper).to.have.length(1);
  });

  it('test key down enter', () => {
    const wrapper = mount(<Select options={options} />);
    wrapper.setState({ isOpen: true });
    wrapper
      .find(Option)
      .first()
      .simulate('keyDown', { keyCode: 13 });
    expect(wrapper).to.have.length(1);
  });

  it('test key arrow down', () => {
    const wrapper = mount(<Select options={options} />);
    wrapper.setState({ isOpen: true });
    wrapper
      .find(Option)
      .first()
      .simulate('keyDown', { keyCode: 40 });
    expect(wrapper).to.have.length(1);
  });

  it('test key arrow up', () => {
    const wrapper = mount(<Select options={options} />);
    wrapper.setState({ isOpen: true });
    wrapper
      .find(Option)
      .first()
      .simulate('keyDown', { keyCode: 38 });
    expect(wrapper).to.have.length(1);
  });

  it('test next props', () => {
    const wrapper = mount(<Select options={options} selectedItem={options[0]} />);
    wrapper.setProps({ selectedItem: options[1] });
    expect(wrapper).to.have.length(1);
  });
});
