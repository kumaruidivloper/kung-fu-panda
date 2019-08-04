import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RebatesJson from './rebates.component.json';
import Rebates from './rebates.component';

/* eslint no-unused-expressions: 0 */
Enzyme.configure({ adapter: new Adapter() });

describe('<Rebates />', () => {
  const { cms } = RebatesJson.context.data;
  const wrapper = shallow(<Rebates cms={cms} />);
  it('Should reder a <Card />', () => {
    expect(wrapper.find('Card')).to.have.length(1);
  });
});
describe('CMS props', () => {
  const { cms } = RebatesJson.context.data;
  it('Should have property heading', () => {
    expect(cms).to.have.property('heading');
  });
  it('Should have property offerInformation', () => {
    expect(cms).to.have.property('offerInformation');
  });
  it('Should have property ctaLink', () => {
    expect(cms).to.have.property('ctaLink');
  });
  it('Should have property ctaURL', () => {
    expect(cms).to.have.property('ctaURL');
  });
  it('Should have property expiryDate', () => {
    expect(cms).to.have.property('expiryDate');
  });
});
