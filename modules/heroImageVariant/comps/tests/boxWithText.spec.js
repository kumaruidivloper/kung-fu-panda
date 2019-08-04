import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import BoxWithText from '../boxWithText';

// create any initial state needed
const initialState = {};

// middleware? Please pass it in here
const mockStore = configureStore();
let wrapper;
let store;

describe('<BoxWithText/>', () => {
  beforeEach(() => {
    // creates the store with any initial state or middleware needed.
    store = mockStore(initialState);
    wrapper = mount(<BoxWithText store={store} />);
  });

  it('should have a h1 to display heading', () => {
    expect(wrapper.find('Styled(h1)')).to.have.length(1);
  });
  it('should have a p to display description', () => {
    expect(wrapper.find('Styled(p)')).to.have.length(1);
  });

  it('should have a button for cta', () => {
    expect(wrapper.find('Styled(button)')).to.have.length(1);
  });
/*
  it('should have 5 children elements', () => {
    expect(wrapper.find('BoxWithTextContent').children()).to.have.length(5);
  });
*/
  it('should have props for `bgColor` and `position="left"`', () => {
    wrapper.setProps({ bgColor: 'red', position: 'left' });
    expect(wrapper.props().bgColor).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.equal('left');
  });

  it('should have props for `bgColor` and `position="right"`', () => {
    wrapper.setProps({ bgColor: 'red', position: 'right' });
    expect(wrapper.props().bgColor).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.not.be.undefined; //eslint-disable-line
    expect(wrapper.props().position).to.equal('right');
  });

  it('should have a button', () => {
    expect(wrapper.find('Styled(button)')).to.have.length(1);
  });

  it('should have handleClick for cta redirection', () => {
    const newWrapper = shallow(<BoxWithText store={store} />).dive();
    newWrapper.setProps({ gtmDataLayer: [] });
    newWrapper.find('Styled(button)').simulate('click');
  });
});
