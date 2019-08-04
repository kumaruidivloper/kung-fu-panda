import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import checkoutReviewOrderJson from './checkoutReviewOrder.component.json';
import CheckoutReviewOrder from './checkoutReviewOrder.component';
import OrderSubmitBtn from './components/orderSubmitButton/orderSubmitButton';
import Prop65Error from './components/prop65Error/prop65Error';
import { postPlaceOrder, postPlaceOrderSuccess, postPlaceOrderError } from '../../apps/checkout/store/actions/placeOrder';
import * as constants from '../../apps/checkout/checkout.constants';
import * as reducers from '../../apps/checkout/store/reducers/placeOrder';
import { postPlaceOrderData } from '../../apps/checkout/store/sagas/placeOrder';
const mock = new MockAdapter(axios);

describe('<CheckoutReviewOrder />', () => {
  const { cms, orderDetails } = checkoutReviewOrderJson.context.data;
  const initialState = {};
  const requestdata = {
    orderId: orderDetails.orderId,
    isSubmitted: true,
    lastFourCCDigit: '',
    emailPref: '0',
    walletUsed: 'true',
    selectedCardType: '',
    userPayPalContactPhone: ''
  };
  const placeOrder = {
    data: {},
    isFetching: false,
    error: false
  };
  const store = configureStore();
  it('checks the initial state of place order button', () => {
    const wrapper = shallow(<CheckoutReviewOrder cms={cms} orderDetails={orderDetails} placeOrder={placeOrder} store={store(initialState)} />).dive();
    expect(wrapper.state('isButtonDisabled')).to.equal(false);
    wrapper.setState({ shippingRestrictedItems: true });
    expect(wrapper.find(Prop65Error).length).to.equal(1);
    expect(
      wrapper
        .find(Prop65Error)
        .dive()
        .find('p')
        .hasClass('o-copy__14reg')
    ).to.equal(true);
  });
  it('renders <CheckoutReviewOrder /> component', () => {
    sinon.spy(CheckoutReviewOrder.prototype, 'componentDidMount');
    const fnPlaceOrder = sinon.spy();
    const wrapper = mount(
      <Provider store={store(initialState)}>
        <CheckoutReviewOrder cms={cms} orderDetails={orderDetails} placeOrder={placeOrder} fnPlaceOrder={fnPlaceOrder} />
      </Provider>
    );
    expect(CheckoutReviewOrder.prototype.componentDidMount).to.have.property('callCount', 1);
    expect(wrapper.find('div')).to.have.length(4);
    expect(wrapper.find(OrderSubmitBtn).length).to.equal(1);
    expect(wrapper.find(Prop65Error).length).to.equal(0);
    expect(wrapper.find('button')).to.have.length(1);
    wrapper.find('button').prop('onClick')();
    wrapper.find('button').simulate('click');
  });
  it('renders <OrderSubmitBtn /> component', () => {
    const click = sinon.spy();
    const wrapper = shallow(
      <OrderSubmitBtn
        disableSubmit={initialState.shippingRestrictedItems ? true : initialState.isButtonDisabled}
        onSubmitOrder={click}
        data={requestdata}
        label={cms.commonLabels.placeOrderLabel}
      />
    )
      .dive()
      .dive();
    expect(wrapper.find('button')).to.have.length(1);
    wrapper.find('button').prop('onClick')();
    wrapper.find('button').simulate('click');
    expect(click.called).to.equal(true);
  });
  it('renders Age Restriction Content', () => {
    const orderDetail = {
      checkoutStates: {
        shippingAddressRequired: false,
        shippingMethodRequired: false,
        paymentRequired: false,
        billingAddressRequired: true,
        hasAgeRestrictedItems: true
      }
    };
    const order = { ...orderDetails, ...orderDetail };
    const wrapper = shallow(<CheckoutReviewOrder cms={cms} orderDetails={order} placeOrder={placeOrder} store={store(initialState)} />);
    wrapper.setProps({ orderDetails: order });
    const handleSpy = sinon.spy(wrapper.dive().instance(), 'renderAgeRestrictionContent');
    expect(handleSpy.calledOnce).to.be.equals(false);
    expect(wrapper.dive().find('div')).to.have.length(7);
    wrapper
      .dive()
      .find('t')
      .prop('onChange')();
  });
  /*
actions
 */
  describe('Place order actions', () => {
    it('should create an action to make post place order request', () => {
      const data = 'make place order request action data';
      const expectedAction = {
        type: constants.POST_PLACEORDER_REQUEST,
        data
      };
      expect(postPlaceOrder(data)).to.deep.include(expectedAction);
    });
    it('should create an action to make post place order response success', () => {
      const data = 'get place order success response action data';
      const expectedAction = {
        type: constants.POST_PLACEORDER_SUCCESS
      };
      expect(postPlaceOrderSuccess(data)).to.deep.include(expectedAction);
    });
    it('should create an action to make post place order response failure', () => {
      const error = 'get place order error action data';
      const expectedAction = {
        type: constants.POST_PLACEORDER_FAILURE
      };
      expect(postPlaceOrderError(error)).to.deep.include(expectedAction);
    });
  });
  /*
reducers
 */
  const initState = { isFetching: false, error: false, data: {} };
  it('placeOrder reducer should handle POST_PLACEORDER_REQUEST action', () => {
    const action = {
      type: constants.POST_PLACEORDER_REQUEST,
      data: 'post place order test data'
    };
    const expectedObj = { isFetching: true, error: false, data: {} };
    expect(reducers.placeOrder(initState, action)).to.deep.equal(expectedObj);
  });
  it('placeOrder reducer should handle POST_PLACEORDER_SUCCESS', () => {
    const action = {
      type: constants.POST_PLACEORDER_SUCCESS,
      data: 'post place order test data response'
    };
    const expectedObj = { isFetching: false, error: false, data: action.data };
    expect(reducers.placeOrder(initState, action)).to.deep.equal(expectedObj);
  });

  it('placeOrder reducer should handle POST_PLACEORDER_ERROR', () => {
    const action = {
      type: constants.POST_PLACEORDER_FAILURE,
      error: 'post place order error test data'
    };
    const expectedObj = { isFetching: false, error: true, data: action.data };
    expect(reducers.placeOrder(initState, action)).to.deep.equal(expectedObj);
  });

  describe('Place order saga', () => {
    const generator = postPlaceOrderData(requestdata);
    it('should return the place order response', () => {
      expect(generator.next().value).to.deep.include(
        new Promise(() =>
          mock.onGet('/checkout/placeOrder').reply(201, {
            data: {
              orderId: '121',
              userPayPalContactPhone: '9081234532',
              isEmailRegistered: 'Yes',
              nextURL: 'http://something/somepath',
              profileId: '',
              ordShipAdjValue: '100',
              ordItemShipAdjValue: '100',
              containsSpecialOrderItem: 'No',
              receiveEmail: 'Yes',
              orderReview: 'http://something/someotherpath'
            }
          })
        )
      );
    });
  });
});
