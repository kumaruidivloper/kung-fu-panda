import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import SectionTitle from './sectionTitle.component';

const initialState = {};
const store = configureStore([])(initialState);

describe('SectionTitle', () => {
  const json = {
    title: 'heading',
    textAlignment: 'center',
    h1: 'true'
  };
  const component = shallow(<SectionTitle cms={json} store={store} />).dive();

  it('Should render a h1 if "h1: true"', () => {
    expect(component.find('h1')).to.have.length(1);
  });

  it('Content should match the title node of json', () => {
    expect(component.text()).to.equal(json.title);
  });
});
