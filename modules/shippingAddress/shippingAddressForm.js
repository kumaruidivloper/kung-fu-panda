/**
 * shippingAddressForm.component.js renders the form for shipping Address and maintains state
 * of the form with respect to city,state,zipcode and other fields with their related logic.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues, change as changeFieldValue } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RenderTextField from './components/renderInputField/renderInputFieldComponent';
import validationRules from './validationRules';
import RenderDropdown from './components/renderDropdown/renderDropdownComponent';
import RenderCheckbox from './components/renderCheckbox/renderCheckboxComponent';
import { USStates } from './../../utils/constants';
import { FORM_NAME } from './constants';
import { eraseCityStateData } from '../../apps/checkout/store/actions/fetchCityState';
import { addCompanyStyle, addressBlock, mtop } from './shippingAddress.styles';
import { restrictZipCodeFieldValue } from '../../utils/stringUtils';

const asyncValidate = (values, dispatch, props) => {
  const {
    zipCodeCityStateData: { data, error }
  } = props;
  return new Promise((resolve, reject) => {
    if (error && data.errors.length > 0) {
      const { errorMessage } = data.errors[0];
      reject({ zipCode: errorMessage }); // eslint-disable-line
    }
  });
};

export class ShippingAddressForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addCompanyFlag: this.props.initialValues ? this.props.initialValues.companyName : false,
      selectedStateIndex: this.getStateIndex(this.props.initialValues.state),
      saveShippingInfo: true
    };
    this.onShowCompanyAddress = this.onShowCompanyAddress.bind(this);
    this.loadCityStateInStore = this.loadCityStateInStore.bind(this);
    this.onChangeZipHandler = this.onChangeZipHandler.bind(this);
    this.zipPlusFourFormatValidator = this.zipPlusFourFormatValidator.bind(this);
    this.normalizeNumber = this.normalizeNumber.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }
  componentDidMount() {
    const { initialValues } = this.props;
    // call get cityState API only if (city does not exist or city has emoty string) and zipCode exists
    if (
      initialValues &&
      (typeof initialValues.city === typeof undefined || (initialValues.city && initialValues.city.trim().length === 0)) &&
      (initialValues.zipCode && initialValues.zipCode.trim().length > 0)
    ) {
      this.loadCityStateInStore(initialValues.zipCode);
    }
  }

  /**
   * set city/state values into the form fields based on the values that come from API
   * this is done via change method of redux-form because of the known issues with enableReinitialize prop
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    const { initialValues } = this.props;
    if (nextProps.initialValues.city !== initialValues.city) {
      this.props.changeFieldValue(FORM_NAME, 'city', nextProps.initialValues.city);
    }
    if (nextProps.initialValues.state !== initialValues.state) {
      this.setState({ selectedStateIndex: this.getStateIndex(nextProps.initialValues.state) });
      this.props.changeFieldValue(FORM_NAME, 'state', nextProps.initialValues.state);
    }
  }

  /**
   * erase city/state reducer as the component unmounts so that billing address form could reuse the same
   */
  componentWillUnmount() {
    this.props.fnEraseCityStateData();
  }

  /**
   * callback handler for company link
   * @param evt
   */
  onShowCompanyAddress(evt) {
    evt.preventDefault();
    this.setState({ addCompanyFlag: true });
  }

  /**
   * Callback for zip code change
   * @param event
   */
  onChangeZipHandler(event) {
    this.loadCityStateInStore(event.target.value);
  }

  /**
   * get the index of states array based on the selected state name
   * @param stateStr
   * @returns {number}
   */
  getStateIndex(stateStr) {
    const stateIndex = USStates.findIndex(item => item.title === stateStr);
    const derivedIndex = stateIndex > -1 ? stateIndex : 0;
    return derivedIndex;
  }
  /**
   * @param {string} value of the zip code field to be validated with ZIP+4 validation schema.
   * so either ZIP code string will be 5 digits or '5-4' digit string.
   */
  zipPlusFourFormatValidator(value) {
    const ZIP_FOUR_REGEX = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return ZIP_FOUR_REGEX.test(value);
  }
  /**
   *
   * @param {Object} event carries the event object from the zip code input field
   * validates the input zip code with zip+4 format and saves the first five into redux store.
   * from there the city and state data can be loaded via API call to geocoding API.
   * In case, the input is not valid - erase the existing zip code data from store.
   */
  loadCityStateInStore(zipCode) {
    if (this.zipPlusFourFormatValidator(zipCode)) {
      const queryZipCode = zipCode.substring(0, 5);
      this.props.fnvalidateZipCodeshippingAddress(queryZipCode);
    } else {
      this.props.fnEraseCityStateData();
    }
  }

  /**
   * limit text field to only numbers
   * @param value
   * @returns {string}
   */
  normalizeNumber(value) {
    return value && value.replace(/[^0-9]/g, '');
  }

  /**
   * Method for handling keyup and resetting the value if it exceeds the maxLength.
   * @param {object} e Event object corresponding to key down.
   */
  handleKeyUp = e => {
    if (e.target && e.target.maxLength && e.target.value.length >= e.target.maxLength) {
      e.target.value = e.target.value.substring(0, e.target.maxLength); // Resetting the value for Andriod devices
      return false;
    }
    return null;
  };

  /**
   * Method for handling key presses. Submits the form on an any of the field trigger submit event.
   * @param {object} e Event object corresponding to key down.
   */
  handleKeyDown = e => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      const { handleSubmit, onSubmitForm } = this.props;
      handleSubmit(data => onSubmitForm(data))();
    }
  };
  /**
   * It toggles the checkbox for shipping address and bydefault checked
   */
  toggleCheckbox() {
    this.setState({
      saveShippingInfo: !this.state.saveShippingInfo
    });
  }

  render() {
    const { cms, saveAddressForLater, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit} name="shippingInfoForm">
        <div className="form">
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <div className="form-group pr-md-1 col-md-6 px-0 col-12  ">
              <Field
                data-auid="checkout_shipping_address_first_name"
                name="firstName"
                id="shipping-address-firstName"
                type="text"
                label={cms.firstNameLabel}
                margin="mb-2"
                touchedMargin="mb-1"
                component={RenderTextField}
                maxLength="50"
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
              />
            </div>
            <div className="form-group col-md-6 px-0 col-12">
              <Field
                data-auid="checkout_shipping_address_last_name"
                name="lastName"
                id="shipping-address-lastName"
                type="text"
                label={cms.lastNameLabel}
                margin="mb-2"
                touchedMargin="mb-1"
                component={RenderTextField}
                maxLength="50"
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
              />
            </div>
          </div>
          <div className="form-group col-md-12 col-lg-6 col-xl-6 col-12 px-0">
            <Field
              data-auid="checkout_shipping_address_phone_number"
              name="phoneNumber"
              id="shipping-address-phoneNumber"
              type="tel"
              label={cms.phoneNumberLabel}
              margin="mb-2"
              touchedMargin="mb-1"
              component={RenderTextField}
              normalize={this.normalizeNumber}
              maxLength="10"
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
            />
          </div>
          <div className="form-group">
            <Field
              data-auid="checkout_shipping_address_address"
              name="address"
              id="shipping-address-address"
              type="text"
              label={cms.addressLabel}
              margin="mb-2"
              touchedMargin="mb-1"
              component={RenderTextField}
              maxLength="50"
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
            />
          </div>
          {!this.state.addCompanyFlag ? (
            <div className={`mb-2 ${mtop}`}>
              <a
                data-auid="checkout_shipping_address_add_more_details_link"
                onClick={this.onShowCompanyAddress}
                href=" #"
                className={`${addCompanyStyle} o-copy__14reg mt-1`}
              >
                {' '}
                {cms.addMoreDetailsOptionalLabel}
              </a>
            </div>
          ) : (
            <div className="form-group">
              <Field
                data-auid="checkout_shipping_address_company_name"
                name="companyName"
                id="shipping-address-companyName"
                type="text"
                label={cms.addMoreDetailsOptionalLabel}
                margin="mb-2"
                touchedMargin="mb-1"
                component={RenderTextField}
                maxLength="50"
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
              />
            </div>
          )}
          <div className={`${addressBlock}`}>
            <div className="form-group mb-2 mb-md-0">
              <Field
                data-auid="checkout_shipping_address_zip_code"
                name="zipCode"
                id="shipping-address-zipCode"
                type="tel"
                label={cms.zipCodeLabel}
                component={RenderTextField}
                onChange={this.onChangeZipHandler}
                maxLength="5"
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
              />
            </div>
            <div className="form-group">
              <Field
                data-auid="checkout_shipping_address_city"
                name="city"
                id="shipping-address-city"
                type="text"
                label={cms.cityLabel}
                component={RenderTextField}
                maxLength="50"
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
              />
            </div>
            <div className="form-group">
              <Field
                data-auid="checkout_shipping_address_state"
                name="state"
                id="shipping-address-state"
                type="text"
                label={cms.stateLabel}
                component={RenderDropdown}
                height="2.5rem"
                DropdownOptions={USStates}
                initiallySelectedOption={this.state.selectedStateIndex}
                onKeyDown={this.handleKeyDown}
                placeholderOption=" "
              />
            </div>
          </div>
          {saveAddressForLater && (
            <div className="form-group">
              <Field
                data-auid="checkout_save_shipping_address"
                name="saveAddressCheckbox"
                id="saveAddressCheckbox"
                label={cms.saveShippingInfoLabel}
                component={RenderCheckbox}
                labelClass="body-14-regular"
                onKeyDown={this.handleKeyDown}
                checked={this.state.saveShippingInfo}
                onChange={this.toggleCheckbox}
              />
            </div>
          )}
        </div>
      </form>
    );
  }
}

ShippingAddressForm.propTypes = {
  cms: PropTypes.object.isRequired,
  fnvalidateZipCodeshippingAddress: PropTypes.func,
  fnEraseCityStateData: PropTypes.func, // eslint-disable-line
  initialValues: PropTypes.object,
  changeFieldValue: PropTypes.func,
  saveAddressForLater: PropTypes.bool,
  handleSubmit: PropTypes.func,
  onSubmitForm: PropTypes.func
};

const mapStateToProps = (reduxState, ownProps) => {
  const { zipCodeCityStateData, initialVals, isLoggedIn, saveAddressForLater } = ownProps;
  const existingValues = getFormValues('shippingAddress')(reduxState);
  let initialVal = Object.assign({}, initialVals, existingValues);
  if (zipCodeCityStateData.isFetching === false && zipCodeCityStateData.error === false && Object.keys(zipCodeCityStateData.data).length > 0) {
    const { state, city } = zipCodeCityStateData ? zipCodeCityStateData.data : { city: '', state: '' };
    const stateCity = { city, state };
    if (stateCity) {
      initialVal = Object.assign({}, initialVal, stateCity);
    }
  }
  initialVal.saveAddressCheckbox = (isLoggedIn && saveAddressForLater) || false; // save Address checkbox to set to true if user is logged & selected index of dropdown is 0, else false.
  const { zipCode } = initialVal;
  initialVal.zipCode = restrictZipCodeFieldValue(zipCode);
  return {
    initialValues: initialVal
  };
};
const mapDispatchToProps = dispatch => bindActionCreators({ fnEraseCityStateData: eraseCityStateData, changeFieldValue }, dispatch);

const shippingAddressFormContainer = reduxForm({
  form: FORM_NAME,
  validate: validationRules,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  asyncValidate
})(ShippingAddressForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(shippingAddressFormContainer);
