import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';
import { labelStyle, formControl, borderRed } from './styles';

const renderField = ({ input, label, type, id, meta: { touched, error, warning }, maxLength }) => (
  <div>
    <label className={`${labelStyle} o-copy__14bold p-quarter`} htmlFor={id}>{label}</label>
    <div>
      <Input
        {...input}
        width="100%"
        height="2.5rem"
        borderradius="4px"
        bordercolor="rgba(0, 0, 0, 0.3)"
        borderwidth="1px"
        maxLength={maxLength}
        id={id}
        classname={`${formControl} w-100 ${touched && error && borderRed}`}
        type={type}
      />
      {touched &&
        ((error && <span className="body-12-regular text-danger">{error}</span>) ||
          (warning && <span className="body-12-regular text-danger">{warning}</span>))}
    </div>
  </div>
);
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  maxLength: PropTypes.number
};
export default renderField;
