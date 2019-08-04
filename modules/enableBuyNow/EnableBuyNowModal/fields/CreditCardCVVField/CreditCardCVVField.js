import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Input from '@academysports/fusion-components/dist/InputField';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import * as emo from './CreditCardCVVField.emotion';
import { isMobile } from '../../../../../utils/userAgent';

const CreditCardCVVField = ({ input, label, maxLength, meta: { touched, error, warning }, tooltipMessage, ...rest }) => {
  const clazzName = cx(emo.formControl, 'w-100', { [emo.hasError]: touched && error });
  const labelClassName = cx('o-copy__14bold', { ['form-scroll-to-error']: touched && error }); // eslint-disable-line no-useless-computed-key
  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <Tooltip
        auid="buyNow_creditCard_cvv"
        direction="top"
        align="C"
        lineHeightFix={1.5}
        className="body-12-normal"
        content={
          <div style={{ width: '150px', fontSize: '12px', fontFamily: 'Mallory-Book', fontWeight: 'normal', margin: '0px' }} id="descriptionTooltipCVV" role="alert">{tooltipMessage}</div>
        }
        showOnClick={isMobile()}
        ariaLabel={tooltipMessage}
      >
        <button
          className={`academyicon icon-information ml-half ${emo.tooltipStyle}`}
          role="tooltip" //eslint-disable-line
          aria-describedby="descriptionTooltipCVV"
        />
      </Tooltip>

      <div>
        <Input
          {...input}
          width="100%"
          height="2.5rem"
          borderradius="4px"
          bordercolor="rgba(0, 0, 0, 0.3)"
          borderwidth="1px"
          classname={clazzName}
          placeholder=""
          type="password"
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

CreditCardCVVField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  tooltipMessage: PropTypes.string
};

export default CreditCardCVVField;
