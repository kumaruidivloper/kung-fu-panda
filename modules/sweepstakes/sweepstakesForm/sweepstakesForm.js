// Creating a form for Create Account
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import RenderInputField from '../renderInputField/renderInputFieldComponent';
import validationRules from '../validationRules/validationRules';
import { SWEEPSTAKESFORM } from './../constants';

export class SweepstakesForm extends React.PureComponent {
  render() {
    const { cms } = this.props;
    return (
      <form>
        <div className="row pb-1">
          <div className="form-group col-12 col-md-6">
            <Field name="firstName" type="text" label={cms.checkoutLabels.firstNameLabel} component={RenderInputField} />
          </div>
          <div className="form-group mt-2 mt-md-0 col-12 col-md-6">
            <Field name="lastName" type="text" label={cms.checkoutLabels.lastNameLabel} component={RenderInputField} />
          </div>
          <div className="form-group mt-2 col-12 col-md-6">
            <Field name="email" type="text" label={cms.commonLabels.emailaddressLabel} component={RenderInputField} />
          </div>
          <div className="form-group mt-2  col-12 col-md-6">
            <Field name="zipCode" type="tel" label={cms.checkoutLabels.zipCodeLabel} component={RenderInputField} />
          </div>
        </div>
      </form>
    );
  }
}

SweepstakesForm.propTypes = {
  cms: PropTypes.object.isRequired
};
const mapStateToProps = (state, ownProps) => {
  const initialVal = ownProps.formData;
  return {
    initialValues: initialVal
  };
};
const SweepstakesFormContainer = reduxForm({
  form: SWEEPSTAKESFORM,
  enableReinitialize: true,
  destroyOnUnmount: false,
  validate: validationRules
})(SweepstakesForm);

export default connect(mapStateToProps, null)(SweepstakesFormContainer);
