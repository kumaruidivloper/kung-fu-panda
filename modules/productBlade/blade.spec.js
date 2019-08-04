/**
 * This file is for covering test cases
 */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import productBladeJson from './productBlade.component.json';
import Blade, { DisplayPrice } from './blade/blade';
import { formatDate, ShippingModes, getOpenHours, getStoreId } from './blade/shippingModes';
import { QtyField } from './blade/qtyField';
import * as actions from './actions';
import Storage from '../../utils/StorageManager';

describe('<Blade /> ', () => {
  const { cms, api, labels } = productBladeJson.context.data;
  const initialState = { quantity: api.orderItems[0].quantity };
  const store = configureStore();
  const comp = shallow(
    <Blade
      cms={cms}
      labels={labels}
      data={api.orderItems[0]}
      qtyUpdateLoader={[]}
      fnRemoveitem={actions.removeItem}
      fnAddToWishList={actions.addToWishList}
      fnUpdateQty={actions.updateQty}
      fnUpdateMode={() => sinon.spy()}
      findAStore={{ getMystoreDetails: { storeId: '2' } }}
    />
  );
  const wrapper = shallow(
    <Provider store={store(initialState)}>
      <Blade
        cms={cms}
        labels={labels}
        data={api.orderItems[2]}
        qtyUpdateLoader={[]}
        fnRemoveitem={actions.removeItem}
        fnAddToWishList={actions.addToWishList}
        fnTriggerSignIn={() => sinon.spy()}
      />
    </Provider>
  );

  it('renders <Blade/> component ', () => {
    comp.instance().setStateForOutOfStock();
    expect(wrapper.dive().find('div.container')).to.have.length(1);
  });

  it('renders 14 reg ', () => {
    expect(wrapper.dive().find('div.o-copy__14reg')).to.have.length(1);
  });

  it('renders blade stock message ', () => {
    if (api.orderItems[0].skuDetails.inventory.online[0].inventoryStatus === 'OUT_OF_STOCK') {
      expect(wrapper.dive().find('div.o-copy__14reg').text()).to.equals(
        cms.errorMsg.outOfStock.concat(cms.commonLabels.addToWishlistLabel.concat(cms.commonLabels.removeFromCartLabel))
      );
    } else {
      expect(wrapper.dive().find('div.o-copy__14reg').text()).to.equals(cms.errorMsg.limitedStock);
    }
  });

  it('Checks setStateForPartiallyAvailable works fine', () => {
    const comp2 = shallow(
      <Blade
        cms={cms}
        labels={labels}
        data={api.orderItems[1]}
        qtyUpdateLoader={[]}
        fnRemoveitem={actions.removeItem}
        fnAddToWishList={actions.addToWishList}
        fnUpdateQty={actions.updateQty}
        fnUpdateMode={() => sinon.spy()}
        findAStore={{ getMystoreDetails: { storeId: '2' } }}
      />
    );
    expect(comp2.instance().setStateForPartiallyAvailable()).to.equal(2);
    comp2.setState({ partiallyAvailable: true, howToProceedModalStatus: false });
    comp2.find('button').at(2).simulate('click');
    comp2.instance().toggleModal();
    expect(comp2.state().howToProceedModalStatus).to.equal(true);
  });

  it('renders productCard div and image tag', () => {
    expect(wrapper.dive().find('img')).to.have.length(2);
  });

  it('renders <a/> tag ', () => {
    expect(wrapper.dive().find('a.o-copy__14reg')).to.have.length(1);
    expect(wrapper.dive().find('a.o-copy__14reg').text()).to.equals(api.orderItems[0].skuDetails.skuInfo.name);
  });

  it('renders <div> containing product name and attributes: ', () => {
    expect(wrapper.dive().find('div.col-md-3')).to.have.length(1);
    expect(wrapper.dive().find('span.o-copy__14bold')).to.have.length(api.orderItems[0].skuDetails.skuInfo.skuAttributes.length);
  });

  it('Emulates partially available scenario', () => {
    comp.setState({ shippingMode: 'SG' });
    comp.instance().handleRadioBtn({ target: { value: 'PICKUPINSTORE' } });
  });

  it('simulates cta event: ', () => {
    wrapper
      .dive()
      .find('div.o-copy__14reg span')
      .children()
      .forEach(node => {
        node.simulate('click');
      });
  });

  it('executes submitupdateQty ', () => {
    const spy = sinon.spy(Blade.prototype, 'submitUpdateQty');
    comp.instance().submitUpdateQty();
    spy.restore();
    expect(spy.calledOnce).to.equals(true);
  });

  it('executes handleQtyFieldSubmit', () => {
    const event = { target: { value: 1 } };
    const spy = sinon.spy(Blade.prototype, 'handleQtyFieldSubmit');
    comp.instance().handleQtyFieldSubmit(event);
    event.target.value = '';
    comp.instance().handleQtyFieldSubmit(event);
    event.target.value = '0';
    comp.instance().handleQtyFieldSubmit(event);
    expect(spy.callCount).to.equals(3);
    spy.restore();
  });

  it('executes handleWishListClicked', () => {
    Storage.setCookie('USERTYPE', 'R');
    const spy = sinon.spy(Blade.prototype, 'handleWishListClicked');
    comp.instance().handleWishListClicked();
    spy.restore();
    expect(spy.calledOnce).to.equals(true);
  });

  it('executes handleQtyChange', () => {
    const event = { target: { value: '1' } };
    const spy = sinon.spy(Blade.prototype, 'handleQtyChange');
    comp.instance().handleQtyChange(event);
    event.target.value = '1e';
    comp.instance().handleQtyChange(event);
    expect(spy.callCount).to.equals(2);
    spy.restore();
  });

  it('executes handleButtonQtyChange', () => {
    const spy = sinon.spy(Blade.prototype, 'handleButtonQtyChange');
    comp.instance().handleButtonQtyChange(2);
    comp.instance().handleButtonQtyChange(0);
    spy.restore();
    expect(spy.callCount).to.equals(2);
  });

  it('executes handleRadioBtn', () => {
    const event = { target: { value: 'SG' } };
    const spy = sinon.spy(Blade.prototype, 'handleRadioBtn');
    comp.instance().handleRadioBtn(event);
    comp.instance().state.shippingMode = 'PICKUPINSTORE';
    comp.instance().handleRadioBtn(event);
    comp.instance().state.shippingMode = 'SG';
    event.target.value = 'PICKUPINSTORE';
    comp.instance().handleRadioBtn(event);
    const comp2 = shallow(
      <Blade
        cms={cms}
        labels={labels}
        data={api.orderItems[1]}
        qtyUpdateLoader={[]}
        fnRemoveitem={actions.removeItem}
        fnAddToWishList={actions.addToWishList}
        fnUpdateQty={actions.updateQty}
        fnUpdateMode={() => sinon.spy()}
      />
    );
    event.target.value = 'PICKUPINSTORE';
    comp2.instance().handleRadioBtn(event);
    spy.restore();
    expect(spy.callCount).to.equals(4);
  });

  // it('Executes toggletooltip()', () => {
  //   const spy = sinon.spy(Blade.prototype, 'toggleTooltip');
  //   comp.instance().toggleTooltip();
  //   expect(spy.calledOnce).to.equals(true);
  //   spy.restore();
  // });

  it('Executes formatDate() fn in RadioButton', () => {
    expect(formatDate('2018-07-28')).to.equals('Jul 28 ');
  });

  it('Simulates change on radio button input field', () => {
    const radio = shallow(
      <ShippingModes
        inventory={api.orderItems[1].skuDetails.inventory}
        availableShippingMethods={api.orderItems[1].availableShippingMethods}
        cms={cms}
        radioBtnLabelMapping={{ SG: 'sth', STS: 'sts', PICKUPINSTORE: 'bopis' }}
        estdFromDate="2018-07-28"
        estdToDate="2018-07-28"
        currentChoice="PICKUPINSTORE"
        handleChange={() => sinon.spy()}
        findAStore={{ getMystoreDetails: { neighborhood: 'Richland', openhours: '7', storeId: 'S011' } }}
      />
    );
    radio.find('input').forEach(node => node.simulate('change', { target: { value: 'SG' } }));
    radio.find('input').forEach(node => node.simulate('keyDown', { key: 'Enter' }));
  });

  it('Checks store related functions in radiobtn', () => {
    expect(getStoreId({ getMystoreDetails: { neighborhood: 'Richland', openhours: '7', storeId: 'S011' } })).to.equal(true);
    expect(getStoreId()).to.equal(false);
    expect(getOpenHours()).to.equal('9.30pm');
  });

  it('Simulates keyPress on qty Field', () => {
    const qty = shallow(<QtyField showLoader />);
    qty.find('input').simulate('keyPress', { keyCode: 69 });
  });

  it('Covers Display price', () => {
    shallow(<DisplayPrice orderPrice="" discounted="" quantity={1} />);
    shallow(<DisplayPrice orderPrice="123" discounted="" quantity={1} />);
    shallow(<DisplayPrice orderPrice="" discounted="" quantity={2} />);
    shallow(<DisplayPrice orderPrice="123" discounted="" quantity={2} />);
  });

  // it('Simulates change on quantity field in HowToProceed Modal', () => {
  //   const wrap = shallow(<HowToProceedModal cms={productBladeJson.context.data.cms} orderItem={api.orderItems[0]} />);
  //   wrap.instance().handleButtonQtyChange(100);
  //   expect(wrap.instance().state.quantity).to.equals(100);
  //   const spy = sinon.spy(HowToProceedModal.prototype, 'handleQtyChange');
  //   wrap.instance().handleQtyChange({ target: { value: '2e' } });
  //   wrap.find(QtyField).simulate('change', { target: { value: '10' } });
  //   wrap.find(QtyField).simulate('changeByButton', { target: { value: '10' } });
  //   spy.restore();
  //   wrap.find('button').forEach(btn => btn.simulate('click'));
  //   expect(spy.callCount).to.equals(2);
  // });

  // it('Executes click of button for selecting option on howtoproceed modal', () => {
  //   const wrap = shallow(<HowToProceedModal cms={productBladeJson.context.data.cms} orderItem={api.orderItems[0]} />);
  //   const spy = sinon.spy(HowToProceedModal.prototype, 'onSelectOption');
  //   wrap.instance().onSelectOption(1);
  //   expect(spy.calledOnce).to.equals(true);
  // });
});
