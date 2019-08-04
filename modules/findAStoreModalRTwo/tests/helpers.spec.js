import { expect } from 'chai';
import {
  formatedString,
  getStockAvailabilityStatus,
  inventoryData,
  extractRegUserResponse
} from '../helpers';

const storeInventory = {
  skus: [1, 2, 3, 4]
};

const cartItems = [
  { skuId: 1 },
  { skuId: 2 }
];

const inventory = {
      orderItem: [
        { skuId: 1, quantity: 1, skuDetails: { skuInfo: 'skuInfo' }, productId: 1 },
        { skuId: 2, quantity: 1, skuDetails: { skuInfo: 'skuInfo' }, productId: 2 },
        { skuId: 1, quantity: 1, skuDetails: { skuInfo: 'skuInfo' }, productId: 1 },
        { skuId: 2, quantity: 1, skuDetails: { skuInfo: 'skuInfo' }, productId: 2 }
      ]
};
const storeDetailsData = {
  stores: [{
    geometry: {
      type: 'Point',
      coordinates: [36.2899, -94.1582, 0]
    },
    properties: {
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
      city: 'Rogers',
      country: 'US',
      careers: '10560170185',
      distance: '2.86',
      zipCode: '72758',
      EVENTS: "<div class='monetateevents'></div>",
      promo1: '',
      bopisEligible: '0',
      todayTiming: 'Open today from 8:00 am - 10:00 pm',
      weekHours: { weekEndHrs: '9am-9:30pm', openUntil: '10pm', weekDayHrs: '8am-10pm' }
    }
  },
    {
      geometry: {
        type: 'Point',
        coordinates: [36.121747, -94.154561, 0]
      },
      properties: {
        streetAddress: '3864 N. Steele Blvd.',
        storeLocalID: '',
        phone: '(479) 444-2500',
        services: "<ul>\n<li>Hunting & Fishing Licenses</li>\n<li>Line Spooling</li>\n<li>Scope Mounting & Bore Sighting</li>\n<li>FFL Transfer Service</li>\n<li>CO2 Refills</li>\n<li>Propane Exchange</li>\n<li>Racquet Stringing</li>\n<li>Product Delivery & Assembly</li>\n<li>Archery Lane</li>\n<li>Archery Shop</li>\n<li>Electronic Driving Range</li>\n<!--<li>Golf Club Regripping</li>-->\n<li>Golf Club Trade-In</li>\n</ul>\n<br>\n<br><a href='/webapp/wcs/stores/servlet/InStoreServices?langId=-1&storeId=10151&catalogId=10051'>View details</a>",
        storePicURL: '',
        storeName: 'Academy Sports + Outdoors 180',
        storeHours: 'Sun. 9:30am-9:30pm Mon. 8am-9:30pm Tues. 8am-9:30pm Weds. 8am-9:30pm Thurs. 8am-9:30pm Fri. 8am-10pm Sat. 8am-10pm',
        neighborhood: 'Mud Creek',
        state: 'ar',
        todayHours: 'Sun. 9:30am-9:30pm Mon. 8am-9:30pm Tues. 8am-9:30pm Weds. 8am-9:30pm Thurs. 8am-9:30pm Fri. 8am-10pm Sat. 8am-10pm',
        gx_id: '180',
        city: 'Fayetteville',
        country: 'US',
        careers: '',
        distance: '14.06',
        zipCode: '72703',
        EVENTS: "<div class='monetateevents'></div>",
        promo1: ''
      }
    }
  ]
};
describe('findAStoreModalRTwo Helpers Test', () => {
  it('formatedString', () => {
    expect(formatedString('IAM-CAPITAL')).to.deep.equal('iam-capital');
  });

  it('return null avl and unAvl data, if cartItems receive null data', () => {
    const expectedData = {
      avl: [],
      unAvl: []
    };
    expect(getStockAvailabilityStatus([], [])).to.deep.equal(expectedData);
  });

  it('return null avl and unAvl data, if storeInventory receive null data', () => {
    const expectedData = {
      avl: [],
      unAvl: [
        { skuId: 1 },
        { skuId: 2 }
      ]
    };
    expect(getStockAvailabilityStatus(cartItems, [])).to.deep.equal(expectedData);
  });

  it('Should accept storeInventory, cartItems', () => {
    const expectedData = {
      avl: [],
      unAvl: [
        { skuId: 1 },
        { skuId: 2 }
      ]
    };
    expect(getStockAvailabilityStatus(cartItems, storeInventory)).to.deep.equal(expectedData);
  });

  it('inventoryData test', () => {
    const expectedData = {
      allItems: [{
        quantity: 1,
        skuId: 1
      }, {
        quantity: 1,
        skuId: 2
      }, {
        quantity: 1,
        skuId: 1
      }, {
        quantity: 1,
        skuId: 2
      }],
      skus: ['1:1', '2:1', '1:1', '2:1']
    };
    expect(inventoryData(inventory)).to.deep.equal(expectedData);
  });

  it('Should extractRegUserResponse return object, if storeDetails exist', () => {
    const expectedData = {
      streetAddress: '3855 S 26th St',
      todayHours: 'Sun. 9:30am-9:30pm Mon. 8am-9:30pm Tues. 8am-9:30pm Weds. 8am-9:30pm Thurs. 8am-9:30pm Fri. 8am-10pm Sat. 8am-10pm',
      neighborhood: 'Pleasant Grove',
      phone: '(479) 619-1900',
      state: 'ar',
      zipCode: '72758',
      city: 'Rogers',
      manualSearch: false,
      gx_id: '89',
      storeId: '89',
      storeName: 'Academy Sports + Outdoors 0089',
      isFav: undefined,
      openhours: '9:30pm',
      geometry: {
        type: 'Point',
        coordinates: [36.2899, -94.1582, 0]
      },
      distance: '2.86',
      bopisEligible: '0',
      todayTiming: 'Open today from 8:00 am - 10:00 pm',
      weekHours: { weekEndHrs: '9am-9:30pm', openUntil: '10pm', weekDayHrs: '8am-10pm' }
    };
    expect(extractRegUserResponse(storeDetailsData)).to.deep.equal(expectedData);
  });
});
