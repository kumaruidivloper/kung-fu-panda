// Creating a form for Create Account
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import RenderInputField from './../renderInputField/renderInputFieldComponent';
import RenderEmailField from './../renderEmail/renderEmailFieldComponent';
// import RenderCheckboxField from './../renderCheckbox/renderCheckboxComponent';
import SimpleCheckbox from './SimpleCheckbox';
import validationRules from './../validationRules/validationRules';
import { normalizePhoneNumber } from './../../../../utils/helpers';
import * as constants from './../../constants';

export class AlternatePickupForm extends React.PureComponent {
  render() {
    const { cms, status } = this.props;
    return (
      <form>
        <div className="row pb-1">
          <div className="form-group col-12 col-md-6">
            <Field
              name="firstName"
              type="text"
              label={cms.inStorePickupLabel.alternateFirstNameLabel}
              component={RenderInputField}
              maxLength={constants.NAME_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="form-group mt-2 mt-md-0 col-12 col-md-6">
            <Field
              name="lastName"
              type="text"
              label={cms.inStorePickupLabel.alternateLastNameLabel}
              component={RenderInputField}
              maxLength={constants.NAME_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="form-group mt-2 col-12 col-md-6">
            <Field
              name="email"
              type="text"
              label={cms.inStorePickupLabel.alternateEmailLabel}
              component={RenderEmailField}
              maxLength={constants.EMAIL_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="form-group mt-2  col-12 col-md-6">
            <Field
              name="mobile"
              type="tel"
              label={cms.inStorePickupLabel.alternatePhoneNumberLabel}
              component={RenderInputField}
              maxLength={constants.MOBILE_FIELD_MAX_LENGTH}
              normalize={normalizePhoneNumber}
            />
          </div>
          <div className="col-12 mt-1">
            <Field name="emailNotification" type="checkbox" label={cms.sendSmsLabel} status={status} component={SimpleCheckbox} />
          </div>
        </div>
      </form>
    );
  }
}

AlternatePickupForm.propTypes = {
  cms: PropTypes.object.isRequired,
  status: PropTypes.bool
};
const mapStateToProps = (state, ownProps) => {
  const initialVal = ownProps.formData;
  return {
    initialValues: initialVal
  };
};
const AlternatePickupFormContainer = reduxForm({
  form: 'alternatePickupForm',
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: validationRules
})(AlternatePickupForm);

export default connect(
  mapStateToProps,
  null
)(AlternatePickupFormContainer);
