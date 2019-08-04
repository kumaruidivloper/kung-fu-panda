// It return the Input field for the redux form

import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';
import { labelStyle, errorStyles, invalid } from '../../style';

export const renderField = ({ input, id, label, type, meta: { touched, error, warning }, ...rest }) => (
  <div>
    <label htmlFor={id} className={`${labelStyle} o-copy__14bold`}>{label}</label>
    <div>
      <Input
        {...input}
        height="2.5rem"
        borderradius="4px"
        bordercolor="rgba(0, 0, 0, 0.3)"
        borderwidth="1px"
        classname={`w-100 ${error && invalid}`}
        type={type}
        id={id}
        {...rest}
      />
      {touched &&
        ((error && <span className={`${errorStyles} o-copy__12reg`}>{error}</span>) ||
          (warning && <span className={`${errorStyles} o-copy__12reg`}>{warning}</span>))}
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
