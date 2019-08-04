import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';

const CheckboxField = ({ input: { value, onChange, ...input }, label, id, labelClass, meta: { touched, error, warning }, ...rest }) => {
  const labelClassName = cx('o-copy__14reg d-flex', { ['form-scroll-to-error']: touched && error }); // eslint-disable-line no-useless-computed-key
  return (
    <div>
      <label className={labelClassName}>
        <Checkbox {...input} id={id} checked={value} onChange={val => onChange(val)} {...rest} />
        <div className="ml-half">{label}</div>
      </label>
      <div>{touched && ((error && <span className="text-danger">{error}</span>) || (warning && <span className="text-danger">{warning}</span>))}</div>
    </div>
  );
};

CheckboxField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  labelClass: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  meta: PropTypes.object,
  checked: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string
};

export default CheckboxField;
