import React from 'react';
import PropTypes from 'prop-types';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import { labelStyle } from './../../styles';
import { domainsList } from './../../../../utils/constants';

const renderEmailField = ({
                       input: { name, ...input },
                       id,
                       label,
                       type,
                       auid,
                       meta: { touched, error, warning },
                       ...rest
                     }) => (
                       <div>
                         <label htmlFor={id} className={`${labelStyle} o-copy__14bold p-quarter`}>{label}</label>
                         <div>
                           <EmailField
                             domainsList={domainsList}
                             width="36.3125rem"
                             height="2.5rem"
                             borderradius="4px"
                             bordercolor="rgba(0, 0, 0, 0.3)"
                             borderwidth="1px"
                             className="w-100"
                             type={type}
                             name={name}
                             id={id}
                             auid={label}
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
  auid: PropTypes.string,
  meta: PropTypes.object
};
export default renderEmailField;
