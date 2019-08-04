import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';

export const SubmitButton = props => {
  const { handleSubmit, submitting, btnText } = props;
  return (
    <React.Fragment>
      <form className="d-flex justify-content-end">
        <Button
          auid="checkout_goto_shipping_method_btn"
          type="submit"
          disabled={submitting || props.disableButton}
          size="S"
          className="o-copy__14bold px-4"
          onClick={
            handleSubmit(data => {
              props.onSubmitForm(data);
            })
          }
        >{btnText}
        </Button>
      </form>
    </React.Fragment>
  );
};

SubmitButton.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.isRequired,
  btnText: PropTypes.isRequired,
  onSubmitForm: PropTypes.func,
  disableButton: PropTypes.bool
};

export default reduxForm({
  form: 'creditApplicationModal' // a unique identifier for this form
})(SubmitButton);
