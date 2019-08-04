import React from 'react';
import { cx } from 'react-emotion';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import PasswordField from '@academysports/fusion-components/dist/PasswordField';
import InputField from '@academysports/fusion-components/dist/InputField';
import Button from '@academysports/fusion-components/dist/Button';
import FormErrorScrollManager from '../../utils/FormErrorScrollManager';
import { MOBILE_MAX_WIDTH, DESKTOP_MIN_WIDTH, UPDATE_PASSWORD, BACK_TO_PROFILE_PAGE, SHOW_LABEL, HIDE_LABEL } from './constants';
import PasswordStrengthMeter from '../passwordStrengthMeter';
import * as styles from './style';

export class EditPasswordView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      condition: {
        currentPassword: '',
        newPassword: '',
        email: '',
        submitButtonActive: false
      },
      currentPasswordError: '',
      newPasswordError: '',
      showStrengthMeterAndRules: false,
      preventValidateFail: false
    };
    this.errorScrollManager = new FormErrorScrollManager('.form-scroll-to-error');
    this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.checkValidation = this.checkValidation.bind(this);
    this.handleCurrentPasswordValidation = this.handleCurrentPasswordValidation.bind(this);
    this.handleNewPasswordValidation = this.handleNewPasswordValidation.bind(this);
    this.updatePasswordWrapper = this.updatePasswordWrapper.bind(this);
    this.handleFocusOnNewPassword = this.handleFocusOnNewPassword.bind(this);
  }
  /**
   * Function to set the intent for submit
   * Needed to prevent focus event from firing on create password
   */
  submitButtonClickIntentHandler = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Method to set state to display password strength meter component.
   * Will be displayed only when user has focus on new password field.
   */
  handleFocusOnNewPassword() {
    this.setState({ showStrengthMeterAndRules: true });
  }
  checkValidation(active) {
    this.setState({
      submitButtonActive: active
    });
  }
  handleCurrentPasswordChange(event) {
    this.setState({
      condition: {
        newPassword: this.state.condition.newPassword,
        currentPassword: event.target.value
      }
    });
  }
  handleNewPasswordChange(event) {
    this.setState({
      condition: {
        currentPassword: this.state.condition.currentPassword,
        newPassword: event.target.value
      }
    });
  }

  handleCurrentPasswordValidation(value) {
    this.validationLogicUtility('currentPasswordError', value);
  }

  handleNewPasswordValidation(value) {
    this.setState({ showStrengthMeterAndRules: false });
    this.validationLogicUtility('newPasswordError', value);
  }

  updatePasswordWrapper() {
    const {
      condition,
      preventValidateFail,
      condition: { currentPassword, newPassword }
    } = this.state;
    const { email } = this.props;
    condition.email = email;
    const { analyticsContent } = this.props;
    this.handleCurrentPasswordValidation(currentPassword);
    this.handleNewPasswordValidation(newPassword);
    const currentPasswordErrorMessage = 'Please enter your current password';
    const newPasswordErrorMessage = 'Please enter a new password';
    const errorMessageToPopulate = `${condition.currentPassword === '' ? currentPasswordErrorMessage : ''}|${condition.newPassword === '' ? newPasswordErrorMessage : ''}`;
    if (condition.currentPassword === '' || condition.newPassword === '') {
      const analyticsDataOnError = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'form validation error|password form',
        eventLabel: errorMessageToPopulate
      };
      analyticsContent(analyticsDataOnError);
    }
    if (preventValidateFail && currentPassword.length !== 0 && newPassword.length !== 0) {
      this.props.onUpdatePassword(condition);
    }
  }

  validationLogicUtility = (key, value) => {
    const {
      cms: { errorMsg }
    } = this.props;
    const consData = /(.)\1\1/g; // regular expression to check more than 3 same consecutive characters
    const checkRegEx = consData.test(value);
    if (value.length < 1) {
      // if password entered is blank.
      if (key === 'currentPasswordError') {
        this.setState(
          {
            [key]: errorMsg.enterCurrentPassword,
            preventValidateFail: false
          },
          () => this.errorScrollManager.scrollToError()
        );
      } else {
        this.setState(
          {
            [key]: errorMsg.enterNewPassword,
            preventValidateFail: false
          },
          () => this.errorScrollManager.scrollToError()
        );
      }
    } else if (checkRegEx) {
      // if password entered has 3 consecutive same characters.
      this.setState(
        {
          [key]: errorMsg.passwordCanNotContainACharacterConsecutivelyThanThreeTimes,
          preventValidateFail: false
        },
        () => this.errorScrollManager.scrollToError()
      );
    } else if (value.length < 8) {
      // password has to be minimum 8 characters.
      this.setState(
        {
          [key]: errorMsg.passwordLengthError,
          preventValidateFail: false
        },
        () => this.errorScrollManager.scrollToError()
      );
    } else {
      this.setState({
        [key]: '',
        preventValidateFail: true
      });
    }
  };

  render() {
    const { cms, errorMsg, updatePasswordError, updatePasswordErrorCode } = this.props;
    const { commonLabels: { showLabel, hideLabel } = '' } = cms;
    const { currentPasswordError, newPasswordError, showStrengthMeterAndRules } = this.state;
    return (
      <React.Fragment>
        <div className="px-0 px-sm-1 px-md-3 pt-3">
          {updatePasswordError ? (
            <div>
              <section className={`${styles.errorWrapper} d-flex flex-column p-1 mb-2`}>
                <p className="o-copy__14reg mb-0">{cms.errorMsg[updatePasswordErrorCode]}</p>
              </section>
            </div>
          ) : null}
          <label htmlFor="profile-currentPassword">
            <span className="o-copy__14bold mb-half d-block">{cms.currentPasswordLabel}</span>
          </label>
          <div className="row mx-0">
            <InputField
              autocomplete="off"
              name="currentPassword"
              id="profile-currentPassword"
              type="password"
              classname={cx(styles.passwordFieldStyle, 'pr-1 pr-md-0 w-100 col-12 col-lg-9', currentPasswordError && styles.invalid, {
                'form-scroll-to-error': !this.state.preventValidateFail
              })}
              onChange={this.handleCurrentPasswordChange}
              onBlur={event => this.handleCurrentPasswordValidation(event.target.value)}
            />
          </div>
          <span className="body-12-regular text-danger d-block mt-quarter"> {currentPasswordError && `${currentPasswordError}`}</span>
          <label htmlFor="profile-newPassword">
            <span className="o-copy__14bold pt-2 mb-half d-block">{cms.newPasswordLabel}</span>
          </label>
          <div className="row mx-0">
            <PasswordField
              autocomplete="off"
              name="newPassword"
              id="profile-newPassword"
              classname={cx(styles.passwordFieldStyle, 'col-12 col-lg-9 px-0', newPasswordError && styles.invalid, {
                'form-scroll-to-error': !this.state.preventValidateFail
              })}
              onChange={this.handleNewPasswordChange}
              onBlur={event => this.handleNewPasswordValidation(event.target.value)}
              onFocus={this.handleFocusOnNewPassword}
              inlinebuttontextshow={showLabel ? showLabel.toUpperCase() : SHOW_LABEL}
              inlinebuttontexthide={hideLabel ? hideLabel.toUpperCase() : HIDE_LABEL}
              buttontextfont={styles.INLINE_BUTTON_FONT_SIZE}
            />
          </div>
          <span className="body-12-regular text-danger"> {newPasswordError && `${newPasswordError}`} </span>
          {showStrengthMeterAndRules && (
            <PasswordStrengthMeter
              cms={cms}
              errorMsg={errorMsg}
              password={this.state.condition.newPassword}
              callbackValidator={e => this.checkValidation(e)}
            />
          )}
        </div>
        <Responsive minWidth={DESKTOP_MIN_WIDTH}>
          <div className="d-flex flex-row justify-content-center py-3 align-items-center">
            <Button
              data-auid={BACK_TO_PROFILE_PAGE}
              aria-label="Go back to profile page"
              className={classNames('o-copy__14reg mr-0 mr-md-3', styles.bgNone)}
              onClick={this.props.editPasswordClick(false)}
              btntype="tertiary"
              size="S"
            >
              <span>{cms.commonLabels.cancelLabel}</span>
            </Button>
            <Button
              data-auid={UPDATE_PASSWORD}
              aria-label="Click button to update password"
              className="col-4"
              onClick={this.updatePasswordWrapper}
              onMouseDown={this.submitButtonClickIntentHandler}
              size="S"
            >
              {cms.commonLabels.updateLabel}
            </Button>
          </div>
        </Responsive>
        <Responsive maxWidth={MOBILE_MAX_WIDTH}>
          <div className="d-flex flex-column py-3 px-0 px-sm-1 px-md-3">
            <Button data-auid={UPDATE_PASSWORD} aria-label="Click button to update password" onClick={this.updatePasswordWrapper} onMouseDown={this.submitButtonClickIntentHandler} size="S">
              {cms.commonLabels.updateLabel}
            </Button>
            <button
              data-auid={BACK_TO_PROFILE_PAGE}
              aria-label="Go back to profile page"
              className={classNames('o-copy__14reg mt-3', styles.bgNone)}
              onClick={this.props.editPasswordClick(false)}
            >
              <span>{cms.commonLabels.cancelLabel}</span>
            </button>
          </div>
        </Responsive>
      </React.Fragment>
    );
  }
}

EditPasswordView.propTypes = {
  email: PropTypes.string,
  cms: PropTypes.object.isRequired,
  errorMsg: PropTypes.object,
  editPasswordClick: PropTypes.func,
  onUpdatePassword: PropTypes.func,
  updatePasswordError: PropTypes.string,
  updatePasswordErrorCode: PropTypes.string,
  analyticsContent: PropTypes.func
};
