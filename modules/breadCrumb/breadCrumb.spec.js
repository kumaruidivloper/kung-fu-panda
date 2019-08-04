import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import breadCrumbJson from './breadCrumb.component.json';
import BreadCrumb from './breadCrumb.component';

describe('<BreadCrumb />', () => {
  const { cms } = breadCrumbJson.context.data;
  it('renders <BreadCrumb /> component', () => {
    const wrapper = shallow(<BreadCrumb cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Bread Crumb works!');
  });

  it('renders <BreadCrumb /> breadCrumbComponent', () => {
    const wrapper = shallow(<BreadCrumb cms={cms} />);
    expect(wrapper.hasClass('breadCrumbComponent')).to.equal(true);
  });

  it('renders <BreadCrumb /> CSS', () => {
    const wrapper = shallow(<BreadCrumb cms={cms} />);
    expect(wrapper.hasClass('css-9tf9ac ec2ex2f2')).to.equal(false);
  });
  it('component previous linke should be empty at component initialization', () => {
    const wrapper = shallow(<BreadCrumb cms={cms} />);
    expect(wrapper.state().previousLink).to.equal('');
  });
});
