import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import CreditCardNumberField from '../../fields/CreditCardNumberField';
import CreditCardCVVField from '../../fields/CreditCardCVVField';
import InputField from '../../fields/InputField';
import { isMobile } from '../../../../../utils/userAgent';
import { getCreditCardLabel } from '../../../../../utils/buyNow/buyNow.utils';
import { CREDIT_CARD_NUMBER, EXPIRATION_DATE, CVV, CVV_HINT_TEXT } from './CreditCardForm.constants';
import { normalizeCard, normalizeExpiry, normalizeCvv } from '../../DefaultPaymentForm/DefaultPaymentForm.validate.creditcard'; // normalizeCard, , normalizeCvv
import { getCVVMaxLength } from '../../../../../utils/validationRules';

class CreditCardForm extends PureComponent {
  /**
   * @description Renders Credit Card Number input field
   * @returns {JSX}
   */
  renderCreditCard() {
    const { cms, cardType } = this.props;
    const label = getCreditCardLabel(cms, CREDIT_CARD_NUMBER);
    return (
      <Field
        auid="creditCardNumber"
        id="creditCardNumber"
        name="creditCardNumber"
        type="tel"
        cms={cms}
        maxLength="25"
        className="form-control"
        component={CreditCardNumberField}
        autoComplete="off"
        placeholder=""
        label={label}
        onChange={this.props.onEditHandler}
        cardType={cardType}
        normalize={normalizeCard}
        aria-label={label}
      />
    );
  }

  /**
   * @description Renders Credit Card Expiration Date input field
   * @returns {JSX}
   */
  renderExpirationDate() {
    const { cms } = this.props;
    const label = getCreditCardLabel(cms, EXPIRATION_DATE);
    return (
      <Field
        auid="creditCardExpiration"
        id="creditCardExpiration"
        name="creditCardExpiration"
        label={label}
        type="tel"
        component={InputField}
        normalize={normalizeExpiry}
        aria-label={label}
        placeholder="MM/YY"
      />
    );
  }

  /**
   * @description Renders Credit Card CVV input field
   * @returns {JSX}
   */
  renderCVV() {
    const { cms, cardType } = this.props;
    const isMobileView = isMobile();
    const type = isMobileView ? 'tel' : 'password';
    const label = getCreditCardLabel(cms, CVV);
    const tooltipMessage = getCreditCardLabel(cms, CVV_HINT_TEXT);
    return (
      <Field
        auid="creditCardCVV"
        id="creditCardCVV"
        name="creditCardCVV"
        type={type}
        maxLength={getCVVMaxLength(cardType)}
        label={label}
        component={CreditCardCVVField}
        normalize={normalizeCvv}
        tooltipMessage={tooltipMessage}
        aria-label={label}
      />
    );
  }

  render() {
    return (
      <section>
        <div className="row">
          <div className="col-12 col-lg-6 mb-1">{this.renderCreditCard()}</div>
          <div className="col-7 col-sm-8 col-lg-4 mb-1">{this.renderExpirationDate()}</div>
          <div className="col-5 col-sm-4 col-lg-2 mb-1">{this.renderCVV()}</div>
        </div>
      </section>
    );
  }
}

CreditCardForm.propTypes = {
  onEditHandler: PropTypes.func,
  cardType: PropTypes.string,
  cms: PropTypes.object
};

export default CreditCardForm;
