import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import siteMapJson from './siteMap.component.json';
import SiteMap from './siteMap.component';

describe('<SiteMap />', () => {
  const { cms } = siteMapJson.context.data;
  it('renders <SiteMap /> component', () => {
    const wrapper = shallow(<SiteMap cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Site Map works!');
  });
});
