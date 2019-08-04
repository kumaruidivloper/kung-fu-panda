import { onCheckout } from '@academysports/aso-env';
import axios from 'axios';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { call, takeLatest } from 'redux-saga/effects';

import { doInventory } from './action';
import CartOption from './cartOption.component';
import cartOptionJson from './cartOption.component.json';
import { INVENTORY_CHECK } from './constants';
import rootSaga, { fnInventoryCheck, fnOnCheckout, handleInventoryResponse } from './saga';

describe('<CartOption />', () => {
  const { cms, orderItems, bundleProductInfo } = cartOptionJson.context.data;
  const mockstore = configureStore();
  const store = mockstore({});
  const findAStore = undefined;
  let wrapper;

  before(() => {
    wrapper = mount(
      <Provider store={store}>
        <CartOption
          cms={cms}
          orderId="12345"
          fnDoInventory={doInventory}
          orderItems={orderItems}
          bundleProductInfo={bundleProductInfo}
          findAStore={findAStore}
        />
      </Provider>
    );
  });

  it('renders <CartOption /> component', () => {
    expect(wrapper.find('button')).to.have.length(1);
  });

  it('simulating click action', () => {
    const submitBtn = wrapper.find('button');
    submitBtn.simulate('click');
  });

  it('Executes root saga', () => {
    const defaultSaga = rootSaga();
    expect(defaultSaga.next().value).to.deep.equal(takeLatest(INVENTORY_CHECK, fnOnCheckout));
    defaultSaga.next();
    expect(defaultSaga.next().done).to.equal(true);
  });

  it('Executes fnOnCheckout saga', () => {
    const action = { data: { orderId: '123' } };
    const fnOnCheckoutSaga = fnOnCheckout(action);
    expect(fnOnCheckoutSaga.next().value).to.deep.equal(call(axios, onCheckout(action.data.orderId), {
      method: 'PUT',
      data: { orderId: action.data.orderId }
    }));
    fnOnCheckoutSaga.next();
    expect(fnOnCheckoutSaga.next({ status: 201 }).done).to.deep.equal(true);
  });

  it('Executes handleInventoryResponse saga', () => {
    const requestParams = { orderId: '123' };
    const responseData = {
      onlineskus: {
        skus: [
          {
            inventoryStatus: 'AVAILABLE'
          }
        ]
      },
      pickupskus: [
        {
          skus: [
            {
              inventoryStatus: 'OUT_OF_STOCK'
            }
          ]
        }
      ],
      bundleskus: [
        {
          skus: [
            {
              inventoryStatus: 'OUT_OF_STOCK'
            }
          ]
        }
      ]
    };
    let sagaConst = handleInventoryResponse(false, requestParams);
    expect(sagaConst.next().value).to.deep.equal(fnOnCheckout({ data: '123' }));
    expect(sagaConst.next().done).to.equal(true);
    sagaConst = handleInventoryResponse(responseData, requestParams);
    sagaConst.next();
    expect(sagaConst.next().done).to.equal(true);
    responseData.pickupskus = [];
    sagaConst = handleInventoryResponse(responseData, requestParams);
    sagaConst.next();
    expect(sagaConst.next().done).to.equal(true);
  });

  it('Executes fnInventoryCheck saga', () => {
    const action = {
      data: {
        storeId: '180',
        onlineSkus: [
          {
            quantity: '1',
            productId: '179'
          }
        ],
        pickupSkus: [
          {
            skuId: '2',
            quantity: '10'
          }
        ],
        bundleSkus: [
          {
            productId: '179',
            quantity: '3',
            shipModeCode: 'online',
            constituents: [
              {
                info: {
                  skuId: '123'
                }
              }
            ]
          }
        ]
      }
    };
    const sagaFn = fnInventoryCheck(action);
    sagaFn.next();
    sagaFn.next();
    expect(sagaFn.next().done).to.equal(true);
  });
});
