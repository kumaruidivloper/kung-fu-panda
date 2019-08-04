/* global PaymentJS */
/**
 *  checkoutPaymentOptions serves as a component holding various checkout payment options like credit card,
 *  PayPal, Google Pay, Apple Pay and more.
 */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

import {
  FIRSTDATA_DOMAIN,
  FIRSTDATA_PAYMENTJS,
  FIRSTDATA_API_KEY,
  FIRSTDATA_JS_SECURITY_TOKEN,
  FIRSTDATA_FD_TOKEN,
  FIRSTDATA_TA_TOKEN,
  PAYPAL_JS,
  GOOGLE_PAY_JS,
  APPLE_PAY_MERCHANT_IDENTIFIER
} from '@academysports/aso-env';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose, combineReducers } from 'redux';
import { getFormValues, reducer as form, change as changeFieldValue, untouch } from 'redux-form';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import { get } from '@react-nitro/error-boundary';
import RadioButton from '@academysports/fusion-components/dist/RadioButton';
import BrowserDataCollector from '../../utils/BrowserDataCollector';
import CreditcardDetails from './CreditcardDetails/creditcardDetails';
import { hideLoader, showLoader } from '../../apps/checkout/store/actions/globalLoader';
import GenericError from './../genericError';
import AlertComponent from './../genericError/components/alertComponent';
import injectReducer from '../../utils/injectReducer';
import { validateCard, typeAmexTwoChars, typeMasterTwoChars, typeVisaTwoChars, typeDiscoverTwoChars } from '../../utils/validationRules';
import BillingInfoForm from '../billingInfoForm/billingInfoForm.component';
import ApplePay from './../applePay/applePay.component';
import { has } from './../../utils/objectUtils';
import GooglePay from './GPay/googlePay';
import * as styles from './payment.styles';
import { getOrderItems, getShippingAddress, getRequestObject, getInlinePriceDetails } from './Paypal/getOrderItems';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  PAYMENT_SUCCESS_STATUS,
  CREDIT_CARD,
  PAYPAL,
  GOOGLE_PAY,
  APPLE_PAY,
  EXPIRED,
  NEWCARD,
  CVV_AMEX_LENGTH,
  CVV_OTHER_CARDS_LENGTH,
  FORM_NAME,
  ANALYTICS_EVENT_IN,
  ANALYTICS_SUB_EVENT_IN,
  ANALYTICS_EVENT_CATEGORY,
  analyticsEventActionPayment,
  analyticsEventLabelPayment,
  AMEX_CARD_LENGTH,
  OTHER_CARDS_LENGTH,
  analyticsErrorEvent,
  analyticsErrorEventCategory,
  analyticsErrorCCEventAction
} from './constants';

import StorageManager from './../../utils/StorageManager';
import { fetchSavedCards, toggleBillingAddress } from '../../apps/checkout/store/actions/savedCreditCards';
import { postpaymentData } from '../../apps/checkout/store/actions/postPaymentData';
import { validateAddress, inValidateAddressVerification } from '../../apps/checkout/store/actions/validateAddress';
import { giftCardApplyRequest, giftCardRemoveRequest, giftCardFetchRequest, clearGiftCardErrors } from '../../apps/checkout/store/actions/giftCard';
import FormSubmitButton from './RevieworderButton/formSubmitBtnComponent';
import GiftCardOptions from './GiftCards/giftCardOption';
import PaypalButton from './Paypal/payPalButton';
import loadScripts from './../../utils/loadScripts';
import { postPayPalData, postPayPalError } from '../../apps/checkout/store/actions/postPayPalData';
import { COUNTRY } from './../../utils/constants';
import { getApplePayRequestPayload, applePaymentSuccessCallback, applePaymentErrorCallaback } from './ApplePay/applePayUtilities';
import { collateAnalyticsData, typeOfOrder } from './../../utils/analyticsUtils';
import { scrollIntoView } from '../../utils/scroll';

const goToReviewOrderAnalyticsData = {
  event: 'checkoutsteps',
  eventCategory: 'checkout',
  eventAction: 'payment',
  eventLabel: 'GO TO REVIEW ORDER',
  customerleadlevel: null,
  customerleadtype: null,
  leadsubmitted: 0,
  newslettersignupcompleted: 0
};
export class CheckoutPaymentOptions extends React.Component {
  constructor(props) {
    super(props);
    const {
      orderDetails: {
        payments: { paymentMethod }
      },
      cms: { paymentOptions }
    } = props;
    const selectedPaymentOption = paymentMethod && paymentMethod !== ' ' ? paymentMethod.toLowerCase() : CREDIT_CARD.toLowerCase();
    this.state = {
      modalIsOpen: false,
      selectedPaymentOption,
      selectedCreditCardIndex: 0,
      isPaymentJsReady: false,
      newcardSelected: false,
      creditCardSrc: '',
      isValidCreditCard: null,
      showValidCard: false,
      isCreditcardFormVisible: false,
      savedCreditCardCredentials: null,
      gpayLoaded: false,
      payPalLoaded: false,
      validateCVVLength: 4,
      showBillingForm: false,
      creditCardPaymentError: false
    };
    this.paymentOptionsRef = React.createRef();
    this.paymentOptions = this.availablePaymentMethods(paymentOptions);
    this.showPaymentOption = this.showPaymentOption.bind(this);
    this.onSubmitFormHandler = this.onSubmitFormHandler.bind(this);
    this.onSubmitSuggestHandler = this.onSubmitSuggestHandler.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onGenerateToken = this.onGenerateToken.bind(this);
    this.onChangeCreditCardFieldHandler = this.onChangeCreditCardFieldHandler.bind(this);
    this.saveCreditCardCredentials = this.saveCreditCardCredentials.bind(this);
    this.getLastFourCCDDigits = this.getLastFourCCDDigits.bind(this);
    this.getAddressId = this.getAddressId.bind(this);
    this.postPayPalData = this.postPayPalData.bind(this);
    this.payPalError = this.payPalError.bind(this);
    this.onChangeBillingAddress = this.onChangeBillingAddress.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  /**
   * checks for auth status of user and loads Google Pay, PaymentJS and saved credit cards data.
   */
  componentDidMount() {
    const {
      isLoggedIn,
      orderDetails: { orderId }
    } = this.props;
    if (isLoggedIn) {
      const userId = StorageManager.getSessionStorage('userId');
      this.props.fnloadSavedCreditcards(userId);
    }
    BrowserDataCollector.transactionIdentifier = orderId;
    BrowserDataCollector.beginCollectingData();
    loadScripts([
      { src: FIRSTDATA_PAYMENTJS, onLoad: () => this.onLoadPayJS(), onError: () => console.log('error in loading payment JS scripts') },
      { src: GOOGLE_PAY_JS, onLoad: () => this.onGpayLoad(), onError: () => console.log('error in oading Google Pay scripts') },
      { src: PAYPAL_JS, onLoad: () => this.onPayPalLoad(), onError: () => console.log('error in loading PayPal scripts') }
    ]);
    this.InitialChangeBillingAddressValue();
    this.scrollIntoView();
    /** onload or edit of payment Drawer */
    this.postAnalyticsDataOnLoad();
    this.getCvvLength();
  }

  componentWillReceiveProps(nextProps) {
    const {
      orderDetails: { payments }
    } = this.props;
    if (
      nextProps.validateBillingAddress &&
      nextProps.validateBillingAddress.data &&
      Object.keys(nextProps.validateBillingAddress.data).length > 0 &&
      !nextProps.validateBillingAddress.error &&
      nextProps.validateBillingAddress.data.avsErrors
    ) {
      this.setState({ modalIsOpen: true });
    } else if (
      nextProps.validateBillingAddress.error ||
      (nextProps.validateBillingAddress && nextProps.validateBillingAddress.data && nextProps.validateBillingAddress.data.address === 'Verified')
    ) {
      this.onSubmitSuggestHandler(this.props.formValues);
    }
    if (payments.paymentMethod && JSON.stringify(payments.paymentMethod) !== JSON.stringify(nextProps.orderDetails.payments.paymentMethod)) {
      this.postReviewOrderAnalyticsData(payments.paymentMethod);
    }
  }

  componentDidUpdate(prevProps) {
    const { savedCreditCards } = this.props;
    if (JSON.stringify(prevProps.savedCreditCards.data) !== JSON.stringify(savedCreditCards.data)) {
      if (
        savedCreditCards.data &&
        savedCreditCards.data.profile &&
        savedCreditCards.data.profile.payment &&
        savedCreditCards.data.profile.payment.length === 1 &&
        savedCreditCards.data.profile.payment[0].expired
      ) {
        // checking if we have one saved creditcard and it is expired
        this.showtheFormForSingleExpiredCard();
      }
    }
  }
  /**
   * @param {object} event called while generating payment token for a new credit card.
   */
  onGenerateToken(event) {
    const responseJson = JSON.parse(event.data);
    const { changeBillingAddress, formValues } = this.props;
    if (event.origin === FIRSTDATA_DOMAIN) {
      if (responseJson.status === PAYMENT_SUCCESS_STATUS) {
        // save credit card credentials from PaymentJS to for further use.
        const billingAddress = this.getBillingAddress();
        this.saveCreditCardCredentials(
          Object.assign({}, responseJson, {
            cardholderFirstName: formValues.billingFirstName,
            cardholderLastName: formValues.billingLastName
          }),
          () => this.handleChangeAddress(changeBillingAddress ? this.props.formValues : billingAddress)
        );
        this.setState({ isValidCreditCard: true, creditCardPaymentError: false });
      } else {
        this.setState({ creditCardPaymentError: true });
        this.props.fnHideLoader();
      }
    }
  }
  /**
   * Loading PaymentJs on component load
   */
  onLoadPayJS() {
    const fdc = new PaymentJS(FIRSTDATA_API_KEY, FIRSTDATA_JS_SECURITY_TOKEN, FIRSTDATA_TA_TOKEN, FIRSTDATA_FD_TOKEN);
    fdc.dsg();
    window.addEventListener('message', this.onGenerateToken, false);
    this.setState({ isPaymentJsReady: true });
  }
  /**
   * once GPay has been loaded successfully.
   */
  onGpayLoad() {
    this.setState({ gpayLoaded: true });
  }
  /**
   * once PayPal script has been loaded successfully.
   */
  onPayPalLoad() {
    this.setState({ payPalLoaded: true });
  }
  /**
   * function to be called when 'review order' button is clicked in payment drawer.
   * @param {object} data Contains all form field values
   */
  onSubmitFormHandler(data, Frame) {
    // read form values from credit card fields - eg. credit card number, expiry and CVV.
    const { orderDetails, changeBillingAddress, formValues, analyticsContent } = this.props;
    const selectedCreditcard = this.getSelectedCreditCard();
    analyticsContent(goToReviewOrderAnalyticsData);
    if (selectedCreditcard && selectedCreditcard.expired) {
      // Checking and returning if credit card is expired.
      this.setState({ isValidCreditCard: false });
      return;
    }
    this.props.fnShowLoader();
    const billingAddress = this.getBillingAddress();
    if (this.checkIfAuthOrUnauthUserWithNoSavedCreditCards()) {
      // covers unauthenticated user && authenticated users with no saved credit cards.
      this.ifNoSavedCreditCardsForUser(data, Frame);
    } else {
      const creditCardDetailsWithBilling = selectedCreditcard;
      if (changeBillingAddress) {
        if (formValues.sameAsShippingAddress) {
          this.postPaymentDetails(Object.assign({}, creditCardDetailsWithBilling, this.props.formValues), orderDetails.orderId);
        } else {
          this.saveCreditCardCredentials(
            Object.assign({}, this.formValuesToCreditCardFieldsMapping(this.props.formValues, creditCardDetailsWithBilling), {
              cardholderFirstName: `${this.props.formValues.billingFirstName}`,
              cardholderLastName: `${this.props.formValues.billingLastName}`
            }),
            () => this.handleChangeAddress(this.props.formValues ? this.props.formValues : {})
          );
        }
      } else {
        this.saveCreditCardCredentials(
          Object.assign({}, creditCardDetailsWithBilling, {
            cardholderFirstName: `${billingAddress.firstName}`,
            cardholderLastName: `${billingAddress.lastName}`
          }),
          () => this.handleChangeAddress(this.props.formValues ? this.props.formValues : billingAddress)
        );
      }
    }
    this.setState({ creditCardPaymentError: false });
  }
  /**
   * event handler when change billing address link is clicked.
   */
  onChangeBillingAddress(event) {
    event.preventDefault();
    const { analyticsContent } = this.props;
    analyticsContent({
      event: ANALYTICS_SUB_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventActionPayment,
      eventLabel: 'change billing address',
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    });
    this.setState({ showBillingForm: true });
    this.props.toggleBillingAddress(true);
    // this.props.analyticsContent
  }

  /**
   * @param {object} selectedAddress is the address selected by user in AVS modal.
   * onSubmitSuggestHandler is called when user sees the AVS modal and clicks on use selected address button with the selected address object.
   */
  onSubmitSuggestHandler(selectedAddress) {
    const { formValues } = this.props;
    this.setState({ modalIsOpen: false });
    this.props.fnInvalidateAddress();
    // consolidating data from selected address and credit card details.
    const consolidatedData = Object.assign({}, this.state.savedCreditCardCredentials);
    consolidatedData.email = formValues.email;
    consolidatedData.organizationName = formValues.billingCompany ? formValues.billingCompany : '';
    consolidatedData.billingAddress1 = selectedAddress.address ? selectedAddress.address : formValues.billingAddress1;
    consolidatedData.billingPhoneNumber = formValues.billingPhoneNumber;
    consolidatedData.billingCity = selectedAddress.city ? selectedAddress.city : formValues.billingCity;
    consolidatedData.billingState = selectedAddress.state ? selectedAddress.state : formValues.billingState;
    consolidatedData.billingZipCode = selectedAddress.zipcode ? selectedAddress.zipcode : formValues.billingZipCode;
    consolidatedData.country = selectedAddress.country ? selectedAddress.country : COUNTRY;
    consolidatedData.savePaymentInfoCheckbox = formValues.savePaymentInfoCheckbox;
    this.postPaymentDetails(consolidatedData, this.props.orderDetails.orderId);
  }

  /**
   * Hidding the error message if user entered on any field.
   */
  onChangeCreditCardFieldHandler(eve) {
    const { value } = eve.target;
    if (value.length < 2 && eve.target.name === 'creditcardField') {
      this.setState({ showValidCard: false, isValidCreditCard: true });
    } else if (value.length >= 2 && eve.target.name === 'creditcardField') {
      this.setState({ showValidCard: true, isValidCreditCard: true });
      this.onCreditcardValidate(value);
    }
  }

  /**
   *
   * @param {string} creditcardInputVal user entered creditcard value
   * @param {array} propValues list of creditcard urls provided
   */
  onCreditcardValidate(creditcardInputVal) {
    const { commonLabels } = this.props.cms;
    if (creditcardInputVal.length <= 1) {
      this.setState({ creditCardSrc: '' });
    } else if (creditcardInputVal.length >= 2) {
      const cardValueTwoChars = creditcardInputVal.substr(0, 2);
      if (validateCard(cardValueTwoChars, typeAmexTwoChars)) {
        this.setState({ validateCVVLength: CVV_AMEX_LENGTH, creditCardSrc: this.getCurrentImage('amex', commonLabels.cardsAccepted) });
      } else if (validateCard(cardValueTwoChars, typeMasterTwoChars)) {
        this.setState({ validateCVVLength: CVV_OTHER_CARDS_LENGTH, creditCardSrc: this.getCurrentImage('mast', commonLabels.cardsAccepted) });
      } else if (validateCard(cardValueTwoChars, typeVisaTwoChars)) {
        this.setState({ validateCVVLength: CVV_OTHER_CARDS_LENGTH, creditCardSrc: this.getCurrentImage('visa', commonLabels.cardsAccepted) });
      } else if (validateCard(cardValueTwoChars, typeDiscoverTwoChars)) {
        this.setState({ validateCVVLength: CVV_OTHER_CARDS_LENGTH, creditCardSrc: this.getCurrentImage('disc', commonLabels.cardsAccepted) });
      } else {
        this.setState({ creditCardSrc: '' });
      }
    }
  }

  /**
   *
   * returns the credit card type on Edit mode
   * @param {string} twoChars credit card first two digits
   */
  onEditCreditCard(twoChars) {
    let cardType;
    if (validateCard(twoChars, typeMasterTwoChars)) {
      cardType = 'mast';
    } else if (validateCard(twoChars, typeVisaTwoChars)) {
      cardType = 'visa';
    } else if (validateCard(twoChars, typeDiscoverTwoChars)) {
      cardType = 'disc';
    }
    return cardType;
  }

  getSelectedCreditCard() {
    const { savedCreditCards } = this.props;
    const { data } = savedCreditCards || {};
    const { profile } = data || {};
    const { payment } = profile || {};
    return payment ? payment[this.state.selectedCreditCardIndex] : undefined;
  }

  /**
   * will set the state for CVV length based on creditcard prefilled value
   */
  getCvvLength() {
    if (ExecutionEnvironment.canUseDOM) {
      const { isEdited } = this.props;
      const creditcardEle = document.getElementById('creditcardField');
      if (isEdited && creditcardEle && creditcardEle.value) {
        const replacedVal = creditcardEle.value.replace(/[-\s]/g, '');
        if (replacedVal.length === AMEX_CARD_LENGTH) {
          this.setState({ validateCVVLength: CVV_AMEX_LENGTH });
        } else if (replacedVal.length === OTHER_CARDS_LENGTH) {
          this.setState({ validateCVVLength: CVV_OTHER_CARDS_LENGTH });
        }
      }
    }
  }

  /**
   * computes and returns the billing address based on two conditions:
   * 1. A billing address is recieved in OrderDetails API response.
   * 2. User supposedly has a saved crsedit card with a billing address.
   */
  getBillingAddress() {
    const { orderDetails, isLoggedIn, savedCreditCards } = this.props;
    let billingAddressObj = {};
    const areCreditCardsPresent = this.checkSavedCreditcardsList() > 0;
    const orderDetailsBillingAddr =
      orderDetails && orderDetails.addresses && orderDetails.addresses.billingAddress && Object.keys(orderDetails.addresses.billingAddress).length > 0
        ? orderDetails.addresses.billingAddress
        : {};
    if (isLoggedIn && areCreditCardsPresent && !this.state.newcardSelected) {
      if (Object.keys(orderDetailsBillingAddr).length > 0) {
        billingAddressObj = Object.assign({}, orderDetailsBillingAddr);
        return billingAddressObj;
      }
      // if user is logged in and there are more than one credit card available and new card is not selected
      const { billingAddress } = savedCreditCards.data.profile.payment[this.state.selectedCreditCardIndex];
      billingAddressObj = Object.assign({}, billingAddress);
      return billingAddressObj;
    }
    if (Object.keys(orderDetailsBillingAddr).length > 0) {
      // order details API contains billing address
      billingAddressObj = Object.assign({}, orderDetailsBillingAddr);
      return billingAddressObj;
    }
    return billingAddressObj;
  }

  /**
   *
   * @param {string} cardName provided by ourself for validation
   * @param {*} propValues list of creditcard urls
   */
  getCurrentImage(cardName, cardsAccepted) {
    let cardurl = '';
    if (cardsAccepted && cardsAccepted.length) {
      cardurl = cardsAccepted.filter(cardObj => (cardObj.label && cardObj.label.toLowerCase().indexOf(cardName) !== -1 ? cardObj.url : ''));
    }
    return cardurl && cardurl[0] ? cardurl[0].url : '';
  }
  /**
   *
   * @param {number} index will get the selected index value from saved creditcards dropdown
   */
  getSelectedOption(index) {
    const { savedCreditCards, analyticsContent } = this.props;
    const { addNewCreditCardLabel } = this.props.cms;
    let creditcardsDataList = [];
    if (savedCreditCards && savedCreditCards.data && savedCreditCards.data.profile && savedCreditCards.data.profile.payment) {
      creditcardsDataList = savedCreditCards.data.profile.payment.concat({ name: `${NEWCARD}`, title: addNewCreditCardLabel });
    }
    if (creditcardsDataList[index].name === `${NEWCARD}`) {
      this.setState({ selectedPaymentOption: CREDIT_CARD, isCreditcardFormVisible: true, newcardSelected: true });
      this.props.toggleBillingAddress(true);
      const analyticsData = {
        event: ANALYTICS_SUB_EVENT_IN,
        eventCategory: ANALYTICS_EVENT_CATEGORY,
        eventAction: analyticsEventActionPayment,
        eventLabel: 'add new card',
        customerleadlevel: null,
        customerleadtype: null,
        leadsubmitted: 0,
        newslettersignupcompleted: 0
      };
      analyticsContent(analyticsData);
    } else {
      this.setState({ isCreditcardFormVisible: false, selectedCreditCardIndex: index, newcardSelected: false }); // eslint-disable-line
      this.props.toggleBillingAddress(false);
      // When switching between the saved cards call the analytics
      this.logAnalyticsOnChangePayment();
    }
  }
  /**
   * helper function to return combined credit card data.
   */
  getCreditcardData(cd) {
    const cardType = cd.type;
    return {
      exp_date: cd.expiryDate,
      cardType: cardType.charAt(0).toUpperCase() + cardType.slice(1),
      lastFourCCDigit: this.getLastFourCCDDigits(cd.token),
      token: cd.token,
      cardHolderFirstName: cd.cardholderFirstName,
      cardHolderLastName: cd.cardholderLastName
    };
  }
  /**
   * utlity function to return last four digits of the credit card number.
   */
  getLastFourCCDDigits(creditCardNumber) {
    return creditCardNumber.substr(creditCardNumber.length - 4, creditCardNumber.length);
  }

  /**
   * helper function to return addressID from address saved in selected card.
   */
  getAddressId() {
    let addressId = '';
    const addressRecieved = this.getBillingAddress();
    if (addressRecieved) {
      addressId = addressRecieved.id ? addressRecieved.id : '';
    }
    return addressId;
  }

  /**
   * scrolls the component into view on component mount
   */
  scrollIntoView() {
    const el = this.paymentOptionsRef.current;
    if (el) {
      scrollIntoView(el);
    }
  }
  /** collates and pushes analytics data on load of payment drawer or on edit. */
  postAnalyticsDataOnLoad() {
    const { orderDetails, analyticsContent, landingDrawer } = this.props;
    const orderItemsShippingMethodColln = orderDetails.orderItems.map(item => item.availableShippingMethods[0]);
    const analyticsObject = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventActionPayment,
      eventLabel: analyticsEventLabelPayment,
      ecommerce: {
        checkout: {
          actionField: { step: 7, option: 'payment method' },
          products: collateAnalyticsData(orderDetails, orderDetails.shippingGroups)
        }
      },
      dimension85: typeOfOrder(orderItemsShippingMethodColln) || ''
    };
    analyticsObject['checkout steps'] = landingDrawer;
    analyticsContent(analyticsObject);
  }
  /**
   * collates and pushes analytics data on successfull click of review order.
   */
  postReviewOrderAnalyticsData(label) {
    const { analyticsContent } = this.props;
    const analyticsObject = {
      event: ANALYTICS_SUB_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventActionPayment,
      eventLabel: label,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };
    analyticsContent(analyticsObject);
  }
  /**
   * Available payment options
   * Disables google pay and apple pay on load and checks if required script or feature available before making it available
   * @param payOpts
   */
  availablePaymentMethods(payOpts) {
    return payOpts.map(option => {
      const { id, text } = option;
      const enabled = id.toLowerCase() === GOOGLE_PAY.toLowerCase() || id.toLowerCase() === APPLE_PAY.toLowerCase();
      return { id, text, enabled: !enabled };
    });
  }
  /**
   * setting the state to true to enable the form (if one saved creditcard is there and it is expired)
   */
  showtheFormForSingleExpiredCard() {
    this.setState({ isCreditcardFormVisible: true });
  }

  /**
   *
   * @param {object} data - creditcard form values
   * @param {*} Frame - paymentJS iframe id
   */
  tokenizeNewCreditCardFromData(data, Frame) {
    const { creditcardField, expiryField, cvvField } = data;
    const cardNumber = creditcardField.replace(/[-\s]/g, '');
    const expDate = expiryField.replace('/', '');
    if (Frame) {
      const receiver = document.getElementById(Frame).contentWindow; // PaymentJS requirement.
      const creditCardCredentials = { cc: cardNumber, exp_date: expDate, cvv: cvvField }; // consolidate credit card field values.
      // For following line, we have added NOSONAR to skip because we do not have alternate of postMessage and we have to have it.
      receiver.postMessage(creditCardCredentials, FIRSTDATA_DOMAIN); // NOSONAR
    }
  }
  /**
   * utility functions for checking presence of saved credit cards and performing subsequent operations.
   */
  checkIfAuthOrUnauthUserWithNoSavedCreditCards() {
    return (
      !this.props.isLoggedIn || (this.props.isLoggedIn && this.state.newcardSelected) || (this.props.isLoggedIn && !this.checkSavedCreditcardsList())
    );
  }
  /**
   * tokenizes/saves credentials for user if no saved cards are present.
   */
  ifNoSavedCreditCardsForUser(data, Frame) {
    const { orderDetails, formValues } = this.props;
    // execute gift card scenario if 'gcRemainingAmount' key is available and is zero otherwise execute paymentJS
    const giftcardRemainingAmt = get(orderDetails, 'totals.gcRemainingAmount', 1);
    if (Number(giftcardRemainingAmt) !== 0) {
      this.tokenizeNewCreditCardFromData(data, Frame);
    } else if (!formValues && Number(giftcardRemainingAmt) === 0) {
      const {
        orderDetails: { addresses }
      } = this.props;
      const billingAddress = this.getBillingAddress();
      this.saveCreditCardCredentials(
        Object.assign(
          {},
          {
            cardholderFirstName: `${addresses.shippingAddress.firstName}`,
            cardholderLastName: `${addresses.shippingAddress.lastName}`
          }
        ),
        () => this.handleChangeAddress(billingAddress)
      );
    } else {
      const {
        orderDetails: { addresses },
        changeBillingAddress,
        formValues: { sameAsShippingAddress }
      } = this.props;
      const billingAddress = this.getBillingAddress();
      this.saveCreditCardCredentials(
        Object.assign(
          {},
          {
            cardholderFirstName: `${sameAsShippingAddress ? addresses.shippingAddress.firstName : formValues.billingFirstName}`,
            cardholderLastName: `${sameAsShippingAddress ? addresses.shippingAddress.lastName : formValues.billingLastName}`
          }
        ),
        () => this.handleChangeAddress(changeBillingAddress ? this.props.formValues : billingAddress)
      );
    }
  }
  /**
   * changes structure of object to post billing address.
   */
  mapBillingAddress(address) {
    const result = {
      firstName: this.mapBillingAddressIfSameAsShippingAddress(address.cardholderFirstName),
      lastName: this.mapBillingAddressIfSameAsShippingAddress(address.cardholderLastName),
      address: this.mapBillingAddressIfSameAsShippingAddress(address.address),
      phoneNumber: this.mapBillingAddressIfSameAsShippingAddress(address.phoneNumber),
      zipCode: this.mapBillingAddressIfSameAsShippingAddress(address.zipCode),
      state: this.mapBillingAddressIfSameAsShippingAddress(address.state),
      city: this.mapBillingAddressIfSameAsShippingAddress(address.city),
      country: this.mapBillingAddressIfSameAsShippingAddress(COUNTRY),
      organizationName: address.organizationName ? address.organizationName : '',
      email: address.email ? address.email : this.props.formValues.email
    };
    return result;
  }
  /**
   * utility function to abstract conditional operator complexity from mapBillingAddress();
   */
  mapBillingAddressIfSameAsShippingAddress(valueToReturnIfFalse, valueToReturnIfTrue = '') {
    const { orderDetails, formValues } = this.props;
    const giftcardRemainingAmt = get(orderDetails, 'totals.gcRemainingAmount', 1);
    if (!formValues && Number(giftcardRemainingAmt) === 0) {
      return valueToReturnIfTrue;
    }
    const { sameAsShippingAddress } = formValues;
    return sameAsShippingAddress ? valueToReturnIfTrue : valueToReturnIfFalse;
  }

  /**
   * @param {object} data object recieved containing form values or address obtained from orderDetails.
   * handleChangeAddress takes care of flow when user clicks on change billing address CTA, if not it calls
   * postPaymentDetails with the orderID and address data obtained.
   */
  handleChangeAddress(data) {
    const { savedCreditCardCredentials } = this.state;
    const { sameAsShippingAddress } = data;
    const { changeBillingAddress } = this.props;
    if (changeBillingAddress) {
      // if billing address change link clicked, then change billing address in true.
      if (!sameAsShippingAddress) {
        // if same as shipping address is unchecked, we need to open address verification modal.
        this.setState({ modalIsOpen: true });
        this.props.fnvalidateAddress(data); // for validating address data.
      } else {
        // else same as shipping address is true, we need to post a few fields only.
        const cleanFormData = Object.assign({}, savedCreditCardCredentials);
        cleanFormData.sameAsShippingAddress = true;
        cleanFormData.email = data.email;
        cleanFormData.promotionCheckbox = data.promotionCheckbox;
        cleanFormData.savePaymentInfoCheckbox = data.savePaymentInfoCheckbox;
        this.props.fnHideLoader();
        this.postPaymentDetails(Object.assign({}, cleanFormData, savedCreditCardCredentials), this.props.orderDetails.orderId);
      }
    } else {
      this.props.fnHideLoader();
      this.postPaymentDetails(Object.assign({}, data, savedCreditCardCredentials), this.props.orderDetails.orderId);
    }
  }

  /** TODO:- Major refactoring required. This is done because keyNames are coming diff. from diff. APIs.
   * Consolidates and posts data accumulated to APIs.
   * @param {object} consolidatedData combined details to be sent to API.
   * @param {string} orderID for the specific order.
   */
  postPaymentDetails(consolidatedData, orderID) {
    // API call for posting payment details to be undertaken in this function.
    const { formValues, orderDetails, changeBillingAddress } = this.props;
    const sameAsShippingAddress = formValues && (formValues.sameAsShippingAddress ? formValues.sameAsShippingAddress : false);
    const formData = { orderId: orderID, paymentMethod: CREDIT_CARD };
    const giftcardRemainingAmt = get(orderDetails, 'totals.gcRemainingAmount', 1);
    if (changeBillingAddress && consolidatedData.billingAddress1 && consolidatedData.billingAddress) {
      this.postDetailsAfterAVSSelections(formData, consolidatedData, giftcardRemainingAmt);
    } else if (consolidatedData.billingAddress) {
      // for saved card consolidated data would have billing
      this.postDetailsForSavedCard(formData, consolidatedData, giftcardRemainingAmt);
    } else if (changeBillingAddress && Object.keys(formValues).length > 0 && !sameAsShippingAddress) {
      this.postDetailsForBillingForm(formData, consolidatedData, giftcardRemainingAmt);
    } else if (changeBillingAddress && Object.keys(formValues).length > 0 && sameAsShippingAddress) {
      this.postDetailsForBillingFormWithSameAsShippingAddress(formData, consolidatedData, giftcardRemainingAmt);
    } else {
      this.postDetailsForRemainingCases(formData, consolidatedData, giftcardRemainingAmt);
    }
  }
  /**
   * helper function for postPaymentDetails(), in case user pays from saved card.
   * @param {object} formDetails prefilled object comprising of form values.
   * @param {object} consolidatedData consolidated data from all sources applicable.
   * @param {string} giftcardRemainingAmt amount remaining from gift cards to be paid.
   */
  postDetailsForSavedCard(formDetails, consolidatedData, giftcardRemainingAmt) {
    const { billingAddress, isLoggedIn } = consolidatedData;
    const formData = formDetails;
    formData.addressId = consolidatedData.billingAddress.addressId;
    formData.editBillingAddressId = '';
    formData.paymentMethod = +giftcardRemainingAmt !== 0 ? CREDIT_CARD : '';
    formData.billingSameAsShippingAddress = consolidatedData.sameAsShippingAddress ? '1' : '0';
    formData.savePaymentInfo = isLoggedIn && consolidatedData.savePaymentInfoCheckbox ? '1' : '0';
    formData.promoEmailPreference = !consolidatedData.promotionCheckbox ? '0' : '1';
    formData.creditCard =
      +giftcardRemainingAmt !== 0
        ? {
            exp_date: consolidatedData.expiryDate,
            cardType: consolidatedData.type.charAt(0).toUpperCase() + consolidatedData.type.slice(1),
            lastFourCCDigit: this.getLastFourCCDDigits(consolidatedData.token),
            token: consolidatedData.token,
            cardHolderFirstName: consolidatedData.cardholderFirstName
              ? consolidatedData.cardholderFirstName
              : consolidatedData.billingAddress.firstName,
            cardHolderLastName: consolidatedData.cardholderLastName ? consolidatedData.cardholderLastName : consolidatedData.billingAddress.lastName
          }
        : null;
    formData.billingAddress = {
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      address: billingAddress.address,
      phoneNumber: billingAddress.phoneNumber,
      zipCode: billingAddress.zipCode,
      state: billingAddress.state,
      city: billingAddress.city,
      country: COUNTRY,
      organizationName: '',
      email: consolidatedData.email || ''
    };
    this.props.fnSubmitFormHandler(formData);
  }
  /**
   * helper function for postPaymentDetails(), in case a new form is filed by user.
   * @param {object} formDetails prefilled object comprising of form values.
   * @param {object} consolidatedData consolidated data from all sources applicable.
   * @param {string} giftcardRemainingAmt amount remaining from gift cards to be paid.
   */
  postDetailsForBillingForm(formDetails, consolidatedData, giftcardRemainingAmt) {
    const { formValues, fnSubmitFormHandler, isLoggedIn } = this.props;
    const formData = formDetails;
    formData.addressId = this.getAddressId();
    formData.editBillingAddressId = '';
    formData.paymentMethod = +giftcardRemainingAmt !== 0 ? CREDIT_CARD : '';
    formData.billingSameAsShippingAddress = '0';
    formData.creditCard = +giftcardRemainingAmt !== 0 ? this.getCreditcardData(consolidatedData) : null;
    formData.savePaymentInfo = isLoggedIn && consolidatedData.savePaymentInfoCheckbox ? '1' : '0';
    formData.promoEmailPreference = !consolidatedData.promotionCheckbox ? '0' : '1';
    formData.billingAddress = {
      firstName: formValues.billingFirstName,
      lastName: formValues.billingLastName,
      address: consolidatedData.billingAddress1 || formValues.billingAddress1,
      phoneNumber: formValues.billingPhoneNumber,
      zipCode: consolidatedData.billingZipCode || formValues.billingZipCode,
      state: consolidatedData.billingState || formValues.billingState,
      city: consolidatedData.billingState || formValues.billingCity,
      country: COUNTRY,
      organizationName: formValues.billingCompany || '',
      email: formValues.email
    };
    fnSubmitFormHandler(formData);
  }
  /**
   * helper function for postPaymentDetails(), in case a new form is filed by user with same as shipping address.
   * @param {object} formDetails prefilled object comprising of form values.
   * @param {object} consolidatedData consolidated data from all sources applicable.
   * @param {string} giftcardRemainingAmt amount remaining from gift cards to be paid.
   */
  postDetailsForBillingFormWithSameAsShippingAddress(formDetails, consolidatedData, giftcardRemainingAmt) {
    const { formValues, fnSubmitFormHandler, orderDetails, isLoggedIn } = this.props;
    const formData = formDetails;
    const { firstName, lastName } = orderDetails.addresses.shippingAddress;
    formData.addressId = '';
    formData.editBillingAddressId = '';
    formData.paymentMethod = +giftcardRemainingAmt !== 0 ? CREDIT_CARD : '';
    formData.billingSameAsShippingAddress = '1';
    formData.savePaymentInfo = isLoggedIn && consolidatedData.savePaymentInfoCheckbox ? '1' : '0';
    formData.promoEmailPreference = !consolidatedData.promotionCheckbox ? '0' : '1';
    formData.creditCard =
      +giftcardRemainingAmt !== 0
        ? Object.assign({}, this.getCreditcardData(consolidatedData), { cardHolderFirstName: firstName, cardHolderLastName: lastName })
        : null;
    formData.billingAddress = {
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      zipCode: '',
      state: '',
      city: '',
      country: '',
      organizationName: '',
      email: formValues.email
    };
    fnSubmitFormHandler(formData);
  }
  /**
   * helper function for postPaymentDetails(), for remaining cases.
   * @param {object} formDetails prefilled object comprising of form values.
   * @param {object} consolidatedData consolidated data from all sources applicable.
   * @param {string} giftcardRemainingAmt amount remaining from gift cards to be paid.
   */
  postDetailsForRemainingCases(formDetails, consolidatedData, giftcardRemainingAmt) {
    const { formValues, fnSubmitFormHandler, isLoggedIn } = this.props;
    const sameAsShippingAddress = formValues && (formValues.sameAsShippingAddress ? formValues.sameAsShippingAddress : false);
    const formData = formDetails;
    formData.addressId = sameAsShippingAddress ? '' : this.getAddressId();
    formData.editBillingAddressId = '';
    formData.paymentMethod = +giftcardRemainingAmt !== 0 ? CREDIT_CARD : '';
    formData.billingSameAsShippingAddress = sameAsShippingAddress ? '1' : '0';
    formData.creditCard = +giftcardRemainingAmt !== 0 ? this.getCreditcardData(consolidatedData) : null;
    formData.billingAddress = this.mapBillingAddress(consolidatedData);
    formData.savePaymentInfo = isLoggedIn && consolidatedData.savePaymentInfoCheckbox ? '1' : '0';
    formData.promoEmailPreference = !consolidatedData.promotionCheckbox ? '0' : '1';
    fnSubmitFormHandler(formData);
  }
  /**
   * helper function for postPaymentDetails(), in case a new form is filed by user and AVS comes up.
   * @param {object} formDetails prefilled object comprising of form values.
   * @param {object} consolidatedData consolidated data from all sources applicable.
   * @param {string} giftcardRemainingAmt amount remaining from gift cards to be paid.
   */
  postDetailsAfterAVSSelections(formDetails, consolidatedData, giftcardRemainingAmt) {
    const { fnSubmitFormHandler, isLoggedIn } = this.props;
    const { billingAddress, billingAddress1 } = consolidatedData;
    const formData = formDetails;
    formData.addressId = billingAddress && billingAddress.addressId ? billingAddress.addressId : '';
    formData.editBillingAddressId = '';
    formData.paymentMethod = +giftcardRemainingAmt !== 0 ? CREDIT_CARD : '';
    formData.email = !consolidatedData.email ? consolidatedData.email : '';
    formData.billingSameAsShippingAddress = !consolidatedData.sameAsShippingAddress ? '0' : '1';
    formData.savePaymentInfo = isLoggedIn && consolidatedData.savePaymentInfoCheckbox ? '1' : '0';
    formData.promoEmailPreference = !consolidatedData.promotionCheckbox ? '0' : '1';
    formData.creditCard =
      +giftcardRemainingAmt !== 0
        ? {
            exp_date: consolidatedData.expiryDate,
            cardType: consolidatedData.type.charAt(0).toUpperCase() + consolidatedData.type.slice(1),
            lastFourCCDigit: this.getLastFourCCDDigits(consolidatedData.token),
            token: consolidatedData.token,
            cardHolderFirstName: consolidatedData.cardholderFirstName,
            cardHolderLastName: consolidatedData.cardholderLastName
          }
        : null;
    formData.billingAddress = {
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      address: billingAddress1,
      phoneNumber: billingAddress.phoneNumber,
      zipCode: consolidatedData.billingZipCode,
      state: consolidatedData.billingState,
      city: consolidatedData.billingCity,
      country: COUNTRY,
      organizationName: '',
      email: billingAddress.email
    };
    fnSubmitFormHandler(formData);
  }
  /**
   * @param {object} data object recieved from either PaymentJS or saved credit card details.
   * @param {func} callback function to be executed once the state is set.
   */
  saveCreditCardCredentials(data, callback) {
    if (data.status) {
      const { orderDetails, formValues } = this.props;
      if (formValues.billingFirstName && formValues.billingLastName) {
        const { billingFirstName, billingLastName, billingPhoneNumber, billingZipCode, billingState, billingCity } = formValues;
        this.setState(
          {
            savedCreditCardCredentials: {
              correlationId: data.results.correlation_id,
              expiryDate: data.results.token.exp_date,
              token: data.results.token.value,
              type: data.results.token.type,
              cardholderFirstName: billingFirstName,
              cardholderLastName: billingLastName,
              phoneNumber: billingPhoneNumber,
              zipCode: billingZipCode,
              state: billingState,
              city: billingCity
            }
          },
          callback
        );
      } else if (
        orderDetails &&
        orderDetails.addresses &&
        orderDetails.addresses.billingAddress &&
        Object.keys(orderDetails.addresses.billingAddress).length > 0
      ) {
        const { billingAddress } = orderDetails.addresses;
        this.setState(
          {
            savedCreditCardCredentials: {
              correlationId: data.results.correlation_id,
              expiryDate: data.results.token.exp_date,
              token: data.results.token.value,
              type: data.results.token.type,
              cardholderFirstName: billingAddress.firstName,
              cardholderLastName: billingAddress.lastName,
              phoneNumber: billingAddress.phoneNumber,
              zipCode: billingAddress.zipCode,
              state: billingAddress.state,
              city: billingAddress.city
            }
          },
          callback
        );
      } else {
        this.setState(
          {
            savedCreditCardCredentials: {
              correlationId: data.results.correlation_id,
              expiryDate: data.results.token.exp_date,
              token: data.results.token.value,
              type: data.results.token.type,
              cardholderFirstName: data.cardholderFirstName,
              cardholderLastName: data.cardholderLastName
            }
          },
          callback
        );
      }
    } else {
      this.setState({ savedCreditCardCredentials: data }, callback);
    }
  }

  /**
   * sets value of changeBillingAddress state when form loads.
   */
  InitialChangeBillingAddressValue() {
    const { orderDetails } = this.props;
    const savedCards = this.checkSavedCreditcardsList();
    if (
      (orderDetails &&
        orderDetails.addresses &&
        orderDetails.addresses.billingAddress &&
        Object.keys(orderDetails.addresses.billingAddress).length > 0) ||
      savedCards
    ) {
      this.props.toggleBillingAddress(false);
    } else {
      this.props.toggleBillingAddress(true);
    }
  }
  /**
   * maps values from FormValues to credit card fields.
   */
  formValuesToCreditCardFieldsMapping(formValues, creditCardCredentials) {
    const details = Object.assign({}, creditCardCredentials, {
      billingAddress: {
        addressId: creditCardCredentials.billingAddress.addressId,
        address: formValues.billingAddress1,
        organizationName: formValues.billingCompany,
        lastName: formValues.billingLastName,
        zipCode: formValues.billingZipCode,
        state: formValues.billingState,
        firstName: formValues.billingFirstName,
        email: formValues.email,
        phoneNumber: formValues.billingPhoneNumber,
        city: formValues.billingCity
      }
    });
    return details;
  }
  /**
   * helper function to find if saved credit cards exist.
   */
  checkSavedCreditcardsList() {
    const { savedCreditCards } = this.props;
    return (
      savedCreditCards &&
      savedCreditCards.data &&
      savedCreditCards.data.profile &&
      savedCreditCards.data.profile.payment &&
      savedCreditCards.data.profile.payment.length > 0
    );
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.fnInvalidateAddress();
  }
  /**
   * Call analytics on change of payment methods
   */
  logAnalyticsOnChangePayment() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: ANALYTICS_SUB_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventActionPayment,
      eventLabel: 'change payment method',
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };
    analyticsContent(analyticsData);
  }
  /**
   *
   * showPaymentOption will set the state based on payment selection and shows the fields based on the selected payment.
   * @param {string} paymentOption selected payment option to show the section
   */
  showPaymentOption(paymentOption) {
    const { formValues } = this.props;
    // verifying if the credit card form values are entered or not and setting the value. We are doing this for "card is not valid" error scenario when switching between creditcard and other payment options.
    const validateCardDetails = (formValues && (!formValues.creditcardField && !formValues.expiryField && !formValues.cvvField)) || false;
    this.setState({ selectedPaymentOption: paymentOption, isValidCreditCard: validateCardDetails });
    // call analytics on change of payment option
    this.logAnalyticsOnChangePayment();
  }
  /**
   * posts paypal data recieved.
   * @param {object} data
   */
  postPayPalData(data) {
    const requestObject = getRequestObject(data, this.props.orderDetails);
    this.props.authorisePayPalPayment(requestObject, this.props.orderDetails.orderId);
  }
  /**
   * dispatches action for paypal error. to be handled.
   */
  payPalError() {
    this.props.payPalPaymentFailed();
  }

  /**
   * Resets single/multiple form fields by taking the form name and fields object
   * @param formName
   * @param fieldsObj
   */
  resetFields(formName, fieldsObj) {
    Object.keys(fieldsObj).forEach(fieldKey => {
      // reset the field's value
      this.props.changeFieldValue(formName, fieldKey, fieldsObj[fieldKey]);
      // reset the field's error
      this.props.unTouchField(formName, fieldKey);
    });
  }

  /**
   * enable google pay if script is loaded and PaymentRequest API is available in the browser
   * enable apple pay if browser supports
   */
  enablePaymentOptions() {
    return this.paymentOptions.map(payOpt => {
      if (payOpt.id.toLowerCase() === GOOGLE_PAY.toLowerCase() && window.PaymentRequest && this.state.gpayLoaded) {
        const { ...rest } = payOpt;
        return { enabled: true, ...rest };
      }
      if (payOpt.id.toLowerCase() === APPLE_PAY.toLowerCase() && ApplePay.isApplePayAvailable()) {
        const { ...rest } = payOpt;
        return { enabled: true, ...rest };
      }
      return payOpt;
    });
  }
  /**
   * Method to push server side error data to GTM layer.
   */
  pushServerSideErrorsToGTMLayer(errorLabel = '') {
    this.props.analyticsContent({
      event: analyticsErrorEvent,
      eventCategory: analyticsErrorEventCategory,
      eventAction: analyticsErrorCCEventAction,
      eventLabel: errorLabel
    });
  }
  /**
   * render credit card form
   * @param cms
   * @returns {*}
   */
  renderCreditcard(cms) {
    return (
      <div>
        <CreditcardDetails
          cms={cms}
          cvvLabel={cms.cvvLabel}
          resetFields={this.resetFields}
          validateCVVLength={this.state.validateCVVLength}
          creditCardNumberLabel={cms.creditCardNumberLabel}
          cvvHintText={cms.cvvHintText}
          expirationDateLabel={cms.expirationDateLabel}
          cardsAccepted={cms.commonLabels.cardsAccepted}
          onEditHandler={this.onChangeCreditCardFieldHandler}
          showValidCard={this.state.showValidCard}
          creditCardSrc={this.state.creditCardSrc}
        />
        {this.state.isValidCreditCard === false && (
          <p className="invalidTxt body-12-regular mt-20">
            <span>Invalid card details!</span>
          </p>
        )}
      </div>
    );
  }
  /**
   * renders view when paypal radio button is selected.
   */
  renderPayPal(isPaypal = false) {
    const { cms, orderDetails, storeAddress, analyticsContent } = this.props;
    const { totals, checkoutStates } = orderDetails;
    const shippingAddress =
      orderDetails && orderDetails.addresses.shippingAddress && Object.keys(orderDetails.addresses.shippingAddress).length > 0
        ? orderDetails.addresses.shippingAddress
        : {};
    const refinedAddress = getShippingAddress(shippingAddress, storeAddress, has(checkoutStates, 'pickupDrawerRequired'));
    const orderItems = getOrderItems(orderDetails.orderItems, totals);
    return (
      <div className={`row m-0 ${styles.headingBox} pt-1 ${isPaypal ? '' : 'd-none'}`}>
        <div className="col-12 col-lg-7 body-14-regular pl-0 pt-half">{cms.checkoutWithPaypalText}</div>
        <div className="col-12 col-lg-5 pr-0 pt-1">
          {this.state.payPalLoaded ? (
            <PaypalButton
              currency={orderDetails.totals.orderCurrency}
              shippingAddress={refinedAddress}
              inlineItems={orderItems}
              orderId={orderDetails.orderID}
              onPaymentComplete={this.postPayPalData}
              onPaymentFail={this.payPalError}
              grandTotal={totals.orderGrandTotal}
              details={getInlinePriceDetails(totals)}
              totalProductPrice={totals.totalProductPrice}
              totalSalesTax={totals.totalSalesTax}
              totalShippingCharge={totals.totalShippingCharge}
              analyticsContent={analyticsContent}
            />
          ) : (
            <div className="body-14-bold">{cms.unableRedirectToPaypal}</div>
          )}
        </div>
      </div>
    );
  }

  renderApplePay() {
    const { totals } = this.props.orderDetails;
    return (
      <div className="d-flex flex-md-row-reverse mt-2">
        <ApplePay
          supportsVersion={3}
          merchantIdentifier={APPLE_PAY_MERCHANT_IDENTIFIER}
          orderDetails={getApplePayRequestPayload(totals)}
          successCallback={applePaymentSuccessCallback}
          errorCallback={applePaymentErrorCallaback}
        />
      </div>
    );
  }
  /**
   * renders credit card values in dropdown.
   */
  rendercreditcardVals(cards) {
    const { addNewCreditCardLabel, commonLabels } = this.props.cms;
    const cardsArr = cards;
    // Findind the defaultFlag "true" to show it in the first position in saved credit card dropdown.
    const defaultCardIndex = Array.isArray(cardsArr) && cardsArr.findIndex(card => card.defaultFlag === true);
    if (defaultCardIndex !== -1 && cardsArr[0] && !cardsArr[0].expired) {
      const getDefaultCard = cardsArr.splice(defaultCardIndex, 1); // If it finds the index then removing the object from the array.
      cardsArr.unshift(...getDefaultCard); // Pushing the removed object in the first position in the array.
    } else if (defaultCardIndex !== -1 && cardsArr[0] && cardsArr[0].expired) {
      // If credit card is expired and it is default we are putting that into next item in the options
      let firstCardItem;
      let secondCardItem;
      if (cardsArr.length >= 2) {
        [firstCardItem, secondCardItem] = cardsArr;
        cardsArr[0] = secondCardItem;
        cardsArr[1] = firstCardItem;
      }
    }

    const filterVals =
      Array.isArray(cardsArr) &&
      cardsArr.map(card => {
        const cardNum = card.creditCardNumber;
        const cardType = card.type.charAt(0).toUpperCase() + card.type.slice(1); // Payment js is returning few cards type in lowercase. We have to show the card type first character in Uppercase in dropdown.
        const lastdigits = cardNum.substr(cardNum.length - 4);
        const { expired } = card;
        const validateExpiry = expired ? ` - ${EXPIRED}` : '';
        const cardDisplayStr = `${cardType} ${commonLabels.cardEndingInLabel} - ${lastdigits} ${validateExpiry}`;
        return { title: cardDisplayStr, name: cardType, disabled: expired };
      });

    if (cardsArr.length < 2) {
      if (cardsArr[0].expired) {
        filterVals.unshift({ name: `${NEWCARD}`, title: addNewCreditCardLabel, disabled: false }); // if expired we are keeping Add a new card in a first position in the dropdown
        return filterVals;
      }
    }
    return Array.isArray(filterVals) && filterVals.concat({ name: `${NEWCARD}`, title: addNewCreditCardLabel, disabled: false });
  }

  /**
   * renders all the payment options available.
   * @param {object} cms
   * @param {object} savedCreditcardsDataList
   * @param {object} paymentTypes
   */
  renderPaymentOptions(cms, savedCreditcardsDataList, paymentTypes) {
    const { orderDetails, messages = {} } = this.props;
    const { checkoutStates } = orderDetails;
    return (
      <div>
        <div className="body-14-regular text-uppercase mb-1 mb-lg-2">{cms.paymentMethod}</div>
        {checkoutStates &&
          !checkoutStates.hasSOFItems &&
          orderDetails.totals.gcRemainingAmount &&
          Number(orderDetails.totals.gcRemainingAmount) !== 0 && (
            <div className="selectPayment mb-1">
              <fieldset>
                <legend>{paymentTypes}</legend>
              </fieldset>
            </div>
          )}
        {this.props.isLoggedIn &&
          this.checkSavedCreditcardsList() &&
          this.state.selectedPaymentOption.toLowerCase() === CREDIT_CARD.toLowerCase() &&
          orderDetails.totals.gcRemainingAmount &&
          Number(orderDetails.totals.gcRemainingAmount) !== 0 &&
          this.renderDropdown(cms, savedCreditcardsDataList)}
        {(!this.props.isLoggedIn ||
          (this.props.isLoggedIn && !this.checkSavedCreditcardsList()) ||
          (this.props.isLoggedIn && this.state.isCreditcardFormVisible)) &&
          (this.state.selectedPaymentOption.toLowerCase() === CREDIT_CARD.toLowerCase() &&
            orderDetails.totals.gcRemainingAmount &&
            Number(orderDetails.totals.gcRemainingAmount) !== 0) &&
          this.renderCreditcard(cms)}
        <div />
        {this.renderPayPal(this.state.selectedPaymentOption.toLowerCase() === PAYPAL.toLowerCase())}
        {this.state.selectedPaymentOption.toLowerCase() === GOOGLE_PAY.toLowerCase() && <GooglePay {...this.props} />}
        {this.state.selectedPaymentOption.toLowerCase() === APPLE_PAY.toLowerCase() && this.renderApplePay()}
        {this.state.selectedPaymentOption.toLowerCase() === CREDIT_CARD.toLowerCase() && (messages.isGiftCardEnabled !== 'false') && (
          <GiftCardOptions {...this.props} analyticsContent={this.props.analyticsContent} />
        )}
      </div>
    );
  }

  renderDropdown(cms, creditcardsList) {
    return (
      <div className="creditcardDetails">
        <div className="form-group mb-2 col-12 p-0 col-md-12 col-lg-6">
          <div className="label relativePos">
            <span className="body-14-bold">{cms.chooseCardLabel}</span>
            <Dropdown
              DropdownOptions={creditcardsList}
              initiallySelectedOption={0}
              disabled={false}
              width="100%"
              height="2.5rem"
              borderColor="#cccccc"
              borderWidth="1px"
              borderRadius="4px"
              listBorderRadius="5px"
              onSelectOption={index => {
                this.getSelectedOption(index);
              }}
            />
            <span className="creditcarsBg" />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      cms,
      savedCreditCards,
      validateBillingAddress,
      orderDetails,
      changeBillingAddress,
      paymentData,
      required,
      analyticsContent,
      messages = {}
    } = this.props;
    const {
      errorMsg: { creditCardPaymentFailure }
    } = cms;
    const { checkoutStates } = orderDetails;
    const savedCreditCardsPresent = this.checkSavedCreditcardsList();
    const { selectedPaymentOption } = this.state;
    const shippingAddressRequired =
      checkoutStates && Object.keys(checkoutStates).filter(checkoutState => checkoutState === 'shippingAddressRequired').length > 0;
    // const paymentOptions = [{ label: CREDIT_CARD, text: 'Credit Card' }, { label: PAYPAL, text: PAYPAL }];
    let savedCreditcardsDataList;
    const savedCcList = get(savedCreditCards, 'data.profile.payment', null);
    if (savedCcList && savedCcList.length && savedCcList.length > 0) {
      savedCreditcardsDataList = this.rendercreditcardVals(savedCcList);
    }
    this.paymentOptions = this.enablePaymentOptions();
    const giftcardAddedChk = orderDetails.giftCardDetails.length ? 'disabled' : '';
    const paymentTypes = this.paymentOptions.map(
      paymentMethod =>
        paymentMethod.id.toLowerCase() === PAYPAL.toLowerCase() && messages.isPayPalEnabled === 'false' ? (
          <Fragment />
        ) : (
          paymentMethod.enabled && (
            <Fragment>
              <span className={`${styles.radioFocus} d-block d-lg-inline`}>
                <RadioButton
                  key={paymentMethod.id}
                  data-auid={`checkout_payment_options_radio_button_${paymentMethod.text}`}
                  onChange={this.showPaymentOption}
                  initialState={(this.state.selectedPaymentOption || '').toLowerCase()}
                  id={paymentMethod.id}
                  value={(paymentMethod.id || '').toLowerCase()}
                  radioName="paymentOption"
                  disabled={paymentMethod.id.toLowerCase() !== CREDIT_CARD.toLowerCase() ? giftcardAddedChk : ''}
                >
                  <span className="body-14-regular pl-2">{paymentMethod.text}</span>
                </RadioButton>
              </span>
            </Fragment>
          )
        )
    );
    return (
      <section ref={this.paymentOptionsRef} id="checkout-payment-drawer">
        {paymentData &&
          paymentData.error === true &&
          paymentData.data && (
            <div className="mb-1">
              <GenericError
                auid="checkout_creditcard_payment_error_details"
                cmsErrorLabels={cms.errorMsg}
                apiErrorList={paymentData.data.errors}
                errorTracking={() => this.pushServerSideErrorsToGTMLayer(cms.errorMsg[paymentData.data.errors[0]])}
              />
            </div>
          )}
        {this.state.creditCardPaymentError && (
          <div className="mb-1">
            <AlertComponent
              auid="paymentjs-error"
              message={creditCardPaymentFailure}
              errorTracking={() => this.pushServerSideErrorsToGTMLayer(creditCardPaymentFailure)}
            />
          </div>
        )}
        <div className={styles.paymentContainer}>
          {this.renderPaymentOptions(cms, savedCreditcardsDataList, paymentTypes)}
          {selectedPaymentOption.toLowerCase() === CREDIT_CARD.toLowerCase() && (
            <React.Fragment>
              <hr className={`${styles.hr} my-1 my-md-2`} />
              <BillingInfoForm
                {...this.props}
                selectedPaymentOption={selectedPaymentOption.toLowerCase()}
                modalIsOpen={this.state.modalIsOpen}
                closeModal={this.closeModal}
                onSubmitSuggestHandler={this.onSubmitSuggestHandler}
                validateBillingAddress={validateBillingAddress}
                billingAddress={this.getBillingAddress()}
                onChangeBillingAddress={this.onChangeBillingAddress}
                changeBillingAddress={changeBillingAddress}
                savePaymentInfoForLater={this.props.isLoggedIn && (this.state.newcardSelected || !savedCreditCardsPresent)}
                shippingAddressRequired={shippingAddressRequired}
                billingFormState={this.state.showBillingForm}
                analyticsContent={analyticsContent}
              />
              <FormSubmitButton
                enableSubmit={this.state.isPaymentJsReady}
                formButtonTextStatus={required}
                cms={cms}
                onSubmitForm={this.onSubmitFormHandler}
              />
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  formValues: getFormValues(FORM_NAME)(state),
  storeAddress: state.checkout.storeAddress
});
const mapDispatchToProps = dispatch => ({
  fnloadSavedCreditcards: profileId => dispatch(fetchSavedCards(profileId)),
  fnSubmitFormHandler: (data, orderId) => dispatch(postpaymentData(data, orderId)),
  fngiftCardApplyRequest: data => dispatch(giftCardApplyRequest(data)),
  fngiftCardRemoveRequest: data => dispatch(giftCardRemoveRequest(data)),
  fngiftCardFetchRequest: data => dispatch(giftCardFetchRequest(data)),
  fnClearGiftCardErrors: () => dispatch(clearGiftCardErrors()),
  fnvalidateAddress: data => dispatch(validateAddress(data)),
  fnInvalidateAddress: () => dispatch(inValidateAddressVerification()),
  fnShowLoader: () => dispatch(showLoader()),
  fnHideLoader: () => dispatch(hideLoader()),
  authorisePayPalPayment: (data, orderId) => dispatch(postPayPalData(data, orderId)),
  payPalPaymentFailed: () => dispatch(postPayPalError()),
  toggleBillingAddress: flag => dispatch(toggleBillingAddress(flag)),
  changeFieldValue: (formName, fieldKey, value) => dispatch(changeFieldValue(formName, fieldKey, value)),
  unTouchField: (formName, fieldKey) => dispatch(untouch(formName, fieldKey))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
CheckoutPaymentOptions.propTypes = {
  cms: PropTypes.object.isRequired,
  order: PropTypes.object,
  savedCreditCards: PropTypes.object.isRequired,
  fnloadSavedCreditcards: PropTypes.func,
  fnSubmitFormHandler: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  formValues: PropTypes.object,
  fnsaveBillingAddress: PropTypes.func,
  orderDetails: PropTypes.object.isRequired,
  fnvalidateAddress: PropTypes.func,
  fnInvalidateAddress: PropTypes.func,
  validateBillingAddress: PropTypes.object,
  fnHideLoader: PropTypes.func,
  fnShowLoader: PropTypes.func,
  shippingAddressRequired: PropTypes.bool,
  fnPostPayPalData: PropTypes.func,
  authorisePayPalPayment: PropTypes.func,
  payPalPaymentFailed: PropTypes.func,
  changeBillingAddress: PropTypes.bool,
  toggleBillingAddress: PropTypes.func,
  paymentData: PropTypes.object,
  required: PropTypes.any,
  analyticsContent: PropTypes.func,
  storeAddress: PropTypes.object,
  landingDrawer: PropTypes.string,
  messages: PropTypes.object
};
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer: combineReducers({ key: () => 'value' }) });
    const formReducer = injectReducer({ key: 'form', reducer: form });
    const CheckoutPaymentOptionsContainer = compose(
      withReducer,
      formReducer,
      withConnect
    )(CheckoutPaymentOptions);
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CheckoutPaymentOptionsContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}
export default withConnect(CheckoutPaymentOptions);
