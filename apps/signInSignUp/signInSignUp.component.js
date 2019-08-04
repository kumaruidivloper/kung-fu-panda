import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import { get } from '@react-nitro/error-boundary';
import reducer from './store/reducers';
import saga from './store/sagas';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import SignIn from '../../modules/signIn/signIn.component';
import ForgotPassword from '../../modules/forgotPassword';
import SignUp from '../../modules/signUpComponent';
import AnalyticsWrapper from '../../modules/analyticsWrapper/analyticsWrapper.component';
import { forgotPassword, clearData } from '../../modules/forgotPassword/actions';
import { signup, validateAddress, loadCityStateFromZipCode } from '../../modules/signUpComponent/actions';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './signInSignUp.constants';
import { signinCall } from '../../modules/signIn/actions';
import StorageManager from './../../utils/StorageManager';
import { PREVIOUS_URL } from './../../utils/constants';
import Loader from './../../modules/loader/loader.component';
import * as styles from './signInSignUp.styles';
import { showLoader, hideLoader } from './../../apps/signInSignUp/store/actions/globalLoader';
import { getURLparam } from './../../utils/helpers';

class SignInSignUp extends React.PureComponent {
  constructor(props) {
    super(props);
    // default screens available via this component
    const screens = ['signIn', 'signUp', 'forgotPassword'];
    // Check if pageState exists else assign screen to default page
    let screen = get(this.props.pageInfo, 'pageState', 'signIn');
    // Check if pageState doesn't belong to the default screen
    screen = screens.indexOf(screen) > -1 ? screen : 'signIn';
    this.state = {
      showScreen: screen,
      timeoutError: this.displaySessionTimeout()
    };
  }

  componentDidMount() {
    if (document.referrer !== window.location.href.split('?')[0]) {
      StorageManager.setSessionStorage(PREVIOUS_URL, document.referrer);
    }
  }
  onRedirection = screen => {
    this.setState({
      showScreen: screen,
      timeoutError: false
    });
    if (ExecutionEnvironment.canUseDOM) {
      window.scrollTo(0, 0);
    }
  };

  /**
   * Method to return true or false based on url params, to display timeout error
   */
  displaySessionTimeout() {
    if (!ExecutionEnvironment.canUseDOM) {
      return false;
    }
    const paramsTimeout = getURLparam('timeout');
    if (paramsTimeout) {
      return true;
    }
    return false;
  }

  render() {
    const { cms, fnShowLoader, fnHideLoader, globalLoader, formSubmitStatus, analyticsContent } = this.props;
    const { timeoutError } = this.state;
    return (
      <div data-auid="signin_signup_page" className="signInSignUp pb-5 container">
        {globalLoader.isFetching === true && <Loader className={`${styles.minHeight}`} overlay />}
        {this.state.showScreen === 'signIn' && (
          <SignIn
            errorCode={this.props.errorCode}
            cms={cms}
            handleRedirection={this.onRedirection}
            error={this.props.error}
            fnSigninCall={this.props.fnSigninCall}
            redirect={this.props.redirect}
            passwordExpiredFlag={this.props.passwordExpiredFlag}
            formSubmitStatus={formSubmitStatus}
            fnShowLoader={fnShowLoader}
            fnHideLoader={fnHideLoader}
            analyticsContent={analyticsContent}
            showTimeoutError={timeoutError}
          />
        )}
        {this.state.showScreen === 'forgotPassword' && (
          <ForgotPassword
            cms={cms}
            handleRedirect={this.onRedirection}
            successPage={this.props.successPage}
            serverError={this.props.serverError}
            fnForgotPassword={this.props.fnForgotPassword}
            fnClearData={this.props.fnClearData}
            errorCode={this.props.ForgotPassworderrorCode}
            fnShowLoader={fnShowLoader}
            fnHideLoader={fnHideLoader}
            analyticsContent={this.props.analyticsContent}
          />
        )}
        {this.state.showScreen === 'signUp' && (
          <SignUp
            registerData={this.props.registerData}
            errorCode={this.props.signupErrorCode}
            cms={cms}
            handleRedirect={this.onRedirection}
            fnSignup={this.props.fnSignup}
            isRegistered={this.props.isRegistered}
            errorSignUp={this.props.errorSignUp}
            errorAddressVerify={this.props.errorAddressVerify}
            fnShowLoader={fnShowLoader}
            fnHideLoader={fnHideLoader}
            analyticsContent={this.props.analyticsContent}
            fnvalidateshippingAddress={this.props.fnvalidateshippingAddress}
            addressValid={this.props.addressValid}
            fnvalidateZipCodeshippingAddress={this.props.fnvalidateZipCodeshippingAddress}
            cityStore={this.props.cityStore}
          />
        )}
      </div>
    );
  }
}

SignInSignUp.propTypes = {
  cms: PropTypes.object.isRequired,
  error: PropTypes.bool,
  fnSigninCall: PropTypes.func,
  fnForgotPassword: PropTypes.func,
  serverError: PropTypes.bool,
  successPage: PropTypes.bool,
  fnClearData: PropTypes.func,
  fnSignup: PropTypes.func,
  isRegistered: PropTypes.isRequired,
  errorSignUp: PropTypes.bool,
  redirect: PropTypes.bool,
  passwordExpiredFlag: PropTypes.bool,
  formSubmitStatus: PropTypes.object,
  errorCode: PropTypes.string,
  signupErrorCode: PropTypes.string,
  registerData: PropTypes.object,
  ForgotPassworderrorCode: PropTypes.string,
  pageInfo: PropTypes.object,
  fnShowLoader: PropTypes.func,
  fnHideLoader: PropTypes.func,
  globalLoader: PropTypes.object,
  analyticsContent: PropTypes.func,
  fnvalidateshippingAddress: PropTypes.func,
  cityStore: PropTypes.object,
  addressValid: PropTypes.object,
  errorAddressVerify: PropTypes.object,
  fnvalidateZipCodeshippingAddress: PropTypes.func
};

const mapStateToProps = state => ({
  ...state,
  globalLoader: get(state, 'signInSignUp.globalLoader', { isFetching: false }),
  error: get(state, 'signInSignUp.formSubmitStatus.error', false),
  serverError: get(state, 'signInSignUp.forgotPasswordInfoStatus.serverError', ''),
  successPage: get(state, 'signInSignUp.forgotPasswordInfoStatus.successPage', false),
  isRegistered: get(state, 'signInSignUp.registerUser.isRegistered', false),
  registerData: get(state, 'signInSignUp.registerUser.data', {}),
  errorSignUp: get(state, 'signInSignUp.registerUser.error', false),
  errorAddressVerify: get(state, 'signInSignUp.registerUser.addressError', false),
  addressValid: get(state, 'signInSignUp.registerUser.addressData', {}),
  cityStore: get(state, 'signInSignUp.fetchCityStateFromZipCode.data', {}),
  signupErrorCode: get(state, 'signInSignUp.registerUser.errorCode', ''),
  redirect: get(state, 'signInSignUp.formSubmitStatus.redirect', false),
  passwordExpiredFlag: get(state, 'signInSignUp.formSubmitStatus.token.passwordExpiredFlag', false),
  formSubmitStatus: get(state, 'signInSignUp.formSubmitStatus', {}),
  errorCode: get(state, 'signInSignUp.formSubmitStatus.errorCode', ''),
  ForgotPassworderrorCode: get(state, 'signInSignUp.forgotPasswordInfoStatus.errorCode', '')
});
const mapDispatchToProps = dispatch => ({
  fnSigninCall: data => dispatch(signinCall(data)),
  fnForgotPassword: data => dispatch(forgotPassword(data)),
  fnClearData: () => dispatch(clearData()),
  fnSignup: data => dispatch(signup(data)),
  fnShowLoader: () => dispatch(showLoader()),
  fnHideLoader: () => dispatch(hideLoader()),
  fnvalidateshippingAddress: data => dispatch(validateAddress(data)),
  fnvalidateZipCodeshippingAddress: data => dispatch(loadCityStateFromZipCode(data))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const SignInSignUpContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(SignInSignUp);
  const SignInSignUpAnalyticsWrapper = AnalyticsWrapper(SignInSignUpContainer);
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <SignInSignUpAnalyticsWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(SignInSignUp));
