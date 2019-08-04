import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';
import { labelStyle, formControl, invalidTxt } from './../../style';

const renderField = ({
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
                           <Input
                             width="36.3125rem"
                             height="2.5rem"
                             classname={`${formControl} w-100 ${touched && error ? 'invalidField' : ''}`}
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
renderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  maxLength: PropTypes.string
};
export default renderField;
