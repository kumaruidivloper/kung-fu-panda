// Creating a form for Create Account
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import Button from '@academysports/fusion-components/dist/Button';
import validationRules from '../validationRules/validationRules';
import { SWEEPSTAKESFORM } from './../constants';

export const RenderButton = props => {
    const { handleSubmit, buttonClickAction, cms } = props;
    return (
      <form>
        <Button
          auid="sweepstakes_data_submit"
          disabled={false}
          size="S"
          className="col-md-6 col-12 w-100 o-copy__14bold"
          onClick={handleSubmit(data => {
                buttonClickAction(data);
              })}
        >{cms.commonLabels.submitLabel}
        </Button>
      </form>
    );
};

RenderButton.propTypes = {
  cms: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  buttonClickAction: PropTypes.func
};

export default reduxForm({
  form: SWEEPSTAKESFORM,
  validate: validationRules
})(RenderButton);
