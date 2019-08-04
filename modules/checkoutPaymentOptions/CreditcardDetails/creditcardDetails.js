/* eslint complexity: 0 */
import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import InputField from '@academysports/fusion-components/dist/InputField';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import { FORM_NAME, CVV_LENGTH, AMEX_LENGTH, CARD_LENGTH } from './../constants';
import { isMobile } from '../../../utils/userAgent';
import { validatePaymentForm, normalizeCard, normalizeExpiry, normalizeCvv } from '../../../utils/validationRules';
import { validateBillingForm } from '../../billingInfoForm/validationRules';
import { numberOnly } from '../../../apps/checkout/checkout.constants';
import { cvvField, toolTipStyle } from '../payment.styles';

// TODO - move the below component to a new file
const renderField = ({
  input,
  label,
  className,
  placeholder,
  validCard,
  fetchCardSrc,
  maxLength,
  cvvCls,
  msg,
  forAttr,
  type,
  pattern,
  inputmode,
  meta: { touched, error }
}) => {
  const fieldCls = forAttr === 'creditcardField' ? 'form-group mb-0 mb-lg-2' : 'form-group mb-2';

  if (input.name === 'cvvField' && input.value && input.value.length > 1 && input.value.length > maxLength) {
    input.value = input.value.substring(1); // eslint-disable-line
  }

  return (
    <div className={`${fieldCls}`}>
      <label htmlFor={forAttr} className="w-100">
        {label === 'CVV' && (
          <React.Fragment>
            <span className={`body-14-bold ${cvvCls}`}>{label}</span>
            <Tooltip
              auid="checkout_payment_creditCard_cvv_tooltip"
              direction="top"
              align="C"
              lineHeightFix={1.5}
              className="body-12-normal"
              content={
                <div
                  style={{ width: '150px', fontSize: '12px', fontFamily: 'Mallory-Book', fontWeight: 'normal', margin: '0px' }}
                  id="descriptionTooltipCC"
                  role="alert"
                >
                  {msg}
                </div>
              }
              showOnClick={isMobile()}
              ariaLabel={msg}
            >
              <button
                className={`academyicon icon-information mx-half p-0 ${toolTipStyle}`}
                role="tooltip" //eslint-disable-line
                aria-describedby="descriptionTooltipCC"
              />
            </Tooltip>
          </React.Fragment>
        )}
        {label !== 'CVV' && <span className="body-14-bold">{label}</span>}
        <InputField
          disabled={false}
          width="100%"
          height="2.5rem"
          maxLength={maxLength}
          {...input}
          pattern={pattern}
          inputmode={inputmode}
          classname={`${className} ${touched && error ? 'invalidField' : ''}`}
          placeholder={placeholder}
          type={type}
          id={forAttr}
        />
        {forAttr === 'creditcardField' &&
          validCard && (
            <span className="creditcarsBg">
              <img className="loadcardInfo" alt="" src={fetchCardSrc} />
            </span>
          )}
      </label>
      <div className="invalidTxt">
        {touched &&
          (error && (
            <span className="o-copy__12reg" role="alert" aria-atomic="true">
              {error}
            </span>
          ))}
      </div>
    </div>
  );
};

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  forAttr: PropTypes.string,
  maxLength: PropTypes.string,
  cvvCls: PropTypes.string,
  msg: PropTypes.string,
  fetchCardSrc: PropTypes.string,
  validCard: PropTypes.bool
};

class creditcardDetails extends PureComponent {
  componentWillUnmount() {
    this.props.resetFields(FORM_NAME, { cvvField: '' });
  }
  render() {
    const isMobileView = isMobile();
    const type = isMobileView ? 'tel' : 'password';
    const {
      creditCardNumberLabel,
      onEditHandler,
      showValidCard,
      creditCardSrc,
      expirationDateLabel,
      validateCVVLength,
      cardsAccepted,
      cvvLabel,
      cvvHintText,
      cms
    } = this.props;
    return (
      <form id="payment_form" name="paymentForm">
        <div className="creditcardDetails">
          <div className="w-100 d-flex flex-column">
            <div className="w-100 d-flex flex-column flex-xl-row">
              <div className="col-12 col-xl-6 p-0">
                <Field
                  name="creditcardField"
                  type="tel"
                  forAttr="creditcardField"
                  className="form-control"
                  component={renderField}
                  placeholder=""
                  infoIcon="false"
                  maxLength={validateCVVLength > CVV_LENGTH ? AMEX_LENGTH : CARD_LENGTH}
                  normalize={normalizeCard}
                  label={creditCardNumberLabel}
                  onChange={onEditHandler}
                  validCard={showValidCard}
                  fetchCardSrc={creditCardSrc}
                />
              </div>
              <div className="col-12 col-xl-6 p-0 d-flex pt-1 pt-lg-0">
                <div className="col-6 p-0 pl-xl-2 expiry">
                  <Field
                    name="expiryField"
                    type="tel"
                    maxLength="5"
                    forAttr="expiryField"
                    className="form-control"
                    component={renderField}
                    placeholder={cms.expiryDateFormat}
                    infoIcon="false"
                    normalize={normalizeExpiry}
                    label={expirationDateLabel}
                    onChange={onEditHandler}
                  />
                </div>
                <div className="col-6 p-0 pl-2 pl-lg-1 pl-xl-2">
                  <Field
                    name="cvvField"
                    type={type}
                    pattern={numberOnly} // For IOS
                    inputmode="numeric" // Rest of the new browsers
                    maxLength={validateCVVLength}
                    forAttr="cvvField"
                    className={`form-control ${cvvField}`}
                    component={renderField}
                    placeholder=""
                    infoIcon="true"
                    cvvCls="cvvCls"
                    normalize={normalizeCvv}
                    cardsAccepted={cardsAccepted}
                    label={cvvLabel}
                    msg={cvvHintText}
                    onChange={onEditHandler}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

creditcardDetails.propTypes = {
  creditCardNumberLabel: PropTypes.string,
  expirationDateLabel: PropTypes.string,
  cvvLabel: PropTypes.string,
  cvvHintText: PropTypes.string,
  cardsAccepted: PropTypes.array,
  onEditHandler: PropTypes.func,
  showValidCard: PropTypes.bool,
  creditCardSrc: PropTypes.string,
  validateCVVLength: PropTypes.func,
  cms: PropTypes.object,
  resetFields: PropTypes.func
};

export default reduxForm({
  form: FORM_NAME, // a unique identifier for this form
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: (values, props) => {
    const billingErrors = validateBillingForm(values, props);
    const paymentFormErrors = validatePaymentForm(values, props);
    return Object.assign({}, billingErrors, paymentFormErrors);
  }
})(creditcardDetails);
