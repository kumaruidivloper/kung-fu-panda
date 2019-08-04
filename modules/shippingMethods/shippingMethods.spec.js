import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import shippingMethodsJson from './shippingMethods.component.json';
import ShippingMethods from './shippingMethods.component';

describe('<ShippingMethods />', () => {
  const { cms } = shippingMethodsJson.context.data;
  const orderDetails = {
    orderId: '1000',
    orderItems: [
      {
          orderItemId: '1000',
          skuDetails: {
            skuInfo: {
              thumbnail: '//assets.academy.com/mgen/68/20004268.jpg',
              imageAltDescription: 'Mag M SS Laguna Madre:Grey:X Small'
            }
          }
      }
    ],
    shippingGroups: [
    ],
    addresses: {
      shippingAddress: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        zipCode: '',
        city: '',
        state: '',
        companyName: ''
      }
    }
  };
  const savedShippingModes = {
    isFetching: false,
    error: false,
    data: {
      results: {
      orderId: '1000',
      shippingGroups: [
      {
      orderItems: [
      {
      orderItemId: '1000'
      },
      {
      orderItemId: '1001'
      }
      ],
      shippingModes: [
      {
      shippingType: 'SG',
      estimatedFromDate: '8-5',
      estimatedToDate: '8-7',
      saleShippingCharge: '10.95',
      shipmodeId: '10551',
      shipmodeDesc: '3-5 business days',
      baseShippingCharge: '12'
      },
      {
      shippingType: '2D',
      estimatedFromDate: '8-5',
      estimatedToDate: '8-7',
      saleShippingCharge: '10.95',
      shipmodeId: '10551',
      shipmodeDesc: '2 business days',
      baseShippingCharge: '12'
      }
      ],
      groupSeqNum: 1
      }
      ]
      }
      }
};
  const initialstore = { checkout: {
    savedShippingModes: {
      data: {},
      error: true,
      isFetching: true
    }
  } };
  const mockStore = configureMockStore();
  const store = mockStore(initialstore);
  it('renders <ShippingMethods /> component, check for dropdown if two or more shipping modes are available for shipment', () => {
    const wrapper = mount(<Provider store={store}><ShippingMethods cms={cms} orderDetails={orderDetails} savedShippingModes={savedShippingModes} /></Provider>);
    expect(wrapper.find('button')).to.have.length(2);
  });
  it('renders <ShippingMethods /> component, count number of order items', () => {
    const wrapper = mount(<Provider store={store}><ShippingMethods cms={cms} orderDetails={orderDetails} savedShippingModes={savedShippingModes} /></Provider>);
    expect(wrapper.find('img')).to.have.length(savedShippingModes.data.results.shippingGroups[0].orderItems.length);
  });
  it('renders <ShippingMethods /> component, check for dropdown if one shipping mode are available for shipment', () => {
    const savedShippingMode = {
      isFetching: false,
      error: false,
      data: {
        results: {
        orderId: '1000',
        shippingGroups: [
        {
        orderItems: [
        {
        orderItemId: '1000'
        },
        {
        orderItemId: '1001'
        }
        ],
        shippingModes: [
        {
        shippingType: 'SG',
        estimatedFromDate: '8-5',
        estimatedToDate: '8-7',
        saleShippingCharge: '10.95',
        shipmodeId: '10551',
        shipmodeDesc: '3-5 business days',
        baseShippingCharge: '12'
        }
        ],
        groupSeqNum: 1
        }
        ]
        }
        }
  };
    const wrapper = mount(<Provider store={store}><ShippingMethods cms={cms} orderDetails={orderDetails} savedShippingModes={savedShippingMode} /></Provider>);
    expect(wrapper.find('button')).to.have.length(1);
  });
  it('renders <ShippingMethods /> component, count total Shipment', () => {
    const savedShippingMode = {
      isFetching: false,
      error: false,
      data: {
        results: {
        orderId: '1000',
        shippingGroups: [
        {
        orderItems: [
        ],
        shippingModes: [
        {
        shippingType: 'SG',
        estimatedFromDate: '8-5',
        estimatedToDate: '8-7',
        saleShippingCharge: '10.95',
        shipmodeId: '10551',
        shipmodeDesc: '3-5 business days',
        baseShippingCharge: '12'
        }
        ],
        groupSeqNum: 1
        },
        {
          orderItems: [
          ],
          shippingModes: [
          {
          shippingType: 'SG',
          estimatedFromDate: '8-5',
          estimatedToDate: '8-7',
          saleShippingCharge: '10.95',
          shipmodeId: '10551',
          shipmodeDesc: '3-5 business days',
          baseShippingCharge: '12'
          }
          ],
          groupSeqNum: 2
          }
        ]
        }
        }
  };
    const wrapper = mount(<Provider store={store}><ShippingMethods cms={cms} orderDetails={orderDetails} savedShippingModes={savedShippingMode} /></Provider>);
    expect(wrapper.find('Shipment')).to.have.length(2);
  });
  it('renders <ShippingMethods /> component, when order details api contains shipping groups or edit mode', () => {
    const orderDetail = {
      orderId: '1000',
      orderItems: [
        {
            orderItemId: '1000',
            skuDetails: {
              skuInfo: {
                thumbnail: '//assets.academy.com/mgen/68/20004268.jpg',
                imageAltDescription: 'Mag M SS Laguna Madre:Grey:X Small'
              }
            }
        }
      ],
      shippingGroups: [
      {
        orderItems: [
        ],
        shippingModes: [
        {
        shippingType: 'SG',
        estimatedFromDate: '8-5',
        estimatedToDate: '8-7',
        saleShippingCharge: '10.95',
        shipmodeId: '10551',
        shipmodeDesc: '3-5 business days',
        baseShippingCharge: '12',
        isSelected: true
        },
        {
          shippingType: 'SG',
          estimatedFromDate: '8-5',
          estimatedToDate: '8-7',
          saleShippingCharge: '10.95',
          shipmodeId: '10551',
          shipmodeDesc: '3-5 business days',
          baseShippingCharge: '12'
          }
        ],
        groupSeqNum: 1
        }
      ],
      addresses: {
        shippingAddress: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          address: '',
          zipCode: '',
          city: '',
          state: '',
          companyName: ''
        }
      }
    };
    const savedShippingMode = {};
    const spy = sinon.spy(ShippingMethods.prototype, 'componentDidMount');
    const wrapper = shallow(<ShippingMethods cms={cms} orderDetails={orderDetail} store={store}savedShippingModes={savedShippingMode} />);
    const handleSpy = sinon.spy(wrapper.dive().instance(), 'handlePreSelectedShippingMethod');
    expect(spy.calledOnce).to.be.equals(true);
    expect(handleSpy.calledOnce).to.be.equals(false);
    expect(wrapper.dive().find('div')).to.have.length(3);
  });
  it('renders <Shippingmethods /> component, check button click on GO to Payment button', () => {
    const wrapper = shallow(<ShippingMethods cms={cms} orderDetails={orderDetails} store={store}savedShippingModes={savedShippingModes} />).dive();
    const spy = sinon.spy(wrapper.instance(), 'onClickPostCall');
    wrapper.find('y').simulate('click');
    expect(spy.calledOnce).to.equals(true);
  });
  it('renders <Shippingmethods /> component, check dropdown selection', () => {
    const wrapper = shallow(<ShippingMethods cms={cms} orderDetails={orderDetails} store={store}savedShippingModes={savedShippingModes} />).dive();
    const spy = sinon.spy(wrapper.instance(), 'handleDropdown');
    wrapper.instance().handleDropdown(1, 2);
    expect(spy.calledOnce).to.equals(true);
  });
  it('renders <Shippingmethods /> component, test for empty shipping methods and empty orderitems', () => {
    const savedShippingMode = {
      isFetching: false,
      error: false,
      data: {
        results: {
        orderId: '1000',
        shippingGroups: [
        {
        orderItems: [
        ],
        shippingModes: [
        {
        shippingType: 'SG'
        }
        ],
        groupSeqNum: 1
        }
        ]
        }
        }
  };
    const wrapper = mount(<Provider store={store}><ShippingMethods cms={cms} orderDetails={orderDetails} savedShippingModes={savedShippingMode} /></Provider>);
    expect(wrapper.find('div')).to.have.length(9);
  });
});
