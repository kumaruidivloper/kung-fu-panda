import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Field, initialize, reduxForm, reducer as form } from 'redux-form';
import Modal from 'react-modal';
import Button from '@academysports/fusion-components/dist/Button';
import { Provider, connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import reducer from './reducer';
import saga from './saga';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';
import { beginSignIn, hideSigninModal, inValidateSignin } from './actions';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  SHOW_LABEL,
  HIDE_LABEL,
  EMAIL_ADDRESS_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  EVENT_ACTION,
  EVENT_CATEGORY,
  EVENT_NAME
} from './constants';
import StorageManager from './../../utils/StorageManager';
import * as styles from './styles';
import RenderEmailField from './components/renderEmailField';
import RenderPasswordField from './components/renderPasswordField';
import validationRules from './validationRules';
import GenericError from './../../modules/genericError';
import { analyticsErrorTracker } from '../../utils/analyticsUtils';
export class LoginModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onForgotPasswordLogAnalytics = this.onForgotPasswordLogAnalytics.bind(this);
    this.onCreateAccountLogAnalytics = this.onCreateAccountLogAnalytics.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { data, isFetching, error } = nextProps.loginInfoStatus;
    const { analyticsContent } = this.props;
    if (isFetching === false && error === false && Object.keys(data).length > 0) {
      StorageManager.setSessionStorage('userId', data['x-userid']);
      StorageManager.setSessionStorage('storeId', data.storeLocId);
      if (ExecutionEnvironment.canUseDOM) {
        // checks whether DOM is available for calling window object.
        window.location.reload(); // reload current page on successful login
      }
    }
    if (Object.keys(data).length > 0 && data.identity && !data.identity.passwordExpiredFlag) {
      const analyticsData = {
        event: 'signin',
        eventCategory: 'user account',
        eventAction: 'login',
        eventLabel: 'sign in|checkout',
        authenticationcomplete: nextProps.loginInfoStatus.isFetching ? 0 : 1
      };
      analyticsContent(analyticsData);
    }
  }
  componentDidUpdate(prevProps) {
    const { analyticsContent } = this.props;
    const { data } = this.props.loginInfoStatus;
    if (data.errors && JSON.stringify(data.errors) !== JSON.stringify(prevProps.loginInfoStatus.data.errors)) {
      const errormessageToPush = data.errors.length > 0 ? data.errors[0].errorMessage : '';
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'validation error|signin',
        eventLabel: `${errormessageToPush}`
      };
      analyticsContent(analyticsData);
    }
  }
  /**
   * It gets fired on click of forgot password link and pushes analytics data
   */
  onForgotPasswordLogAnalytics() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: 'signin',
      eventCategory: 'user account',
      eventAction: 'forgot your password|initiated',
      eventLabel: 'forgot password|checkout',
      authenticationcomplete: 0
    };

    analyticsContent(analyticsData);
  }
  /**
   * It gets fired on click of create account link and pushes analytics data
   */
  onCreateAccountLogAnalytics() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: 'signup',
      eventCategory: 'user account',
      eventAction: 'registration initiated',
      eventLabel: 'sign up|checkout',
      accregistrationcomplete: 0,
      authenticationcomplete: 0,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };

    analyticsContent(analyticsData);
  }
  toggleModal() {
    this.props.hideSigninModal();
    this.props.reInitForm('loginForm');
    this.props.inValidateSignin();
  }
  submitForm(error) {
    const { analyticsContent } = this.props;
    if (error && Object.keys(error).length !== 0) {
      const logonIdLable = error.logonId || '';
      const logonPasswordLabel = error.logonPassword || '';
      const seperateLabel = error.logonId && error.logonPassword ? '||' : '';
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'form validation error|signin',
        eventLabel: `${logonIdLable}${seperateLabel}${logonPasswordLabel}`
      };
      analyticsContent(analyticsData);
    }
  }
  modalContent() {
    const {
      cms,
      cms: { commonLabels, signInLabels },
      handleSubmit,
      submitting,
      enableSubmit,
      analyticsContent,
      loginInfoStatus: { data, error }
    } = this.props;
    return (
      <div className={`${styles.containerMargin}`}>
        <button onClick={this.toggleModal} className="modalCloseButton" data-auid="email-signup-main-modal-close">
          <span className="academyicon icon-close" />
          <span className="sr-only">Close</span>
        </button>
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-12">
              <h4 className={`${styles.fontSize72} text-center`}>{cms.welcomeBackText}</h4>
            </div>
            <div className="col-12 mt-1">
              <div className="o-copy__16reg text-center">{cms.welcomeBackSubText}</div>
            </div>
            <div className="col-12 col-md-10">
              <form noValidate>
                {data.errors ? (
                  <div className={`${!error ? styles.signInError : ''} my-1`}>
                    <GenericError auid="login_error" cmsErrorLabels={cms.errorMsg || {}} apiErrorList={data.errors} />
                  </div>
                ) : (
                  <div className="mt-4" />
                )}
                <div className="pb-2">
                  <Field
                    name="logonId"
                    id="logonId"
                    type="text"
                    label={commonLabels.emailaddressLabel}
                    component={RenderEmailField}
                    maxLength={EMAIL_ADDRESS_MAX_LENGTH}
                    analyticsContent={analyticsContent}
                  />
                </div>
                <div>
                  <Field
                    name="logonPassword"
                    id="logonPassword"
                    type="password"
                    label={signInLabels.passwordLabel}
                    component={RenderPasswordField}
                    maxLength={PASSWORD_MAX_LENGTH}
                    inlinebuttontextshow={signInLabels.showLabel ? signInLabels.showLabel.toUpperCase() : SHOW_LABEL}
                    inlinebuttontexthide={signInLabels.hideLabel ? signInLabels.hideLabel.toUpperCase() : HIDE_LABEL}
                    analyticsContent={analyticsContent}
                  />
                </div>
                <a
                  className={`${styles.academyBlue} o-copy__12reg mt-quarter d-block`}
                  href={cms.forgotPasswordLink}
                  onClick={this.onForgotPasswordLogAnalytics}
                >
                  {signInLabels.forgotYourPasswordLabel}
                </a>
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    auid="email-signin-button"
                    type="submit"
                    size="M"
                    className={`${styles.submit}`}
                    disabled={submitting || enableSubmit}
                    onClick={handleSubmit(formData => this.props.beginSignIn(formData))}
                    analyticsContent={analyticsContent}
                  >
                    {commonLabels.signInLabel}
                  </Button>
                </div>
              </form>
            </div>
            <div className="d-flex mt-2 o-copy__14reg">
              <span>{cms.notAMemberText}</span>
              &nbsp;
              <a className={`${styles.academyBlue}`} href={cms.signupLink} onClick={this.onCreateAccountLogAnalytics}>
                {cms.createAnAccountText}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { modalStatus } = this.props.loginInfoStatus;
    // console.log()
    return (
      <div className="loginModal">
        {modalStatus && (
          <Modal
            overlayClassName="modalOverlay"
            className="modalContent"
            contentLabel="Login Modal"
            isOpen
            onRequestClose={() => {
              this.toggleModal();
            }}
            shouldCloseOnOverlayClick
          >
            {this.modalContent()}
          </Modal>
        )}
      </div>
    );
  }
}
const LoginModalReduxForm = reduxForm({
  form: 'loginForm',
  destroyOnUnmount: false,
  validate: validationRules,
  onSubmitFail: (errors, dispatch, submitError, props) =>
    analyticsErrorTracker(EVENT_NAME, EVENT_CATEGORY, EVENT_ACTION, errors, dispatch, submitError, props)
})(LoginModal);

LoginModal.propTypes = {
  cms: PropTypes.object.isRequired,
  loginInfoStatus: PropTypes.object,
  hideSigninModal: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  enableSubmit: PropTypes.bool,
  beginSignIn: Provider.func,
  reInitForm: PropTypes.func,
  inValidateSignin: PropTypes.func,
  analyticsContent: PropTypes.func
};
// to test individual component , change modalStatus to true
const mapStateToProps = state => ({
  loginInfoStatus: state.loginModal.loginInfoStatus,
  formError: state.form.loginForm
});
const mapDispatchToProps = dispatch => bindActionCreators({ beginSignIn, hideSigninModal, inValidateSignin, reInitForm: initialize }, dispatch);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const LoginModalContainer = compose(
    withReducer,
    formReducer,
    withSaga,
    withConnect
  )(LoginModalReduxForm);
  const LoginModalAnalyticsWrappedComponent = AnalyticsWrapper(LoginModalContainer);
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <LoginModalAnalyticsWrappedComponent {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(LoginModal));
