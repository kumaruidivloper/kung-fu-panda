import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import InputField from '@academysports/fusion-components/dist/InputField';
import { getCreditCardImageByType } from './CreditCardNumberField.utils';
import * as emo from './CreditCardNumberField.emotion';

class CreditCardNumberField extends PureComponent {
  /**
   * @description Renders Credit Card Image inside of Credit Card Field when a matching credit card type is found for current input value.
   * @returns {JSX}
   */
  renderCreditCardImage() {
    const { cardType, cms } = this.props;
    return (
      <span className={emo.ccImageWrapper}>
        <img className={emo.ccImage} alt="" src={getCreditCardImageByType(cardType, cms)} />
      </span>
    );
  }

  render() {
    const {
      name,
      input,
      label,
      className,
      placeholder,
      maxLength,
      type,
      meta: { touched, error },
      ...rest
    } = this.props;

    const clazzName = cx(className, emo.ccField, { [emo.hasError]: touched && error });
    const labelClassName = cx('o-copy__14bold', { ['form-scroll-to-error']: touched && error }); // eslint-disable-line no-useless-computed-key

    return (
      <div className="'form-group mb-0 mb-xl-2'">
        <label htmlFor={name} className="w-100">
          <label className={labelClassName}>{label}</label>
          <InputField
            width="100%"
            height="2.5rem"
            bordercolor="#cccccc"
            borderradius="6px"
            activebordercolor="red"
            activeborderwidth="3px"
            fontWeight="500"
            maxLength={maxLength}
            {...input}
            classname={clazzName}
            placeholder={placeholder}
            type={type}
            {...rest}
          />
          {this.renderCreditCardImage()}
        </label>
        <div className="invalidTxt">{touched && (error && <span className={cx('body-12-regular', emo.redColor)}>{error}</span>)}</div>
      </div>
    );
  }
}

CreditCardNumberField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.string,
  cms: PropTypes.object,
  cardType: PropTypes.string
};

export default CreditCardNumberField;
