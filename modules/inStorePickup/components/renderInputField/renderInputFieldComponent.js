import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';

export const renderField = ({
 input, label, maxLength, type, meta: { touched, error, warning }, ...rest
}) => (
  <div>
    <label className="o-copy__14bold">{label}</label>
    <div>
      <Input
        {...input}
        width="100%"
        height="2.5rem"
        borderradius="4px"
        bordercolor={touched && error ? '#c00000' : 'rgba(0, 0, 0, 0.3)'}
        borderwidth="1px"
        className="w-100"
        type={type}
        maxlength={maxLength}
        data-auid={`checkout_in_store_pickup_input_${label}`}
        {...rest}
      />
      {touched && ((error && <span className="o-copy__12reg text-danger">{error}</span>) || (warning && <span className="o-copy__12reg text-danger">{warning}</span>))}
    </div>
  </div>
);
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  maxLength: PropTypes.string
};
export default renderField;
