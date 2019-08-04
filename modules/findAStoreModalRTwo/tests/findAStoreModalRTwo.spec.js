import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { spy } from 'sinon';
import { FindAStoreModalRTwoVanilla } from '../findAStoreModalRTwo.component';
import FindAStoreModalJson, { } from '../findAStoreModalRTwo.component.json';

let ShallowWrapper;
let inputWrapper;

const { cms } = FindAStoreModalJson.context.data;
const { storeData } = FindAStoreModalJson.context.data;
const initialState = {};
const props = {
  findStoreHeading: true,
  getMystoreDetails: {
    streetAddress: '3855 S 26th St',
    storeLocalID: '2622190',
    phone: '(479) 619-1900',
    services: "<ul>\n<li>Hunting & Fishing Licenses</li>\n<li>Line Spooling</li>\n<li>Scope Mounting & Bore Sighting</li>\n<li>FFL Transfer Service</li>\n<li>CO2 Refills</li>\n<li>Propane Exchange</li>\n<li>Racquet Stringing</li>\n<li>Product Delivery & Assembly</li>\n<li>Archery Lane</li>\n<li>Archery Shop</li>\n<li>Electronic Driving Range</li>\n<!--<li>Golf Club Regripping</li>-->\n<li>Golf Club Trade-In</li>\n</ul>\n<br>\n<br><a href='/webapp/wcs/stores/servlet/InStoreServices?langId=-1&storeId=10151&catalogId=10051'>View details</a>",
    storePicURL: '',
    storeName: 'Academy Sports + Outdoors 0089',
    storeHours: 'Sun. 9:30am-9:30pm Mon. 8am-9:30pm Tues. 8am-9:30pm Weds. 8am-9:30pm Thurs. 8am-9:30pm Fri. 8am-10pm Sat. 8am-10pm',
    neighborhood: 'Pleasant Grove',
    state: 'ar',
    todayHours: 'Sun. 9:30am-9:30pm Mon. 8am-9:30pm Tues. 8am-9:30pm Weds. 8am-9:30pm Thurs. 8am-9:30pm Fri. 8am-10pm Sat. 8am-10pm',
    gx_id: '89',
    storeId: '89',
    city: 'Rogers',
    country: 'US',
    careers: '10560170185',
    distance: '2.86',
    zipCode: '72758',
    EVENTS: "<div class='monetateevents'></div>",
    promo1: '',
    isCompleted: true,
    geometry: {
      type: 'Point',
      coordinates: [36.121747, -94.154561, 0]
    }
  },
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
  getCartDetails: {
    data: {
      allItems: { a: 'asdasd' }
    }
  },
  store: configureStore()(initialState),
  fnFindLatLangZipCodeRequest: () => {},
  fnfindZipCodeGapiRequest: () => {},
  fnToggleFindAStore: () => {},
  fnsetRadius: () => {},
  fnupdateOrderIdRequest: () => {},
  fnUpdateMyStoreDetails: () => {},
  fnmakeMyStoreDetailsUpdated: () => {},
  fngetCartDetails: () => {},
  cms: {
    radiusLabel: 'radiusLabel'
  }
};

const event = {
  target: { name: 'pollName', value: 'spam' },
  preventDefault: spy,
  stopPropagation: spy
};

const storeValue = { gx_id: '43' };
const storeGeo = 'storeGeo';

// Mock geo location
global.navigator.geolocation = {
  getCurrentPosition: () => {
  }
};

describe('FindAStoreModal Unit Test', () => {
  beforeEach(() => {
    ShallowWrapper = shallow(<FindAStoreModalRTwoVanilla {...props} cms={cms} />);
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

  it('getStoreDetails() call', () => {
    const getStoreDetails = spy(ShallowWrapper.instance(), 'getStoreDetails');
    const getFormWrapper = ShallowWrapper.find('form');
    ShallowWrapper.setState({ selectedStoreNo: 89 });
    getFormWrapper.simulate('submit', event);
    expect(getStoreDetails.calledOnce).to.equal(true);
  });

/*  it('Should call seeMoreStores, on Button click', () => {
    ShallowWrapper.setState({ showLimit: 1 });
    const nextStoreButton = ShallowWrapper.find('.mb-half').at(0);
    const seeMoreStores = spy(ShallowWrapper.instance(), 'seeMoreStores');
    nextStoreButton.simulate('click', event);
    expect(seeMoreStores.calledOnce).to.equal(true);
  }); */

  it('Display noStore message, when zero store found', () => {
    ShallowWrapper.setProps({ data: { storeDetails: { data: [] }, getMystoreDetails: { zipCode: 122001 } } });
    const notStoreComponent = ShallowWrapper.find('.noStore');
    expect(notStoreComponent).to.have.length(1);
  });

  // Branch test
  it('Should return true, when showLimit less than storeDetails length', () => {
    ShallowWrapper.setState({ showLimit: 0 });
  });
  it('makeMyStore test', () => {
    const makeMyStore = spy(ShallowWrapper.instance(), 'makeMyStore');
    const getButton = ShallowWrapper.find('.StoreBody').at(1).children().at(2);
    getButton.simulate('click', (storeValue, storeValue.gx_id, storeGeo, event));
    expect(makeMyStore.calledOnce).to.equal(true);
  });

  it('Should render myStore accordion if getMystoreDetails and selectedStoreNo exist', () => {
    const myStoreAccordian = spy(ShallowWrapper.instance(), 'myStoreAccordian');
    ShallowWrapper.setState({ selectedStoreNo: 89 });
    expect(myStoreAccordian.calledOnce).to.equal(true);
  });

  it('showPositionAccessed should accept position parameter', () => {
    const position = {
      coords: {
        latitude: 29.7604267,
        longitude: -95.3698028
      }
    };
    ShallowWrapper.setState({ selectedStoreNo: 35 });
    const showPositionAccessed = spy(ShallowWrapper.instance(), 'showPositionAccessed');
    showPositionAccessed(position);
  });
});
