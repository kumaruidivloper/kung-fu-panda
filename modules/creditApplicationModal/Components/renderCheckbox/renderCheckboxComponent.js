import React from 'react';
import PropTypes from 'prop-types';
// import Checkbox from './../../checkBox';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';

const renderCheckbox = ({
  input: { name, value, onChange, ...input },
  label,
  id,
  labelClass,
  checkboxLabel,
  meta: { touched, error, warning },
  ...rest
}) => (
  <div className="mt-2">
    <label className={`${labelClass} d-flex`}>
      <Checkbox
        {...input}
        name={name}
        id={id}
        checked={value}
        onChange={val => onChange(val)}
        {...rest}
      />
      <div className={`ml-half ${checkboxLabel}`}>{label}</div>
    </label>
    <div>
      {touched &&
((error && <span className="text-danger">{error}</span>) ||
(warning && <span className="text-danger">{warning}</span>))}
    </div>
  </div>
);

renderCheckbox.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  labelClass: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  meta: PropTypes.object,
  checked: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  checkboxLabel: PropTypes.string
};
export default renderCheckbox;
