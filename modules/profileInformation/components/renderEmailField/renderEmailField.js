import React from 'react';
import PropTypes from 'prop-types';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import { labelStyle, invalid } from './../../style';
import { domainsList } from './../../../../utils/constants';

const renderEmailField = ({ input: { name, ...input }, id, label, type, maxLength, meta: { touched, error, warning }, ...rest }) => (
  <div>
    <label htmlFor={id} className={`${labelStyle} o-copy__14bold`}>{label}</label>
    <div>
      <EmailField
        domainsList={domainsList}
        height="2.5rem"
        borderradius="4px"
        bordercolor="rgba(0, 0, 0, 0.3)"
        borderwidth="1px"
        className={`w-100 ${touched && error && invalid}`}
        type={type}
        name={name}
        maxlength={maxLength}
        id={id}
        {...input}
        {...rest}
      />
      {touched &&
        ((error && <span className="body-12-regular text-danger">{error}</span>) ||
          (warning && <span className="body-12-regular text-danger">{warning}</span>))}
    </div>
  </div>
);
renderEmailField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  maxLength: PropTypes.string
};
export default renderEmailField;
