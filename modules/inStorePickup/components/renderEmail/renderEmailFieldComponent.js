import React from 'react';
import PropTypes from 'prop-types';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import { domainsList } from './../../../../utils/constants';

const renderEmailField = ({ input: { name, id, ...input }, label, type, meta: { touched, error, warning }, ...rest }) => (
  <div>
    <label className="o-copy__14bold">{label}</label>
    <div>
      <EmailField
        domainsList={domainsList}
        width="100%"
        height="2.5rem"
        borderradius="4px"
        bordercolor={touched && error ? '#c00000' : 'rgba(0, 0, 0, 0.3)'}
        borderwidth="1px"
        className="w-100"
        initialValue={input.value}
        type={type}
        name={name}
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
  meta: PropTypes.object
};
export default renderEmailField;
