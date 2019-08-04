import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Input from '@academysports/fusion-components/dist/InputField';
import { labelStyle, formControl, errorBorder } from './styles';
import { ADDRESS_FIELD_HEIGHT } from './constants';

const renderField = ({ input: { value, ...inputRest }, label, id, type, handleKeyDown, meta: { touched, error, warning }, onlyNumeric, ...rest }) => {
  const inputValue = onlyNumeric ? value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1') : value;

  return (
    <div>
      {/* eslint-disable-next-line no-useless-computed-key */}
      <label className={cx(labelStyle, 'o-copy__14bold', { ['form-scroll-to-error']: touched && error })} htmlFor={id}>{label}</label>
      <div>
        <Input
          auid={`${label}-input`}
          {...inputRest}
          value={inputValue}
          id={id}
          height={ADDRESS_FIELD_HEIGHT}
          borderradius="4px"
          bordercolor="rgba(0, 0, 0, 0.3)"
          borderwidth="1px"
          classname={`${formControl} w-100 ${touched && error && errorBorder}`}
          type={type}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {touched &&
          ((error && <span className="o-copy__12reg text-danger">{error}</span>) ||
            (warning && <span className="o-copy__12reg text-danger">{warning}</span>))}
      </div>
    </div>
  );
};

renderField.propTypes = {
  input: PropTypes.isRequired,
  handleKeyDown: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};
export default renderField;
