import React from 'react';
import PropTypes from 'prop-types';
import Input from '@academysports/fusion-components/dist/InputField';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import { isMobile } from '../../utils/userAgent';
import { labelStyle, errorStyles, tooltipStyle } from './styles';

export const renderField = ({
 input, label, type, meta: { touched, error, warning }, id, tooltipData, apierror, ...rest
}) => (
  <div>
    <label className={`${labelStyle} o-copy__14bold`} htmlFor={id}>{label}
      { tooltipData &&
        <Tooltip
          direction={{ mobile: 'right', desktop: 'top' }}
          align="C"
          lineHeightFix={1.5}
          closeBtn
          content={
            <div id="descriptionTooltipMyAccountGc" role="alert" className="o-copy__12reg" style={{ width: '176px', margin: '0px' }}>
              {tooltipData}
            </div>
          }
          showOnClick={isMobile()}
          ariaLabel={tooltipData}
        >
          <span>
            <button
              className={`academyicon icon-information mx-half ${tooltipStyle}`}
              role="tooltip" //eslint-disable-line
              aria-describedby="descriptionTooltipMyAccountGc"
            />
          </span>
        </Tooltip>
      }
    </label>

    <div>
      <Input
        {...input}
        width="36.3125rem"
        height="2.5rem"
        id={id}
        borderradius="4px"
        bordercolor={touched && error ? '#c00000' : 'rgba(0, 0, 0, 0.3)'}
        borderwidth="1px"
        classname="w-100"
        type={type}
        {...rest}
      />
      {touched && (((error || apierror) && <span className={`body-12-regular text-danger ${errorStyles}`} dangerouslySetInnerHTML={{ __html: error || apierror }}></span>) || (warning && <span className={`body-12-regular ${errorStyles}`}>{warning}</span>))}
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
