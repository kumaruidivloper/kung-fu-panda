import React from 'react';
import PropTypes from 'prop-types';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import { labelStyle, invalidTxt } from './../../style';
import { domainsList } from './../../../../utils/constants';

const renderEmailField = ({
                       input: { name, ...input },
                       id,
                       label,
                       type,
                       maxLength,
                       meta: { touched, error },
                       ...rest
                     }) => (
                       <div>
                         <label htmlFor={id} className={`${labelStyle} o-copy__14bold mb-half`}>{label}</label>
                         <div>
                           <EmailField
                             domainsList={domainsList}
                             width="36.3125rem"
                             height="2.5rem"
                             className={`w-100 ${touched && error ? 'invalidField' : ''}`}
                             type={type}
                             name={name}
                             maxlength={maxLength}
                             id={id}
                             {...input}
                             {...rest}
                           />
                           {touched &&
      (error && <div className={`o-copy__12reg ${invalidTxt}`} role="alert" aria-atomic="true"><span>{error}</span></div>)}
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
