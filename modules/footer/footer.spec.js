import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import footerJson from './footer.component.json';
import Footer from './footer.component';
import Accordian from './footer.accordian';
import SocialLinks from './columnHeadings/socialLinks';
import LegalLinks from './columnHeadings/legalLinks';
import HeaderList from './columnHeadings/headerList';
import ColumnHeaders from './columnHeadings/columnHeaders';

const initialState = {};
const store = configureStore([])(initialState);

describe('<Footer />', () => {
  const { cms } = footerJson.context.data;
  const linksArr = [
    { label: 'Gift Cards', url: 'www.yahoo.com' },
    { label: 'Academy Credit', url: 'www.yahoo.com' },
    { label: 'Card', url: 'www.yahoo.com' },
    { label: 'Store Services', url: 'www.yahoo.com' }
  ];
  let legalLinksArr = [
    { label: 'Privacy Policy', url: 'privacy.com' },
    { label: 'Terms & Conditions', url: 'terms.com' },
    { label: 'California Proposition 65 California Transparency in Supply Chain Act(SB 657)', url: '/content/academy' }
  ];

  const wrapper = shallow(<Footer cms={cms} store={store} />).dive();
  const accordian = shallow(<Accordian title="THIS IS ACADEMY" />);
  const headerList = shallow(<HeaderList />);
  const socialLinks = shallow(<SocialLinks />);
  const legalLinks = shallow(<LegalLinks legalLinks={legalLinksArr} store={store} />).dive();
  const columnHeaders = shallow(<ColumnHeaders links={linksArr} store={store} />).dive();

  it('Should render <Accordian /> component', () => {
    expect(wrapper.find(Accordian)).to.have.length(3);
  });

  it('Should render <SocialLinks /> component', () => {
    expect(wrapper.find(SocialLinks)).to.have.length(4);
  });

  it('Should render <LegalLinks /> component', () => {
    expect(wrapper.find(LegalLinks)).to.have.length(2);
  });

  it('Should render <HeaderList /> component', () => {
    expect(wrapper.find(HeaderList)).to.have.length(6);
  });

  it('Should render Legal label', () => {
    expect(wrapper.find('.o-copy__12light')).to.have.length(1);
  });

  it('Should call Accordian method to pass academy params', () => {
    const instance = wrapper.instance();
    instance.toggleAccordian('academy', true);
    expect(wrapper.state().academyTab).to.equal(true);
    expect(wrapper.state().helpTab).to.equal(false);
    expect(wrapper.state().servicesTab).to.equal(false);
  });

  it('Should call Accordian method to pass help params', () => {
    const instance = wrapper.instance();
    instance.toggleAccordian('help', true);
    expect(wrapper.state().academyTab).to.equal(false);
    expect(wrapper.state().helpTab).to.equal(true);
    expect(wrapper.state().servicesTab).to.equal(false);
  });

  it('Should call Accordian method to pass services params', () => {
    const instance = wrapper.instance();
    instance.toggleAccordian('services', true);
    expect(wrapper.state().helpTab).to.equal(false);
    expect(wrapper.state().academyTab).to.equal(false);
    expect(wrapper.state().servicesTab).to.equal(true);
  });

  it('Should have button element to work Accordian in mobile view', () => {
    expect(accordian.find('button')).to.have.length(1);
  });

  it('Should have 2 children div element when open state is true', () => {
    accordian.setProps({ isOpen: true });
    expect(accordian.find('div')).to.have.length(2);
  });

  it('Should have 1 children div element when open state is false', () => {
    accordian.setProps({ isOpen: false });
    expect(accordian.find('div')).to.have.length(1);
  });

  it('Should present "d-flex flex-column" element', () => {
    expect(accordian.find('.d-flex.flex-column')).to.have.length(1);
  });

  it('Should have <ColumnHeaders /> component', () => {
    expect(headerList.find(ColumnHeaders)).to.have.length(1);
  });

  it('Should have h6 element to be present', () => {
    headerList.setProps({ columnHeading: true });
    expect(headerList.find('h6')).to.have.length(1);
  });

  it('Should not render h6 element', () => {
    headerList.setProps({ columnHeading: false });
    expect(headerList.find('h6')).to.have.length(0);
  });

  it('Should have <ColumnHeaders /> component', () => {
    expect(socialLinks.find(ColumnHeaders)).to.have.length(1);
  });

  it('Should be present "d-flex flex-wrap" classes', () => {
    expect(legalLinks.find('.d-flex.flex-wrap')).to.have.length(1);
  });

  it('Should not render icon related element', () => {
    expect(legalLinks.find('.academyicon')).to.have.length(0);
  });

  it('Should have anchor links', () => {
    expect(legalLinks.find('a')).to.not.have.length(0);
  });

  it('Should have anchor links', () => {
    expect(legalLinks.find('span')).to.have.length(2);
  });

  it('Should render icon related element', () => {
    legalLinksArr = [
      { label: 'Privacy Policy', url: 'privacy.com', icon: 'fb' },
      { label: 'Terms & Conditions', url: 'terms.com', icon: 'ln' },
      { label: 'California Proposition 65 California Transparency in Supply Chain Act(SB 657)', url: '/content/academy', icon: 'tw' }
    ];
    legalLinks.setProps({ legalLinks: legalLinksArr });
    expect(legalLinks.find('.academyicon')).to.not.have.length(0);
  });

  it('Should not have "social-item" class', () => {
    expect(columnHeaders.find('.social-item')).to.have.length(0);
  });

  it('Should trigger the click event', () => {
    columnHeaders.setProps({ className: 'social-item' });
    expect(columnHeaders.find('.social-item')).to.not.have.length(0);
  });
});
