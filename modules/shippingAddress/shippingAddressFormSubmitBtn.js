import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import Prop65Wraning from './components/prop65Warning/prop65Warning';
import {
  seperateLineStyle,
  submitButton
} from './shippingAddress.styles';
import { analyticsErrorTracker, getErrorMessagesFromDOM } from './../../utils/analyticsUtils';
import { analyticsErrorEvent, analyticsErrorEventCategory, analyticsErrorEventAction } from './constants';

export const SubmitButton = props => {
  const { handleSubmit, submitting, btnText, orderDetails, cms } = props;
  return (
    <div>
      {orderDetails && orderDetails.containsProp65Warning &&
      <Prop65Wraning cms={cms} orderDetails={orderDetails} />}
      <div className={`${seperateLineStyle} my-2`} />
      <form className="d-flex justify-content-end">
        <Button
          auid="checkout_goto_shipping_method_btn"
          type="submit"
          disabled={submitting}
          size="S"
          className={`o-copy__14bold px-4 ${submitButton}`}
          onClick={
            handleSubmit(data => {
              props.onSubmitForm(data);
            })
          }
        >{btnText}
        </Button>
      </form>
    </div>
  );
};

SubmitButton.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.isRequired,
  btnText: PropTypes.isRequired,
  onSubmitForm: PropTypes.func,
  orderDetails: PropTypes.object,
  cms: PropTypes.object
};

export default reduxForm({
  form: 'shippingAddress', // a unique identifier for this form
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const forms = document.querySelectorAll('form[name="shippingInfoForm"]');
    getErrorMessagesFromDOM(forms, '.error, .text-danger').then(data => {
      analyticsErrorTracker(analyticsErrorEvent, analyticsErrorEventCategory, analyticsErrorEventAction, data, dispatch, submitError, props);
    });
  }
})(SubmitButton);
