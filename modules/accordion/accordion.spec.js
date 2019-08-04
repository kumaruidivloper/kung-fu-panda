import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import accordionJson from './accordion.component.json';
import { Accordion } from './accordion.component';

/* eslint no-unused-expressions: 0 */
Enzyme.configure({ adapter: new Adapter() });

describe('<Accordion />', () => {
  const { cms } = accordionJson.context.data;
  it('Should have <Drawer /> component', () => {
    const wrapper = shallow(<Accordion cms={cms} />);
    expect(wrapper.find('.container').children()).to.not.have.length(0);
  });
});
describe('CMS props', () => {
  const { cms } = accordionJson.context.data;
  it('Should have accordionItems', () => {
    expect(cms).to.have.property('accordionItems');
  });
  it('accordionItems Should have at-least one item', () => {
    expect(cms.accordionItems).to.have.length.gte(1);
  });
});
