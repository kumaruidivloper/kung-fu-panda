import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import seoJson from './seo.component.json';
import Seo from './seo.component';
/* eslint no-unused-expressions: 0 */
Enzyme.configure({ adapter: new Adapter() });

describe('<Seo />', () => {
  const { api, pageInfo } = seoJson.context.data;
  it('Should have a title tag', () => {
    const wrapper = shallow(<Seo api={api} pageInfo={pageInfo} />);
    expect(wrapper.find('title')).to.have.length(1);
  });

  it('Should have one or more meta tags', () => {
    const wrapper = shallow(<Seo api={api} pageInfo={pageInfo} />);
    expect(wrapper.find('meta').length).to.be.at.least(1);
  });

  it('should have props api and pageInfo', () => {
    const wrapper = shallow(<Seo api={api} pageInfo={pageInfo} />);
    expect(wrapper.props('api')).to.be.an('object');
    expect(wrapper.props('pageInfo')).to.be.an('object');
  });
});
