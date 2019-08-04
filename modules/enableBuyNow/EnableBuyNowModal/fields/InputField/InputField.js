import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';
import { cx } from 'react-emotion';
import * as emo from './InputField.emotion';

const InputField = ({ input, label, type, meta: { touched, error, warning }, ...rest }) => {
  const labelClassName = cx('o-copy__14bold', { ['form-scroll-to-error']: touched && error }); // eslint-disable-line no-useless-computed-key
  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div>
        <Input
          {...input}
          width="100%"
          height="2.5rem"
          borderradius="4px"
          bordercolor="rgba(0, 0, 0, 0.3)"
          borderwidth="1px"
          classname={cx(emo.formControl, 'w-100', { [emo.hasError]: touched && error })}
          type={type}
          {...rest}
        />
        {touched &&
          ((error && (
            <span className="body-12-regular text-danger" role="alert" aria-atomic="true">
              {error}
            </span>
          )) ||
            (warning && (
              <span className="body-12-regular text-danger" role="alert" aria-atomic="true">
                {warning}
              </span>
            )))}
      </div>
    </div>
  );
};

InputField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default InputField;
