/**
 * shippingAddressForm.component.js renders the form for shipping Address and maintains state
 * of the form with respect to city,state,zipcode and other fields with their related logic.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues, change as changeFieldValue } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import RenderTextField from './Components/renderInputField/renderInputFieldComponent';
import RenderDropDown from './Components/renderDropdown/renderDropdownComponent';
import { Suffix, USStates } from '../../utils/constants';
import { openAccount, isMobileTextBox, mobilePaddingTextBox } from './styles';
import validationRules from './validationRules';

const sampleText = `There are many variations of passages of Lorem Ipsum available, but the majority have 
suffered alteration in some form, by injected humour, or randomised words which don't look even slightly
 believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything
  embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat 
  predefined chunks as necessary, making this the first true generator on the Internet. It uses a 
  dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate 
  Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, 
  injected humour, or non-characteristic words etc.`;

export class creditApplicationStep1 extends React.PureComponent {
  constructor(props) {
    super(props);
     this.state = {
      selectedStateIndex: 0,
      selectedSuffixIndex: 0
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    const { initialValues } = this.props;

    if ('title' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'title', initialValues.title);
      const suffixIndex = Suffix.findIndex(item => item === initialValues.title);
      const derivedIndex = suffixIndex > -1 ? suffixIndex : 0;
      this.setState({ selectedSuffixIndex: derivedIndex });
    }

    if ('city' in initialValues) {
       this.props.changeFieldValue('creditApplicationModal', 'city', initialValues.city);
    }

    if ('firstName' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'firstName', initialValues.firstName);
    }

    if ('middleName' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'middleName', initialValues.lastName);
    }

    if ('lastName' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'lastName', initialValues.lastName);
    }

    if ('ssn' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'ssn', initialValues.ssn);
    }

    if ('dateOfBirth' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'dateOfBirth', initialValues.dateOfBirth);
    }

    if ('annualIncome' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'annualIncome', initialValues.annualIncome);
    }

    if ('streetAddress' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'streetAddress', initialValues.streetAddress);
    }

    if ('suiteOrApartment' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'suiteOrApartment', initialValues.suiteOrApartment);
    }

    if ('state' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'state', initialValues.state);
      const stateIndex = USStates.findIndex(item => item.title === initialValues.state);
      const derivedIndex = stateIndex > -1 ? stateIndex : 0;
      this.setState({ selectedStateIndex: derivedIndex });
    }

    if ('zipCode' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'zipCode', initialValues.zipCode);
    }

    if ('emailAddress' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'emailAddress', initialValues.emailAddress);
    }

    if ('confirmEmailAddress' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'confirmEmailAddress', initialValues.confirmEmailAddress);
    }

    if ('mobilePhone' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'mobilePhone', initialValues.mobilePhone);
    }

    if ('alternatePhone' in initialValues) {
      this.props.changeFieldValue('creditApplicationModal', 'alternatePhone', initialValues.alternatePhone);
    }
    // call get cityState API only if (city does not exist or city has emoty string) and zipCode exists
    console.log(initialValues, 'dsdas');
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

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <div className={`${openAccount}`}>
          <p>{sampleText} </p>
        </div>
        <div className="mt-4">
          <h5> Your Personal Information </h5>
        </div>
        <form onSubmit={handleSubmit} name="creditApplicationModal">
          <div className="form">
            <div className="d-flex flex-column flex-md-row justify-content-between">
              {(this.props.layout && this.props.layout === 'General') ?
              (<div className={classNames(`${isMobileTextBox}`, 'form-group pr-md-1 col-md-2 px-0')}>
                <Field
                  data-auid="credit_application_title"
                  name="title"
                  id="personal-title"
                  type="text"
                  label="Suffix"
                  margin="mb-2"
                  touchedMargin="mb-1"
                  component={RenderDropDown}
                  DropdownOptions={Suffix}
                  initiallySelectedOption={this.state.selectedSuffixIndex}
                  onKeyDown={this.handleKeyDown}
                />
               </div>) : null }
              <div className={`${isMobileTextBox} form-group px-0 ${this.props.layout === 'General' ? 'col-md-4' : 'col-md-6'}`}>
                <Field
                  data-auid="credit_application_first_name"
                  name="firstName"
                  id="personal-firstName"
                  type="text"
                  label="First Name*"
                  margin="mb-2"
                  touchedMargin="mb-1"
                  component={RenderTextField}
                  maxLength="50"
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                />
              </div>
              {(this.props.layout && this.props.layout === 'General') ?
              (<div className={classNames(`${isMobileTextBox}`, `${mobilePaddingTextBox}`, 'form-group pr-md-1 col-md-2 px-1')}>
                <Field
                  data-auid="credit_application_middle_name"
                  name="middleName"
                  id="personal-middle"
                  type="text"
                  label="MI"
                  margin="mb-2"
                  touchedMargin="mb-1"
                  component={RenderTextField}
                  maxLength="50"
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                />
               </div>) : null }
              <div className={`${isMobileTextBox} form-group ${this.props.layout === 'General' ? 'col-md-4' : 'col-md-6'} pr-md-1 px-0`}>
                <Field
                  data-auid="credit_application_last_name"
                  name="lastName"
                  id="personal-lastName"
                  type="text"
                  label="Last Name*"
                  margin="mb-2"
                  touchedMargin="mb-1"
                  component={RenderTextField}
                  maxLength="50"
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                />
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-between">
              <div className={classNames(`${isMobileTextBox}`, 'form-group pr-md-1 col-md-6 px-0 col-12')}>
                <Field
                  data-auid="credit_application_SSN"
                  name="ssn"
                  id="personal-ssn"
                  type="text"
                  label="Last 4 SSN"
                  margin="mb-2"
                  touchedMargin="mb-1"
                  component={RenderTextField}
                  maxLength="4"
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                  placeholder="XXX - XX -"
                />
              </div>
              <div className={classNames(`${isMobileTextBox}`, 'form-group col-md-6 px-0')}>
                <Field
                  data-auid="credit_application_date_of_birth"
                  name="dateOfBirth"
                  id="personal-dateOfBirth"
                  type="text"
                  label="Data of Birth"
                  margin="mb-2"
                  touchedMargin="mb-1"
                  component={RenderTextField}
                  maxLength="50"
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-between">
              <div className={classNames(`${isMobileTextBox}`, 'form-group pr-md-1 col-md-6 px-0')}>
                <Field
                  data-auid="credit_application_annual_income"
                  name="annualIncome"
                  id="personal-annual-income"
                  type="text"
                  label="Annual Income"
                  margin="mb-2"
                  touchedMargin="mb-1"
                  component={RenderTextField}
                  maxLength="7"
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                  placeholder="$"
                />
              </div>
            </div>
            <div className="mt-2 mb-2">
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
               industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of
               type and scrambled it to make a type specimen book.
              </p>
            </div>
            <hr />
            <div>
              <div className="mt-3 mb-2">
                <h5> Contact Information</h5>
                <p className="mt-2"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industrys standard dummy text ever since the 1500s.
                </p>
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <div className="form-group pr-md-1 col-md-6 px-0 col-12">
                  <Field
                    data-auid="credit_application_street_address"
                    name="streetAddress"
                    id="personal-street-address"
                    type="text"
                    label="Street Address"
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
                    data-auid="credit_application_suite_or_apartment"
                    name="suiteOrApartment"
                    id="personal-suite-or-apartment"
                    type="text"
                    label="Suite or Apartment"
                    margin="mb-2"
                    touchedMargin="mb-1"
                    component={RenderTextField}
                    maxLength="50"
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                    placeholder="Eg. Apt, Suite"
                  />
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <div className="form-group pr-md-1 col-md-4 px-0 col-12">
                  <Field
                    data-auid="credit_application_city"
                    name="city"
                    id="personal-city"
                    type="text"
                    label="City"
                    margin="mb-2"
                    touchedMargin="mb-1"
                    component={RenderTextField}
                    maxLength="50"
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                  />
                </div>
                <div className="form-group col-md-4 px-0 col-12">
                  <Field
                    data-auid="credit_application_state"
                    name="state"
                    id="personal-state"
                    type="text"
                    label="State"
                    margin="mb-2"
                    touchedMargin="mb-1"
                    component={RenderDropDown}
                    DropdownOptions={USStates}
                    initiallySelectedOption={this.state.selectedStateIndex}
                    onKeyDown={this.handleKeyDown}
                    placeholderOption=" "
                  />
                </div>
                <div className={classNames(`${isMobileTextBox}`, `${mobilePaddingTextBox}`, 'form-group col-md-4 px-0 col-12 px-1')}>
                  <Field
                    data-auid="credit_application_zipcode"
                    name="zipCode"
                    id="personal-zipcode"
                    type="text"
                    label="Zip Code"
                    margin="mb-2"
                    touchedMargin="mb-1"
                    component={RenderTextField}
                    maxLength="50"
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                  />
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <div className="form-group pr-md-1 col-md-6 px-0 col-12">
                  <Field
                    data-auid="credit_application_email"
                    name="emailAddress"
                    id="personal-email"
                    type="text"
                    label="Email Address"
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
                    data-auid="credit_application_confirm_email"
                    name="confirmEmailAddress"
                    id="personal-confirm-email"
                    type="text"
                    label="Confirm Email Address"
                    margin="mb-2"
                    touchedMargin="mb-1"
                    component={RenderTextField}
                    maxLength="50"
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                  />
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <div className="form-group pr-md-1 col-md-6 px-0 col-12">
                  <Field
                    data-auid="credit_application_mobile_phone"
                    name="mobilePhone"
                    id="personal-mobile-phone"
                    type="text"
                    label="Mobile Phone"
                    margin="mb-2"
                    touchedMargin="mb-1"
                    component={RenderTextField}
                    maxLength="10"
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                    placeholder="XXX-XXX-XXXX"
                  />
                </div>
                <div className="form-group col-md-6 px-0 col-12">
                  <Field
                    data-auid="credit_application_alternate_phone"
                    name="alternatePhone"
                    id="personal-alternate-phone"
                    type="text"
                    label="Alternate Phone"
                    margin="mb-2"
                    touchedMargin="mb-1"
                    component={RenderTextField}
                    maxLength="10"
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                    placeholder="XXX-XXX-XXXX"
                  />
                </div>
              </div>
              <div className="mt-2 mb-2">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                 industry standard dummy text ever since the 1500s, when an unknown printer took a galley of
                 type and scrambled it to make a type specimen book.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

creditApplicationStep1.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmitForm: PropTypes.func,
  changeFieldValue: PropTypes.func,
  initialValues: PropTypes.object
};

const mapStateToProps = (reduxState, ownProps) => {
  const { initialVals } = ownProps;
  const existingValues = getFormValues('creditApplicationModal')(reduxState);
  const initialVal = Object.assign({}, initialVals, existingValues);
  return {
    initialValues: initialVal
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ changeFieldValue }, dispatch);

const creditApplicationStep1Container = reduxForm({
  form: 'creditApplicationModal',
  validate: validationRules,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true
})(creditApplicationStep1);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(creditApplicationStep1Container);
