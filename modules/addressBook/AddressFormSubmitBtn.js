import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import { getErrorMessagesFromDOM, analyticsErrorTracker } from './../../utils/analyticsUtils';
import { analyticsErrorEvent, analyticsErrorEventCategory, analyticsAddErrorEventAction, analyticsEditErrorEventAction } from './constants';
export const SubmitButton = props => {
  const { handleSubmit, errorScrollManager, submitting, btnText, flag, initialVals, index } = props;
  const reduxFormSubmit = handleSubmit(data => {
    props.onSubmitForm(data, flag, initialVals, index);
  });
  const wrappedHandelSubmit = () => {
    reduxFormSubmit();
    errorScrollManager.scrollToError();
  };
  return (
    <form className="d-flex justify-content-end">
      <Button auid="submit_btn" disabled={submitting} size="S" className="col-12 w-100 o-copy__14bold" onClick={wrappedHandelSubmit}>
        {btnText}
      </Button>
    </form>
  );
};

SubmitButton.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.isRequired,
  btnText: PropTypes.isRequired,
  onSubmitForm: PropTypes.func,
  flag: PropTypes.string,
  initialVals: PropTypes.string,
  errorScrollManager: PropTypes.object,
  index: PropTypes.number
};

export default reduxForm({
  form: 'MyAccountAddressForm', // a unique identifier for this form
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const forms = document.querySelectorAll('form[name="addressForm"]');
    getErrorMessagesFromDOM(forms, '.invalidTxt, .text-danger').then(data => {
      const eventAction = props.flag === 'edit' ? analyticsEditErrorEventAction : analyticsAddErrorEventAction;
      analyticsErrorTracker(analyticsErrorEvent, analyticsErrorEventCategory, eventAction, data, dispatch, submitError, props);
    });
  }
})(SubmitButton);
