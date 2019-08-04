import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import { FORM_NAME, analyticsErrorEvent, analyticsErrorEventCategory, analyticsGCErrorEventAction } from './constants';
import { analyticsErrorTracker, getErrorMessagesFromDOM } from './../../utils/analyticsUtils';

const SubmitButton = props => {
  const { handleSubmit, submitting, btnText } = props;
  return (
    <form className="d-flex justify-content-end">
      <Button
        type="submit"
        disabled={submitting}
        size="S"
        className="col-12 col-md-4 w-100 o-copy-14bold"
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
  form: FORM_NAME, // a unique identifier for this form
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const forms = document.querySelectorAll('form[name="addNewGiftCardForm"]');
    getErrorMessagesFromDOM(forms, '.invalidTxt, .text-danger').then(data => {
      analyticsErrorTracker(analyticsErrorEvent, analyticsErrorEventCategory, analyticsGCErrorEventAction, data, dispatch, submitError, props);
    });
  }
})(SubmitButton);
