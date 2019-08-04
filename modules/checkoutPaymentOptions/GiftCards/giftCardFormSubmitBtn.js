import React from 'react';
import { css } from 'react-emotion';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import { analyticsErrorTracker, getErrorMessagesFromDOM } from './../../../utils/analyticsUtils';
import { analyticsErrorEvent, analyticsErrorEventCategory, analyticsGCErrorEventAction } from './../constants';

const btn = css`
  min-width: auto;
`;

const SubmitButton = props => {
  const { handleSubmit, submitting, btnText } = props;
  return (
    <form className="d-flex justify-content-end">
      <Button
        auid="checkout_payment_apply_gift_card_btn"
        type="submit"
        btntype="secondary"
        disabled={submitting}
        size="XS"
        className={`w-100 o-copy__14bold ${btn}`}
        onClick={
        handleSubmit(data => {
          props.onSubmitForm(data);
        })}
      >
        {btnText}
      </Button>
    </form>
  );
};

SubmitButton.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.isRequired,
  btnText: PropTypes.isRequired,
  onSubmitForm: PropTypes.func
};

export default reduxForm({
  form: 'giftCard', // a unique identifier for this form
  /* error tracking for analytics purposes */
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const forms = document.querySelectorAll('#paymentGiftCardForm');
    getErrorMessagesFromDOM(forms, '.text-error').then(data => {
      analyticsErrorTracker(analyticsErrorEvent, analyticsErrorEventCategory, analyticsGCErrorEventAction, data, dispatch, submitError, props);
    });
  }
})(SubmitButton);
