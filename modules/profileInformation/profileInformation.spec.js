import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import profileInformationJson from './profileInformation.component.json';
import ProfileInformation from './profileInformation.component';

describe('<ProfileInformation />', () => {
  const { cms } = profileInformationJson.context.data;
  it('renders <ProfileInformation /> component', () => {
    const wrapper = shallow(<ProfileInformation cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Profile Information works!');
  });
});
