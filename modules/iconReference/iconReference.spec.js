import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import iconReferenceJson from './iconReference.component.json';
import IconReference from './iconReference.component';

describe('<IconReference />', () => {
  const { cms } = iconReferenceJson.context.data;
  it('renders <IconReference /> component', () => {
    const wrapper = shallow(<IconReference cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Icon Reference works!');
  });
});
