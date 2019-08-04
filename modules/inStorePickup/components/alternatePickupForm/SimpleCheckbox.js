import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxStyles } from '../../inStorePickup.styles';

const SimpleCheckbox = ({ input, label, status }) => (
  <label className="d-flex flex-row">
    <input
      className={CheckboxStyles}
      type="checkbox"
      checked={status}
      disabled={false}
      data-auid="checkout_in_store_pickup_sms_checkbox"
      {...input}
    />
    <p className="pl-1">{label}</p>
  </label>
);

SimpleCheckbox.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  status: PropTypes.bool
};

export default SimpleCheckbox;
