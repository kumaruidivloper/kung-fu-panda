import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import createPasswordJson from './createPassword.component.json';
import CreatePassword from './createPassword.component';

describe('<CreatePassword />', () => {
  const { cms } = createPasswordJson.context.data;
  it('renders <CreatePassword /> component', () => {
    const wrapper = shallow(<CreatePassword cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Create Password works!');
  });
});
