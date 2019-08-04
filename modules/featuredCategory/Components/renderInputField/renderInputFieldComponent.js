// It return the Input field for the redux form

import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';
import { labelStyle, errorStyles } from '../../featuredCategory.styles';

export const renderField = ({
 input, label, id, type, meta: { touched, error, warning }, margin, touchedMargin, ...rest
}) => (
  <div className={touched ? touchedMargin : margin}>
    <label htmlFor={id} className={`${labelStyle} o-copy__14bold`}>{label}</label>
    <div>
      <Input
        {...input}
        width="36.3125rem"
        height="2.5rem"
        borderradius="4px"
        bordercolor={touched && error ? '#c00000' : 'rgba(0, 0, 0, 0.3)'}
        borderwidth="1px"
        classname="w-100"
        id={id}
        type={type}
        {...rest}
      />
      {(touched && ((error && <span className={`${errorStyles} o-copy__12reg text-danger`}>{error}</span>) || (warning && <span className={`${errorStyles} o-copy__12reg`}>{warning}</span>))) || <span className={`${errorStyles} o-copy__12reg`}> </span>}
    </div>
  </div>
  );
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  margin: PropTypes.string,
  touchedMargin: PropTypes.string
};
export default renderField;
