import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';

export const renderField = ({ input, label, type, check, id }) => (
  <div>
    <label className="o-copy__14reg d-flex">
      <Checkbox
        {...input}
        id={id}
        checked={check}
        disabled={false}
        formLabel="createAccount"
        type={type}
        // onChange={this.functionToBeExecutedWhenCheckboxChanges}
      />
      <div className="ml-half">{label}</div>
    </label>
  </div>
);
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};
export default renderField;
