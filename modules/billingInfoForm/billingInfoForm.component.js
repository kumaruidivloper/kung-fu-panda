/**
 * billingInfoForm.component.js renders the form container and contains the billingForm
 * It maintains the state for the case where the billing address is same as shipping address.
 */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { combineReducers, compose } from 'redux';
import AddressSuggestions from './components/addressSuggestionModal/addressSuggestionsModal';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import BillingForm from './components/billingForm/billingFormComponent';
import injectReducer from '../../utils/injectReducer';
import { AddOptionalAddressLink } from './style';
import { titleCase, formatPhoneNumber } from '../../utils/stringUtils';
import { getURLparam } from './../../utils/helpers';
export class BillingInfoForm extends React.Component {
  /**
   * get initial form values
   * @return {Object}
   */
  getDeliveryZipCodeFromURL() {
    const zipCode = getURLparam('deliveryzip');
    const formValues = zipCode ? { zipCode } : {};
    return formValues;
  }

  /**
   * Method to see Bopis item exist in one of the shipping group to enable SMS signup
   */
  shouldRenderSMSSignupCheckbox = shippingGroups => {
    const filtered = shippingGroups.filter(
      ({ shippingModes = [] }) => shippingModes.filter(({ shippingType }) => shippingType === 'PICKUPINSTORE').length
    );
    return filtered.length > 0;
  };

  /**
   * @param {object} shippingAddress obtained as prop for orderDetails API response.
   * ifNoBillingAddressFound renders the billing form, for the case when getBillingAddress() in the parent
   * checkoutPaymentOptions returns null. It displays the full billing form.
   */
  ifNoBillingAddressFound(shippingAddress) {
    const { fetchCityStateFromZipCode, cms, isLoggedIn, shippingAddressRequired, orderDetails, billingFormState, analyticsContent } = this.props;
    const { shippingGroups = [] } = orderDetails;
    const deliveryZip = this.getDeliveryZipCodeFromURL();

    return (
      <div className="d-flex flex-column">
        <BillingForm
          fetchCityStateFromZipCode={fetchCityStateFromZipCode}
          billingFormState={billingFormState}
          deliveryZip={deliveryZip}
          changeBillingAddress={this.props.changeBillingAddress}
          cms={cms}
          shippingAddress={shippingAddress}
          isLoggedIn={isLoggedIn}
          savePaymentInfoForLater={this.props.savePaymentInfoForLater}
          phoneNumberCheckboxVisible={this.shouldRenderSMSSignupCheckbox(shippingGroups)}
          shippingAddressRequired={shippingAddressRequired}
          analyticsContent={analyticsContent}
        />
      </div>
    );
  }
  /**
   *
   * @param {object} address is rendered when the user is logged in and has a saved billing address
   * on thier account
   */
  renderBillingAddress(address) {
    const { firstName, lastName, companyName, address: shippingAddress, city, state, zipCode, phoneNumber } = address;
    if (address) {
      return (
        <div className="mb-1">
          <div className="o-copy__14bold">{titleCase(`${firstName} ${lastName}`)}</div>
          <div className="body-14-regular">{`${titleCase(`${shippingAddress}, ${city}`)}, ${state}`}</div>
          <div className="body-14-regular">{`${zipCode}, ${formatPhoneNumber(phoneNumber)}`}</div>
          <div className="body-14-regular">{titleCase(companyName)}</div>
        </div>
      );
    }
    return <div className="o-copy__14bold">No Address Found</div>;
  }

  render() {
    const {
      cms,
      orderDetails,
      modalIsOpen,
      closeModal,
      validateBillingAddress,
      onSubmitSuggestHandler,
      billingAddress,
      selectedPaymentOption
    } = this.props;
    const { paymentMethod } = orderDetails.payments;
    const shippingAddress =
      orderDetails && orderDetails.addresses.shippingAddress && Object.keys(orderDetails.addresses.shippingAddress).length > 0
        ? orderDetails.addresses.shippingAddress
        : null;
    return (
      <section className="mt-2">
        {modalIsOpen && (
          <AddressSuggestions
            cms={cms}
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            onSubmitSuggestHandler={onSubmitSuggestHandler}
            validateBillingAddress={validateBillingAddress}
          />
        )}
        <div className="body-14-regular mb-1">{cms.billingInformation}</div>
        {this.props.changeBillingAddress === false &&
        Object.keys(billingAddress).length > 0 &&
        selectedPaymentOption === (paymentMethod && paymentMethod.toLowerCase()) ? (
          <div>
            {this.renderBillingAddress(billingAddress)}
            <a onClick={event => this.props.onChangeBillingAddress(event)} href=" #" className={`o-copy__14reg ${AddOptionalAddressLink}`}>
              {' '}
              {cms.changeBillingInformationLabel}
            </a>
          </div>
        ) : (
          this.ifNoBillingAddressFound(shippingAddress)
        )}
      </section>
    );
  }
}

BillingInfoForm.propTypes = {
  cms: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  orderDetails: PropTypes.object,
  fetchCityStateFromZipCode: PropTypes.object,
  modalIsOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  validateBillingAddress: PropTypes.object,
  onSubmitSuggestHandler: PropTypes.func,
  billingAddress: PropTypes.object,
  savePaymentInfoForLater: PropTypes.bool,
  shippingAddressRequired: PropTypes.bool,
  onChangeBillingAddress: PropTypes.func,
  changeBillingAddress: PropTypes.bool,
  billingFormState: PropTypes.bool,
  selectedPaymentOption: PropTypes.object,
  analyticsContent: PropTypes.func
};
const withConnect = connect(
  null,
  null
);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer: combineReducers({ key: 'vals' }) });
  const BillingInfoFormContainer = compose(
    withReducer,
    withConnect
  )(BillingInfoForm);
  /* istanbul ignore next */
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <BillingInfoFormContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(BillingInfoForm);
