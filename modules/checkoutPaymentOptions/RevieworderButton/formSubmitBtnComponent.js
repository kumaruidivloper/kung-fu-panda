import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import { topBorderBtn, submitButton } from '../payment.styles';
import { getFormFields } from '../../../utils/scrollToErrorMessages';
import { FORM_NAME } from './../constants';
const SubmitButton = props => {
  const { handleSubmit, submitting, enableSubmit, formButtonTextStatus, cms } = props;
  return (
    <div className={`${topBorderBtn} mt-2 pt-2`}>
      <form className="d-flex justify-content-end">
        <Button
          type="submit"
          size="S"
          name="submitForm"
          id="submitForm"
          disabled={submitting || !enableSubmit}
          className={`o-copy__14bold px-4 ${submitButton}`}
          onClick={handleSubmit(data => {
            props.onSubmitForm(data, 'myFrame');
          })}
        >
          {formButtonTextStatus ? cms.reviewOrderText : cms.commonLabels.confirmLabel}
        </Button>
      </form>
    </div>
  );
};

SubmitButton.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func,
  enableSubmit: PropTypes.bool,
  formButtonTextStatus: PropTypes.bool,
  cms: PropTypes.object
};

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  onSubmitFail: errors => {
    const forms = document.querySelectorAll('form[name="paymentForm"]');
    if (errors && Object.keys(errors).length) { getFormFields(errors, forms, -30); }
  }
})(SubmitButton);
