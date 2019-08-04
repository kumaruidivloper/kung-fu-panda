import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import Modal from 'react-modal';
import { cx } from 'react-emotion';
import { getProfileId } from '../../../utils/UserSession';
import {
  fetchShippingAddresses,
  postBuyNow,
  postShippingDetails,
  postPaymentDetails,
  postValidateAddress,
  getErrorMessageFrom
} from '../../../utils/buyNow/buyNow.api';
import DefaultPaymentForm, { PDP_DEFAULT_PAYMENT_FORM } from './DefaultPaymentForm';
import DefaultShippingAddressForm, { PDP_DEFAULT_SHIPPING_ADDRESS_FORM } from './DefaultShippingAddressForm';
import AddressSuggestionsSelector from './AddressSuggestionsSelector';
import Loader from '../../loader/loader.component';
import { profileHasDefaultShippingMethod, profileHasDefaultBillingCreditCard } from '../../../utils/buyNow/buyNow.utils';
import * as emo from './EnableBuyNowModal.emotion';
import cmsJSON from './myAccountCMS.json';
import paymentJsAPI, { EVENT_GENERATE_TOKEN } from '../../../utils/PaymentJs/PaymentJsAPI';
import { getMessageDataHttpStatus, getMessageDataErrorMessage } from '../../../utils/PaymentJs/utils/MessageData';
import {
  createAddPaymentMethodRequestObject,
  createAddShippingAddressRequestObject,
  createValidateShippingAddressRequestObject,
  createValidateBillingAddressRequestObject,
  getAddressSuggestionsFromResponse,
  convertShippingAddressToSimpleAddress,
  convertSimpleAddressToShippingAddress,
  convertBillingAddressToSimpleAddress
} from './EnableBuyNowModal.utils';
import { scrollIntoView } from '../../../utils/scroll';

const { cms } = cmsJSON;

class EnableBuyNowModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      shippingAddressFormMeta: {
        isSubmitted: false,
        isSubmitting: false,
        errorMessage: undefined,
        isFetchingSuggestions: false,
        addressSubmittedByForm: undefined,
        suggestedAddresses: undefined,
        selectedAddressIndex: -1,
        selectedAddress: undefined
      },
      paymentMethodFormMeta: {
        isSubmitted: false,
        isSubmitting: false,
        errorMessage: undefined,
        isFetchingSuggestions: false,
        addressSubmittedByForm: undefined,
        suggestedAddresses: undefined,
        selectedAddressIndex: -1,
        selectedAddress: undefined
      },
      firstDataMessageData: undefined, // will contain token returned from PaymentJsAPI
      defaultShippingAddress: undefined
    };

    this.isOpen = this.isOpen.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);

    this.onFetchDefaultShippingAddresses = this.onFetchDefaultShippingAddresses.bind(this);
    this.onFetchDefaultShippingAddressesSuccess = this.onFetchDefaultShippingAddressesSuccess.bind(this);
    this.onFetchDefaultShippingAddressesFail = this.onFetchDefaultShippingAddressesFail.bind(this);

    this.onSubmitDefaultShippingAddress = this.onSubmitDefaultShippingAddress.bind(this);
    this.onSubmitDefaultShippingAddressSuccess = this.onSubmitDefaultShippingAddressSuccess.bind(this);
    this.onSubmitDefaultShippingAddressFail = this.onSubmitDefaultShippingAddressFail.bind(this);

    this.onSubmitShippingAddressSuggestion = this.onSubmitShippingAddressSuggestion.bind(this);
    this.onSelectShippingAddressSuggestion = this.onSelectShippingAddressSuggestion.bind(this);

    this.onSaveDefaultShippingAddress = this.onSaveDefaultShippingAddress.bind(this);
    this.onSaveDefaultShippingAddressSuccess = this.onSaveDefaultShippingAddressSuccess.bind(this);
    this.onSaveDefaultShippingAddressFail = this.onSaveDefaultPaymentMethodFail.bind(this);

    this.onSubmitDefaultPaymentMethod = this.onSubmitDefaultPaymentMethod.bind(this);
    this.onSubmitDefaultPaymentMethodSuccess = this.onSubmitDefaultPaymentMethodSuccess.bind(this);
    this.onSubmitDefaultPaymentMethodFail = this.onSubmitDefaultPaymentMethodFail.bind(this);

    this.onSubmitBillingAddressSuggestion = this.onSubmitBillingAddressSuggestion.bind(this);
    this.onSelectBillingAddressSuggestion = this.onSelectBillingAddressSuggestion.bind(this);

    this.onRequestToken = this.onRequestToken.bind(this);
    this.onGenerateToken = this.onGenerateToken.bind(this);
    this.onGenerateTokenSuccess = this.onGenerateTokenSuccess.bind(this);
    this.onGenerateTokenFail = this.onGenerateTokenFail.bind(this);

    this.onSaveDefaultPaymentMethod = this.onSaveDefaultPaymentMethod.bind(this);
    this.onSaveDefaultPaymentMethodSuccess = this.onSaveDefaultPaymentMethodSuccess.bind(this);
    this.onSaveDefaultPaymentMethodFail = this.onSaveDefaultPaymentMethodFail.bind(this);

    this.onBuyNow = this.onBuyNow.bind(this);
    this.onBuyNowSuccess = this.onBuyNowSuccess.bind(this);
    this.onBuyNowFail = this.onBuyNowFail.bind(this);
    this.reportAnalyticsOnError = this.reportAnalyticsOnError.bind(this);
    this.logGAonSuggestedAddressSelection = this.logGAonSuggestedAddressSelection.bind(this);

    this.clickModifyShippingAddress = this.clickModifyShippingAddress.bind(this);
    this.clickModifyBillingAddress = this.clickModifyBillingAddress.bind(this);

    this.scrollModalToTop = this.scrollModalToTop.bind(this);
  }

  componentDidMount() {
    paymentJsAPI.injectScripts();
    paymentJsAPI.subscribe(EVENT_GENERATE_TOKEN, this.onGenerateToken);
    this.onFetchDefaultShippingAddresses();
  }

  componentWillUnmount() {
    paymentJsAPI.unsubscribe(EVENT_GENERATE_TOKEN, this.onGenerateToken);
  }

  /**
   * @description updates state when modal close is executed
   * @returns {undefined}
   */
  onRequestClose() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
    this.close();
  }

  onFetchDefaultShippingAddresses() {
    this.setState({ defaultShippingAddress: undefined });

    fetchShippingAddresses(getProfileId(), this.onFetchDefaultShippingAddressesSuccess, this.onFetchDefaultShippingAddressesFail);
  }

  /**
   * @description Processes successful response for ajax request Add Default Shipping Address
   * @param  {Object} response
   * @returns {undefined}
   */
  onFetchDefaultShippingAddressesSuccess(response) {
    const { status, data } = response || {};
    const { profile } = data || {};

    if (status && status >= 200 && status < 300) {
      const addresses = profile.address || [];
      const defaultShippingAddress = addresses.find((address = {}) => address.primary === true);
      this.setState({ defaultShippingAddress });
      return;
    }

    this.onFetchDefaultShippingAddressesFail();
  }

  /**
   * @description Prcesses failed response for ajx request Add Default Shipping Address
   * @param  {Object} response
   * @returns {undefined}
   */
  onFetchDefaultShippingAddressesFail() {
    // do nothing since user is not conerned with whether this completes successfully or not
    // const { paymentMethodFormMeta } = this.state;
    // this.setState({ paymentMethodFormMeta: { ...paymentMethodFormMeta, errorMessage: getErrorMessageFrom(response) } });
  }

  /**
   * @description Handles request to validate shipping address
   * @returns {undefined}
   */
  onSubmitDefaultShippingAddress() {
    if (ExecutionEnvironment.canUseDOM) {
      // set state to is submitting
      const { shippingAddressFormMeta } = this.state;
      const { defaultShippingAddressForm } = this.props;
      this.setState({
        shippingAddressFormMeta: {
          ...shippingAddressFormMeta,
          isSubmitting: true,
          isFetchingSuggestions: true,
          addressSubmittedByForm: defaultShippingAddressForm,
          selectedAddress: convertShippingAddressToSimpleAddress(defaultShippingAddressForm),
          errorMessage: undefined
        }
      });

      // init ajax call
      const requestObj = createValidateShippingAddressRequestObject(defaultShippingAddressForm);
      postValidateAddress(requestObj, this.onSubmitDefaultShippingAddressSuccess, this.onSubmitDefaultShippingAddressFail);
    }
  }

  /**
   * @description Processes successful response for ajax request Add Default Shipping Address
   * @param  {Object} response
   * @returns {undefined}
   */
  onSubmitDefaultShippingAddressSuccess(response) {
    const { status } = response;
    const suggestedAddresses = getAddressSuggestionsFromResponse(response);
    const { shippingAddressFormMeta } = this.state;

    if (status && status >= 200 && status < 300) {
      if (suggestedAddresses.length > 0) {
        this.setState({
          shippingAddressFormMeta: {
            ...shippingAddressFormMeta,
            isSubmitting: false,
            isFetchingSuggestions: false,
            suggestedAddresses
          }
        });
      } else {
        // if no addresses suggested, move on to try and persist current address as is
        this.setState({
          shippingAddressFormMeta: {
            ...shippingAddressFormMeta,
            isFetchingSuggestions: false
          }
        });
        this.onSaveDefaultShippingAddress();
      }
    } else {
      this.onSubmitDefaultShippingAddressFail(response);
    }
  }

  /**
   * @description Processes failed response for ajx request Validate Address. We will not show error to user.  Address will be saved as is.
   * @param  {Object} response
   * @returns {undefined}
   */
  onSubmitDefaultShippingAddressFail(response) {
    const { shippingAddressFormMeta } = this.state;
    const serverErrorMessage = getErrorMessageFrom(response) || '';
    this.setState({
      shippingAddressFormMeta: {
        ...shippingAddressFormMeta,
        isFetchingSuggestions: false
      }
    });
    this.reportAnalyticsOnError(serverErrorMessage, 'default shipping address');
    this.onSaveDefaultShippingAddress();
  }

  onSubmitShippingAddressSuggestion() {
    this.logGAonSuggestedAddressSelection();
    this.onSaveDefaultShippingAddress();
  }

  onSelectShippingAddressSuggestion(index) {
    const { shippingAddressFormMeta } = this.state;
    const { addressSubmittedByForm, suggestedAddresses } = shippingAddressFormMeta;
    const selectedAddress = index === -1 ? convertShippingAddressToSimpleAddress(addressSubmittedByForm) : suggestedAddresses[index];
    this.setState({
      shippingAddressFormMeta: {
        ...shippingAddressFormMeta,
        selectedAddressIndex: index,
        selectedAddress
      }
    });
  }

  /**
   * @description Handles persisting of default shipping address
   * @returns {undefined}
   */
  onSaveDefaultShippingAddress() {
    if (ExecutionEnvironment.canUseDOM) {
      const { shippingAddressFormMeta } = this.state;
      const { addressSubmittedByForm, selectedAddress } = shippingAddressFormMeta;
      const shippingAddresFormValues = selectedAddress
        ? convertSimpleAddressToShippingAddress(addressSubmittedByForm, selectedAddress)
        : addressSubmittedByForm;
      this.setState({
        shippingAddressFormMeta: {
          ...shippingAddressFormMeta,
          isSubmitting: true,
          errorMessage: undefined
        }
      });
      const requestObj = createAddShippingAddressRequestObject(shippingAddresFormValues);
      postShippingDetails(getProfileId(), requestObj, this.onSaveDefaultShippingAddressSuccess, this.onSaveDefaultShippingAddressFail);
    }
  }

  /**
   * @description Processes successful response for ajax request Add Default Shipping Address
   * @param  {Object} response
   * @returns {undefined}
   */
  onSaveDefaultShippingAddressSuccess(response) {
    const { profile } = this.props;
    const { status } = response || {};
    const { shippingAddressFormMeta } = this.state;

    if (status && status >= 200 && status < 300) {
      this.setState({
        shippingAddressFormMeta: {
          ...shippingAddressFormMeta,
          isSubmitting: false,
          isSubmitted: true
        }
      });
      this.onFetchDefaultShippingAddresses();
      if (profileHasDefaultBillingCreditCard(profile)) {
        this.onBuyNow();
      }
      return;
    }

    this.onSaveDefaultShippingAddressFail(response);
  }

  /**
   * @description Prcesses failed response for ajx request Add Default Shipping Address
   * @param  {Object} response
   * @returns {undefined}
   */
  onSaveDefaultShippingAddressFail(response) {
    const { shippingAddressFormMeta } = this.state;
    this.setState({ shippingAddressFormMeta: { ...shippingAddressFormMeta, isSubmitting: false, errorMessage: getErrorMessageFrom(response) } });
  }
  /**
   * @description Handles default payment method form submission
   * @returns {undefined}
   */
  onSubmitDefaultPaymentMethod() {
    if (ExecutionEnvironment.canUseDOM) {
      // set state to is submitting
      const { paymentMethodFormMeta, defaultShippingAddress } = this.state;
      const { defaultPaymentMethodForm } = this.props;
      this.setState({
        paymentMethodFormMeta: {
          ...paymentMethodFormMeta,
          isSubmitting: true,
          isFetchingSuggestions: true,
          addressSubmittedByForm: defaultPaymentMethodForm,
          selectedAddress: convertBillingAddressToSimpleAddress(defaultPaymentMethodForm, defaultShippingAddress),
          errorMessage: undefined
        }
      });

      // init ajax call
      const requestObj = createValidateBillingAddressRequestObject(defaultPaymentMethodForm, defaultShippingAddress);
      postValidateAddress(requestObj, this.onSubmitDefaultPaymentMethodSuccess, this.onSubmitDefaultPaymentMethodFail);
    }
  }

  /**
   * @description Processes successful response for ajax request Add Default Shipping Address
   * @param  {Object} response
   * @returns {undefined}
   */
  onSubmitDefaultPaymentMethodSuccess(response) {
    const { status } = response;
    const suggestedAddresses = getAddressSuggestionsFromResponse(response);
    const { paymentMethodFormMeta } = this.state;

    if (status && status >= 200 && status < 300) {
      if (suggestedAddresses.length > 0) {
        this.setState({
          paymentMethodFormMeta: {
            ...paymentMethodFormMeta,
            isSubmitting: false,
            isFetchingSuggestions: false,
            suggestedAddresses
          }
        });
      } else {
        // if no addresses suggested, move on to try and persist current address as is
        this.setState({
          paymentMethodFormMeta: {
            ...paymentMethodFormMeta,
            isFetchingSuggestions: false
          }
        });
        this.onRequestToken();
      }
    } else {
      this.onSubmitDefaultPaymentMethodFail();
    }
  }

  /**
   * @description Prcesses failed response for ajx request Validate Address
   * @param  {Object} response
   * @returns {undefined}
   */
  onSubmitDefaultPaymentMethodFail() {
    const { paymentMethodFormMeta } = this.state;
    this.setState({
      paymentMethodFormMeta: {
        ...paymentMethodFormMeta,
        isFetchingSuggestions: false
      }
    });
    this.onRequestToken();
  }

  onSubmitBillingAddressSuggestion() {
    this.onRequestToken();
  }

  onSelectBillingAddressSuggestion(index) {
    const { paymentMethodFormMeta, defaultShippingAddress } = this.state;
    const { addressSubmittedByForm, suggestedAddresses } = paymentMethodFormMeta;
    const selectedAddress =
      index === -1 ? convertBillingAddressToSimpleAddress(addressSubmittedByForm, defaultShippingAddress) : suggestedAddresses[index];
    this.setState({
      paymentMethodFormMeta: {
        ...paymentMethodFormMeta,
        selectedAddressIndex: index,
        selectedAddress
      }
    });
  }

  onRequestToken() {
    if (ExecutionEnvironment.canUseDOM) {
      const { paymentMethodFormMeta } = this.state;
      const { addressSubmittedByForm } = paymentMethodFormMeta;
      const newPaymentMethodFormMeta = {
        ...paymentMethodFormMeta,
        isSubmitting: true,
        errorMessage: undefined
      };
      this.setState({ paymentMethodFormMeta: newPaymentMethodFormMeta, firstDataMessageData: undefined });
      const { creditCardNumber, creditCardExpiration, creditCardCVV } = addressSubmittedByForm;
      paymentJsAPI.saveCreditCard(creditCardNumber, creditCardExpiration, creditCardCVV);
    }
  }

  onGenerateToken(messageData) {
    const httpStatus = getMessageDataHttpStatus(messageData);
    if (httpStatus >= 200 && httpStatus < 300) {
      this.onGenerateTokenSuccess(messageData);
    } else {
      this.onGenerateTokenFail(messageData);
    }
  }

  onGenerateTokenSuccess(messageData) {
    this.setState({ firstDataMessageData: messageData });
    this.onSaveDefaultPaymentMethod();
  }

  onGenerateTokenFail(messageData) {
    const { paymentMethodFormMeta } = this.state;
    const newPaymentMethodFormMeta = {
      ...paymentMethodFormMeta,
      isSubmitting: false,
      errorMessage: getMessageDataErrorMessage(messageData)
    };
    this.setState({ paymentMethodFormMeta: newPaymentMethodFormMeta, firstDataMessageData: messageData });
  }

  onSaveDefaultPaymentMethod() {
    const { paymentMethodFormMeta, firstDataMessageData, defaultShippingAddress } = this.state;
    const { addressSubmittedByForm, selectedAddress } = paymentMethodFormMeta;
    const requestObj = createAddPaymentMethodRequestObject(defaultShippingAddress, addressSubmittedByForm, selectedAddress, firstDataMessageData);
    postPaymentDetails(getProfileId(), requestObj, this.onSaveDefaultPaymentMethodSuccess, this.onSaveDefaultPaymentMethodFail);
  }

  onSaveDefaultPaymentMethodSuccess(response) {
    const { status } = response || {};

    if (status && status >= 200 && status < 300) {
      this.onBuyNow();
      return;
    }

    this.onSaveDefaultPaymentMethodFail(response);
  }

  onSaveDefaultPaymentMethodFail(response) {
    const { paymentMethodFormMeta } = this.state;
    const serverErrorMessage = getErrorMessageFrom(response) || '';
    this.setState({ paymentMethodFormMeta: { ...paymentMethodFormMeta, isSubmitting: false, errorMessage: serverErrorMessage } });
    this.reportAnalyticsOnError(serverErrorMessage, 'buy now');
  }

  onBuyNow() {
    const { createAddToCartRequestObject } = this.props;
    const requestObj = createAddToCartRequestObject();
    postBuyNow(requestObj, this.onBuyNowSuccess, this.onBuyNowFail);
  }

  onBuyNowSuccess(response) {
    const { status } = response || {};

    if (status && status >= 200 && status < 300) {
      const { buyNow } = response.data || {};
      const { orderId } = buyNow || {};
      if (orderId) {
        window.location = `/shop/OrderConfirmation?orderId=${orderId}`;
        return;
      }
      this.onRequestClose();
      return;
    }

    this.onBuyNowFail(response);
  }

  onBuyNowFail(response) {
    this.onRequestClose();
    this.props.handleBuyNowResponseError(response);
  }

  /**
   * report to anlytics when error happens
   */
  reportAnalyticsOnError(serverError, formName) {
    const { gtmDataLayer } = this.props;
    gtmDataLayer.push({
      event: 'errormessage',
      eventCategory: 'error message',
      eventAction: `form validation error|${formName}`,
      eventLabel: serverError ? serverError.toLowerCase() : ''
    });
  }

  /**
   * report anlytics when selection of suggested address happens
   */
  logGAonSuggestedAddressSelection() {
    const { gtmDataLayer } = this.props;
    gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'add a default payment',
      eventLabel: 'use selected address',
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    });
  }

  /**
   * @description determines if open state is managed via props or via internal state
   * @returns {boolean} true if this.props.open is defined, false if this.props.open is not defined
   */
  isControlledComponent() {
    const { open } = this.props;
    return open !== null && open !== undefined;
  }

  /**
   * @description returns true if the Modal is open, first checks props and if open state not passed in via props, then checks state for open state.
   * @returns {boolean} true if modal is open, false if modal is closed.
   */
  isOpen() {
    return this.isControlledComponent() ? this.props.open : this.state.isOpen;
  }

  /**
   * @description sets state.isOpen = true
   */
  open() {
    this.setState({ isOpen: true });
  }

  /**
   * @description sets state.isOpen = false
   */
  close() {
    this.setState({ isOpen: false });
  }

  showDefaultShippingAddressForm() {
    const { profile } = this.props;
    const { shippingAddressFormMeta = {} } = this.state;
    const { isSubmitted, addressSubmittedByForm, suggestedAddresses, isFetchingSuggestions } = shippingAddressFormMeta;
    const suggestionsReturnedNoResults = (suggestedAddresses || []).length === 0;
    return (
      !profileHasDefaultShippingMethod(profile) && !isSubmitted && (!addressSubmittedByForm || isFetchingSuggestions || suggestionsReturnedNoResults)
    );
  }

  clickModifyShippingAddress(e) {
    e.stopPropagation();
    const { shippingAddressFormMeta } = this.state;
    this.setState({ shippingAddressFormMeta: { ...shippingAddressFormMeta, addressSubmittedByForm: undefined } });
  }

  showShippingAddressSuggestions() {
    const { profile } = this.props;
    const { shippingAddressFormMeta = {} } = this.state;
    const { suggestedAddresses = [], isSubmitted } = shippingAddressFormMeta;
    return !profileHasDefaultShippingMethod(profile) && suggestedAddresses.length > 0 && !isSubmitted;
  }

  showDefaultPaymentMethodForm() {
    const { profile } = this.props;
    const { paymentMethodFormMeta = {} } = this.state;
    const { isSubmitted, addressSubmittedByForm, suggestedAddresses, isFetchingSuggestions } = paymentMethodFormMeta;
    const suggestionsReturnedNoResults = (suggestedAddresses || []).length === 0;
    return (
      !profileHasDefaultBillingCreditCard(profile) &&
      !isSubmitted &&
      (!addressSubmittedByForm || isFetchingSuggestions || suggestionsReturnedNoResults)
    );
  }

  clickModifyBillingAddress(e) {
    e.stopPropagation();
    const { paymentMethodFormMeta } = this.state;
    this.setState({ paymentMethodFormMeta: { ...paymentMethodFormMeta, addressSubmittedByForm: undefined } });
  }

  showBillingAddressSuggestions() {
    const { profile } = this.props;
    const { paymentMethodFormMeta = {} } = this.state;
    const { suggestedAddresses = [], isSubmitted } = paymentMethodFormMeta;
    return !profileHasDefaultBillingCreditCard(profile) && suggestedAddresses.length > 0 && !isSubmitted;
  }

  showLoader() {
    const { shippingAddressFormMeta = {}, paymentMethodFormMeta = {} } = this.state;
    return (
      shippingAddressFormMeta.isFetchingSuggestions ||
      shippingAddressFormMeta.isSubmitting ||
      paymentMethodFormMeta.isFetchingSuggestions ||
      paymentMethodFormMeta.isSubmitting
    );
  }

  scrollModalToTop() {
    scrollIntoView(this.contentEl, { offset: 0 }, this.scrollContainerEl);
  }

  renderModalContent() {
    const { profile, productItem } = this.props;
    const { shippingAddressFormMeta = {}, paymentMethodFormMeta = {}, defaultShippingAddress } = this.state;

    if (this.showDefaultShippingAddressForm()) {
      return (
        <DefaultShippingAddressForm
          cms={cms}
          profile={profile}
          isSubmitting={shippingAddressFormMeta.isSubmitting}
          onSubmit={this.onSubmitDefaultShippingAddress}
          errorMessage={shippingAddressFormMeta.errorMessage}
          productItem={productItem}
          scrollContainerEl={this.scrollContainerEl}
          scrollPageToTop={this.scrollModalToTop}
        />
      );
    }

    if (this.showShippingAddressSuggestions()) {
      return (
        <div className={emo.addressetSuggestionWrapperTweaks}>
          <AddressSuggestionsSelector
            cms={cms}
            isSubmitting={shippingAddressFormMeta.isSubmitting}
            onSubmit={this.onSubmitShippingAddressSuggestion}
            onSelect={this.onSelectShippingAddressSuggestion}
            selectedIndex={shippingAddressFormMeta.selectedAddressIndex}
            suggestedAddresses={shippingAddressFormMeta.suggestedAddresses}
            originalAddress={convertShippingAddressToSimpleAddress(shippingAddressFormMeta.addressSubmittedByForm)}
            onClickModifyAddress={this.clickModifyShippingAddress}
            scrollPageToTop={this.scrollModalToTop}
          />
        </div>
      );
    }

    if (this.showDefaultPaymentMethodForm()) {
      return (
        <DefaultPaymentForm
          cms={cms}
          profile={profile}
          isSubmitting={paymentMethodFormMeta.isSubmitting}
          onSubmit={this.onSubmitDefaultPaymentMethod}
          errorMessage={paymentMethodFormMeta.errorMessage}
          defaultShippingAddress={defaultShippingAddress}
          scrollContainerEl={this.scrollContainerEl}
          productItem={productItem}
          scrollPageToTop={this.scrollModalToTop}
        />
      );
    }

    if (this.showBillingAddressSuggestions()) {
      return (
        <div className={emo.addressetSuggestionWrapperTweaks}>
          <AddressSuggestionsSelector
            cms={cms}
            isSubmitting={paymentMethodFormMeta.isSubmitting}
            onSubmit={this.onSubmitBillingAddressSuggestion}
            onSelect={this.onSelectBillingAddressSuggestion}
            selectedIndex={paymentMethodFormMeta.selectedAddressIndex}
            suggestedAddresses={paymentMethodFormMeta.suggestedAddresses}
            originalAddress={convertBillingAddressToSimpleAddress(paymentMethodFormMeta.addressSubmittedByForm, defaultShippingAddress)}
            onClickModifyAddress={this.clickModifyBillingAddress}
            scrollPageToTop={this.scrollModalToTop}
          />
        </div>
      );
    }

    return null;
  }

  renderLoader() {
    return this.showLoader() && <Loader className={emo.loaderMinHeight} overlay />;
  }

  render() {
    return (
      <Modal
        isOpen={this.isOpen()}
        overlayClassName={emo.overlay}
        className={emo.content}
        onRequestClose={this.onRequestClose}
        shouldCloseOnOverlayClick
        ariaHideApp={false}
        overlayRef={node => {
          this.scrollContainerEl = node;
        }}
        contentRef={node => {
          this.contentEl = node;
        }}
      >
        <emo.CloseButton onClick={this.onRequestClose}>
          <emo.CloseIcon className={cx('academyicon', 'icon-close')} aria-hidden="true" />
        </emo.CloseButton>
        <div className="py-6 px-2 p-md-6">{this.renderModalContent()}</div>
        {this.renderLoader()}
      </Modal>
    );
  }
}

EnableBuyNowModal.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
  profile: PropTypes.object,
  defaultPaymentMethodForm: PropTypes.object,
  defaultShippingAddressForm: PropTypes.object,
  handleBuyNowResponseError: PropTypes.func,
  createAddToCartRequestObject: PropTypes.func.isRequired,
  productItem: PropTypes.object,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  defaultShippingAddressForm: getFormValues(PDP_DEFAULT_SHIPPING_ADDRESS_FORM)(state),
  defaultPaymentMethodForm: getFormValues(PDP_DEFAULT_PAYMENT_FORM)(state)
});

export default connect(mapStateToProps)(EnableBuyNowModal);
