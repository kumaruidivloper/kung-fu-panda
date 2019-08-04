// Creating a form for Shipping Address and modal for AVS
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';
import RenderTextField from './renderInputField';
import validationRules from './validationRules';
import RenderStateDropdown from './renderStateDropDown';
import { USStates } from '../../utils/constants';
import { normalizeCard, normalizeExpiry, normalizeCvv, normalizePhone } from './creditCardValidationRules';
import { creditcardDetailsStyle, addCompanyStyle, addressBlock, fullNameStyles, bgColorDisable, autoComplete, passwordDesc } from './styles';
import renderField from './renderCardInputField';
import { NAME_ADDRESS_MAX_LEN, ZIP_CODE_MAX_LEN, PHONE_NUM_MAX_LEN } from './constants';

const asyncValidate = (values, dispatch, props) =>
  new Promise((resolve, reject) => {
    const { zipCodeCityStateData } = props;
    if (zipCodeCityStateData.error && zipCodeCityStateData.data.errors.length > 0) {
      reject({ zipCode: zipCodeCityStateData.data.errors[0].errorMessage }); // eslint-disable-line
    }
  });
export class AddressForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addCompanyFlag: false,
      selectedStateIndex: 0
    };
    this.onShowCompanyAddress = this.onShowCompanyAddress.bind(this);
    this.loadCityStateInStore = this.loadCityStateInStore.bind(this);
    this.zipPlusFourFormatValidator = this.zipPlusFourFormatValidator.bind(this);
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
  render() {
    const { cms } = this.props;
    return (
      <section>
        <form name="myaccountPayment">
          <div>
            <div className={classNames(creditcardDetailsStyle)}>
              {this.props.editCreditCard ? (
                <Field
                  data-auid="creditcardField"
                  name="creditcardFieldEdit"
                  id="creditcardFieldEdit"
                  type="tel"
                  editCreditCard={this.props.editCreditCard}
                  maxLength="25"
                  forAttr="creditcardField"
                  className={`${bgColorDisable} ${autoComplete} form-control`}
                  component={renderField}
                  autoComplete="off"
                  placeholder=""
                  infoIcon="false"
                  normalize={normalizeCard}
                  label={this.props.creditCardNumberLabel}
                  onChange={this.props.onEditHandler}
                  validCard={this.props.showValidCard}
                  fetchCardSrc={this.props.creditCardSrc}
                  cms={cms}
                  cardType={this.props.cardType}
                  setCvvLengthOnEdit={this.props.setCvvLengthOnEdit}
                />
              ) : (
                <Field
                  data-auid="creditcardField"
                  name="creditcardField"
                  id="creditcardField"
                  type="tel"
                  editCreditCard={this.props.editCreditCard}
                  maxLength="25"
                  forAttr="creditcardField"
                  className="form-control"
                  component={renderField}
                  placeholder=""
                  infoIcon="false"
                  autoComplete="off"
                  normalize={normalizeCard}
                  label={this.props.creditCardNumberLabel}
                  onChange={this.props.onEditHandler}
                  validCard={this.props.showValidCard}
                  fetchCardSrc={this.props.creditCardSrc}
                  cms={cms}
                  cardType={this.props.cardType}
                />
              )}
              <Field
                data-auid="expiryField"
                name="expiryField"
                id="expiryField"
                type="tel"
                maxLength="5"
                editCreditCard={false}
                forAttr="expirationDate"
                className={`${autoComplete} form-control`}
                component={renderField}
                autoComplete="off"
                placeholder="MM/YY"
                infoIcon="false"
                normalize={normalizeExpiry}
                label={this.props.expirationDateLabel}
                onChange={this.props.onEditHandler}
              />
              <Field
                data-auid="cvvField"
                name="cvvField"
                id="cvvField"
                type="tel"
                maxLength={this.props.cardMaxLength}
                editCreditCard={false}
                forAttr="cvv"
                className={`${autoComplete} ${passwordDesc} form-control`}
                component={renderField}
                placeholder=""
                infoIcon="true"
                cvvCls="cvvCls"
                normalize={normalizeCvv}
                cardsAccepted={this.props.cardsAccepted}
                label={this.props.cvvLabel}
                msg={this.props.cvvHintText}
                onChange={this.props.onEditHandler}
              />
            </div>
          </div>
          <hr />
          <div className={classNames('o-copy__14reg', 'mt-2 mb-3')}>{cms.checkoutLabels.billingInformation}</div>
          <div className="form">
            <div className={` ${fullNameStyles} d-flex justify-content-between`}>
              <div className="form-group pr-md-1 mb-1 col-md-6 px-0 col-12  ">
                <Field
                  data-auid="firstName"
                  name="firstName"
                  id="firstName"
                  type="text"
                  maxLength={NAME_ADDRESS_MAX_LEN}
                  label={cms.checkoutLabels.firstNameLabel}
                  component={RenderTextField}
                  editCreditCard={false}
                />
              </div>
              <div className="form-group mb-1 col-md-6 px-0 col-12">
                <Field
                  data-auid="lastName"
                  name="lastName"
                  id="lastName"
                  type="text"
                  maxLength={NAME_ADDRESS_MAX_LEN}
                  label={cms.checkoutLabels.lastNameLabel}
                  component={RenderTextField}
                  editCreditCard={false}
                />
              </div>
            </div>
            <div className="form-group">
              <Field
                data-auid="addressLine1"
                name="address"
                id="address"
                type="text"
                maxLength={NAME_ADDRESS_MAX_LEN}
                label={cms.checkoutLabels.addressLabel}
                component={RenderTextField}
                editCreditCard={false}
              />
            </div>
            {!this.state.addCompanyFlag ? (
              <a onClick={this.onShowCompanyAddress} href=" #" className={`${addCompanyStyle} o-copy__14reg mt-1`}>
                {' '}
                {cms.checkoutLabels.addMoreDetailsOptionalLabel}
              </a>
            ) : (
              <div className="form-group mt-1">
                <Field
                  data-auid="addressLine2"
                  name="companyName"
                  id="companyName"
                  type="text"
                  maxLength={NAME_ADDRESS_MAX_LEN}
                  label={cms.checkoutLabels.addMoreDetailsOptionalLabel}
                  component={RenderTextField}
                  editCreditCard={false}
                />
              </div>
            )}
            <div className={`${addressBlock} mt-1`}>
              <div className="form-group">
                <Field
                  data-auid="zipCode"
                  name="zipCode"
                  id="zipCode"
                  type="tel"
                  normalize={normalizePhone}
                  maxLength={ZIP_CODE_MAX_LEN}
                  label={cms.checkoutLabels.zipCodeLabel}
                  component={RenderTextField}
                  onChange={this.loadCityStateInStore}
                  editCreditCard={false}
                />
              </div>
              <div className="form-group mt-1 mt-sm-0">
                <Field
                  data-auid="city"
                  name="city"
                  id="city"
                  type="text"
                  maxLength={NAME_ADDRESS_MAX_LEN}
                  label={cms.checkoutLabels.cityLabel}
                  component={RenderTextField}
                  editCreditCard={false}
                />
              </div>
              <div className="form-group mt-1 mt-sm-0">
                <Field
                  data-auid="state"
                  name="state"
                  id="state"
                  type="text"
                  label={cms.checkoutLabels.stateLabel}
                  component={RenderStateDropdown}
                  height="2.5rem"
                  DropdownOptions={USStates}
                  initiallySelectedOption={this.state.selectedStateIndex}
                  editCreditCard={false}
                />
              </div>
            </div>
            <div className="form-group mb-1 col-md-6 col-12 px-0 pr-md-1">
              <Field
                data-auid="phone1"
                name="phoneNumber"
                id="phoneNumber"
                type="tel"
                normalize={normalizePhone}
                maxLength={PHONE_NUM_MAX_LEN}
                label={cms.checkoutLabels.phoneNumberLabel}
                component={RenderTextField}
                editCreditCard={false}
              />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

AddressForm.propTypes = {
  cms: PropTypes.object.isRequired,
  fnLoadCityStateData: PropTypes.func,
  creditCardNumberLabel: PropTypes.string,
  expirationDateLabel: PropTypes.string,
  cvvLabel: PropTypes.string,
  cvvHintText: PropTypes.string,
  cardsAccepted: PropTypes.array,
  editCreditCard: PropTypes.bool,
  showValidCard: PropTypes.bool,
  creditCardSrc: PropTypes.string,
  onEditHandler: PropTypes.func,
  cardMaxLength: PropTypes.number,
  cardType: PropTypes.string,
  setCvvLengthOnEdit: PropTypes.func
};

const mapStateToProps = (reduxState, ownProps) => {
  const { zipCodeCityStateData, initialVals, editCreditCard } = ownProps;
  const existingValues = getFormValues('myAccountPaymentForm')(reduxState); // eslint-disable-line
  let initialVal = Object.assign({}, initialVals, existingValues);
  if (
    (zipCodeCityStateData.isFetching === false &&
      zipCodeCityStateData.error === false &&
      Object.keys(zipCodeCityStateData.data).length > 0 &&
      !editCreditCard) ||
    (editCreditCard && zipCodeCityStateData.data.state !== undefined)
  ) {
    const { state, city } = zipCodeCityStateData.data;
    initialVal = Object.assign({}, initialVal, { city, state });
  }
  return {
    initialValues: initialVal
  };
};
const AddressFormContainer = reduxForm({
  form: 'myAccountPaymentForm',
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: validationRules,
  asyncValidate
})(AddressForm);

export default connect(
  mapStateToProps,
  null
)(AddressFormContainer);
