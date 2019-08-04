import { addPromoCodeAPI, removePromoCodeAPI } from '@academysports/aso-env';
import axios from 'axios';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import configureStore from 'redux-mock-store';
import { call } from 'redux-saga/effects';

import { PROMOCODE_ERROR, PROMOCODE_SUCCESS } from './constants';
import PromotionalMessaging from './promotionalMessaging.component';
import promotionalMessagingJson from './promotionalMessaging.component.json';
import { promocodeAPIDetails } from './reducer';
import promotionalMessaging, { addPromotionalCode, removePromotionalCode } from './saga';

describe('<PromotionalMessaging />', () => {
  const { cms } = promotionalMessagingJson.context.data;
  let { api } = promotionalMessagingJson.context.data;
  const initialState = {};
  const store = configureStore();
  const promoField = { current: '' };
  let wrapper;

  before(() => {
    wrapper = mount(<PromotionalMessaging cms={cms} api={api} store={store(initialState)} />);
  });

  it('renders <PromotionalMessaging /> component', () => {
    expect(wrapper.find('div')).to.have.length(3);
  });

  it('find button to add promo code', () => {
    expect(wrapper.find('div span')).to.have.length(1);
    expect(wrapper.find('div.addLabel')).to.have.length(1);
  });

  it('simulate cta for add promo code', () => {
    const crossButton = wrapper.find('div span');
    crossButton.simulate('click');
  });

  it('after simulate click then there should be submit btn, input field, hide icon should be visible', () => {
    expect(wrapper.find('div')).to.have.length(5);
    expect(wrapper.find('div.hideLabel')).to.have.length(1);
    expect(wrapper.find('div i')).to.have.length(1);
    promoField.current = wrapper.find('div input').instance();
    promoField.current.value = 'test';
    expect(wrapper.find('div input')).to.have.length(1);
    expect(wrapper.find('div button')).to.have.length(2);
    const submitBtn = wrapper.find('div button.submitBtn');
    submitBtn.simulate('click');
  });

  it('adding value to promotions array', () => {
    api = [
      {
        promotionId: '100533691',
        code: 'Test10',
        description: ''
      }
    ];
    wrapper = mount(<PromotionalMessaging cms={cms} api={api} store={store(initialState)} />);
    expect(wrapper.find('div i').hasClass('icon-x-circle')).to.equal(true);
    expect(wrapper.find('div.promoCode')).to.have.length(1);
    expect(wrapper.find('div')).to.have.length(5);
    const removeBtn = wrapper.find('i');
    removeBtn.simulate('click');
  });

  it('executes add promotional code saga', () => {
    const action = { data: { orderId: '123', code: 'test10' } };
    const addpromo = addPromotionalCode(action);
    expect(addpromo.next().value).to.deep.equal(
      call(axios, addPromoCodeAPI(action.data.orderId, action.data.code), {
        method: 'POST',
        data: {
          promoCode: action.data.code
        }
      })
    );
    addpromo.next({ status: 200 });
    expect(addpromo.next().done).to.equal(true);
  });

  it('Executes remove promo code saga', () => {
    const action = { data: { orderId: '123', code: 'test10' } };
    const removepromo = removePromotionalCode(action);
    expect(removepromo.next().value).to.deep.equal(call(axios, removePromoCodeAPI(action.data.orderId, action.data.code), {
      method: 'DELETE'
    }));
    removepromo.next({ status: 200 });
    expect(removepromo.next().done).to.equal(true);
  });

  it('Executes root saga', () => {
    const rootSaga = promotionalMessaging();
    rootSaga.next();
    rootSaga.next();
    expect(rootSaga.next().done).to.equal(true);
  });

  it('Testing reducer', () => {
    expect(promocodeAPIDetails({}, { type: PROMOCODE_SUCCESS })).to.deep.equal({ isFetching: false, error: false });
    expect(promocodeAPIDetails({}, { type: PROMOCODE_ERROR, data: { data: '23' } })).to.deep.equal({ isFetching: false, error: true, errorInfo: '23' });
  });
});
