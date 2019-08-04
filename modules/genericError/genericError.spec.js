import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import genericErrorJson from './genericError.component.json';
import GenericError from './genericError.component';

describe('<GenericError />', () => {
  const { cms } = genericErrorJson.context.data;
  it('renders <GenericError /> component', () => {
    const wrapper = shallow(<GenericError cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Generic Error works!');
  });
});
