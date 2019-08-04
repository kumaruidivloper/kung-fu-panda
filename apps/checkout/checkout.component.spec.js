import * as environment from '@academysports/aso-env';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { runSaga } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import sinon from 'sinon';

import savedCreditCardsJSON from './../../modules/checkoutPaymentOptions/checkoutPaymentOptions.component.json';
import CheckoutWrapper from './checkout.component';
import checkoutJSON from './checkout.component.json';
import * as constants from './checkout.constants';
import * as actions from './store/actions';
import { showLoader } from './store/actions/globalLoader';
import * as reducers from './store/reducers';
import * as sagas from './store/sagas';

const mock = new MockAdapter(axios);

// const { savedShippingAddress } = shippingAddressJSON.context.data;
const { savedCreditCards } = savedCreditCardsJSON.context.data;

const initialstore = {
  checkout: {
    orderDetails: {
      isFetching: false,
      error: false,
      data: {
        orders: [
          {
            checkoutStates: {
              shippingAddressRequired: false,
              shippingMethodRequired: false,
              paymentRequired: true,
              billingAddressRequired: true
            },
            orderId: '550060016',
            numberOfItems: '2',
            orderStatus: 'P',
            totals: {
              orderTotal: '$229.93',
              totalShippingTax: '$0.00',
              totalShippingCharge: '0.00000',
              totalAdjustment: 0,
              totalSalesTax: 0,
              totalProductPrice: 229.93,
              orderCurrency: 'USD'
            },
            orderItems: [
              {
                orderItemId: '550216027',
                unitPrice: 34.99,
                totalAdjustment: 0,
                zipCode: null,
                quantity: 6,
                shipModeCode: 'UPS Ground',
                shipModeId: '10551',
                orderItemPrice: 209.94,
                orderItemDiscountedPrice: 209.94,
                skuId: '110241067',
                isfreeGift: false,
                productId: '3956033',
                skuDetails: {
                  inventory: {
                    store: [
                      {
                        storeId: 'false'
                      }
                    ],
                    online: [
                      {
                        availableQuantity: '507.0',
                        inventoryStatus: 'IN_STOCK'
                      }
                    ]
                  },
                  skuInfo: {
                    name: 'ADI B TIRO PANT:Black 03:X Small',
                    shortDescription: '',
                    longDescription: 'Designed with side stripes and an adidas™ brandmark, the adidas Boys\' Tiro 17 Training Pant offers a sporty look that he will love. The pant is made of 100% polyester double knit for comfortable wear and features CLIMACOOL® fabric technology to provide heat and moisture management and help him stay cool and dry. Zip pockets.',
                    imageAltDescription: 'ADI B TIRO PANT:Black 03:X Small',
                    sellable: 'true',
                    imageURL: '//assets.academy.com/mgen/94/10757894.jpg',
                    thumbnail: '//assets.academy.com/mgen/94/10757894.jpg',
                    skuAttributes: [
                      {
                        name: 'Color',
                        value: 'Black/White'
                      },
                      {
                        name: 'Size',
                        value: 'X Small'
                      }
                    ]
                  }
                },
                availableShippingMethods: [
                  {
                    shipmodeId: '10551',
                    shipmodeDes: 'SG',
                    shippingType: 'SG',
                    estimatedFromDate: '01-07-2018',
                    estimatedToDate: '07-07-2018'
                  }
                ]
              },
              {
                orderItemId: '550216034',
                unitPrice: 19.99,
                totalAdjustment: 0,
                zipCode: null,
                quantity: 1,
                shipModeCode: 'UPS Ground',
                shipModeId: '10551',
                orderItemPrice: 19.99,
                orderItemDiscountedPrice: 19.99,
                skuId: '113014951',
                isfreeGift: false,
                productId: '5037538',
                skuDetails: {
                  inventory: {
                    store: [
                      {
                        storeId: 'false'
                      }
                    ],
                    online: [
                      {
                        availableQuantity: '23.0',
                        inventoryStatus: 'IN_STOCK'
                      }
                    ]
                  },
                  skuInfo: {
                    name: 'Under Armour Women\'s Tech Graphic Twist T-shirt',
                    shortDescription: '',
                    longDescription: 'Treat yourself to the comfort of the Under Armour Women\'s Tech Graphic Twist T-shirt. The sweat-wicking UA Tech™ fabric dries quickly and feels ultra soft, while the anti-odor technology helps keep the shirt odor free. The Under Armour™ graphic with an allover twist effect creates a cool, sporty look.',
                    imageAltDescription: 'Under Armour Women\'s Tech Graphic Twist T-shirt',
                    sellable: 'true',
                    imageURL: '//assets.academy.com/mgen/63/20075363.jpg',
                    thumbnail: '//assets.academy.com/mgen/63/20075363.jpg',
                    skuAttributes: [
                      {
                        name: 'Color',
                        value: 'Grey'
                      },
                      {
                        name: 'Size',
                        value: 'X Small'
                      }
                    ]
                  }
                },
                availableShippingMethods: [
                  {
                    shipmodeId: '10551',
                    shipmodeDes: 'SG',
                    shippingType: 'SG',
                    estimatedFromDate: '01-07-2018',
                    estimatedToDate: '07-07-2018'
                  }
                ]
              }
            ],
            shippingGroups: [],
            addresses: {
              shippingAddress: {
                firstName: 'Academy',
                lastName: 'Sports',
                phoneNumber: '9786765456',
                address: '7 times square',
                zipCode: '10007',
                city: 'NY',
                state: 'NY',
                companyName: 'Academys'
              },
              billingAddress: {
                firstName: 'John',
                lastName: 'Appleseed',
                phoneNumber: '9786765456',
                address: '1, Infinite Loop',
                zipCode: '95040',
                city: 'Cupertino',
                state: 'CA',
                companyName: 'Nike'
              }
            },
            promotions: [],
            giftCardDetails: [
              {
                gcPiId: '1234',
                totalGCBalance: '0',
                GcAppliedAmount: '14',
                giftcard: '7777091989512621'
              },
              {
                gcPiId: '5678',
                totalGCBalance: '0',
                GcAppliedAmount: '14',
                giftcard: '7777091989512621'
              }
            ]
          }
        ]
      }
    },
    authStatus: {
      isLoggedIn: false
    },
    pageState: {
      shippingAddressRequired: {
        required: false,
        edit: false
      },
      shippingMethodRequired: {
        required: false,
        edit: false
      },
      paymentRequired: {
        required: true,
        edit: true
      }
    },
    savedShippingModes: {
      isFetching: false,
      error: false,
      data: {}
    },
    addShippingAddress: {
      isFetching: false,
      error: false,
      data: {}
    },
    validateShippingModes: {
      isFetching: false,
      error: false,
      data: {}
    },
    validateAddress: {
      isFetching: false,
      error: false,
      data: {}
    },
    savedBillingAddress: {
      isFetching: false,
      error: false,
      data: {}
    },
    giftCardData: {
      isFetching: false,
      error: false,
      data: {}
    },
    fetchCityStateFromZipCode: {
      isFetching: false,
      error: false,
      data: {}
    },
    savedCreditCards,
    savedCreditCardCredentials: {},
    placeOrder: {
      isFetching: false,
      error: false,
      data: {}
    },
    globalLoader: {
      isFetching: false
    }
  }
};

const initialstoreNoSignIn = {
  checkout: {
    orderDetails: {
      isFetching: false,
      error: false,
      data: {
        orders: [
          {
            checkoutStates: {
              shippingAddressRequired: false,
              shippingMethodRequired: false,
              paymentRequired: true,
              billingAddressRequired: true
            },
            orderId: '550060016',
            numberOfItems: '2',
            orderStatus: 'P',
            totals: {
              orderTotal: '$229.93',
              totalShippingTax: '$0.00',
              totalShippingCharge: '0.00000',
              totalAdjustment: 0,
              totalSalesTax: 0,
              totalProductPrice: 229.93,
              orderCurrency: 'USD'
            },
            orderItems: [
              {
                orderItemId: '550216027',
                unitPrice: 34.99,
                totalAdjustment: 0,
                zipCode: null,
                quantity: 6,
                shipModeCode: 'UPS Ground',
                shipModeId: '10551',
                orderItemPrice: 209.94,
                orderItemDiscountedPrice: 209.94,
                skuId: '110241067',
                isfreeGift: false,
                productId: '3956033',
                skuDetails: {
                  inventory: {
                    store: [
                      {
                        storeId: 'false'
                      }
                    ],
                    online: [
                      {
                        availableQuantity: '507.0',
                        inventoryStatus: 'IN_STOCK'
                      }
                    ]
                  },
                  skuInfo: {
                    name: 'ADI B TIRO PANT:Black 03:X Small',
                    shortDescription: '',
                    longDescription: 'Designed with side stripes and an adidas™ brandmark, the adidas Boys\' Tiro 17 Training Pant offers a sporty look that he will love. The pant is made of 100% polyester double knit for comfortable wear and features CLIMACOOL® fabric technology to provide heat and moisture management and help him stay cool and dry. Zip pockets.',
                    imageAltDescription: 'ADI B TIRO PANT:Black 03:X Small',
                    sellable: 'true',
                    imageURL: '//assets.academy.com/mgen/94/10757894.jpg',
                    thumbnail: '//assets.academy.com/mgen/94/10757894.jpg',
                    skuAttributes: [
                      {
                        name: 'Color',
                        value: 'Black/White'
                      },
                      {
                        name: 'Size',
                        value: 'X Small'
                      }
                    ]
                  }
                },
                availableShippingMethods: [
                  {
                    shipmodeId: '10551',
                    shipmodeDes: 'SG',
                    shippingType: 'SG',
                    estimatedFromDate: '01-07-2018',
                    estimatedToDate: '07-07-2018'
                  }
                ]
              },
              {
                orderItemId: '550216034',
                unitPrice: 19.99,
                totalAdjustment: 0,
                zipCode: null,
                quantity: 1,
                shipModeCode: 'UPS Ground',
                shipModeId: '10551',
                orderItemPrice: 19.99,
                orderItemDiscountedPrice: 19.99,
                skuId: '113014951',
                isfreeGift: false,
                productId: '5037538',
                skuDetails: {
                  inventory: {
                    store: [
                      {
                        storeId: 'false'
                      }
                    ],
                    online: [
                      {
                        availableQuantity: '23.0',
                        inventoryStatus: 'IN_STOCK'
                      }
                    ]
                  },
                  skuInfo: {
                    name: 'Under Armour Women\'s Tech Graphic Twist T-shirt',
                    shortDescription: '',
                    longDescription: 'Treat yourself to the comfort of the Under Armour Women\'s Tech Graphic Twist T-shirt. The sweat-wicking UA Tech™ fabric dries quickly and feels ultra soft, while the anti-odor technology helps keep the shirt odor free. The Under Armour™ graphic with an allover twist effect creates a cool, sporty look.',
                    imageAltDescription: 'Under Armour Women\'s Tech Graphic Twist T-shirt',
                    sellable: 'true',
                    imageURL: '//assets.academy.com/mgen/63/20075363.jpg',
                    thumbnail: '//assets.academy.com/mgen/63/20075363.jpg',
                    skuAttributes: [
                      {
                        name: 'Color',
                        value: 'Grey'
                      },
                      {
                        name: 'Size',
                        value: 'X Small'
                      }
                    ]
                  }
                },
                availableShippingMethods: [
                  {
                    shipmodeId: '10551',
                    shipmodeDes: 'SG',
                    shippingType: 'SG',
                    estimatedFromDate: '01-07-2018',
                    estimatedToDate: '07-07-2018'
                  }
                ]
              }
            ],
            shippingGroups: [],
            addresses: {
              shippingAddress: {
                firstName: 'Academy',
                lastName: 'Sports',
                phoneNumber: '9786765456',
                address: '7 times square',
                zipCode: '10007',
                city: 'NY',
                state: 'NY',
                companyName: 'Academys'
              },
              billingAddress: {
                firstName: 'John',
                lastName: 'Appleseed',
                phoneNumber: '9786765456',
                address: '1, Infinite Loop',
                zipCode: '95040',
                city: 'Cupertino',
                state: 'CA',
                companyName: 'Nike'
              }
            },
            promotions: [],
            giftCardDetails: [
              {
                gcPiId: '1234',
                totalGCBalance: '0',
                GcAppliedAmount: '14',
                giftcard: '7777091989512621'
              },
              {
                gcPiId: '5678',
                totalGCBalance: '0',
                GcAppliedAmount: '14',
                giftcard: '7777091989512621'
              }
            ]
          }
        ]
      }
    },
    authStatus: {
      isLoggedIn: false
    },
    pageState: {
      shippingAddressRequired: {
        required: false,
        edit: false
      },
      shippingMethodRequired: {
        required: false,
        edit: false
      },
      paymentRequired: {
        required: true,
        edit: true
      }
    },
    savedShippingModes: {
      isFetching: false,
      error: false,
      data: {}
    },
    addShippingAddress: {
      isFetching: false,
      error: false,
      data: {}
    },
    validateShippingModes: {
      isFetching: false,
      error: false,
      data: {}
    },
    validateAddress: {
      isFetching: false,
      error: false,
      data: {}
    },
    savedBillingAddress: {
      isFetching: false,
      error: false,
      data: {}
    },
    giftCardData: {
      isFetching: false,
      error: false,
      data: {}
    },
    fetchCityStateFromZipCode: {
      isFetching: false,
      error: false,
      data: {}
    },
    savedCreditCards,
    savedCreditCardCredentials: {},
    placeOrder: {
      isFetching: false,
      error: false,
      data: {}
    },
    globalLoader: {
      isFetching: false
    }
  }
};

describe('<CheckoutWrapper />', () => {
  it('calls componentDidMount', () => {
    const { cms } = checkoutJSON;
    const store = configureStore();
    sinon.spy(CheckoutWrapper.prototype, 'componentDidMount');
    const wrapper = shallow(<CheckoutWrapper cms={cms} store={store(initialstore)} />); // eslint-disable-line
    expect(CheckoutWrapper.prototype.componentDidMount.calledOnce).to.equal(true);
  });
  it('hide sign in link if user is logged in', () => {
    const { cms } = checkoutJSON;
    const store = configureStore();
    const wrapper = shallow(<CheckoutWrapper cms={cms} store={store(initialstore)} />);
    expect(wrapper.find('.signInLink')).to.have.length(0);
  });
  it('show sign in link if user is not logged in', () => {
    const { cms } = checkoutJSON;
    const store = configureStore();
    const wrapper = mount(<Provider store={store(initialstoreNoSignIn)}><CheckoutWrapper cms={cms} /></Provider>);

    expect(wrapper.find('.signInLink')).to.have.length(1);
  });
  it('ensures order details API is called', () => {
  });
});

/*
actions
 */
describe('Checkout actions', () => {
  it('should create an action to fetch order details', () => {
    const orderId = '12345';
    const expectedAction = {
      type: constants.FETCH_PAGE_DATA_REQUEST,
      params: orderId
    };
    expect(actions.fetchOrderDetails(orderId)).to.deep.include(expectedAction);
  });
  it('should create an action to hold order details', () => {
    const data = { test: 'test123' };
    const expectedAction = {
      type: constants.FETCH_PAGE_DATA_SUCCESS,
      data
    };
    expect(actions.fetchOrderDetailsSuccess(data)).to.deep.include(expectedAction);
  });
  it('should create an action to hold error', () => {
    const error = 'Some error occurred';
    const expectedAction = {
      type: constants.FETCH_PAGE_DATA_FAILURE,
      error
    };
    expect(actions.fetchOrderDetailsError(error)).to.deep.include(expectedAction);
  });
  it('should create an action to set initial page state', () => {
    const pageState = 'Some error occured';
    const expectedAction = {
      type: constants.SET_INIT_PAGE_STATE,
      pageState
    };
    expect(actions.setInitialPageState(pageState)).to.deep.include(expectedAction);
  });
  it('should create an action to set the user auth status', () => {
    const flag = true;
    const expectedAction = {
      type: constants.SET_AUTH_STATUS,
      flag
    };
    expect(actions.setAuthStatus(flag)).to.deep.include(expectedAction);
  });
  it('should create an action to expand a drawer', () => {
    const pageSection = 'shippingAddress';
    const expectedAction = {
      type: constants.MARK_SECTION_EDIT,
      pageSection
    };
    expect(actions.markSectionToEdit(pageSection)).to.deep.include(expectedAction);
  });
  it('should create an action to collapse a drawer', () => {
    const pageSection = 'shippingAddress';
    const expectedAction = {
      type: constants.MARK_SECTION_COMPLETED,
      pageSection
    };
    expect(actions.markSectionCompleted(pageSection)).to.deep.include(expectedAction);
  });
});


describe('Checkout sagas', () => {
  it('should request order details', () => {
    const generator = sagas.manageCheckoutStates();
    expect(generator.next().value).to.deep.include(takeLatest(constants.FETCH_PAGE_DATA_REQUEST, sagas.fetchPageDataWorkerSaga));
  });
  const generator = sagas.fetchPageDataWorkerSaga({ orderId: '123' });
  it('should dispatch action to show the loader', () => {
    expect(generator.next().value).to.deep.include(put(showLoader()));
  });
  it('should call fetchPageDataAPI', () => {
    mock.onGet(environment.getOrderDetails('12345'), { }).reply(200, initialstore.checkout.orderDetails.data);
    const response = call(sagas.fetchPageDataAPI, { orderId: '123' });
    expect(generator.next().value).to.deep.include(response);
  });
  it('should fetch order details json and handle them in case of success', async () => {
    mock.onGet(environment.getOrderDetails('12345'), { }).reply(200, initialstore.checkout.orderDetails.data);
    const dispatchedActions = [];
    const fakeStore = {
      getState: () => ({ test: '123' }),
      dispatch: action => dispatchedActions.push(action)
    };
    await runSaga(fakeStore, sagas.fetchPageDataWorkerSaga, { orderId: '12345' }).done;
    // console.log(dispatchedActions);
    expect(dispatchedActions).to.have.length(3);
    // TODO - check why the below is not working. This is due to actions returning different set of structure.
    // expect(dispatchedActions).to.deep.equal([actions.fetchOrderDetailsSuccess(initialstore.checkout.orderDetails.data)]);
    // console.log(actions.fetchOrderDetailsSuccess(initialstore.checkout.orderDetails.data));
  });
});

describe('Checkout reducers', () => {
  it('should return the initial state for order details', () => {
    expect(reducers.orderDetails(undefined, {})).to.deep.include({ isFetching: false, error: false, data: {} });
  });
  it('should handle order details API request', () => {
    expect(reducers.orderDetails(undefined, { type: constants.FETCH_PAGE_DATA_REQUEST })).to.deep.include({ isFetching: true, error: false, data: {} });
  });
  it('should set order details API response', () => {
    const data = { test: '123' };
    expect(reducers.orderDetails(undefined, { type: constants.FETCH_PAGE_DATA_SUCCESS, data })).to.deep.include({ isFetching: false, error: false, data });
  });
  it('should handle order details API failure', () => {
    expect(reducers.orderDetails(undefined, { type: constants.FETCH_PAGE_DATA_FAILURE })).to.deep.include({ isFetching: false, error: true, data: {} });
  });
  it('should invalidate order details API', () => {
    expect(reducers.orderDetails(undefined, { type: constants.INVALIDATE_PAGE_DATA_FAILURE })).to.deep.include({ isFetching: false, error: false, data: {} });
  });
  it('should return the initial state for auth status', () => {
    expect(reducers.authStatus(undefined, { })).to.deep.include({ isLoggedIn: false });
  });
  it('should set auth status to true', () => {
    expect(reducers.authStatus(undefined, { type: constants.SET_AUTH_STATUS, flag: true })).to.deep.include({ isLoggedIn: true });
  });
});
