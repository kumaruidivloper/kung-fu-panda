import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import RenderTextField from './renderInputField';
import validationRules from './validationRules';
import RenderDropdown from './renderDropdownComponent';
import { renderCheckbox, defaultCheckbox } from './renderCheckboxField';
import { addCompanyStyle, addressBlock, fullNameStyles, addressForm } from './styles';
import { MY_ACCOUNT_ADDRESS_FORM_NAME, ADDRESS_FIELD_HEIGHT } from './constants';
import { USStates } from '../../utils/constants';
import { restrictZipCodeFieldValue } from '../../utils/stringUtils';
const asyncValidate = (values, dispatch, props) =>
  new Promise((resolve, reject) => {
    const { zipCodeCityStateData } = props;
    if (
      zipCodeCityStateData &&
      zipCodeCityStateData.data &&
      Object.keys(zipCodeCityStateData.data).length &&
      zipCodeCityStateData.data.errorMsg.length > 0
    ) {
      reject(new Error({ zipCode: props.zipCodeCityStateData.data.errorMsg }));
    }
  });

export class MyAccountAddressForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addCompanyFlag: false
    };

    this.wrapperRef = React.createRef();

    this.onShowCompanyAddress = this.onShowCompanyAddress.bind(this);
    this.loadCityStateInStore = this.loadCityStateInStore.bind(this);
    this.zipPlusFourFormatValidator = this.zipPlusFourFormatValidator.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const { scrollToTop } = this.props;
    scrollToTop(this.wrapperRef.current);
  }

  componentDidUpdate() {
    const { initialized, initialize, initialValues } = this.props;
    if (!initialized) {
      // re-intializes redux form with initial values when switching from add new address to edit mode
      initialize(initialValues);
    }
  }

  static getDerivedStateFromProps(props) {
    const { zipCodeCityStateData, initialVals } = props;
    if (!zipCodeCityStateData.error && Object.keys(zipCodeCityStateData.data).length > 0) {
      const dropDownIndex = USStates.findIndex(item => item.title === zipCodeCityStateData.data.state);
      return { selectedStateIndex: dropDownIndex > -1 ? dropDownIndex : 0 };
    } else if (initialVals) {
      const dropDownStateIndex = initialVals.state ? USStates.findIndex(item => item.title === initialVals.state) : 0;
      return { selectedStateIndex: dropDownStateIndex };
    }
    return { selectedStateIndex: 0 };
  }
  onShowCompanyAddress(evt) {
    evt.preventDefault();
    this.setState({ addCompanyFlag: true });
  }
  loadCityStateInStore(event) {
    if (this.zipPlusFourFormatValidator(event.target.value)) {
      const queryZipCode = event.target.value.substring(0, 5);
      this.props.fnLoadCityStateData(queryZipCode);
    }
  }
  zipPlusFourFormatValidator(value) {
    const ZIP_FOUR_REGEX = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return ZIP_FOUR_REGEX.test(value);
  }

  /**
   * @description Wrapper for this.props.handleSubmit.  Allows us to execute additional code on submit without being tied to the passed in submit.
   * @param  {Function} onSubmit - Function to be executed when form is submitted successfully.
   */
  handleSubmit = () => {
    const { handleSubmit, errorScrollManager } = this.props;
    handleSubmit();
    errorScrollManager.scrollToError();
  };

  /**
   * Method for handling key presses. Submits the form on an Enter press.
   * @param {object} e Event object corresponding to key down.
   */
  handleKeyDown = e => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  render() {
    const { cms, flag, addressList, index } = this.props;
    const { addCompanyFlag } = this.state;
    return (
      <form onSubmit={this.handleSubmit} ref={this.wrapperRef} name="addressForm">
        <div className={`${addressForm} form`}>
          <div className={` ${fullNameStyles} d-flex flex-column flex-md-row justify-content-between`}>
            <div className="form-group pr-md-1 mb-1 col-md-6 px-0 col-12  ">
              <Field
                data-auid="firstName"
                name="firstName"
                id="myaccount-firstname"
                type="text"
                handleKeyDown={this.handleKeyDown}
                label={cms.checkoutLabels.firstNameLabel}
                component={RenderTextField}
                maxLength="50"
              />
            </div>
            <div className="form-group mb-1 col-md-6 px-0 col-12">
              <Field
                data-auid="lastName"
                name="lastName"
                id="myaccount-lastname"
                type="text"
                handleKeyDown={this.handleKeyDown}
                label={cms.checkoutLabels.lastNameLabel}
                component={RenderTextField}
                maxLength="50"
              />
            </div>
          </div>
          <div className="form-group">
            <Field
              data-auid="addressLine1"
              name="address"
              id="myaccount-address"
              type="text"
              handleKeyDown={this.handleKeyDown}
              label={cms.checkoutLabels.addressLabel}
              component={RenderTextField}
              maxLength="50"
            />
          </div>
          {addCompanyFlag || (flag === 'edit' && addressList[index].companyName.length > 0) ? (
            // show company name field if addcompanyName clicked or company name available in edit mode
            <div className="form-group mt-1">
              <Field
                data-auid="addressLine2"
                name="companyName"
                type="text"
                id="myaccount-companyName"
                handleKeyDown={this.handleKeyDown}
                label={cms.checkoutLabels.addMoreDetailsOptionalLabel}
                component={RenderTextField}
                maxLength="50"
                autoFocus
              />
            </div>
          ) : (
            <div className="mt-1">
              <a onClick={this.onShowCompanyAddress} href=" #" className={`${addCompanyStyle} o-copy__14reg`}>
                {cms.checkoutLabels.addMoreDetailsOptionalLabel}
              </a>
            </div>
          )}
          <div className={`${addressBlock} mt-1`}>
            <div className="form-group">
              <Field
                data-auid="zipCode"
                name="zipCode"
                type="tel"
                id="myaccount-zipcode"
                handleKeyDown={this.handleKeyDown}
                label={cms.checkoutLabels.zipCodeLabel}
                component={RenderTextField}
                onChange={this.loadCityStateInStore}
                maxLength="5"
                onlyNumeric
              />
            </div>
            <div className="form-group mt-1 mt-sm-0">
              <Field
                data-auid="city"
                name="city"
                type="text"
                id="myaccount-city"
                handleKeyDown={this.handleKeyDown}
                label={cms.checkoutLabels.cityLabel}
                component={RenderTextField}
                maxLength="50"
              />
            </div>
            <div className="form-group mt-1 mt-sm-0">
              <Field
                data-auid="state"
                name="state"
                type="text"
                id="myaccount-state"
                handleKeyDown={this.handleKeyDown}
                label={cms.checkoutLabels.stateLabel}
                component={RenderDropdown}
                height={ADDRESS_FIELD_HEIGHT}
                DropdownOptions={USStates}
                initiallySelectedOption={this.state.selectedStateIndex}
                placeholderOption=" "
              />
            </div>
          </div>
          <div className="form-group mb-1 col-md-6 col-12 px-0 pr-md-1 mt-1">
            <Field
              data-auid="phone1"
              name="phoneNumber"
              type="tel"
              id="myaccount-phone"
              handleKeyDown={this.handleKeyDown}
              label={cms.checkoutLabels.phoneNumberLabel}
              component={RenderTextField}
              maxLength="10"
              onlyNumeric
            />
          </div>
          {this.props.addressList !== undefined &&
          this.props.addressList.length > 0 &&
          (this.props.flag === 'edit' ? !this.props.initialVals.primary : true) ? (
            <div className="form-group mt-1 mt-sm-0 copy__16reg d-flex flex-row">
              <Field
                data-auid="defaultAddress"
                name="primary"
                type="checkbox"
                id="myaccount-defaultaddress"
                label={cms.commonLabels.setAsDefault}
                component={renderCheckbox}
                primary={this.props.flag === 'edit' ? this.props.addressList[this.props.index].primary : false}
              />
            </div>
          ) : (
            <div className="form-group mt-1 mt-sm-0 copy__16reg d-flex flex-row">
              <Field data-auid="defaultAddress" name="primary" type="checkbox" label={cms.commonLabels.setAsDefault} component={defaultCheckbox} />
            </div>
          )}
        </div>
      </form>
    );
  }
}

MyAccountAddressForm.propTypes = {
  cms: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  fnLoadCityStateData: PropTypes.func,
  addressList: PropTypes.object,
  initialVals: PropTypes.object,
  index: PropTypes.number,
  flag: PropTypes.string,
  initialized: PropTypes.bool,
  initialize: PropTypes.func,
  initialValues: PropTypes.object,
  errorScrollManager: PropTypes.object,
  scrollToTop: PropTypes.func
};

const mapStateToProps = (reduxState, ownProps) => {
  const { zipCodeCityStateData, initialVals } = ownProps;
  const existingValues = getFormValues(MY_ACCOUNT_ADDRESS_FORM_NAME)(reduxState);
  let initialVal = Object.assign({}, initialVals, existingValues);
  if (zipCodeCityStateData.isFetching === false && zipCodeCityStateData.error === false && Object.keys(zipCodeCityStateData.data).length > 0) {
    const { state, city } = zipCodeCityStateData.data ? zipCodeCityStateData.data : { city: '', state: '' };
    const stateCity = { city, state };
    if (stateCity) {
      initialVal = Object.assign({}, initialVal, stateCity);
    }
  }
  const { zipCode } = initialVal;
  initialVal.zipCode = restrictZipCodeFieldValue(zipCode);
  return {
    initialValues: initialVal
  };
};

const MyAccountAddressFormContainer = reduxForm({
  form: MY_ACCOUNT_ADDRESS_FORM_NAME,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: validationRules,
  asyncValidate,
  onSubmitFail: (error, dispatch, submitError, props) => {
    console.log('onValidate', error, props);
  }
})(MyAccountAddressForm);

export default connect(
  mapStateToProps,
  null
)(MyAccountAddressFormContainer);
