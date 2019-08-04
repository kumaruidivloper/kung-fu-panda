import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Json from './featuredCategory.component.json';
import FeaturedCategory from './featuredCategory.component';

const initialState = {};
const store = configureStore([])(initialState);

describe('FeaturedCategory', () => {
  const { cms } = Json.context.data;
  const component = shallow(<FeaturedCategory cms={cms} store={store} />).dive();

  it('Renders a heading', () => {
    expect(component.find('h2')).to.have.length(1);
  });

  it('Heading same as headline', () => {
    expect(component.find('h2').text()).to.equal(cms.headline);
  });

  it('Number of cards is same as length of category', () => {
    expect(component.find('a')).to.have.length(cms.category.length);
  });
  it('heading left alignment', () => {
    cms.headlineAlignment = 'left';
    const leftAlign = shallow(<FeaturedCategory cms={cms} store={store} />).dive();
    expect(leftAlign.find('h3').prop('className')).to.equal('text-left');
  });
  it('heading right alignment', () => {
    cms.headlineAlignment = 'right';
    const rightAlign = shallow(<FeaturedCategory cms={cms} store={store} />).dive();
    expect(rightAlign.find('h3').prop('className')).to.equal('text-right');
  });
});
