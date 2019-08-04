import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import Button from '@academysports/fusion-components/dist/Button';
import { Provider } from 'react-redux';
import FormErrorScrollManager from '../../utils/FormErrorScrollManager';
import { domainsList } from './../../utils/constants';
import { isValidEmail } from '../../utils/validationRules';
import { bgNone, blueIcon, errorWrapper, errorMsgDisp, invalid, inputBorder } from './forgotPassword.styles';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { scrollIntoView } from '../../utils/scroll';

class ForgotPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.validateForm = this.validateForm.bind(this);
    this.state = {
      emailId: '',
      valid: true,
      validEmail: true,
      invalidEmail: '',
      formErrors: {}
    };

    this.errorScrollManager = new FormErrorScrollManager('.form-scroll-to-error');

    this.forgotPasswordConatinerRef = React.createRef();
    this.validateEmail = this.validateEmail.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.logGAServerSideErr = this.logGAServerSideErr.bind(this);
  }

  /**
   * @param {*} event
   * On change of Email validation should pass Blank Email and Incorrect Format
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.serverError === true) {
      const container = this.forgotPasswordConatinerRef.current;
      scrollIntoView(container, true);
      this.logGAServerSideErr();
    }
  }

  /**
   * On Submit of Email Validate
   */
  onSubmit = () => {
    const { fnShowLoader, fnHideLoader, fnForgotPassword, analyticsContent } = this.props;
    fnShowLoader();
    const { cms } = this.props;
    if (this.state.emailId === '') {
      this.setState({
        invalidEmail: cms.errorMsg.blankEmailAddress,
        validEmail: false
      });
    } else if (this.state.validEmail) {
      const data = {
        logonId: this.state.emailId
      };
      fnForgotPassword(data);
    }

    if (!this.state.validEmail) {
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'validation error|forgot password',
        eventLabel: this.state.invalidEmail
      };
      analyticsContent(analyticsData);
      this.errorScrollManager.scrollToError();
    }
    fnHideLoader();
  };

  /**
   * Handle click for back to sign in.
   */
  onBackToSignIn = () => {
    const { fnShowLoader, fnHideLoader, handleRedirect, fnClearData } = this.props;
    fnShowLoader();
    fnClearData();
    handleRedirect('signIn');
    fnHideLoader();
  };

  /**
   * Call the anlaytics if server Side error happened
   */
  logGAServerSideErr() {
    const { cms, analyticsContent, serverError, errorCode } = this.props;
    if (serverError && errorCode) {
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'validation error|forgot password',
        eventLabel: cms.errorMsg[this.props.errorCode] || ''
      };
      analyticsContent(analyticsData);
    }
  }

  /**
   * Validating Email
   */
  validateEmail(emailId) {
    const { cms } = this.props;
    const email = isValidEmail(emailId);
    if (emailId === '') {
      this.setState({
        invalidEmail: cms.errorMsg.blankEmailAddress,
        validEmail: false,
        emailId
      });
    } else if (!email) {
      this.setState({
        invalidEmail: cms.errorMsg.emailFormatIncorrect,
        validEmail: false,
        emailId
      });
    } else {
      this.setState({
        invalidEmail: '',
        validEmail: true,
        emailId
      });
    }
  }

  handleEnter(e) {
    e.preventDefault();
    this.onSubmit();
  }

  validateForm() {
    const fieldValidationErrors = {};
    const { emailId } = this.state;
    const emailValid = emailId.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    fieldValidationErrors.emailId = !emailValid;
    this.setState({ formErrors: fieldValidationErrors, valid: !fieldValidationErrors.emailId }, () => this.state.valid);
    return !fieldValidationErrors.emailId;
  }

  renderSuccessPage() {
    const container = this.forgotPasswordConatinerRef.current;
    scrollIntoView(container, true);
    const { cms, analyticsContent } = this.props;

    const analyticsData = {
      event: 'signin',
      eventCategory: 'user account',
      eventAction: 'forgot your password|completed',
      eventLabel: 'forgot password|header',
      authenticationcomplete: 0 // always 0 because he is in forgort password
    };
    analyticsContent(analyticsData);

    return (
      <div>
        <h4 className="mt-3 mt-md-6 mb-0">{cms.sentNewPassword}</h4>
        <div className="mt-3 o-copy__14reg">{cms.sentNewPasswordCopy}</div>
        <button data-auid="backto_signin_btn" onClick={this.onBackToSignIn} className={cx(bgNone, 'mt-3', 'o-copy__14reg')}>
          <i className={cx('academyicon', 'icon-chevron-left', 'pr-1', 'o-copy__12reg', blueIcon)} />
          {cms.backToSignIn}
        </button>
      </div>
    );
  }

  renderForm() {
    const { cms } = this.props;
    const { formErrors, emailId, invalidEmail, validEmail } = this.state;
    return (
      <div>
        <h4 className="mt-1 mt-md-2 mb-0">{cms.forgotYourPasswordHeadingLabel}</h4>
        <div className="o-copy__14reg mt-3">{cms.forgotYourPasswordMessageCopy}</div>
        <form noValidate action="." onSubmit={this.handleEnter}>
          {/* eslint-disable-next-line no-useless-computed-key */}
          <div className={cx('o-copy__14bold mb-half mt-3', { ['form-scroll-to-error']: invalidEmail })}>
            <label htmlFor="forgetPass"> {cms.commonLabels.emailaddressLabel} </label>
          </div>
          <EmailField
            data-auid="email_input"
            type="email"
            id="forgetPass"
            title="submit"
            value={emailId}
            domainsList={domainsList}
            bordercolor={!validEmail ? '#c00000' : 'rgba(0, 0, 0, 0.3)'}
            onChange={value => this.validateEmail(value)}
            onBlur={event => this.validateEmail(event.target.value)}
            className={cx(inputBorder, 'form-control w-100', { [invalid]: formErrors.emailId })}
            maxLength="255"
          />
          {!validEmail ? (
            <span className={errorMsgDisp} role="alert" aria-atomic="true">
              {invalidEmail}
            </span>
          ) : null}
          <div className="mt-3">
            <Button auid="submit_btn" type="submit" className="w-100">
              {cms.commonLabels.submitLabel}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  renderViewBasedUponState() {
    const { successPage } = this.props;
    return successPage ? this.renderSuccessPage() : this.renderForm();
  }

  render() {
    const { cms } = this.props;
    const genericError = '_ERR_DEFAULT_KEY';
    return (
      <div className="container-fluid col-md-6" ref={this.forgotPasswordConatinerRef}>
        {this.props.serverError && (
          <div>
            <section className={`${errorWrapper} d-flex flex-column p-1 my-2`}>
              <p className="o-copy__14reg mb-0" role="alert" aria-atomic="true">
                {cms.errorMsg[this.props.errorCode] || cms.errorMsg[genericError]}
              </p>
            </section>
          </div>
        )}
        <div className="row justify-content-center">{this.renderViewBasedUponState()}</div>
        <div className="mt-5 mt-md-6" />
      </div>
    );
  }
}
ForgotPassword.propTypes = {
  cms: PropTypes.object.isRequired,
  fnForgotPassword: PropTypes.func,
  serverError: PropTypes.bool,
  successPage: PropTypes.bool,
  fnClearData: PropTypes.func,
  handleRedirect: PropTypes.func,
  errorCode: PropTypes.string,
  fnShowLoader: PropTypes.func,
  fnHideLoader: PropTypes.func,
  analyticsContent: PropTypes.func
  // api: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ForgotPassword {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default ForgotPassword;
