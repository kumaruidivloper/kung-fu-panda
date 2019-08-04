import React from 'react';
import PropTypes from 'prop-types';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import { cx } from 'react-emotion';
import { domainsList } from './../../../../../utils/constants';
import * as styles from './EmailField.style';

const EmailFieldWrapper = ({ input, label, type, maxLength, meta: { touched, error, warning }, ...rest }) => {
  const labelClassName = cx('o-copy__14bold', { ['form-scroll-to-error']: touched && error }); // eslint-disable-line no-useless-computed-key
  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div>
        <EmailField
          {...input}
          domainsList={domainsList}
          height="2.5rem"
          borderradius="4px"
          bordercolor="rgba(0, 0, 0, 0.3)"
          borderwidth="1px"
          className={cx(styles.formControl, 'w-100', { [styles.hasError]: touched && error })}
          type={type}
          maxLength={maxLength}
          {...rest}
        />
        {touched &&
          ((error && <span className="body-12-regular text-danger">{error}</span>) ||
            (warning && <span className="body-12-regular text-danger">{warning}</span>))}
      </div>
    </div>
  );
};
EmailFieldWrapper.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  maxLength: PropTypes.string
};

export default EmailFieldWrapper;
