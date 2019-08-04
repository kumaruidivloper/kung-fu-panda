import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';

/**
 * @function this function renders when user add address for the first time and marks it as default
 * @param {Object} input
 * @param {string} label
 * @param {string} type
 */
export const defaultCheckbox = ({ input, label, type, labelClass, checkboxLabel }) => (
  <div>
    <label className={`${labelClass} d-flex`}>
      <Checkbox
        auid={`${label}-checkbox`}
        id={`${label}-checkbox`}
        {...input}
        disabled
        checked
        formLabel="createAccount"
        labelClass="o-copy__14reg"
        type={type}
        labelPosition="right" // either left or right
      />
      <div className={`ml-half ${checkboxLabel}`}>{label}</div>
    </label>
  </div>
);
defaultCheckbox.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};
export const renderField = ({ input, label, type, primary }) => (
  <div>
    <Checkbox
      auid={`${label}-checkbox`}
      id={`${label}-checkbox`}
      {...input}
      // initialState={true} // to render a checked checkbox
      formLabel="createAccount"
      labelText={label}
      labelClass="o-copy__14reg"
      type={type}
      checked={primary} // boolean value that handles checkbox tick
      labelPosition="right" // either left or right
      // onChange={this.functionToBeExecutedWhenCheckboxChanges}
    />
  </div>
);
export const renderCheckbox = ({
  input: { name, value, onChange, ...input },
  label,
  id,
  labelClass,
  checkboxLabel,
  meta: { touched, error, warning },
  ...rest
}) => (
  <div className="mt-2">
    <label className={`${labelClass} d-flex`}>
      <Checkbox {...input} name={name} id={id} checked={value} onChange={val => onChange(val)} {...rest} />
      <div className={`ml-half ${checkboxLabel}`}>{label}</div>
    </label>
    <div>{touched && ((error && <span className="text-danger">{error}</span>) || (warning && <span className="text-danger">{warning}</span>))}</div>
  </div>
);
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  primary: PropTypes.bool
};
