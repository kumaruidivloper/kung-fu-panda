import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';
// import { labelStyle, errorStyles } from '../inStorePickup.styles';

export const renderField = ({
 input, label, type, meta: { touched, error, warning }
}) => (
  <div>
    <label className="o-copy__14bold">{label}</label>
    <div>
      <Input
        {...input}
        width="100%"
        height="2.5rem"
        borderRadius="4px"
        borderColor="rgba(0, 0, 0, 0.3)"
        borderWidth="1px"
        className="w-100"
        placeholder={label}
        type={type}
        data-auid={`_${label}`}
      />
      {touched && ((error && <span className="o-copy__12reg text-danger">{error}</span>) || (warning && <span className="o-copy__12reg text-danger">{warning}</span>))}
    </div>
  </div>
);
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};
export default renderField;
