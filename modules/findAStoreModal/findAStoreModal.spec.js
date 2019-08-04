import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { spy } from 'sinon';
import { FindAStoreModalVanilla } from './findAStoreModal.component';
import FindAStoreModalJson, { } from './findAStoreModal.component.json';

let ShallowWrapper;
let inputWrapper;

const { cms } = FindAStoreModalJson.context.data;
const { storeData } = FindAStoreModalJson.context.data;
const initialState = {};
const props = {
  findStoreHeading: true,
  latLangDetailsForMap: {
    isCompleted: 'true',
    data: {
      lat: 0,
      lang: 0
    }
  },
  data: {
    ...storeData,
    neighborhood: 'neighborhood'
  },
  store: configureStore()(initialState),
  fnFindLatLangZipCodeRequest: spy
};

const event = {
  target: { name: 'pollName', value: 'spam' },
  preventDefault: spy,
  stopPropagation: spy
};

// Mock geo location
global.navigator.geolocation = {
  getCurrentPosition: () => {
  }
};

describe('FindAStoreModal Unit Test', () => {
  beforeEach(() => {
    ShallowWrapper = shallow(<FindAStoreModalVanilla {...props} cms={cms} />);
    inputWrapper = ShallowWrapper.find('input');
  });

  it('renders FindAStoreModal component correctly', () => {
    expect(ShallowWrapper.find('div').at(0)).to.have.length(1);
  });

  it('Should contain one Modal', () => {
    expect(ShallowWrapper.find('Modal')).to.have.length(1);
  });

  // Input Handlers
  it('Should call method onChangeinput(), when input get changed', () => {
    const onChangeinput = spy(ShallowWrapper.instance(), 'onChangeinput');
    inputWrapper.simulate('change', event);
    expect(onChangeinput.calledOnce).to.equal(true);
  });

  it('Should call method focusEle(), when input get focused', () => {
    const focusEle = spy(ShallowWrapper.instance(), 'focusEle');
    inputWrapper.simulate('focus', event);
    expect(focusEle.calledOnce).to.equal(true);
  });

  it('Should call method blurEle(), when input get blur', () => {
    const blurEle = spy(ShallowWrapper.instance(), 'blurEle');
    inputWrapper.simulate('blur', event);
    expect(blurEle.calledOnce).to.equal(true);
  });

  it('getStoreDetails() call, on storeDetail anchor triggered', () => {
    const getStoreDetails = spy(ShallowWrapper.instance(), 'getStoreDetails');
    const getStoreAnchor = ShallowWrapper.find('a').at(0);
    getStoreAnchor.simulate('click', event);
    expect(getStoreDetails.calledOnce).to.equal(true);
  });

  it('Should call seeMoreStores, on Button click', () => {
    ShallowWrapper.setState({ showLimit: 1 });
    const nextStoreButton = ShallowWrapper.find('.mb-half');
    const seeMoreStores = spy(ShallowWrapper.instance(), 'seeMoreStores');
    nextStoreButton.simulate('click', event);
    expect(seeMoreStores.calledOnce).to.equal(true);
  });

  it('Display noStore message, when zero store found', () => {
    ShallowWrapper.setProps({ data: { storeDetails: { data: [] } } });
    const notStoreComponent = ShallowWrapper.find('.noStore');
    expect(notStoreComponent).to.have.length(1);
  });

  // Branch test
  it('Should return true, when showLimit less than storeDetails length', () => {
    ShallowWrapper.setState({ showLimit: 0 });
  });
});
