// Creating a form for Create Account
import React from 'react';
import Button from '@academysports/fusion-components/dist/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Responsive from 'react-responsive';
import RenderPasswordField from './renderInputField';
import RenderCheckboxField from './renderCheckboxField';
import validationRules from './validationRules';
import PasswordStrengthMeter from '../passwordStrengthMeter';
import { SHOW_LABEL, HIDE_LABEL, MOBILE_MAX_WIDTH, DESKTOP_MIN_WIDTH } from './constants';
import * as styles from './styles';

export class CreateAccountForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkboxChecked: true
    };
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }
  /**
   * Toggle the checkbox and shows initially checked.
   */
  toggleCheckbox() {
    const { checkboxChecked } = this.state;
    this.setState({ checkboxChecked: !checkboxChecked });
  }
  renderForMobile() {
    const { cms, submitting, handleSubmit, onSubmitForm, email, showPassMeter, loginPassword, validatePass } = this.props;
    const { checkboxChecked } = this.state;
    const sameAsEmail = value => (value && email === value ? cms.errorMsg.passwordSameAsLogin : undefined);
    return (
      <div className="row pb-half">
        <div className="form-group mt-1 col-12">
          <form action="#">
            <Field
              name="logonPassword"
              type="text"
              id="order-confirmation-logonPassword"
              classname={styles.passwordFieldShowHideButton}
              label={cms.choosePassword}
              component={RenderPasswordField}
              buttonShow={SHOW_LABEL}
              buttonHide={HIDE_LABEL}
              validate={sameAsEmail}
              onBlur={validatePass}
              onFocus={loginPassword}
            />
          </form>
          {showPassMeter ? (
            <PasswordStrengthMeter cms={cms} password={this.props.password ? this.props.password : ''} callbackValidator={value => value} />
        ) : null}
        </div>
        <div className="pt-2 col-12">
          <Field
            name="signupToEmails"
            id="signupToEmails"
            type="checkbox"
            check={checkboxChecked}
            label={cms.notifyMe}
            component={RenderCheckboxField}
            onChange={this.toggleCheckbox}
          />
        </div>
        <div className="col-12 pt-1">
          <Button
            type="submit"
            disabled={submitting}
            size="XS"
            auid="button-1"
            className={`${styles.submitBtnHeight} w-100`}
            onClick={handleSubmit(data => {
            onSubmitForm(data, this.props);
          })}
          >
            {cms.commonLabels.submitLabel}
          </Button>
        </div>
      </div>
    );
  }
  renderForDesktop() {
    const { cms, submitting, handleSubmit, onSubmitForm, email, showPassMeter, loginPassword, validatePass } = this.props;
    const { checkboxChecked } = this.state;
    const sameAsEmail = value => (value && email === value ? cms.errorMsg.passwordSameAsLogin : undefined);
    return (
      <div className="row pb-half">
        <div className="form-group mt-1 col-6">
          <form action="#">
            <Field
              name="logonPassword"
              type="text"
              id="order-confirmation-logonPassword"
              classname={styles.passwordFieldShowHideButton}
              label={cms.choosePassword}
              component={RenderPasswordField}
              buttonShow={SHOW_LABEL}
              buttonHide={HIDE_LABEL}
              validate={sameAsEmail}
              onBlur={validatePass}
              onFocus={loginPassword}
            />
          </form>
          {showPassMeter ? (
            <PasswordStrengthMeter cms={cms} password={this.props.password ? this.props.password : ''} callbackValidator={value => value} />
        ) : null}
        </div>
        <div className="offset-1 col-3 pt-5 px-0">
          <Button
            type="submit"
            disabled={submitting}
            size="XS"
            auid="button-1"
            className={`${styles.submitBtnHeight} w-100`}
            onClick={handleSubmit(data => {
            onSubmitForm(data, this.props);
          })}
          >
            {cms.commonLabels.submitLabel}
          </Button>
        </div>
        <div className="p-1">
          <Field
            name="signupToEmails"
            id="signupToEmails"
            type="checkbox"
            check={checkboxChecked}
            label={cms.notifyMe}
            component={RenderCheckboxField}
            onChange={this.toggleCheckbox}
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      <section>
        <Responsive maxWidth={MOBILE_MAX_WIDTH}>{this.renderForMobile()}</Responsive>
        <Responsive minWidth={DESKTOP_MIN_WIDTH}>{this.renderForDesktop()}</Responsive>
      </section>
    );
  }
}

CreateAccountForm.propTypes = {
  cms: PropTypes.object.isRequired,
  submitting: PropTypes.bool,
  onSubmitForm: PropTypes.func,
  handleSubmit: PropTypes.isRequired,
  password: PropTypes.string,
  email: PropTypes.string,
  loginPassword: PropTypes.func,
  showPassMeter: PropTypes.bool,
  validatePass: PropTypes.func
};
const selector = formValueSelector('createAccount');
export default connect(state => {
  const password = selector(state, 'logonPassword');
  return {
    password
  };
})(
  reduxForm({
    form: 'createAccount',
    destroyOnUnmount: false,
    validate: validationRules,
    onSubmitFail: (errors, dispatch, submitError, props) => {
      const { analyticsContent } = props;
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'form validation error|create account',
        eventLabel: Object.keys(errors)
          .map(data => errors[data])
          .toString()
      };
      analyticsContent(analyticsData);
    }
  })(CreateAccountForm)
);
