import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Button from '@academysports/fusion-components/dist/Button';
import InputField from '../../fields/InputField';
import DropDown from '../../fields/DropDown';
import { getBillingAddressLabel } from '../../../../../utils/buyNow/buyNow.utils';
import { FIRST_NAME, LAST_NAME, PHONE, ADDRESS, ADD_MORE_DETAILS_OPTIONAL, CITY, STATE, ZIP_CODE } from './BillingAddressForm.constants';
import { USStates, MAX_LENGTH, MAX_LENGTH_ZIPCODE, MAX_LENGTH_PHONE } from '../../../../../utils/constants';
import { btnFont } from '../../../styles';

class BillingAddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddressLine2: false,
      selectedStateIndex: 0
    };

    this.onShowAddressLine2 = this.onShowAddressLine2.bind(this);
  }

  /**
   *
   * @param {object} props encompasses the latest prop values, using new props we derive the new state.
   * gets called on initial render and subsequent updates.
   */
  static getDerivedStateFromProps(props) {
    const { zipCodeState } = props;
    if (zipCodeState && zipCodeState !== ' ') {
      const dropDownIndex = USStates.findIndex(item => item.title === zipCodeState);
      return { selectedStateIndex: dropDownIndex };
    }
    return { selectedStateIndex: 0 };
  }

  onShowAddressLine2() {
    this.setState({ showAddressLine2: true });
  }

  showAddressLine2() {
    const { addressLine2: value } = this.props;
    const { showAddressLine2 } = this.state;
    return showAddressLine2 || value;
  }

  renderFirstName() {
    const { cms } = this.props;
    const label = getBillingAddressLabel(cms, FIRST_NAME);
    return (
      <Field
        auid="billingFirstName"
        id="billingFirstName"
        name="billingFirstName"
        maxLength={MAX_LENGTH}
        label={label}
        component={InputField}
        aria-label={label}
      />
    );
  }

  renderLastName() {
    const { cms } = this.props;
    const label = getBillingAddressLabel(cms, LAST_NAME);
    return (
      <Field
        auid="billingLastName"
        id="billingLastName"
        name="billingLastName"
        maxLength={MAX_LENGTH}
        label={label}
        component={InputField}
        aria-label={label}
      />
    );
  }

  /**
   * @description Renders Phone Number
   * @returns {JSX}
   */
  renderPhone() {
    const { cms } = this.props;
    const label = getBillingAddressLabel(cms, PHONE);
    return (
      <Field
        auid="billingPhone"
        id="billingPhone"
        type="tel"
        onKeyPress={e => {
          const keyCode = e.keyCode || e.which;
          const keyValue = String.fromCharCode(keyCode);
          if (keyValue !== keyValue.replace(/\D/g, '')) {
            e.preventDefault();
          }
          return true;
        }}
        name="billingPhone"
        maxLength={MAX_LENGTH_PHONE}
        label={label}
        component={InputField}
        aria-label={label}
      />
    );
  }

  renderAddress() {
    const { cms } = this.props;
    const label = getBillingAddressLabel(cms, ADDRESS);
    return (
      <Field
        auid="billingAddress"
        id="billingAddress"
        name="billingAddress"
        maxLength={MAX_LENGTH}
        label={label}
        component={InputField}
        aria-label={label}
      />
    );
  }

  /**
   * @description Renders the Second Address Line
   * @returns {JSX}
   */
  renderAddressLine2() {
    const { cms } = this.props;
    const label = getBillingAddressLabel(cms, ADD_MORE_DETAILS_OPTIONAL);
    return this.showAddressLine2() ? (
      <Field
        auid="billingAddressLine2"
        id="billingAddressLine2"
        name="billingAddressLine2"
        maxLength={MAX_LENGTH}
        label={label}
        component={InputField}
        aria-label={label}
      />
    ) : (
      this.renderAddressLine2Link()
    );
  }

  /**
   * @description Helper method for renderAddressLine2. Renders the Second Address Line Link allowing user to unhide Address Line 2 field.
   * @returns {JSX}
   */
  renderAddressLine2Link() {
    const { cms } = this.props;
    const label = getBillingAddressLabel(cms, ADD_MORE_DETAILS_OPTIONAL);
    return (
      <Fragment>
        <Button auid="showBillingAddressLine2" btntype="tertiary" className={`p-0 text-left ${btnFont}`} onClick={this.onShowAddressLine2}>
          {label}
        </Button>
        <Field type="hidden" auid="billingAddressLine2" id="billingAddressLine2" name="billingAddressLine2" component={InputField} />
      </Fragment>
    );
  }

  renderZipCode() {
    const { cms, onZipCodeChange } = this.props;
    const label = getBillingAddressLabel(cms, ZIP_CODE);
    const onChange = event => onZipCodeChange(event.target.value);
    return (
      <Field
        auid="billingZipCode"
        id="billingZipCode"
        name="billingZipCode"
        maxLength={MAX_LENGTH_ZIPCODE}
        label={label}
        aria-label={label}
        type="tel"
        onKeyPress={e => {
          const keyCode = e.keyCode || e.which;
          const keyValue = String.fromCharCode(keyCode);
          if (keyValue !== keyValue.replace(/\D/g, '')) {
            e.preventDefault();
          }
          return true;
        }}
        component={InputField}
        onChange={onChange}
      />
    );
  }

  renderCity() {
    const { cms } = this.props;
    const label = getBillingAddressLabel(cms, CITY);
    return (
      <Field auid="billingCity" id="billingCity" name="billingCity" maxLength={MAX_LENGTH} label={label} component={InputField} aria-label={label} />
    );
  }

  renderState() {
    const { cms } = this.props;
    const { selectedStateIndex } = this.state;
    const label = getBillingAddressLabel(cms, STATE);
    return (
      <Field
        auid="billingState"
        id="billingState"
        name="billingState"
        label={label}
        component={DropDown}
        height="2.5rem"
        DropdownOptions={USStates}
        initiallySelectedOption={selectedStateIndex}
        aria-label={label}
      />
    );
  }

  render() {
    return (
      <section>
        <div className="row">
          <div className="mb-1 col-12 col-md-6">{this.renderFirstName()}</div>
          <div className="mb-1 col-12 col-md-6">{this.renderLastName()}</div>
          <div className="mb-1 col-12 col-md-5">{this.renderPhone()}</div>
          <div className="mb-1 col-12">{this.renderAddress()}</div>
          <div className="mb-1 col-12">{this.renderAddressLine2()}</div>
          <div className="mb-1 col-6 col-md-3">{this.renderZipCode()}</div>
          <div className="mb-1 col-7 col-sm-8 col-md-6">{this.renderCity()}</div>
          <div className="mb-1 col-5 col-sm-4 col-md-3">{this.renderState()}</div>
        </div>
      </section>
    );
  }
}

BillingAddressForm.propTypes = {
  cms: PropTypes.object,
  onZipCodeChange: PropTypes.func,
  addressLine2: PropTypes.string
};

export default BillingAddressForm;
