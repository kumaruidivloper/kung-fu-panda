import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import Button from '@academysports/fusion-components/dist/Button';
import PasswordField from '@academysports/fusion-components/dist/PasswordField';
import { get } from '@react-nitro/error-boundary';
// import InputField from '@academysports/fusion-components/dist/InputField';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import FormErrorScrollManager from '../../utils/FormErrorScrollManager';
import StorageManager from './../../utils/StorageManager';
import { domainsList, PREVIOUS_URL } from './../../utils/constants';
import { isValidEmail } from '../../utils/validationRules';
import { NODE_TO_MOUNT, DATA_COMP_ID, SIGNUP_LINK, FORGOT_PASSWORD_URL, SIGN_UP, FORGOT_PASS, SESSION_EXPIRED } from './constants';
import * as styles from './styles';
import { scrollIntoView } from '../../utils/scroll';
import { SHOW_LABEL, HIDE_LABEL, BTN_LABEL_FONT_SIZE, INLINE_BUTTON_FONT_SIZE } from '../../apps/myaccount/myaccount.constants';
export class SignIn extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      emailId: '',
      password: '',
      invalidEmail: 'Please enter an email address',
      invalidPass: 'Please enter the password',
      validEmail: true,
      validPass: true,
      passLengthZero: true
    };

    this.errorScrollManager = new FormErrorScrollManager('.form-scroll-to-error');

    this.signInConatinerRef = React.createRef();
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePass = this.onChangePass.bind(this);
    this.onEmailSubmit = this.onEmailSubmit.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePass = this.changePass.bind(this);
    this.getEmailErrorState = this.getEmailErrorState.bind(this);
    this.getPasswordErrorState = this.getPasswordErrorState.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
    this.handleForgotPassClick = this.handleForgotPassClick.bind(this);
    this.getErrorMsg = this.getErrorMsg.bind(this);
  }

  /**
   * @function, This function sets the userId in cookies after succesful login ,
   * also it decides the route to which the page should be redirected once the login is succesful.
   * If , the user login with temporary password , the user is redirected to create password page ,
   * otherwise the user is redirected to my account page.
   * @param {object} nextProps, nextProps takes the changes in props of component
   * @return {null} , returns nothing
   */
  componentWillReceiveProps(nextProps) {
    const { token: { identity } = {} } = nextProps.formSubmitStatus;
    if (identity) {
      const { userId, storeLocId, passwordExpiredFlag } = identity;
      const { token: currentToken = {} } = this.props.formSubmitStatus;
      const { identity: currentIdentity = {} } = currentToken;

      if (passwordExpiredFlag !== currentIdentity.passwordExpiredFlag) {
        StorageManager.setSessionStorage('userId', userId);
        StorageManager.setSessionStorage('storeId', storeLocId);
        if (passwordExpiredFlag) {
          window.location.href = '/shop/createpassword';
        } else if (StorageManager.getSessionStorage(PREVIOUS_URL)) {
          const redirectUrl = StorageManager.getSessionStorage(PREVIOUS_URL);
          StorageManager.removeSessionStorage(PREVIOUS_URL);
          window.location.href = redirectUrl;
        } else {
          window.location.href = '/myaccount/profile';
        }
      }
    }

    if (nextProps.error === true) {
      const container = this.signInConatinerRef.current;
      scrollIntoView(container, true);
    }
  }
  /**
   * the function tracks analytics on submit of sign-in form
   * @param {Object} prevProps, previous properties object of component
   */
  componentDidUpdate(prevProps) {
    const { analyticsContent, formSubmitStatus, error } = this.props;
    const eventCheck = document.referrer.indexOf('checkout') !== -1 ? 'checkout' : 'header';
    const analyticsData = {
      event: 'signin',
      eventCategory: 'user account',
      eventAction: 'login',
      eventLabel: `sign in|${eventCheck}`
    };
    if (formSubmitStatus.redirect !== prevProps.formSubmitStatus.redirect) {
      analyticsData.authenticationcomplete = 1;
    }
    if (error !== prevProps.error) {
      analyticsData.authenticationcomplete = error ? 0 : 1;
      analyticsData.event = 'errormessage';
      analyticsData.eventCategory = 'error message';
      analyticsData.eventAction = 'validation error|signin';
      analyticsData.eventLabel = this.getErrorMsg(this.props);
    }
    if (error !== prevProps.error || formSubmitStatus.redirect !== prevProps.formSubmitStatus.redirect) {
      analyticsContent(analyticsData);
      // sets constant for expiry date of 30 days.
      const after30Days = Date.now() + (30 * 24 * 60 * 60);
      StorageManager.setCookie('ANALYTICS_REGISTERED', true, after30Days);
    }
  }
  /**
   * @function, onEmailSubmit function is triggered when the user clicks on sign in button,
   * the function validates the forms and call an action for api call if the form is valid.
   * @param {*} event, event
   * @returns {null}, returns nothing
   */
  onEmailSubmit(event) {
    event.preventDefault();
    const { fnShowLoader, fnHideLoader, fnSigninCall, analyticsContent } = this.props;
    const { validEmail, validPass, emailId } = this.state;
    const emailErrorState = this.getEmailErrorState(emailId);
    const passwordErrorState = this.getPasswordErrorState();

    fnShowLoader(); // show loader as soon as user clicks on submit.
    if (validEmail && validPass && !emailErrorState && !passwordErrorState) {
      fnSigninCall({
        logonId: this.state.emailId,
        logonPassword: this.state.password
      });
    } else {
      this.setState({ ...emailErrorState, ...passwordErrorState }, () => this.errorScrollManager.scrollToError());
      fnHideLoader(); // hide loader in case of error.

      const clientSideErrors = [this.state.invalidEmail, this.state.invalidPass];
      const errorEventLabel = clientSideErrors.filter(Boolean).join(',');
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'validation error|signin',
        eventLabel: `${errorEventLabel}`
      };
      analyticsContent(analyticsData);
    }
  }

  /**
   * @function, onChangeinput function sets the value of form field email or password into the state
   * @param {*} e, event
   * @param {string} name, name is the id given to the input field
   * @returns {null}, returns nothing
   */
  onChangeEmail(value) {
    const { cms } = this.props;
    const email = isValidEmail(value);
    const emailErrorState = this.getEmailErrorState(value);
    if (emailErrorState) {
      this.setState(emailErrorState);
    } else if (!email) {
      this.setState({
        invalidEmail: cms.errorMsg.emailFormatIncorrect,
        validEmail: false,
        emailId: value
      });
    } else {
      this.setState({
        invalidEmail: '',
        validEmail: true,
        emailId: value
      });
    }
  }
  onChangePass() {
    const { cms } = this.props;
    const passwordErrorState = this.getPasswordErrorState();
    if (passwordErrorState) {
      this.setState({
        invalidPass: cms.errorMsg.passwordBlank,
        validPass: false
      });
    } else {
      this.setState({
        invalidPass: '',
        validPass: true
      });
    }
  }

  getErrorMsg(data) {
    const { cms, errorCode } = data;
    const errorMessageToPublish = cms.errorMsg && cms.errorMsg[errorCode];
    return errorMessageToPublish || '';
  }

  /**
   * Helper method to get email error state
   */
  getEmailErrorState = emailId => {
    const {
      cms: { errorMsg = {} }
    } = this.props;
    return !emailId
      ? {
          invalidEmail: errorMsg.blankEmailAddress,
          validEmail: false
        }
      : null;
  };

  /**
   * Helper method to get password error state
   */
  getPasswordErrorState = () => {
    const { password } = this.state;
    const {
      cms: { errorMsg = {} }
    } = this.props;
    return !password
      ? {
          invalidPass: errorMsg.passwordBlank,
          validPass: false
        }
      : null;
  };

  /**
   * FUNCTION redirects the user to signUp page when signUp link is clicked
   * @param {event} e
   */
  handleSignUpClick(e) {
    e.preventDefault();
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: 'signup',
      eventCategory: 'user account',
      eventAction: 'signup link click',
      eventLabel: 'sign up|header',
      accregistrationcomplete: 0,
      authenticationcomplete: 0
    };
    analyticsContent(analyticsData);
    const { handleRedirection } = this.props;
    handleRedirection(SIGN_UP);
  }
  /**
   * FUNCTION redirects the user to forgot password page when forgotPassword link is clicked
   * @param {event} e
   */
  handleForgotPassClick(e) {
    e.preventDefault();
    const { handleRedirection, analyticsContent } = this.props;
    handleRedirection(FORGOT_PASS);

    const analyticsData = {
      event: 'signin',
      eventCategory: 'user account',
      eventAction: 'forgot your password|initiated',
      eventLabel: 'forgot password|header',
      authenticationcomplete: '0'
    };
    analyticsContent(analyticsData);
  }
  /**
   * set Email state
   */
  changeEmail = data => {
    this.setState({ emailId: data });
  };
  /**
   * set Password state
   */
  changePass = data => {
    this.setState({ password: data.target.value });
    // condition added to set the password valid when user enters the password
    // this is done to handle the enter press condition
    if (data.target.value.length > 0 && this.state.passLengthZero) {
      this.setState({ validPass: true, passLengthZero: false });
    } else if (data.target.value.length <= 0) {
      this.setState({ validPass: false, passLengthZero: true });
    }
  };
  /**
   * @function, validateForm function validates the input fields for 3 scenarios,
   * if the email/password field is empty,
   * if the email entered is invalid,
   * and sets the error state.
   * @returns {bool}, returns true if the form is invalid and false otherwise.
   */
  render() {
    const { cms, showTimeoutError, error } = this.props;
    const { commonLabels: { showLabel, hideLabel } = '' } = cms;
    const errorMessage = this.props.errorCode;
    return (
      <div className="d-flex justify-content-center" ref={this.signInConatinerRef}>
        <div className="col-12 col-sm-6 py-3 py-md-6">
          {!error &&
            showTimeoutError && (
              <div className="timeoutErrorMessage">
                <section className={`${styles.errorWrapper} d-flex flex-column p-1 mb-2`}>
                  <p className={`${styles.errorText} o-copy__14reg mb-0`} role="alert" aria-atomic="true">
                    {get(cms, 'errorMsg.sessionExpired', SESSION_EXPIRED)}
                  </p>
                </section>
              </div>
            )}
          {this.props.error ? (
            <div>
              <section className={`${styles.errorWrapper} d-flex flex-column p-1 mb-2`}>
                <p className={`${styles.errorText} o-copy__14reg mb-0`} role="alert" aria-atomic="true">
                  {cms.errorMsg[errorMessage]}
                </p>
              </section>
            </div>
          ) : null}
          <div className="pb-1 text-center">
            <h4>{cms.signInHeadingLabel}</h4>
          </div>
          <div>
            <form method="post" action="/" noValidate>
              <div className="pb-1">
                <label htmlFor="signIn-emailInput" className="w-100">
                  <span className="o-copy__14bold">{cms.commonLabels.emailaddressLabel}</span>
                  <div>
                    <EmailField
                      data-auid="emailid_input"
                      id="signIn-emailInput"
                      onChange={value => this.onChangeEmail(value)}
                      onBlur={event => this.onChangeEmail(event.target.value)}
                      domainsList={domainsList}
                      className={cx(styles.inputBorder, 'form-control w-100', {
                        [styles.invalid]: !this.state.validEmail,
                        ['form-scroll-to-error']: !this.state.validEmail // eslint-disable-line no-useless-computed-key
                      })}
                    />
                    {!this.state.validEmail ? (
                      <span className={styles.errorMsgDisp} role="alert" aria-atomic="true">
                        {this.state.invalidEmail}
                      </span>
                    ) : null}
                  </div>
                </label>
              </div>
              <div>
                <label htmlFor="signIn-password" className="w-100">
                  <span className="o-copy__14bold">{cms.passwordLabel}</span>
                  <div>
                    <PasswordField
                      autocomplete="off"
                      data-auid="password_input"
                      id="signIn-password"
                      onChange={value => this.changePass(value)}
                      onBlur={this.onChangePass}
                      inlinebuttontextshow={showLabel ? showLabel.toUpperCase() : SHOW_LABEL}
                      inlinebuttontexthide={hideLabel ? hideLabel.toUpperCase() : HIDE_LABEL}
                      buttontextfont={INLINE_BUTTON_FONT_SIZE}
                      fontSize={BTN_LABEL_FONT_SIZE}
                      classname={cx(styles.inputBorder, 'form-control w-100', {
                        [styles.invalid]: !this.state.validPass,
                        ['form-scroll-to-error']: !this.state.validPass // eslint-disable-line no-useless-computed-key
                      })}
                    />
                    {!this.state.validPass ? (
                      <span className={styles.errorMsgDisp} role="alert" aria-atomic="true">
                        {this.state.invalidPass}
                      </span>
                    ) : null}
                  </div>
                </label>
                <div className={styles.onHover}>
                  <a
                    data-auid="forgot_password_btn"
                    // TODO replace that URL with URL that we will get from AEM
                    href={FORGOT_PASSWORD_URL}
                    className={cx('o-copy__14reg', styles.Btn)}
                    onClick={this.handleForgotPassClick}
                  >
                    {cms.forgotYourPasswordLabel}
                  </a>
                </div>
              </div>
              <div className={`${styles.pb} pt-2 d-flex justify-content-center`}>
                <Button auid="email-signin-button" type="submit" className={`${styles.submit} w-100`} onClick={this.onEmailSubmit}>
                  {cms.commonLabels.signInLabel}
                </Button>
              </div>
            </form>
            <div className={`${styles.onHover} o-copy__14reg text-center pt-2`}>
              {cms.dontHaveAnAccount}{' '}
              <a
                data-auid="signUp_btn"
                // TODO replace this url to url that we will get from AEM
                href={SIGNUP_LINK}
                className={cx('o-copy__14reg', styles.Btn)}
                onClick={this.handleSignUpClick}
              >
                {cms.signUpLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignIn.propTypes = {
  cms: PropTypes.object.isRequired,
  fnSigninCall: PropTypes.func,
  error: PropTypes.bool,
  handleRedirection: PropTypes.func,
  formSubmitStatus: PropTypes.object,
  errorCode: PropTypes.string,
  analyticsContent: PropTypes.func,
  fnShowLoader: PropTypes.func,
  fnHideLoader: PropTypes.func,
  showTimeoutError: PropTypes.bool
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(<SignIn {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}
export default SignIn;
