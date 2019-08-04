import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Button from '@academysports/fusion-components/dist/Button';
import InputField from '../../fields/InputField';
import DropDown from '../../fields/DropDown';
import { getShippingAddressLabel } from '../../../../../utils/buyNow/buyNow.utils';
import { FIRST_NAME, LAST_NAME, ADDRESS, ADD_MORE_DETAILS_OPTIONAL, CITY, STATE, ZIP_CODE, PHONE } from './ShippingAddressForm.constants';
import { USStates, MAX_LENGTH_ZIPCODE, MAX_LENGTH, MAX_LENGTH_PHONE } from '../../../../../utils/constants';
import { btnFont } from '../../../styles';

class ShippingAddressForm extends Component {
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
    const label = getShippingAddressLabel(cms, FIRST_NAME);
    return (
      <Field
        id="shippingFirstName"
        name="shippingFirstName"
        maxLength={MAX_LENGTH}
        forAttr="shippingFirstName"
        label={label}
        component={InputField}
        aria-label={label}
      />
    );
  }

  renderLastName() {
    const { cms } = this.props;
    const label = getShippingAddressLabel(cms, LAST_NAME);
    return (
      <Field
        id="shippingLastName"
        name="shippingLastName"
        maxLength={MAX_LENGTH}
        forAttr="shippingLastName"
        label={label}
        aria-label={label}
        component={InputField}
      />
    );
  }

  renderAddress() {
    const { cms } = this.props;
    const label = getShippingAddressLabel(cms, ADDRESS);
    return (
      <Field
        id="shippingAddress"
        name="shippingAddress"
        maxLength={MAX_LENGTH}
        forAttr="shippingAddress"
        label={label}
        aria-label={label}
        component={InputField}
      />
    );
  }

  /**
   * @description Renders the Second Address Line
   * @returns {JSX}
   */
  renderAddressLine2() {
    const { cms } = this.props;
    const label = getShippingAddressLabel(cms, ADD_MORE_DETAILS_OPTIONAL);
    return this.showAddressLine2() ? (
      <Field
        id="shippingAddressLine2"
        name="shippingAddressLine2"
        maxLength={MAX_LENGTH}
        forAttr="shippingAddressLine2"
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
    const label = getShippingAddressLabel(cms, ADD_MORE_DETAILS_OPTIONAL);
    return (
      <Fragment>
        <Button btntype="tertiary" className={`p-0 text-left ${btnFont}`} aria-label={label} onClick={this.onShowAddressLine2}>
          {label}
        </Button>
        <Field
          type="hidden"
          id="shippingAddressLine2"
          name="shippingAddressLine2"
          forAttr="shippingAddressLine2"
          component={InputField}
          aria-label={label}
        />
      </Fragment>
    );
  }

  renderZipCode() {
    const { cms, onZipCodeChange } = this.props;
    const label = getShippingAddressLabel(cms, ZIP_CODE);
    const onChange = event => onZipCodeChange(event.target.value);
    return (
      <Field
        id="shippingZipCode"
        type="tel"
        onKeyPress={e => {
          const keyCode = e.keyCode || e.which;
          const keyValue = String.fromCharCode(keyCode);
          if (keyValue !== keyValue.replace(/\D/g, '')) {
            e.preventDefault();
          }
          return true;
        }}
        name="shippingZipCode"
        maxLength={MAX_LENGTH_ZIPCODE}
        forAttr="shippingZipCode"
        label={label}
        component={InputField}
        onChange={onChange}
        aria-label={label}
      />
    );
  }

  renderCity() {
    const { cms } = this.props;
    const label = getShippingAddressLabel(cms, CITY);
    return (
      <Field
        id="shippingCity"
        name="shippingCity"
        maxLength={MAX_LENGTH}
        forAttr="shippingCity"
        label={label}
        aria-label={label}
        component={InputField}
      />
    );
  }

  renderState() {
    const { cms } = this.props;
    const label = getShippingAddressLabel(cms, STATE);
    return (
      <Field
        id="shippingState"
        name="shippingState"
        forAttr="shippingState"
        label={label}
        component={DropDown}
        height="2.5rem"
        DropdownOptions={USStates}
        initiallySelectedOption={this.state.selectedStateIndex}
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
    const label = getShippingAddressLabel(cms, PHONE);
    return (
      <Field
        id="shippingPhone"
        type="tel"
        name="shippingPhone"
        maxLength={MAX_LENGTH_PHONE}
        forAttr="shippingPhone"
        label={label}
        component={InputField}
        aria-label={label}
      />
    );
  }

  render() {
    return (
      <section className="px-2 px-md-0">
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

ShippingAddressForm.propTypes = {
  cms: PropTypes.object,
  onZipCodeChange: PropTypes.func,
  addressLine2: PropTypes.string
};

export default ShippingAddressForm;
