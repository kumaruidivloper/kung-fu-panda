import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { call, takeLatest } from 'redux-saga/effects';
import 'isomorphic-fetch';
import configureStore from 'redux-mock-store';
import InputField from '@academysports/fusion-components/dist/InputField';
import Button from '@academysports/fusion-components/dist/Button';
import orderSummaryJson from './orderSummary.component.json';
import OrderSummary from './orderSummary.component';
import CalculateShippingModal from './calculateShippingModal';
import signupData, { getEstimatedCost } from './saga';
import reducer from './reducer';
import { ESTIMATED_TAXES_SUCCESS, ESTIMATED_TAXES_ERROR, ESTIMATED_SHIPPING } from './constants';

describe('<OrderSummary />', () => {
  const { cms, api } = orderSummaryJson.context.data;
  const initialState = {
    totalAdjustment: '10.00',
    totalShippingTax: '22.50',
    totalProductPrice: '100.00',
    orderCurrency: 'USD',
    totalShippingCharge: '10.00',
    orderTotal: '200.00',
    totalSalesTax: '20.00'
  };

  const mockStore = configureStore();
  const store = mockStore(initialState);

  const component = mount(
    <Provider store={store}>
      <OrderSummary checkoutBtnRef={() => {}} orderItems={[{ shipModeCode: 'PickupInStore' }]} promotions={[]} api={initialState} cms={cms} pickUpInStore />
    </Provider>
  );

  const shallowComp = shallow(
    <OrderSummary
      promotions={[]}
      orderItems={[]}
      api={initialState}
      cms={cms}
      pickUpInStore
      findAStore={{ getMystoreDetails: { neighborhood: 'North Richland' } }}
      fnLoadCart={() => sinon.spy()}
      fnUpdateZipCode={zip => sinon.spy(zip)}
      fnToggleFindAStore={() => sinon.spy()}
      store={mockStore()}
    />
  );
  const zipCodeAPIInfo = {
    errorDetails: {
      error: ''
    }
  };
  const modalWrapper = shallow(
    <CalculateShippingModal zipcode="10007" cms={cms} openModal toggleModal={() => sinon.spy()} onSetZipCode={() => sinon.spy()} zipCodeAPIInfo={zipCodeAPIInfo} />
  );

  const textProp = [
    { label: cms.commonLabels.subTotalLabel, text: api.totalProductPrice },
    { label: cms.commonLabels.estimatedShippingLabel, text: api.totalShippingTax },
    {
      label: cms.commonLabels.estimatedTaxesLabel,
      text: !api.totalSalesTax ? '$0.00' : api.totalSalesTax
    },
    { label: cms.commonLabels.promoCodeLabel, text: api.totalAdjustment }
  ];
  for (let i = 0; i < textProp.length; i += 1) {
    textProp[i].text = new Intl.NumberFormat('en-US', { style: 'currency', currency: api.orderCurrency }).format(textProp[i].text);
  }
  it('has header', () => {
    expect(component.find('h5')).to.have.length(1);
  });

  it('renders children ', () => {
    expect(component.find('div.row').children()).to.have.length(2);
  });

  it('renders cart option ', () => {
    expect(component.find('CartOption')).to.have.length(1);
  });

  it('getsStoreName()', () => {
    expect(
      shallowComp
        .dive()
        .instance()
        .getStoreName()
    ).to.equals('North Richland');
    shallowComp
      .dive()
      .find('button')
      .forEach(btn => btn.simulate('click'));
  });

  it('Executes triggerFindStoreModal', () => {
    shallowComp.dive().instance().triggerFindStoreModal();
  });

  it('Set zip code for calculate shipping modal', () => {
    shallowComp
      .dive()
      .find(CalculateShippingModal)
      .simulate('setZipCode', '123');
  });

  it('Executes sagas', () => {
    const action = { type: ESTIMATED_SHIPPING, data: 'test data' };
    const rootSaga = signupData(action);
    const getEstimatedCostSaga = getEstimatedCost(action);
    expect(rootSaga.next().value).to.deep.equal(takeLatest(ESTIMATED_SHIPPING, getEstimatedCost));
    expect(rootSaga.next().done).to.equal(true);
    expect(getEstimatedCostSaga.next().value).to.deep.equal(call(fetch, 'https://api.myjson.com/bins/i6hfg'));
    getEstimatedCostSaga.next();
    getEstimatedCostSaga.next();
    expect(getEstimatedCostSaga.next().done).to.equal(true);
  });

  it('Executes reducer', () => {
    expect(reducer({}, { type: ESTIMATED_TAXES_SUCCESS, data: 'Test data' })).to.deep.equal({ formSubmitStatus: 'Test data' });
    expect(reducer({}, { type: ESTIMATED_TAXES_ERROR, data: 'Error' })).to.deep.equal({ formSubmitStatus: 'Error' });
    expect(reducer({}, { type: 'WRONG TYPE', data: 'Error' })).to.deep.equal({ formSubmitStatus: {} });
  });

  it('simulates change on field', () => {
    modalWrapper.find(InputField).simulate('change', { target: { value: '1' } });
    modalWrapper.find(Button).simulate('click', {});
    modalWrapper.find(InputField).simulate('change', { target: { value: '30001' } });
    modalWrapper.find(Button).simulate('click', {});
    modalWrapper.find(InputField).simulate('keyDown', { key: 'Enter', preventDefault: () => sinon.spy() });
  });
});
