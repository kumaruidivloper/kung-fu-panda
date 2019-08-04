import React from 'react';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
// import StorageManager from './../../utils/StorageManager';
import checkoutPaymentJson from './checkoutPaymentOptions.component.json';
import { CheckoutPaymentOptions } from './checkoutPaymentOptions.component';
import GiftCardOptions from './GiftCards/giftCardOption';
import * as validateSavedcardActions from '../../apps/checkout/store/actions/savedCreditCards';
import * as paymentDataActions from '../../apps/checkout/store/actions/postPaymentData';
// import fetchSavedCardsWorkerSaga from '../../apps/checkout/store/sagas/savedCreditCards';
import * as constants from '../../apps/checkout/checkout.constants';
import * as validateSavedcardReducers from '../../apps/checkout/store/reducers/savedCreditCards';
import * as postPaymentDataReducers from '../../apps/checkout/store/reducers/postPaymentData';
import * as rules from '../../utils/validationRules';
import * as gcrules from './GiftCards/validationRules';

const initialState = { id: 1 };
const store = configureStore();
const data = {
  status: 201,
  results: {
    correlation_id: '228.3219095984413',
    status: 'success',
    type: 'FDToken',
    cvv2: 'M',
    token: { type: 'visa', cardholder_name: 'JohnSmith', exp_date: '1030', value: '0245152126058291' }
  },
  bin: '478825'
};
const nullvalues = { cardId: null, cardPin: null };
const values1 = { cardId: '177412341231234', cardPin: '23' };
const values2 = { cardId: '1774 - 1234 - 1234 - 1234', cardPin: '2323' };
const values3 = { cardId: '7714 - 1234 - 1234 - 1234', cardPin: '2323' };
const values4 = { cardId: '5074 - 1234 - 1234 - 1234', cardPin: '2323' };
describe('GiftCard Validation', () => {
  it('Validation Rules', () => {
    expect(gcrules.normalizeGCNumber('1111111111111111')).to.equal('1111 - 1111 - 1111 - 1111');
    expect(gcrules.normalizeGCNumber('1111')).to.equal('1111');
    expect(gcrules.normalizeGCNumber(null)).to.equal(null);
    expect(gcrules.normalizeGCPin('1111')).to.equal('1111');
    expect(gcrules.normalizeGCPin(null)).to.equal(null);
    expect(gcrules.validationRules(nullvalues).cardId).to.equal('Required');
    expect(gcrules.validationRules(nullvalues).cardPin).to.equal('Required');
    expect(gcrules.validationRules(values1).cardPin).to.equal('Invalid GiftCard Pin');
    expect(gcrules.validationRules(values2).cardId).to.equal(
      'The number you entered is an in-store merchandise credit. Please visit your local store to redeem.'
    );
    expect(gcrules.validationRules(values3).cardId).to.equal(
      'The number you entered is an in-store merchandise credit. Please visit your local store to redeem.'
    );
    expect(gcrules.validationRules(values4).cardId).to.equal(
      'The number you entered is an in-store merchandise credit. Please visit your local store to redeem.'
    );
  });
});
describe('GiftCard 1', () => {
  const { cms, orderDetails } = checkoutPaymentJson.context.data;
  const giftCardData = { error: 'error' };
  const giftcard = shallow(
    <GiftCardOptions
      fngiftCardApplyRequest={() => {}}
      fngiftCardRemoveRequest={() => {}}
      fngiftCardFetchRequest={() => {}}
      fnClearGiftCardErrors={() => {}}
      store={store(initialState)}
      cms={cms}
      giftCardData={giftCardData}
      orderDetails={orderDetails}
    />
  )
    .dive()
    .dive()
    .dive();
  it('GiftCard Option', () => {
    expect(
      giftcard
        .find('div')
        .at(1)
        .text()
    ).to.equal('Gift Card 7777091989512621 added. $1 has been applied. Remove');
    expect(
      giftcard
        .find('a')
        .at(0)
        .text()
    ).to.equal(' Remove');
    expect(
      giftcard
        .find('a')
        .at(3)
        .text()
    ).to.equal(' Add Another Gift Card');
  });
});
describe('GiftCard addGiftCard', () => {
  const { cms, orderDetails } = checkoutPaymentJson.context.data;
  const giftCardData = { error: 'error' };
  const giftcard = shallow(
    <GiftCardOptions
      fngiftCardApplyRequest={() => {}}
      fngiftCardRemoveRequest={() => {}}
      fngiftCardFetchRequest={() => {}}
      fnClearGiftCardErrors={() => {}}
      store={store(initialState)}
      cms={cms}
      giftCardData={giftCardData}
      orderDetails={orderDetails}
    />
  )
    .dive()
    .dive()
    .dive();
  const addGiftCard = sinon.spy(giftcard.instance(), 'addGiftCard');
  addGiftCard({ preventDefault() {} });
  it('GiftCard add', () => {
    expect(
      giftcard
        .find('a')
        .at(3)
        .text()
    ).to.equal(' Hide Gift Card');
  });
});
describe('GiftCard onAddGiftCard', () => {
  const { cms, orderDetails } = checkoutPaymentJson.context.data;
  const giftCardData = { error: 'error' };
  const giftcard = shallow(
    <GiftCardOptions
      fngiftCardApplyRequest={() => {}}
      fngiftCardRemoveRequest={() => {}}
      fngiftCardFetchRequest={() => {}}
      fnClearGiftCardErrors={() => {}}
      store={store(initialState)}
      cms={cms}
      giftCardData={giftCardData}
      orderDetails={orderDetails}
      analyticsContent={() => {}}
    />
  )
    .dive()
    .dive()
    .dive();
  const onAddGiftCard = sinon.spy(giftcard.instance(), 'onAddGiftCard');
  onAddGiftCard({ cardId: '1234123412341234', cardPin: '1234' }, 10001);
  it('check state', () => {
    expect(giftcard.state().showGiftCardForm).to.be.equal(false);
  });
});

describe('<CheckoutPayment />', () => {
  const { orderDetails, cms, savedCreditCards } = checkoutPaymentJson.context.data;
  // sinon.spy(CheckoutPaymentOptions.prototype, 'fnloadSavedCreditcards');
  const fngiftCardApplyRequest = () => '';
  const fngiftCardRemoveRequest = () => '';
  const toggleBillingAddress = () => '';
  const fnHideLoader = () => '';
  const wrapper = shallow(
    <Provider store={store(initialState)}>
      <CheckoutPaymentOptions
        cms={cms}
        fnHideLoader={fnHideLoader}
        fngiftCardRemoveRequest={fngiftCardRemoveRequest}
        fngiftCardApplyRequest={fngiftCardApplyRequest}
        toggleBillingAddress={toggleBillingAddress}
        orderDetails={orderDetails}
        savedCreditCards={savedCreditCards}
        analyticsContent={() => {}}
      />
    </Provider>
  );
  it('Tests the component render life cycle', () => {
    sinon.spy(CheckoutPaymentOptions.prototype, 'render');
    shallow(<CheckoutPaymentOptions cms={cms} availablePaymentMethods={() => {}} orderDetails={orderDetails} store={store(initialState)} />);
    expect(CheckoutPaymentOptions.prototype.render.calledOnce).to.equal(true);
  });

  // it('Tests loadScripts method', () => {
  //   sinon.spy(CheckoutPaymentOptions.prototype, 'loadScripts');
  //   shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} store={store(initialState)} />);
  //   expect(CheckoutPaymentOptions.prototype.render.calledOnce).to.equal(true);
  // });

  it('Tests the selectPayment class is available or not', () => {
    shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} store={store(initialState)} />);
    expect(wrapper.find('.selectPayment')).to.have.length(1);
  });

  it('Validate onGenerateToken method', () => {
    const paymentData = { data: JSON.stringify(data) };
    const formValues = { formValues: { changeBillingAddress: {} } };
    const wrap = shallow(
      <CheckoutPaymentOptions
        cms={cms}
        orderDetails={orderDetails}
        fnHideLoader={fnHideLoader}
        formValues={formValues}
        isLoggedIn={false}
        store={store(initialState)}
      />
    );
    wrap.instance().onGenerateToken(paymentData);
    const dataObj = checkoutPaymentJson.context.data;
    dataObj.status = '';
    const paymentResponse = { data: JSON.stringify(dataObj) };
    wrap.instance().onGenerateToken(paymentResponse);
    expect(wrap.state().isValidCreditCard).to.equal(false);
  });

  it('Validate normalizeCard', () => {
    expect(rules.normalizeCard('4533678845984875')).to.equal('4533 - 6788 - 4598 - 4875');
    expect(rules.normalizeCard('353367884598487')).to.equal('3533 - 6788 - 4598 - 487');
    expect(rules.normalizeCard('')).to.equal('');
  });

  it('Validate normalizeExpiry', () => {
    expect(rules.normalizeExpiry('1219')).to.equal('12/19');
    expect(rules.normalizeExpiry('1121')).to.equal('11/21');
    expect(rules.normalizeExpiry('')).to.equal('');
  });

  it('Validate normalizeCvv', () => {
    expect(rules.normalizeCvv('test123')).to.equal('123');
    expect(rules.normalizeCvv('456test')).to.equal('456');
    expect(rules.normalizeCvv('')).to.equal('');
  });

  it('Should render Creditcard information', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} store={store(initialState)} />);
    wrap.instance().showPaymentOption('Credit Card');
    expect(wrap.state().selectedPaymentOption).to.equal('Credit Card');
  });

  it('Validate getCurrentImage method', () => {
    const { cardsAccepted } = checkoutPaymentJson.context.data.cms.commonLabels;
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} store={store(initialState)} />);
    expect(wrap.instance().getCurrentImage('visa', cardsAccepted)).to.equal(
      'http://uat5glb.academy.com/content/dam/academysports/cart-and-checkout/cards-accepted/visa.jpg'
    );
  });

  it('Validate onCreditcardValidate method', () => {
    const cmsObj = checkoutPaymentJson.context.data;
    cmsObj.commonLabels = {
      cardsAccepted: [
        { label: 'Visa', url: '/content/dam/academysports/cart-and-checkout/cards-accepted/visa.jpg' },
        { label: 'Master Card', url: '/content/dam/academysports/cart-and-checkout/cards-accepted/master.jpg' },
        { label: 'Express', url: '/content/dam/academysports/cart-and-checkout/cards-accepted/express.jpg' },
        { label: 'Discovery', url: '/content/dam/academysports/cart-and-checkout/cards-accepted/discovery.jpg' }
      ]
    };
    const wrap = shallow(<CheckoutPaymentOptions cms={cmsObj} orderDetails={orderDetails} store={store(initialState)} />);
    wrap.instance().onCreditcardValidate('4');
    expect(wrap.state().creditCardSrc).to.equal('');
    wrap.instance().onCreditcardValidate('14');
    expect(wrap.state().creditCardSrc).to.equal('');
    wrap.instance().onCreditcardValidate('49');
    expect(wrap.state().creditCardSrc).to.not.equal('');
    wrap.instance().onCreditcardValidate('65');
    expect(wrap.state().creditCardSrc).to.not.equal('');
    wrap.instance().onCreditcardValidate('34');
    expect(wrap.state().creditCardSrc).to.not.equal('');
    wrap.instance().onCreditcardValidate('55');
    expect(wrap.state().creditCardSrc).to.not.equal('');
  });

  it('Should render Paypal information', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} store={store(initialState)} />);
    wrap.instance().showPaymentOption('Paypal');
    expect(wrap.state().selectedPaymentOption).to.equal('Paypal');
  });

  it('Should render E-Pay information', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} store={store(initialState)} />);
    wrap.instance().showPaymentOption('E-Pay');
    expect(wrap.state().selectedPaymentOption).to.equal('E-Pay');
  });

  it('Validate onChangeCreditCardFieldHandler method', () => {
    const eve = { target: { name: 'creditcardField', value: '4' } };
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} store={store(initialState)} />);
    wrap.instance().onChangeCreditCardFieldHandler(eve);
    expect(wrap.state().showValidCard).to.equal(false);
    expect(wrap.state().isValidCreditCard).to.equal(true);

    const evt = { target: { name: 'creditcardField', value: '48' } };
    wrap.instance().onChangeCreditCardFieldHandler(evt);
    expect(wrap.state().showValidCard).to.equal(true);
    expect(wrap.state().isValidCreditCard).to.equal(true);
  });

  it('Validate saveCreditCardCredentials method', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} store={store(initialState)} />);
    wrap.instance().saveCreditCardCredentials(data);
    expect(wrap.state().savedCreditCardCredentials.token).to.equal('0245152126058291');
    expect(wrap.state().savedCreditCardCredentials.type).to.equal('visa');
    expect(wrap.state().savedCreditCardCredentials.expiryDate).to.equal('1030');
    expect(wrap.state().savedCreditCardCredentials.correlationId).to.equal('228.3219095984413');
    data.status = '';
    data.type = 'master';
    wrap.instance().saveCreditCardCredentials(data);
    expect(wrap.state().savedCreditCardCredentials.type).to.equal('master');
  });

  it('Validate onSubmitSuggestHandler method', () => {
    const formValues = {
      billingAddress1: 'Tribeca, Downtown, Manhattan',
      billingPhoneNumber: 8746324387,
      billingCity: 'NY',
      billingState: 'Newyork',
      billingZipCode: 10007
    };
    const wrap = shallow(
      <CheckoutPaymentOptions formValues={formValues} cms={cms} orderDetails={orderDetails} isLoggedIn={false} store={store(initialState)} />
    );
    wrap.instance().onSubmitSuggestHandler(formValues);
    expect(wrap.state().modalIsOpen).to.equal(false);
  });

  it('Validate closeModal method', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} isLoggedIn={false} store={store(initialState)} />);
    wrap.instance().closeModal();
    expect(wrap.state().modalIsOpen).to.equal(false);
  });

  it('Validate onGpayLoad method', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} isLoggedIn={false} store={store(initialState)} />);
    wrap.instance().onGpayLoad();
    expect(wrap.state().gpayLoaded).to.equal(true);
  });

  it('Validate onPayPalLoad method', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} isLoggedIn={false} store={store(initialState)} />);
    wrap.instance().onPayPalLoad();
    expect(wrap.state().payPalLoaded).to.equal(true);
  });

  it('Validate checkSavedCreditcardsList method', () => {
    const dataObj = { data: [] };
    const wrap = shallow(
      <CheckoutPaymentOptions savedCreditCards={dataObj} cms={cms} orderDetails={orderDetails} isLoggedIn={false} store={store(initialState)} />
    );
    expect(wrap.instance().checkSavedCreditcardsList()).to.equal(false);
  });

  it('Validate onSubmitFormHandler method', () => {
    const cardDetails = { creditcardField: '4567 - 3244 - 2323 - 7653', expiryField: '10/21', cvvField: '345' };
    const fnShowLoader = () => '';
    const wrap = shallow(
      <CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} fnShowLoader={fnShowLoader} isLoggedIn={false} store={store(initialState)} />
    );
    wrap.instance().onSubmitFormHandler(cardDetails);

    wrap.setState({ selectedCreditCardIndex: 1 });
    shallow(
      <CheckoutPaymentOptions
        cms={cms}
        orderDetails={orderDetails}
        savedCreditCards={savedCreditCards}
        isLoggedIn={false}
        store={store(initialState)}
      />
    );
  });

  it('Validate renderDropdown method', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} isLoggedIn={false} store={store(initialState)} />);
    wrap.instance().renderDropdown(cms);
    expect(wrap.find('.creditcardDetails')).to.have.length(0);
  });

  it('Validate "processPayment, applePaymentSuccessCallback, applePaymentErrorCallaback, isAnyRestrictedItemInCart, renderApplePay, getApplePayRequetPayload" method', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} isLoggedIn={false} store={store(initialState)} />);
    wrap.instance().processPayment();
    wrap.instance().applePaymentSuccessCallback();
    wrap.instance().applePaymentErrorCallaback();
    expect(wrap.instance().isAnyRestrictedItemInCart()).to.equal(false);
    expect(wrap.instance().renderApplePay()).to.not.equal('');
    expect(wrap.instance().getApplePayRequetPayload()).to.not.equal('');
  });

  it('Validate handleChangeAddress method', () => {
    const handleChangeAddressObj = { sameAsShippingAddress: false, changeBillingAddress: true };
    const fnvalidateAddress = () => '';
    const wrap = shallow(
      <CheckoutPaymentOptions
        cms={cms}
        orderDetails={orderDetails}
        fnvalidateAddress={fnvalidateAddress}
        savedCreditCards={savedCreditCards}
        store={store(initialState)}
      />
    );
    wrap.instance().handleChangeAddress(handleChangeAddressObj);
    expect(wrap.state().modalIsOpen).to.equal(true);

    const handleChangeAddressObj2 = { sameAsShippingAddress: true, changeBillingAddress: true };
    const wrap2 = shallow(
      <CheckoutPaymentOptions
        cms={cms}
        orderDetails={orderDetails}
        fnHideLoader={fnHideLoader}
        savedCreditCards={savedCreditCards}
        store={store(initialState)}
      />
    );
    wrap2.instance().handleChangeAddress(handleChangeAddressObj2);

    const handleChangeAddressObj3 = { sameAsShippingAddress: true, changeBillingAddress: false };
    const fnHideLoader2 = () => '';
    const wrap3 = shallow(
      <CheckoutPaymentOptions
        cms={cms}
        orderDetails={orderDetails}
        fnHideLoader={fnHideLoader2}
        savedCreditCards={savedCreditCards}
        store={store(initialState)}
      />
    );
    wrap3.instance().handleChangeAddress(handleChangeAddressObj3);
  });

  it('Validate validateCard method', () => {
    const wrap = shallow(<CheckoutPaymentOptions cms={cms} orderDetails={orderDetails} isLoggedIn={false} store={store(initialState)} />);
    expect(
      wrap
        .instance()
        .validateCard('51', /^(?:5[1-5])$/)
        .indexOf('51') !== -1
    ).to.equal(true);
  });

  it('Validate getSelectedOption method', () => {
    const wrap = shallow(
      <CheckoutPaymentOptions
        savedCreditCards={savedCreditCards}
        cms={cms}
        orderDetails={orderDetails}
        isLoggedIn={false}
        store={store(initialState)}
      />
    );
    wrap.instance().getSelectedOption(1);
    expect(wrap.state().isCreditcardFormVisible).to.equal(false);
    expect(wrap.state().selectedCreditCardIndex).to.equal(1);
    expect(wrap.state().newcardSelected).to.equal(false);

    wrap.instance().getSelectedOption(2);
    expect(wrap.state().selectedPaymentOption).to.equal('creditcard');
    expect(wrap.state().isCreditcardFormVisible).to.equal(true);
    expect(wrap.state().newcardSelected).to.equal(true);
  });

  it('Validate validateCreditCard method', () => {
    const cmsObj = checkoutPaymentJson.context.data.cms;
    const values = { creditcardField: '43456754564534' };
    expect(rules.validateCreditCard('', cmsObj.errorMsg).creditcardField).to.equal('Unrecognized card number');
    expect(rules.validateCreditCard(values, cmsObj.errorMsg).creditcardField).to.equal('Unrecognized card number');
  });

  it('Validate validCreditCard method', () => {
    expect(rules.validCreditCard('455454354354355')).to.equal(false);
    expect(rules.validCreditCard('4788250000028291')).to.equal(true);
  });

  it('Validate validateExpiry method', () => {
    const cmsObj = checkoutPaymentJson.context.data.cms;
    const validateExpiry = { expiryField: '10' };
    const expiryYear = { expiryField: '10/12' };
    const invalidMonth = { expiryField: '15/18' };
    expect(rules.validateExpiry('', cmsObj.errorMsg).expiryField).to.equal('Unrecognized expiration date');
    expect(rules.validateExpiry(validateExpiry, cmsObj.errorMsg).expiryField).to.equal('Unrecognized expiration date');
    expect(rules.validateExpiry(expiryYear, cmsObj.errorMsg).expiryField).to.equal('Past expiration date');
    expect(rules.validateExpiry(invalidMonth, cmsObj.errorMsg).expiryField).to.equal('Unrecognized expiration date');
  });

  it('Validate validateCvv method', () => {
    const cmsObj = checkoutPaymentJson.context.data.cms;
    const values = { cvvField: '76' };
    expect(rules.validateCvv('', cmsObj.errorMsg).cvvField).to.equal('Please enter a valid security code');
    expect(rules.validateCvv(values, cmsObj.errorMsg).cvvField).to.equal('Please enter a valid security code');
  });

  it('Validate validatePaymentForm method', () => {
    const cmsObj = checkoutPaymentJson.context.data;
    expect(rules.validatePaymentForm('', cmsObj).creditcardField).to.equal('Unrecognized card number');
    expect(rules.validatePaymentForm('', cmsObj).expiryField).to.equal('Unrecognized expiration date');
    expect(rules.validatePaymentForm('', cmsObj).cvvField).to.equal('Please enter a valid security code');
  });

  it('Validate getBillingAddress method', () => {
    const orderdetails = { addresses: { billingAddress: { firstName: 'John', lastName: 'Appleseed', phoneNumber: '1890787823' } } };
    const wrap = shallow(
      <CheckoutPaymentOptions
        cms={cms}
        orderDetails={orderdetails}
        savedCreditCards={savedCreditCards}
        isLoggedIn={false}
        store={store(initialState)}
      />
    );
    expect(wrap.instance().getBillingAddress()).to.deep.include(orderdetails.addresses.billingAddress);
  });
});

describe('Checkout validateSavedcard actions', () => {
  it('should create an action to fetch saved creditcards', () => {
    const expectedAction = {
      type: constants.FETCH_SAVED_CARDS_REQUEST
    };
    expect(validateSavedcardActions.fetchSavedCards(10002)).to.deep.include(expectedAction);
  });
  it('should create an action for fetch saved creditcards success', () => {
    const expectedAction = {
      type: constants.FETCH_SAVED_CARDS_SUCCESS
    };
    expect(validateSavedcardActions.fetchSavedCardsSuccess({ success: true })).to.deep.include(expectedAction);
  });
  it('should create an action for fetch saved creditcards failure', () => {
    const expectedAction = {
      type: constants.FETCH_SAVED_CARDS_FAILURE
    };
    expect(validateSavedcardActions.fetchSavedCardsError({ error: true })).to.deep.include(expectedAction);
  });
});

describe('Checkout validate Post payment actions', () => {
  it('should create an action to post creditcard data', () => {
    const expectedAction = {
      type: constants.POST_PAYMENT_REQUEST
    };
    expect(paymentDataActions.postpaymentData()).to.deep.include(expectedAction);
  });
  it('should create an action to post creditcard data when failure', () => {
    const expectedAction = {
      type: constants.POST_PAYMENT_FAILURE
    };
    expect(paymentDataActions.postpaymentDataError({ error: true })).to.deep.include(expectedAction);
  });
  it('should create an action to post creditcard data when failure', () => {
    const expectedAction = {
      type: constants.POST_PAYMENT_SUCCESS
    };
    expect(paymentDataActions.postpaymentDataSuccess({ error: true })).to.deep.include(expectedAction);
  });
});

describe('Checkout validateSavedcard reducers', () => {
  const { creditCards } = checkoutPaymentJson.context.data.savedCreditCards.data;
  it('should call reducer to fetch saved creditcards', () => {
    let state = { isFetching: false, error: false, data: {} };
    state = validateSavedcardReducers.savedCreditCards(state, { type: constants.FETCH_SAVED_CARDS_REQUEST, data: {} });
    expect(state).to.deep.include({ data: {}, isFetching: true, error: false });
  });

  it('should call reducer to fetch saved creditcards is successful', () => {
    let state = { isFetching: false, error: false, data: {} };
    state = validateSavedcardReducers.savedCreditCards(state, { type: constants.FETCH_SAVED_CARDS_SUCCESS, data: creditCards });
    creditCards.isFetching = false;
    creditCards.error = false;
    const finalOutput = { data: creditCards };
    expect(state).to.deep.include(finalOutput);
  });

  it('should call reducer to fetch saved creditcards is failure', () => {
    let state = { isFetching: false, error: false, data: {} };
    state = validateSavedcardReducers.savedCreditCards(state, { type: constants.FETCH_SAVED_CARDS_FAILURE, data: {} });
    expect(state).to.deep.include({ data: {}, isFetching: false, error: true });
  });

  it('should call reducer to fetch saved creditcards is invalid', () => {
    let state = { isFetching: false, error: false, data: {} };
    state = validateSavedcardReducers.savedCreditCards(state, { type: constants.INVALIDATE_SAVED_CARDS, data: {} });
    expect(state).to.deep.include({ data: {}, isFetching: false, error: false });
  });

  it('should call reducer to return default state', () => {
    let state = { isFetching: false, error: false, data: {} };
    state = validateSavedcardReducers.savedCreditCards(state, { type: 'TEST_ACTION_TO_RETURN_DEFAULT_STATE', data: {} });
    expect(state).to.deep.include({ data: {}, isFetching: false, error: false });
  });
});

describe('Checkout postPaymentData reducers', () => {
  it('should call post payment request', () => {
    let state = { isFetching: false, error: false, data: {} };
    const cardInfo = { correlation_id: '228.3219095984413', type: 'visa', cardholder_name: 'JohnSmith', exp_date: '1030', token: '0245152126058291' };
    state = postPaymentDataReducers.postPaymentData(state, { type: constants.POST_PAYMENT_REQUEST, data: cardInfo });
    expect(state).to.deep.include({
      isFetching: true,
      error: false,
      data: { correlation_id: '228.3219095984413', type: 'visa', cardholder_name: 'JohnSmith', exp_date: '1030', token: '0245152126058291' }
    });
  });

  it('should call post payment success', () => {
    let state = { isFetching: false, error: false, data: {} };
    const postCardInfo = { success: true };
    state = postPaymentDataReducers.postPaymentData(state, { type: constants.POST_PAYMENT_SUCCESS, data: postCardInfo });
    expect(state).to.deep.include({ isFetching: false, error: false, data: { success: true } });
  });

  it('should call post payment failure', () => {
    let state = { isFetching: false, error: false, data: {} };
    state = postPaymentDataReducers.postPaymentData(state, { type: constants.POST_PAYMENT_FAILURE, error: true });
    expect(state).to.deep.include({ isFetching: false, error: true, data: {} });
  });

  it('should call post payment failure', () => {
    let state = { isFetching: false, error: false, data: {} };
    state = postPaymentDataReducers.postPaymentData(state, { type: 'TEST_ACTION_TO_RETURN_DEFAULT_STATE', error: true });
    expect(state).to.deep.include({ isFetching: false, error: false, data: {} });
  });
});
