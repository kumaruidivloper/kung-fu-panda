import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';

export const renderField = ({ input, label, type, status, id }) => (
  <label className="d-flex flex-row">
    <Checkbox
      {...input}
      id={id}
      checked={status}
      disabled={false}
      formLabel="pickupForm"
      // labelText={label}
      labelClass="o-copy__14reg"
      type={type}
      labelPosition="right" // either left or right
      // onChange={this.functionToBeExecutedWhenCheckboxChanges}
      data-auid="checkout_in_store_pickup_sms_checkbox"
    />
    <p className="pl-1">{label}</p>
  </label>
);
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  status: PropTypes.bool
};
export default renderField;
