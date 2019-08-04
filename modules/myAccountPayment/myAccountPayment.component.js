/* global PaymentJS */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  FIRSTDATA_PAYMENTJS,
  FIRSTDATA_API_KEY,
  FIRSTDATA_JS_SECURITY_TOKEN,
  FIRSTDATA_TA_TOKEN,
  FIRSTDATA_FD_TOKEN,
  FIRSTDATA_DOMAIN
} from '@academysports/aso-env';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  PAYMENT_SUCCESS_STATUS,
  ANALYTICS_EVENT_IN,
  ANALYTICS_EVENT_CATEGORY,
  analyticsEventLabel,
  analyticsEventAction,
  addGiftCardAnalyticsEventLabel,
  removeGiftCardAnalyticsEventLabel,
  addGiftCardAnalyticsEventAction,
  removeGiftCardAnalyticsEventAction
} from './constants';
import CreditCardDisplay from './creditCardDisplay';
import GiftCardDisplay from './giftCardDisplay';
import { eraseCityStateData } from '../../apps/myaccount/store/actions/fetchCityState';
import AddressSuggestions from './avsAddressSuggModal';
import withScroll from '../../hoc/withScroll';
import { myAccountClicksAnalyticsData } from '../../utils/analyticsUtils';

// variable to store the credit card credebtials detail. This value is used in two functions to store data.
let creditCardCredentials = {};
class MyAccountPayment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      creditCardData: {},
      modalIsOpen: false,
      tokenizeError: ''
    };
    this.onLoadPaymentJs = this.onLoadPaymentJs.bind(this);
    this.onGenerateToken = this.onGenerateToken.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onSetDefaultCreditCardClick = this.onSetDefaultCreditCardClick.bind(this);
    this.conditionModal = this.conditionModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmitSuggestHandler = this.onSubmitSuggestHandler.bind(this);
  }
  /**
   * get api calls for credit card and gift card if user is authenticated,
   * otherwise redirect the user to login page
   */
  componentDidMount() {
    const {
      profileID,
      redirectLogin,
      fngetcreditCards,
      fngetGiftCards,
      breadCrumbAction,
      cms,
      scrollPageToTop,
      fnshowloader,
      analyticsContent
    } = this.props;
    breadCrumbAction(cms.paymentsLabel);
    if (profileID === null) {
      fnshowloader();
      redirectLogin();
    } else {
      fngetcreditCards(profileID);
      fngetGiftCards(profileID);
      // append paymentJS script file
      this.onLoadPaymentJs();
    }
    scrollPageToTop();
    myAccountClicksAnalyticsData(cms.paymentsLabel, analyticsContent);
  }

  componentWillReceiveProps(nextProps) {
    const {
      userCreditCards: { data },
      userGiftCards,
      analyticsContent
    } = this.props;
    const payment = data && data.profile && data.profile.payment;

    const newCreditCardList =
      nextProps.userCreditCards &&
      nextProps.userCreditCards.data &&
      nextProps.userCreditCards.data.profile &&
      nextProps.userCreditCards.data.profile.payment;

    const giftCardPayment = userGiftCards && userGiftCards.data;
    const newGiftCardList = nextProps.userGiftCards && nextProps.userGiftCards.data;

    if (newCreditCardList && payment && newCreditCardList.length > payment.length) {
      // new card has been addded.
      this.addCardPostAnalyticsData();
    } else if (newCreditCardList && payment && newCreditCardList.length < payment.length) {
      // a card has been removed.
      this.removeCardPostAnalyticsData();
    }
    if (giftCardPayment && newGiftCardList && newGiftCardList.length > giftCardPayment.length) {
      const analyticsData = {
        event: ANALYTICS_EVENT_IN,
        eventCategory: ANALYTICS_EVENT_CATEGORY,
        eventAction: addGiftCardAnalyticsEventAction,
        eventLabel: addGiftCardAnalyticsEventLabel
      };
      analyticsContent(analyticsData);
    }
    if (giftCardPayment && newGiftCardList && newGiftCardList.length < giftCardPayment.length) {
      const analyticsData = {
        event: ANALYTICS_EVENT_IN,
        eventCategory: ANALYTICS_EVENT_CATEGORY,
        eventAction: removeGiftCardAnalyticsEventAction,
        eventLabel: removeGiftCardAnalyticsEventLabel
      };
      analyticsContent(analyticsData);
    }
  }
  /**
   * @param {object} event called while generating payment token for a new credit card.
   */
  onGenerateToken(event) {
    const tokenResponse = JSON.parse(event.data);
    if (tokenResponse.status === PAYMENT_SUCCESS_STATUS) {
      // save credit card credentials from PaymentJS to for further use.
      // correlation_id is from paymentJS response which is not in camel case, which gives eslint error
      const { correlation_id } = tokenResponse.results; // eslint-disable-line
      const { value, type, exp_date } = tokenResponse.results.token; // eslint-disable-line
      const dataToAPI = {};
      dataToAPI.correlationId = correlation_id; // eslint-disable-line
      dataToAPI.expiryDate = exp_date; // eslint-disable-line
      dataToAPI.token = value;
      dataToAPI.type = type;
      const { address, companyName, city, phoneNumber, state, zipCode, firstName, lastName } = this.state.creditCardData.data;
      const billingAddress = {};
      const addressLine = [];
      addressLine.push(address);
      if (companyName !== undefined) {
        addressLine.push(companyName);
      } else {
        addressLine.push('');
      }
      billingAddress.addressLine = addressLine;
      dataToAPI.creditCardHolderName = firstName.concat(' ').concat(lastName);
      billingAddress.city = city;
      billingAddress.phoneNumber = phoneNumber;
      billingAddress.state = state;
      billingAddress.zipCode = zipCode;
      billingAddress.email = this.props.email;
      billingAddress.firstName = firstName;
      billingAddress.lastName = lastName;
      if (!this.state.creditCardData.editCreditCard) {
        dataToAPI.billingAddress = billingAddress;
        const creditNum = this.state.creditCardData.data.creditcardField.replace(/ /g, '').replace(/-/g, '');
        dataToAPI.creditCardNumber = creditNum.substr(creditNum.length - 4);
        this.props.fnaddCreditCard(this.props.profileID, dataToAPI);
      }
      this.setState({ tokenizeError: '' });
    } else {
      this.setState({ tokenizeError: tokenResponse.results.Error.messages[0].description });
      eraseCityStateData();
    }
    this.setState({ creditCardData: {} });
  }
  /**
   * Loading PaymentJs on component load
   */
  onLoadPaymentJs() {
    const script = document.createElement('script');
    script.src = `${FIRSTDATA_PAYMENTJS}`;
    script.async = true;
    script.onload = () => {
      const fdc = new PaymentJS(`${FIRSTDATA_API_KEY}`, `${FIRSTDATA_JS_SECURITY_TOKEN}`, `${FIRSTDATA_TA_TOKEN}`, `${FIRSTDATA_FD_TOKEN}`);
      fdc.dsg();
      window.addEventListener('message', this.onGenerateToken, false);
    };
    document.body.appendChild(script);
  }
  /**
   * FUNCTION sets the user credit card as default when default button is clicked
   * @param {string} profileID
   * @param {Object} deleteItem
   */
  onSetDefaultCreditCardClick(profileID, deleteItem) {
    const dataToAPI = {};
    dataToAPI.xWalletId = deleteItem.xWalletId;
    dataToAPI.defaultFlag = true;
    const makePrimary = true;
    this.props.fnEditCreditCard(this.props.profileID, deleteItem.xWalletId, dataToAPI, makePrimary);
  }
  /**
   * This function checks whether user wants to add or update credit card
   * and stores data accordingly
   * @param {Object} data - credit card and address form data
   * @param {boolean} editCreditCard - identifier for edit credit card
   * @param {string} deleteItemID - id of item to be deleted
   * @param {number} editItemIndex - index of edit item
   */
  onSubmitHandler(data, editCreditCard, deleteItemID, editItemIndex) {
    // const defaultFlag = false;
    const { userCreditCards } = this.props;
    if (editCreditCard) {
      const { expiryField, cvvField } = data;
      const expDate = expiryField.replace('/', '');
      const cvvFieldVal = cvvField;
      creditCardCredentials = { cc: userCreditCards.data.profile.payment[editItemIndex].creditCardNumber, exp_date: expDate, cvv: cvvFieldVal };
    } else {
      const { creditcardField, expiryField, cvvField } = data;
      const cardNumber = creditcardField.replace(/ /g, '').replace(/-/g, '');
      const expDate = expiryField.replace('/', '');
      const cvvFieldVal = cvvField;
      creditCardCredentials = { cc: cardNumber, exp_date: expDate, cvv: cvvFieldVal }; // consolidate credit card field values.
    }
    this.props.fnValidateAddress(data);
    const dataTOStore = { data, editCreditCard, deleteItemID, editItemIndex };
    this.setState({ modalIsOpen: true, creditCardData: dataTOStore }, () => {
      if (ExecutionEnvironment.canUseDOM) {
        window.scrollTo(0, 0);
      }
    });
  }
  /**
   * The function handles the user selected address. If the indexVal is 0 then the user has selcted the address
   * that was entered in form else this function updates the address and make first data call.
   * @param {object} - selected address value from avs suggestion modal
   * @param {indexVal} - index value of selected address
   */
  onSubmitSuggestHandler(selectedAddress, indexVal) {
    this.closeModal();
    if (ExecutionEnvironment.canUseDOM) {
      const receiver = document.getElementById('myFrame').contentWindow; // PaymentJS requirement.
      if (indexVal !== 0) {
        const { data } = this.state.creditCardData;
        const { address, zipcode, state, city } = selectedAddress;
        data.addressLine1 = address;
        data.zipCode = zipcode;
        data.state = state;
        data.city = city;
      }
      if (!this.state.creditCardData.editCreditCard) {
        // For following line, we have added NOSONAR to skip because we do not have alternate of postMessage and we have to have it.
        receiver.postMessage(creditCardCredentials, `${FIRSTDATA_DOMAIN}`); // NOSONAR
      } else {
        const { address, companyName, city, phoneNumber, state, zipCode, firstName, lastName, expiryField } = this.state.creditCardData.data;
        const billingAddress = {};
        const dataToAPI = {};
        const addressLine = [];
        addressLine.push(address);
        if (companyName !== undefined) {
          addressLine.push(companyName);
        } else {
          addressLine.push('');
        }
        billingAddress.addressLine = addressLine;
        dataToAPI.creditCardHolderName = firstName.concat(' ').concat(lastName);
        dataToAPI.expiryDate = expiryField.replace('/', '');
        billingAddress.city = city;
        billingAddress.phoneNumber = phoneNumber;
        billingAddress.state = state;
        billingAddress.zipCode = zipCode;
        billingAddress.email = this.props.email;
        billingAddress.firstName = firstName;
        billingAddress.lastName = lastName;
        const { userCreditCards, profileID } = this.props;
        const { editItemIndex } = this.state.creditCardData;
        const { creditCardNumber, xWalletId, token, correlationId, type, cardType, expired } = userCreditCards.data.profile.payment[editItemIndex];
        const { addressType } = userCreditCards.data.profile.payment[editItemIndex].billingAddress;
        const makePrimary = false;
        dataToAPI.creditCardNumber = creditCardNumber.substr(creditCardNumber.length - 4);
        billingAddress.addressType = addressType;
        dataToAPI.xWalletId = xWalletId;
        dataToAPI.token = token;
        dataToAPI.correlationId = correlationId;
        dataToAPI.type = type;
        dataToAPI.billingAddress = billingAddress;
        dataToAPI.cardType = cardType;
        dataToAPI.expired = expired;
        this.props.fnEditCreditCard(profileID, dataToAPI.xWalletId, dataToAPI, makePrimary);
      }
    }
  }
  addCardPostAnalyticsData = () => {
    const { analyticsContent } = this.props;
    const analyticsObject = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventAction.ADD,
      eventLabel: analyticsEventLabel.ADD
    };
    analyticsContent(analyticsObject);
  };

  removeCardPostAnalyticsData = () => {
    const { analyticsContent } = this.props;
    const analyticsObject = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventAction.REMOVE,
      eventLabel: analyticsEventLabel.REMOVE
    };
    analyticsContent(analyticsObject);
  };
  /**
   * this function handles fallback for AVS
   */
  conditionModal() {
    const { validatedAddress } = this.props;
    const { creditCardData, modalIsOpen } = this.state;
    if (Object.keys(validatedAddress.data).length > 0 || validatedAddress.error) {
      if (modalIsOpen && validatedAddress.data.avsErrors !== undefined && !validatedAddress.error) {
        return true;
      } else if (Object.keys(creditCardData).length > 0 && modalIsOpen) {
        this.onSubmitSuggestHandler('', 0);
        return false;
      }
    }
    return false;
  }
  /**
   * This function close the address verification modal
   */
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  render() {
    const {
      cms,
      validatedAddress,
      userCreditCards,
      profileID,
      fnRemoveCreditCard,
      fnLoadCityStateData,
      zipCodeCityStateData,
      userGiftCards,
      addGiftCardData,
      fnRemoveGiftCard,
      fnaddGiftCard,
      scrollToTop,
      scrollPageToTop,
      analyticsContent
    } = this.props;
    const { modalIsOpen, creditCardData, tokenizeError } = this.state;
    const cardDetails = userCreditCards.data.profile;
    if (profileID) {
      return (
        <div className="flex-row flex-sm-column container-fluid">
          {this.conditionModal() && (
            <AddressSuggestions
              cms={cms}
              modalIsOpen={modalIsOpen}
              closeModal={this.closeModal}
              onSubmitSuggestHandler={this.onSubmitSuggestHandler}
              validatedAddress={validatedAddress}
              creditCardData={creditCardData}
            />
          )}
          <h5 className="pb-1">{cms.paymentsLabel}</h5>
          <CreditCardDisplay
            tokenizeError={tokenizeError}
            cms={cms}
            userCreditCards={cardDetails}
            userCreditCardsErr={userCreditCards.error ? userCreditCards.errorCode : ''}
            profileID={profileID}
            onSubmitForm={this.onSubmitHandler}
            fnRemoveCreditCard={fnRemoveCreditCard}
            setAsDefaultHandler={this.onSetDefaultCreditCardClick}
            fnLoadCityStateData={fnLoadCityStateData}
            zipCodeCityStateData={zipCodeCityStateData}
            scrollToTop={scrollToTop}
            scrollPageToTop={scrollPageToTop}
            analyticsContent={analyticsContent}
          />
          <GiftCardDisplay
            cms={cms}
            userGiftCards={userGiftCards}
            addGiftCardData={addGiftCardData}
            profileID={profileID}
            fnRemoveGiftCard={fnRemoveGiftCard}
            fnaddGiftCard={fnaddGiftCard}
            analyticsContent={analyticsContent}
          />
        </div>
      );
    }
    return null;
  }
}

MyAccountPayment.propTypes = {
  fnshowloader: PropTypes.func,
  cms: PropTypes.object.isRequired,
  fngetcreditCards: PropTypes.func,
  fngetGiftCards: PropTypes.func,
  fnaddGiftCard: PropTypes.func,
  fnaddCreditCard: PropTypes.func,
  fnRemoveGiftCard: PropTypes.func,
  fnRemoveCreditCard: PropTypes.func,
  fnEditCreditCard: PropTypes.func,
  userCreditCards: PropTypes.array,
  userGiftCards: PropTypes.array,
  profileID: PropTypes.string.isRequired,
  fnLoadCityStateData: PropTypes.func,
  zipCodeCityStateData: PropTypes.object,
  email: PropTypes.string,
  fnValidateAddress: PropTypes.func,
  validatedAddress: PropTypes.object,
  redirectLogin: PropTypes.func,
  breadCrumbAction: PropTypes.func,
  analyticsContent: PropTypes.func,
  scrollToTop: PropTypes.func,
  scrollPageToTop: PropTypes.func,
  addGiftCardData: PropTypes.object
};

const WrappedMyAccountPayment = withScroll(MyAccountPayment);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WrappedMyAccountPayment {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WrappedMyAccountPayment;
