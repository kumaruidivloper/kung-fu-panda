/**
 * billingFormComponent.js renders the form for billing Address and maintains state
 * of the form with respect to city,state,zipcode and other fields with their related logic.
 */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { AddOptionalAddressLink, billingFromError } from './../../style';
import { loadCityStateFromZipCode, eraseCityStateData } from './../../../../apps/checkout/store/actions/fetchCityState';
import RenderTextField from './../renderInput/renderInputFieldComponent';
import RenderCheckbox from './../renderCheckbox/renderCheckboxComponent';
import RenderEmailField from './../renderEmail/renderEmailFieldComponent';
import { validateBillingForm } from './../../validationRules';
import { validatePaymentForm } from '../../../../utils/validationRules';
import RenderDropdown from './../renderDropdown/renderDropdownComponent';
import { USStates } from './../../../../utils/constants';
import {
  FORM_NAME,
  ANALYTICS_EVENT_CATEGORY,
  ANALYTICS_SUB_EVENT_IN,
  analyticsEventActionPayment,
  ADD_BILLING_LABEL_ANALYTICS
} from './../../../checkoutPaymentOptions/constants';
import { titleCase, formatPhoneNumber, restrictZipCodeFieldValue } from './../../../../utils/stringUtils';
import StorageManager from '../../../../utils/StorageManager';

/**
 *
 * asyncValidate validating the zipcode error scenario
 * @param {object} values zipcode data
 * @param {function} dispatch middleware
 * @param {object} props redux form data
 */
const asyncValidate = (values, dispatch, props) => {
  const {
    fetchCityStateFromZipCode: { data, error }
  } = props;
  return new Promise((resolve, reject) => {
    if (error && data.errors.length > 0) {
      const { errorMessage } = data.errors[0];
      reject({ billingZipCode: errorMessage }); // eslint-disable-line
    }
  });
};

export class BillingForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      optionalFieldVisible: this.props.initialValues && this.props.initialValues.billingCompany,
      isChecked: true
    };
    this.loadCityStateInStore = this.loadCityStateInStore.bind(this);
    this.toggleCompanyField = this.toggleCompanyField.bind(this);
    this.normalizeNumber = this.normalizeNumber.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.onChangeZipHandler = this.onChangeZipHandler.bind(this);
  }
  /**
   * If zipcode is prepopulated, then it will render city/state in billing Form.
   */
  componentDidMount() {
    const {
      deliveryZip: { zipCode },
      analyticsContent
    } = this.props;
    if (zipCode) {
      this.loadCityStateInStore(zipCode);
    }
    const analyticsData = {
      event: ANALYTICS_SUB_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventActionPayment,
      eventLabel: ADD_BILLING_LABEL_ANALYTICS,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };
    analyticsContent(analyticsData);
  }
  /**
   *
   * @param {object} props encompasses the latest prop values, using new props we derive the new state.
   * gets called on initial render and subsequent updates.
   */
  static getDerivedStateFromProps(props) {
    const { fetchCityStateFromZipCode } = props;
    if (
      fetchCityStateFromZipCode &&
      (fetchCityStateFromZipCode.isFetching === false &&
        fetchCityStateFromZipCode.error === false &&
        Object.keys(fetchCityStateFromZipCode.data).length > 0)
    ) {
      const dropDownIndex = USStates.findIndex(item => item.title === fetchCityStateFromZipCode.data.state);
      return { selectedStateIndex: dropDownIndex };
    }
    return { selectedStateIndex: 0 };
  }
  /**
   * Callback for zip code change
   * @param event
   */
  onChangeZipHandler(event) {
    this.loadCityStateInStore(event.target.value);
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
      this.props.fnLoadCityStateData(queryZipCode);
    }
  }

  /**
   * @param {string} value of the zip code field to be validated with ZIP+4 validation schema.
   * so either ZIP code string will be 5 digits or '5-4' digit string.
   */
  zipPlusFourFormatValidator(value) {
    const ZIP_FOUR_REGEX = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return ZIP_FOUR_REGEX.test(value);
  }

  handleCheckbox() {
    this.setState({
      isChecked: !this.state.isChecked
    });
  }

  toggleCompanyField(evt) {
    evt.preventDefault();
    this.setState({ optionalFieldVisible: !this.state.optionalFieldVisible });
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
   *
   * @param {object} address to be rendered when user checks same as shipping address checkbox.
   */
  renderShippingAddress(address) {
    const { firstName, lastName, companyName, address: shippingAddress, city, state, zipCode, phoneNumber } = address;
    return (
      <div className="mb-1 mt-1">
        <div className="o-copy__14bold">{titleCase(`${firstName} ${lastName}`)}</div>
        {!companyName && <div className="body-14-regular">{`${titleCase(`${shippingAddress}, ${city}`)}, ${state}`}</div>}
        {companyName && (
          <div>
            <div className="o-copy__14reg">{titleCase(shippingAddress)}</div>
            <div className="o-copy__14reg">{titleCase(companyName)}</div>
            <div className="o-copy__14reg">{`${city} ${state}`}</div>
          </div>
        )}
        <div className="body-14-regular">{`${zipCode}, ${formatPhoneNumber(phoneNumber)}`}</div>
      </div>
    );
  }

  render() {
    const { cms, shippingAddress, initialValues, shippingAddressRequired, phoneNumberCheckboxVisible } = this.props;
    return (
      <form name="paymentForm" className={`${billingFromError}`} onSubmit={evt => evt.preventDefault()}>
        {shippingAddressRequired && (
          <Field
            name="sameAsShippingAddress"
            id="sameAsShippingAddress"
            label={cms.sameAsShippingAddressText}
            component={RenderCheckbox}
            labelClass="body-14-regular"
            checkboxLabel="body-14-regular"
            disabled={!shippingAddressRequired}
          />
        )}
        {initialValues && !initialValues.sameAsShippingAddress ? (
          <div className="mt-1">
            <div className="row">
              <div className="col-12 col-md-6 body-14-regular">
                <Field
                  name="billingFirstName"
                  id="billingFirstName"
                  type="text"
                  label={cms.firstNameLabel}
                  component={RenderTextField}
                  maxLength="50"
                />
              </div>
              <div className="col-12 col-md-6 mb-1 mt-1 mt-lg-0 body-14-regular">
                <Field name="billingLastName" id="billingLastName" type="text" label={cms.lastNameLabel} component={RenderTextField} maxLength="50" />
              </div>
            </div>
            <div className="row">
              <div className="mb-1 col-12 col-md-6 body-14-regular">
                <Field
                  name="billingPhoneNumber"
                  id="billingPhoneNumber"
                  type="tel"
                  label={cms.phoneNumberLabel}
                  component={RenderTextField}
                  maxLength="10"
                  normalize={this.normalizeNumber}
                />
              </div>
            </div>
            {phoneNumberCheckboxVisible && (
              <div className="row">
                <div className="col-12 mb-1 body-14-regular">
                  <Field
                    name="billingSMSLabel"
                    id="billingSMSLabel"
                    label={cms.sendSmsLabel}
                    component={RenderCheckbox}
                    checked={this.state.isChecked}
                    onChange={this.handleCheckbox}
                    labelClass="body-12-regular"
                    checkboxLabel="body-14-regular"
                  />
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-12 body-14-regular mb-half">
                <Field name="billingAddress1" id="billingAddress1" type="text" label={cms.addressLabel} component={RenderTextField} maxLength="50" />
              </div>
            </div>

            {!this.state.optionalFieldVisible ? (
              <a onClick={this.toggleCompanyField} href=" #" id="optionalAddressField" className={`body-14-regular mt-1 ${AddOptionalAddressLink}`}>
                {' '}
                {cms.addMoreDetailsOptionalLabel}
              </a>
            ) : (
              <div className="row">
                <div className="form-group col-12 mt-1 body-14-regular">
                  <Field
                    name="billingCompany"
                    id="billingCompany"
                    type="text"
                    label={cms.addMoreDetailsOptionalLabel}
                    component={RenderTextField}
                    maxLength="50"
                  />
                </div>
              </div>
            )}
            <div className="w-100 d-flex flex-column">
              <div className="w-100 d-flex flex-column flex-lg-row mt-1 mb-1 body-14-regular">
                <div className="col-12 col-lg-3 p-0">
                  <Field
                    name="billingZipCode"
                    id="billingZipCode"
                    type="tel"
                    label={cms.zipCodeLabel}
                    component={RenderTextField}
                    onChange={this.onChangeZipHandler}
                    maxLength="5"
                  />
                </div>
                <div className="col-12 col-lg-9 p-0 d-flex pt-1 pt-lg-0">
                  <div className="col-7 p-0 pl-lg-2">
                    <Field name="billingCity" id="billingCity" type="text" label={cms.cityLabel} component={RenderTextField} maxLength="50" />
                  </div>
                  <div className="col-5 p-0 pl-lg-2 pl-1">
                    <Field
                      name="billingState"
                      id="billingState"
                      type="text"
                      label={cms.stateLabel}
                      component={RenderDropdown}
                      height="2.5rem"
                      DropdownOptions={USStates}
                      initiallySelectedOption={this.state.selectedStateIndex}
                      placeholderOption=" "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="form-group">{this.renderShippingAddress(shippingAddress)}</div>
        )}
        {StorageManager.getCookie('USERTYPE') !== 'R' && (
          <div className="w-100 mb-1 body-14-regular">
            <Field name="email" id="email" type="email" label={cms.emailAddressForOrderConfirmation} component={RenderEmailField} maxLength="255" />
          </div>
        )}
        <div className="w-100 mb-1 body-14-regular">
          <Field
            name="promotionCheckbox"
            id="promotionCheckbox"
            label={cms.promotionalSignupText}
            component={RenderCheckbox}
            labelClass="body-12-regular"
            checkboxLabel="body-14-regular"
          />
        </div>
        {(this.props.savePaymentInfoForLater || !this.props.initialValues.sameAsShippingAddress) && (
          <div className="form-group mb-1">
            <Field
              name="savePaymentInfoCheckbox"
              id="savePaymentInfoCheckbox"
              label={cms.savePaymentInfoLabel}
              component={RenderCheckbox}
              labelClass="body-12-regular"
            />
          </div>
        )}
      </form>
    );
  }
}

BillingForm.propTypes = {
  cms: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  fnLoadCityStateData: PropTypes.func,
  shippingAddress: PropTypes.object,
  savePaymentInfoForLater: PropTypes.bool,
  shippingAddressRequired: PropTypes.bool,
  phoneNumberCheckboxVisible: PropTypes.bool,
  deliveryZip: PropTypes.object,
  analyticsContent: PropTypes.func
};

const mapStateToProps = (reduxState, ownProps) => {
  const {
    fetchCityStateFromZipCode: { isFetching, error, data },
    deliveryZip,
    billingFormState,
    shippingAddressRequired
  } = ownProps;

  // existing values in redux form.
  const existingValues = getFormValues('paymentForm')(reduxState); // eslint-disable-line
  // We are showing the billing address form, when click on change billing address link
  let initialValues = {
    sameAsShippingAddress: !billingFormState ? shippingAddressRequired : false,
    savePaymentInfoCheckbox: true,
    promotionCheckbox: true
  };
  if (deliveryZip && deliveryZip.zipCode) {
    initialValues = Object.assign({}, initialValues, { billingZipCode: deliveryZip.zipCode });
  }
  initialValues = Object.assign({}, initialValues, existingValues);
  if (isFetching === false && error === false && Object.keys(data).length > 0) {
    const { state, city } = data;
    const billingCity = city === undefined ? '' : city;
    const billingState = state === undefined ? '' : state;
    const stateCity = { billingCity, billingState };
    initialValues = Object.assign({}, initialValues, stateCity);
  }
  const { zipCode } = initialValues;
  initialValues.zipCode = restrictZipCodeFieldValue(zipCode);
  return {
    initialValues
  };
};
const mapDispatchToProps = dispatch => ({
  fnLoadCityStateData: data => dispatch(loadCityStateFromZipCode(data)),
  fnEraseCityStateData: () => dispatch(eraseCityStateData())
});
const BillingReduxForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: (values, props) => {
    const billingErrors = validateBillingForm(values, props);
    const paymentFormErrors = validatePaymentForm(values, props);
    return Object.assign({}, billingErrors, paymentFormErrors);
  },
  asyncValidate
})(BillingForm);

const connectedBillingForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(BillingReduxForm);

connectedBillingForm.defaultProps = {
  fetchCityStateFromZipCode: { isFetching: true, error: false, data: {} }
};

export default connectedBillingForm;
