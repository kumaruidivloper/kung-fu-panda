import React from 'react';
import PropTypes from 'prop-types';
import PasswordField from '@academysports/fusion-components/dist/PasswordField';

const renderPasswordField = ({
                       input: { name, ...input },
                       id,
                       label,
                       type,
                       auid,
                       meta: { touched, error, warning },
                       ...rest
                     }) => (
                       <div>
                         <label htmlFor={id} className="o-copy__14bold p-quarter">{label}</label>
                         <div>
                           <PasswordField
                             width="36.3125rem"
                             height="2.5rem"
                             borderradius="4px"
                             bordercolor="rgba(0, 0, 0, 0.3)"
                             borderwidth="1px"
                             classname="w-100"
                             type={type}
                             name={name}
                             id={id}
                             auid={label}
                             buttontextfont="0.75rem"
                             fontSize="1rem"
                             {...input}
                             {...rest}
                           />
                           {touched &&
      ((error && <span className="body-12-regular text-danger">{error}</span>) ||
        (warning && <span className="body-12-regular text-danger">{warning}</span>))}
                         </div>
                       </div>
);
renderPasswordField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  auid: PropTypes.string,
  meta: PropTypes.object
};
export default renderPasswordField;
