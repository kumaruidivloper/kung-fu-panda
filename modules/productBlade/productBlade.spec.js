import { addToWishListAPI, updateQtyAPI, updateShipModeAPI } from '@academysports/aso-env';
import React from 'react';
import axios from 'axios';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import configureStore from 'redux-mock-store';
import { hideLoader, loadCart, showLoader } from './actions';
import { ADD_TO_WISH_LIST, REMOVE_ITEM, UNDO_ACTION, UPDATE_QTY, UPDATE_SHIPPING_MODE } from './constants';
import ProductBlade from './productBlade.component';
import productBladeJson from './productBlade.component.json';
import productBlade, { moveToWishList, undoButton, updateItemQty, updateShipMode } from './saga';

describe('<ProductBlade />', () => {
  const { cms, api } = productBladeJson.context.data;
  const initialState = {
    cart: {
      orderItem: api.orderItems,
      cartMessages: []
    }
  };
  const mockstore = configureStore();
  const store = mockstore(initialState);
  const component = mount(
    <Provider store={store}>
      <ProductBlade
        cms={cms}
        // store={store(initialState)}
        data={api.orderItems}
        qtyUpdateLoader={[]}
        analyticsContent={() => {}}
        cartMessages={[{ id: 1, name: 'Product XXX', type: 'wishList' }, { id: 2, name: 'Product YYY', type: 'Remove' }]}
      />
    </Provider>
  );
  const comp = shallow(
    <Provider store={store}>
      <ProductBlade
        cms={cms}
        // store={mockstore(initialState)}
        data={api.orderItems}
        qtyUpdateLoader={[]}
        analyticsContent={() => {}}
        cartMessages={[{ id: 1, name: 'Product XXX', type: 'wishList' }]}
      />
    </Provider>
  );

  // it('renders <ProductBlade /> component', () => {
  //   expect(component.find('div.o-copy__14reg')).to.have.length(2);
  // });

  it('renders Blade ', () => {
    expect(component.find('Blade')).to.have.length(api.orderItems.length);
    component.find('Blade').forEach(node => {
      console.log('logging blade node: ', node.children());
    });
  });

  it('Renders productBlade with empty data', () => {
    const emptyPB = shallow(
      <Provider store={store}>
        <ProductBlade
          data={[]}
          cms={cms}
          // store={mockstore(initialState)}
          qtyUpdateLoader={[]}
          analyticsContent={() => {}}
          cartMessages={[{ id: 1, name: 'Product XXX', type: 'wishList' }]}
        />
      </Provider>
    );
    emptyPB.dive().instance();
  });

  it('Executes toggleUnAvailableItemsModal', () => {
    comp.state.showUnavailableModal = false;
    comp
      .dive()
      .instance()
      .toggleUnAvailableItemsModal();
    expect(comp.dive().instance().state.showUnavailableModal).to.equals(true);
  });

  it('Simulate keydown on undo button', () => {
    comp
      .dive()
      .find('span')
      .at(1)
      .simulate('keyDown', { key: 'Enter' });
  });

  it('Simulates click on close(X) button of msg', () => {
    comp
      .dive()
      .find('button')
      .simulate('click');
  });

  it('executes updateQty Saga', () => {
    const updateQtySaga = updateItemQty({ data: { orderItem: { orderItemId: 786, quantity: 1 }, orderId: 123 } });
    expect(updateQtySaga.next().value).to.deep.equal(put(showLoader(786)));
    expect(updateQtySaga.next().value).to.deep.equal(
      call(axios, updateQtyAPI(123), {
        method: 'PUT',
        data: {
          orderItem: [
            {
              orderItemId: 786,
              quantity: 1
            }
          ]
        }
      })
    );
    expect(updateQtySaga.next().value).to.deep.equal(put(hideLoader(786)));
    updateQtySaga.next();
    updateQtySaga.next();
    expect(updateQtySaga.next().done).to.equal(true);
  });

  it('executes movetoWishList saga', () => {
    const apiObj = { skuId: 786 };
    const wishlist = moveToWishList({ data: { apiObj } });
    expect(wishlist.next().value).to.deep.equal(
      call(axios, addToWishListAPI(apiObj.skuId), {
        method: 'PUT',
        data: apiObj
      })
    );
    wishlist.next();
    expect(wishlist.next().done).to.equal(true);
  });

  it('executes update ship mode saga', () => {
    const data = { orderId: '786' };
    const mode = updateShipMode({ data });
    expect(mode.next().value).to.deep.equal(
      call(axios, updateShipModeAPI, {
        method: 'PUT',
        data
      })
    );
    mode.next();
    expect(mode.next().done).to.equal(true);
  });

  it('executes undo button saga', () => {
    const data = { type: 'wishList' };
    const undoWishlist = undoButton({ data });
    expect(undoWishlist.next().value).to.deep.equal(call(axios, 'http://API for undoing wishlist'));
    data.type = 'remove';
    const undo = undoButton({ data });
    expect(undo.next().value).to.deep.equal(call(axios, 'http:// API for undoing remove'));
    expect(undo.next().value).to.deep.equal(loadCart());
    expect(undo.next().done).to.equal(true);
  });

  it('Executes root saga', () => {
    const rootSaga = productBlade({ type: 'wishList' });
    expect(rootSaga.next().value).to.deep.equal(takeLatest(UPDATE_QTY, updateItemQty));
    expect(rootSaga.next().value).to.deep.equal(takeLatest(REMOVE_ITEM, updateItemQty));
    expect(rootSaga.next().value).to.deep.equal(takeLatest(ADD_TO_WISH_LIST, moveToWishList));
    expect(rootSaga.next().value).to.deep.equal(takeLatest(UPDATE_SHIPPING_MODE, updateShipMode));
    expect(rootSaga.next().value).to.deep.equal(takeEvery(UNDO_ACTION, undoButton));
    expect(rootSaga.next().done).to.equal(true);
  });
});
