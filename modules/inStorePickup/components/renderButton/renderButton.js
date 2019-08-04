// Creating a form for Create Account
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import Button from '@academysports/fusion-components/dist/Button';
import validationRules from './../validationRules/validationRules';
import { submitButton } from './../../styles';
export const RenderButton = props => {
    const { handleSubmit, buttonClickAction, buttonText } = props;
    return (
      <form className="col-md-6 col-12">
        <Button
          auid="checkout_goto_shipping_payment_btn"
          // type="submit"
          disabled={false}
          size="S"
          className={`o-copy__14bold px-4 ${submitButton}`}
          onClick={handleSubmit(data => {
            const data2 = {
              ...data,
              mobile: data.mobile && data.mobile.replace(/ - /g, '')
            };
            buttonClickAction(data2);
          })}
        >{buttonText}
        </Button>
      </form>
    );
};

RenderButton.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  buttonClickAction: PropTypes.func,
  buttonText: PropTypes.string
};

export default reduxForm({
  form: 'alternatePickupForm',
  validate: validationRules
})(RenderButton);
