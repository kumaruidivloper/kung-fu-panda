import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
// import { Provider } from 'react-redux';
import Button from '@academysports/fusion-components/dist/Button';
import Input from '@academysports/fusion-components/dist/InputField';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import myAccountPaymentJson from './myAccountPayment.component.json';
import MyAccountPayment from './myAccountPayment.component';
import CreditCardDisplay from './creditCardDisplay';
import EmptyCondition from './emptyCondition';
import AddNewGiftCard from './addNewGiftCard';
import ShippingAddressFormSubmitBtn from './shippingAddressFormSubmitBtn';
const userCreditCards = {
  data: {
    profile: {
      creditCardHolderName: 'John Lee',
      correlationId: 'ae809',
      token: 'aerjfnhgk998346',
      expiryDate: '09/25',
      creditCardNumber: '4000021231111111',
      savedCreditCardId: 'aujio84747',
      billingAddress: {
        addressId: 'John LeeID',
        addressLine1: 'John lee address 1',
        addressLine2: 'John Lee address 2',
        lastName: 'Lee',
        nickName: 'Lee',
        zipCode: '35005',
        state: 'AL',
        addressType: 'Jonh lee address',
        firstName: 'John',
        email1: 'JohnLee@abc.com',
        phone1: '1-541-754-3010',
        city: 'Bangalore'
      },
      defaultFlag: true,
      type: 'DINERS'
    }
  }
};
const validatedAddress = {
  data: {}
};
const userGiftCards = [
  {
    giftCardNumber: '1234',
    giftCardPin: '123',
    xwalletId: '123',
    giftCardBalance: 100
  },
  {
    giftCardNumber: '1235',
    giftCardPin: '125',
    xwalletId: '125',
    giftCardBalance: 200
  },
  {
    giftCardNumber: '1236',
    giftCardPin: '126',
    xwalletId: '126',
    giftCardBalance: 300
  }
];
const emptyUserCreditCard = [];
const emptyUserGiftCard = [];
const event = {
  target: { name: 'pollName', value: 'spam' },
  preventDefault: sinon.spy,
  stopPropagation: sinon.spy
};
describe('<MyAccountPayment />', () => {
  const { cms, profileID } = myAccountPaymentJson.context.data;
  const initialState = {
    showCreditFormOnEmpty: false
  };
  const mockStore = configureMockStore();
  const store = mockStore(initialState);
  const funcCheck = sinon.spy(CreditCardDisplay.prototype, 'emptyCheckCreditCardRender');
  const renderEditOrCommon = sinon.spy(CreditCardDisplay.prototype, 'renderEditCreditCardOrCommonCom');
  const renderCreditOrGiftFunc = sinon.spy(EmptyCondition.prototype, 'renderCreditOrGift');
  // const handleCardNumberFunc = sinon.spy(AddNewGiftCard.prototype, 'handleCardNumber');
  // const handlePinChangeFunc = sinon.spy(AddNewGiftCard.prototype, 'handlePinChange');
  // const onSubmitHandlerFunc = sinon.spy(ShippingAddressFormSubmitBtn.prototype, 'handleSubmit');
  // const handleAddNewGiftCardFunc = sinon.spy(EmptyCondition.prototype, 'handleAddNewGiftCard');
  // const onLoadPaymentJsFunc = sinon.spy(MyAccountPayment.prototype, 'onLoadPaymentJs');
  const breadCrumbAction = () => {};
  const wrapper = shallow(
    <MyAccountPayment
      cms={cms}
      profileID={profileID}
      userCreditCards={userCreditCards}
      userGiftCards={userGiftCards}
      validatedAddress={validatedAddress}
      breadCrumbAction={breadCrumbAction}
      fngetcreditCards={() => {}}
      fngetGiftCards={() => {}}
      fnaddGiftCard={() => {}}
      fnaddCreditCard={() => {}}
      fnRemoveGiftCard={() => {}}
      fnRemoveCreditCard={() => {}}
      fnEditCreditCard={() => {}}
      analyticsContent={() => {}}
    />
  );
  // const mountWrapper = shallow(
  //   <MyAccountPayment
  //     cms={cms}
  //     profileID={profileID}
  //     userCreditCards={userCreditCards}
  //     userGiftCards={userGiftCards}
  //     fngetcreditCards={() => {}}
  //     fngetGiftCards={() => {}}
  //     fnaddGiftCard={() => {}}
  //     fnaddCreditCard={() => {}}
  //     fnRemoveGiftCard={() => {}}
  //     fnRemoveCreditCard={() => {}}
  //     fnEditCreditCard={() => {}}
  //   />
  // );
  const emptyWrapper = shallow(
    <MyAccountPayment
      cms={cms}
      store={store}
      profileID={profileID}
      userGiftCards={emptyUserGiftCard}
      userCreditCards={emptyUserCreditCard}
      validatedAddress={validatedAddress}
      breadCrumbAction={breadCrumbAction}
      fngetcreditCards={() => {}}
      fngetGiftCards={() => {}}
      fnaddGiftCard={() => {}}
      fnaddCreditCard={() => {}}
      fnRemoveGiftCard={() => {}}
      fnRemoveCreditCard={() => {}}
      fnEditCreditCard={() => {}}
      analyticsContent={() => {}}
    />
  );
  // const onLoadPaymentJsFunc = sinon.spy(MyAccountPayment.prototype, 'onSubmitHandler');
  it('renders <MyAccountPayment /> component', () => {
    expect(wrapper.find('h5')).to.have.length(1);
    expect(wrapper.find('h5').text()).to.equal(cms.paymentsLabel);
    // expect(onLoadPaymentJsFunc.calledOnce).to.equal(true);
    // expect(mountWrapper.instance().componentDidMount.calledOnce).to.equal(true);
  });
  it('renders <CreditCardDisplay /> component ', () => {
    const creditCardWrapper = wrapper.find('CreditCardDisplay').dive();
    expect(funcCheck.calledOnce).to.equal(true);
    expect(wrapper.find('CreditCardDisplay')).to.have.length(1);
    expect(creditCardWrapper.find('button')).to.have.length(1);
    expect(creditCardWrapper.find('div.o-copy__16bold')).to.have.length(1);
    expect(creditCardWrapper.find('div.o-copy__16bold').text()).to.equal(cms.creditCardLabel);
    expect(creditCardWrapper.find('button').text()).to.equal(cms.addNewCreditCardLabelLower);
    expect(renderEditOrCommon.calledOnce).to.equal(true);
    expect(creditCardWrapper.find('CardCommonMyAccount')).to.have.length(userCreditCards.length);
  });
  it('renders <CreditCardDisplay /> after showCreditCardForm true ', () => {
    const creditCardWrapper = wrapper.find('CreditCardDisplay').dive();
    creditCardWrapper.setState({ showCreditCardForm: true });
    expect(creditCardWrapper.find('RenderCreditCard')).to.have.length(1);
    creditCardWrapper.setState({ showCreditCardForm: false });
    expect(creditCardWrapper.find('RenderCreditCard')).to.have.length(0);
  });
  it('renders check for empty condition of credit card ', () => {
    const creditCrdWrapper = emptyWrapper.find('CreditCardDisplay').dive();
    expect(creditCrdWrapper.find('EmptyCondition')).to.have.length(1);
    const emptyCondition = creditCrdWrapper.find('EmptyCondition').dive();
    expect(renderCreditOrGiftFunc.calledOnce).to.equal(true);
    expect(emptyCondition.find('div.o-copy__14reg')).to.have.length(1);
    expect(emptyCondition.find('div.o-copy__14reg').text()).to.equal(cms.youHaveNoCreditLabel);
    expect(emptyCondition.find(Button)).to.have.length(1);
    renderCreditOrGiftFunc.restore();
    renderCreditOrGiftFunc.resetHistory();
    creditCrdWrapper.setState({ showCreditFormOnEmpty: true });
    const emptyConditionRender = creditCrdWrapper.find('RenderCreditCard').dive();
    expect(emptyConditionRender.find('button')).to.have.length(1);
    expect(emptyConditionRender.find('Connect(ReduxForm)')).to.have.length(2);
    expect(emptyConditionRender.find('button')).to.have.length(1);
    expect(emptyConditionRender.find('button').text()).to.equal(cms.commonLabels.cancelLabel);
    expect(emptyConditionRender.find('ReduxForm')).to.have.length(1);
  });
  it('renders check for empty condition of gift card ', () => {
    const giftCardWrapper = emptyWrapper.find('GiftCardDisplay').dive();
    expect(giftCardWrapper.find('EmptyCondition')).to.have.length(1);
    const emptyCondition = giftCardWrapper.find('EmptyCondition').dive();
    expect(emptyCondition.find('div.o-copy__14reg')).to.have.length(1);
    expect(emptyCondition.find('div.o-copy__14reg').text()).to.equal(cms.youHaveNoGiftCardListedLabel);
    expect(emptyCondition.find(Button)).to.have.length(1);
  });
  it('renders add new gift card: ', () => {
    const addGiftCardWrapper = shallow(
      <AddNewGiftCard cms={cms} toggleGiftCard={() => {}} fnaddGiftCardsProp={() => {}} emptyCondition={false} showGiftFormOnEmptyClick={() => {}} />
    );
    expect(addGiftCardWrapper.find(Input)).to.have.length(2);
    expect(addGiftCardWrapper.find('div.o-copy__14reg')).to.have.length(1);
    expect(addGiftCardWrapper.find('div.o-copy__14reg').text()).to.equal(cms.addNewGiftCardLabel);
    expect(
      addGiftCardWrapper
        .find('div.mb-half')
        .at(1)
        .text()
    ).to.equal(cms.giftCardNumberLabel);
    expect(
      addGiftCardWrapper
        .find('span')
        .at(1)
        .text()
    ).to.equal(cms.pinLabel);
    expect(addGiftCardWrapper.find(Tooltip)).to.have.length(1);
    expect(
      addGiftCardWrapper
        .find('span')
        .at(0)
        .text()
    ).to.equal('Gift Card Number is not valid');
    const giftCardNumberInput = addGiftCardWrapper.find(Input).at(0);
    giftCardNumberInput.simulate('change', event);
    // expect(handleCardNumberFunc.calledOnce).to.equal(true);
    // handleCardNumberFunc.restore();
    // handleCardNumberFunc.resetHistory();
    const giftCardPinInput = addGiftCardWrapper.find(Input).at(1);
    giftCardPinInput.simulate('change', event);
    // expect(handlePinChangeFunc.calledOnce).to.equal(true);
    expect(
      addGiftCardWrapper
        .find('span')
        .at(3)
        .text()
    ).to.equal('Gift Card Pin is not valid');
    expect(addGiftCardWrapper.find('button').text()).to.equal(`${' '}${cms.commonLabels.cancelLabel}${' '}`);
  });
  it('renders shipping address from: ', () => {
    const shippingWrapper = mount(<ShippingAddressFormSubmitBtn cms={cms} onSubmitForm={() => {}} store={store} />);
    expect(shippingWrapper.find(Button)).to.have.length(1);
    const addBtn = shippingWrapper.find(Button);
    addBtn.simulate('click', event);
  });
});
