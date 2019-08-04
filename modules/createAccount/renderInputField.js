import React from 'react';
import PropTypes from 'prop-types';
import PasswordField from '@academysports/fusion-components/dist/PasswordField';
import { labelStyle, errorStyles } from './styles';

export const renderField = ({ input, id, label, type, buttonShow, buttonHide, meta: { touched, error, warning }, ...rest }) => (
  <div>
    <label htmlFor={id} className={`${labelStyle} o-copy__14bold`}>{label}:</label>
    <div>
      <PasswordField
        {...input}
        width="100%"
        height="42px"
        fontSize="12px"
        borderRadius="4px"
        borderColor="rgba(0, 0, 0, 0.3)"
        borderWidth="0.0625rem"
        className="w-100"
        type={type}
        inlinebuttontextshow={buttonShow}
        inlinebuttontexthide={buttonHide}
        inlinebuttonclass="font-weight-bold pr-half"
        buttontextfont="0.75rem"
        id={id}
        {...rest}
      />
      {touched && ((error && <span className={errorStyles}>{error}</span>) || (warning && <span className={errorStyles}>{warning}</span>))}
    </div>
  </div>
);
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  buttonShow: PropTypes.string,
  buttonHide: PropTypes.string
};
export default renderField;
