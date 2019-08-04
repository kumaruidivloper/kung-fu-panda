import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import { isMobile } from '../../../utils/userAgent';
import { labelStyle, errorStyles, toolTip } from './giftCardOption.style';

export const renderField = ({ input, label, id, type, meta: { touched, error, warning }, tooltipData, apierror, ...rest }) => (
  <div>
    <label htmlFor={id} className={`${labelStyle} o-copy__14bold`}>
      {label}
      {tooltipData && (
        <Tooltip
          auid="checkout_payment_gift_card_tooltip"
          direction="top"
          align="C"
          lineHeightFix={1.5}
          closeBtn
          content={
            <div className="o-copy__12reg" style={{ width: '176px', margin: '0px' }} id="descriptionTooltipCartGC" role="alert">
              {tooltipData}
            </div>
          }
          showOnClick={isMobile()}
          ariaLabel={tooltipData}
        >
          <button
            tabIndex="0"
            role="tooltip" //eslint-disable-line
            aria-describedby="descriptionTooltipCartGC"
            className={toolTip}
          >
            <i className="academyicon icon-information mx-half" />
          </button>
        </Tooltip>
      )}
    </label>

    <div>
      <Input
        {...input}
        width="36.3125rem"
        height="2.5rem"
        borderradius="4px"
        bordercolor="rgba(0, 0, 0, 0.3)"
        borderwidth="1px"
        classname="w-100"
        type={type}
        id={id}
        {...rest}
      />
      {touched &&
        (((error || apierror) && <span className={`body-12-regular ${errorStyles} text-error`} dangerouslySetInnerHTML={{ __html: error || apierror }} />) ||
          (warning && <span className={`body-12-regular ${errorStyles}`}>{warning}</span>))}
    </div>
  </div>
);
renderField.propTypes = {
  input: PropTypes.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  tooltipData: PropTypes.string,
  maxLength: PropTypes.string,
  apierror: PropTypes.any
};
export default renderField;
