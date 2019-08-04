import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { select } from 'redux-saga/effects';
import configureStore from 'redux-mock-store';
import cartComponentJson from './cart.component.json';
import Cart from './cart.component';
import { getCartData } from './store/sagas/index';
import { cartAPIDetails as cartAPIReducer, orderSummary as ordSummary, recordSetTotal as rst, orderId, qtyUpdateLoader } from './store/reducers/index';
import { LOAD_CART, LOAD_CART_SUCCESS, LOAD_CART_ERROR } from './cart.constants';
import { SHOW_LOADER, HIDE_LOADER } from '../../modules/productBlade/constants';
import * as selectors from './store/selectors/index';

describe('<Cart />', () => {
  const { cms, api } = cartComponentJson;
  const initialState = {};
  const cartAPIDetails = { error: false, isFetching: false };
  const recordSetTotal = '2';
  const grandTotal = '10';
  const orderItem = api.orders[0].orderItems;
  const orderSummary = api.orders[0].totals;
  const mockstore = configureStore();
  const store = mockstore(initialState);
  let wrapper;

  before(() => {
    api.recordSetTotal = 1;
    wrapper = mount(
      <Provider store={store}>
        <Cart
          cms={cms}
          api={api}
          cartAPIDetails={cartAPIDetails}
          orderItem={orderItem}
          orderSummary={orderSummary}
          orderId="12345"
          cartMessages={[]}
          qtyUpdateLoader={[]}
          promotions={api.orders[0].promotions}
          recordSetTotal={recordSetTotal}
          grandTotal={grandTotal}
        />
      </Provider>
    );
  });

  it('renders <Cart /> component - Parent Container should be there', () => {
    expect(wrapper.children()).to.have.length(1);
  });

  it('cartHeader is need to present', () => {
    expect(wrapper.find('div.cart-header')).to.have.length(1);
  });

  it('Executes getCart saga', () => {
    const getCartSaga = getCartData();
    expect(getCartSaga.next().value).to.deep.equal(select(selectors.deliveryZipcode));
  });

  it('Executes cartAPIDetails reducer', () => {
    const action = { type: LOAD_CART, data: 'data' };
    expect(cartAPIReducer({}, action)).to.deep.equal({ isFetching: true, error: false });
    action.type = LOAD_CART_ERROR;
    expect(cartAPIReducer({}, action)).to.deep.equal({ isFetching: false, error: true, errorInfo: action.data });
    action.type = LOAD_CART_SUCCESS;
    expect(cartAPIReducer({}, action)).to.deep.equal({ isFetching: false, error: false });
  });

  it('Executes orderSummary reducer', () => {
    const action = { type: LOAD_CART_SUCCESS, data: 'data' };
    expect(ordSummary({}, action)).to.deep.equal({});
    expect(ordSummary({}, { type: LOAD_CART_SUCCESS, data: { orders: [{ totals: 1 }] } })).to.equal(1);
  });

  it('Executes recordSetTotal reducer', () => {
    const action = { type: LOAD_CART_SUCCESS, data: 'data' };
    expect(rst(0, action)).to.equal(0);
    action.data = { orders: [{ numberOfItems: 1 }] };
    expect(rst(0, action)).to.equal(1);
  });

  it('Executes orderId reducer', () => {
    const action = { type: LOAD_CART_SUCCESS, data: { orders: [{ orderId: 12345 }] } };
    expect(orderId('', action)).to.equal(12345);
    action.data = {};
    expect(orderId('', action)).to.equal('');
  });

  it('Executes qty update loader', () => {
    const action = { type: SHOW_LOADER, data: '12345' };
    expect(qtyUpdateLoader([], action)).to.deep.equal(['12345']);
    action.type = HIDE_LOADER;
    expect(qtyUpdateLoader(['12345', '6789'], action)).to.deep.equal(['6789']);
  });
});
