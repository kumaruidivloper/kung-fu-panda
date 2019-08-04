import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import { getFormFields } from '../../utils/scrollToErrorMessages';
import { isMobile } from './../../utils/navigator';
import { getErrorMessagesFromDOM, analyticsErrorTracker } from '../../utils/analyticsUtils';
export const SubmitButton = props => {
  const { handleSubmit, submitting, btnText, editCreditCard, deleteItemID, editItemIndex, emptyClickCreditCard } = props;
  return (
    <form className="d-flex justify-content-end">
      <Button
        auid="submit-btn"
        type="submit"
        disabled={submitting}
        size="S"
        className="col-md-6 col-12 w-100 o-copy__14bold"
        onClick={
        handleSubmit(data => {
          props.onSubmitForm(data, editCreditCard, deleteItemID, editItemIndex);
          if (editCreditCard) {
            props.creditCardEditCancelClick();
          } else if (emptyClickCreditCard) {
            props.showFormOnEmptyClick();
          } else {
            props.toggleCreditCard(false);
          }
        })
      }
      >{btnText}
      </Button>
    </form>);
};

SubmitButton.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.isRequired,
  btnText: PropTypes.isRequired,
  onSubmitForm: PropTypes.func,
  editCreditCard: PropTypes.bool,
  deleteItemID: PropTypes.string,
  toggleCreditCard: PropTypes.func,
  creditCardEditCancelClick: PropTypes.func,
  editItemIndex: PropTypes.number,
  showFormOnEmptyClick: PropTypes.func,
  emptyClickCreditCard: PropTypes.bool
};

export default reduxForm({
  form: 'myAccountPaymentForm', // a unique identifier for this form
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const offset = (isMobile()) ? -110 : -30;
    const forms = document.querySelectorAll('form[name="myaccountPayment"]');
    if (errors && Object.keys(errors).length) { getFormFields(errors, forms, offset); }
    getErrorMessagesFromDOM(forms, '.invalidTxt, .text-danger').then(data => {
      analyticsErrorTracker('errormessage', 'error message', `form validation error|${props.editCreditCard ? 'edit' : 'add'} credit card`, data, dispatch, submitError, props);
    });
  },
  onSubmitSuccess: (result, dispatch, props) => {
    props.postUpdateCreditCardAnalyticsData(props);
  }
})(SubmitButton);
