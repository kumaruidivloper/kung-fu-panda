import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import PasswordField from '@academysports/fusion-components/dist/PasswordField';
import Button from '@academysports/fusion-components/dist/Button';
import { NODE_TO_MOUNT, DATA_COMP_ID, SHOW_LABEL, HIDE_LABEL } from './constants';
import { fullWidthRed, redColor, errorWrapper } from './createNewPassword.style';
import { saveNewPassword } from './actions';
import injectSaga from './../../utils/injectSaga';
import saga from './saga';
import reducer from './reducer';
import injectReducer from './../../utils/injectReducer';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';
import PasswordStrengthMeter from '../passwordStrengthMeter';
import { BTN_LABEL_FONT_SIZE, INLINE_BUTTON_FONT_SIZE } from '../../apps/myaccount/myaccount.constants';

class CreatePassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // showNewPasswordSuccess: false,
      valid: true,
      // strengthCheck: false,
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.goToSuccessPage = this.goToSuccessPage.bind(this);
    this.checkValidtor = this.checkValidtor.bind(this);
  }

  // document.onready
  /**
   * @param {*} e
   * New Password On change Validation
   */
  handleOnChange(e) {
    this.setState({ password: e.target.value });
    if (e.target.value.length > 7) {
      this.setState({ valid: true });
    }
  }
  checkValidtor() {
    this.setState({
      // strengthCheck: true
    });
  }
  /**
   * Before Submit Password Change Validate Password Field
   */
  handleSubmit() {
    const { analyticsContent } = this.props;
    if (this.state.password.length < 8) {
      this.setState({ valid: false });
    } else {
      this.props.fnSaveNewPassword({ pwd: this.state.password, analyticsContent });
    }
  }

  /**
   * Go to success page after the new password is set
   */
  goToSuccessPage() {
    window.location.href = '/myaccount/profile?password-reset=success';
  }

  renderError = () => {
    const {
      cms: { errorMsg },
      errorCode,
      error
    } = this.props;
    if (error) {
      return (
        <section className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
          <p className="o-copy__14reg mb-0">{errorMsg[errorCode]}</p>
        </section>
      );
    }
    return null;
  };
  render() {
    const { cms, createNewPasswordSuccessStatus } = this.props;
    if (createNewPasswordSuccessStatus && createNewPasswordSuccessStatus.identity && createNewPasswordSuccessStatus.identity.userId) {
      this.goToSuccessPage();
    }
    return (
      <div className="container-fluid">
        <div className={classNames('row')}>
          <div className="col-12 col-md-5 offset-md-3 py-5">
            {this.renderError()}
            <h4 className={classNames('my-3 mt-md-6 mb-md-3 text-uppercase')}>{cms.createANewPasswordHeader}</h4>
            <span className="o-copy__14bold">{cms.newPasswordLabel}</span>
            <PasswordField
              autocomplete="off"
              data-auid="newpassword_input"
              width="100%"
              classname={this.state.valid ? 'w-100' : fullWidthRed}
              onChange={this.handleOnChange}
              buttonTextColor="#333333"
              buttontextfont={INLINE_BUTTON_FONT_SIZE}
              fontSize={BTN_LABEL_FONT_SIZE}
              inlinebuttontextshow={cms.commonLabels.showLabel ? cms.commonLabels.showLabel.toUpperCase() : SHOW_LABEL}
              inlinebuttontexthide={cms.commonLabels.hideLabel ? cms.commonLabels.hideLabel.toUpperCase() : HIDE_LABEL}
            />
            <div className={this.state.valid ? 'd-none' : 'd-block'}>
              <span className={classNames('0-copy__12reg', 'mt-quarter', redColor)}>This field is required</span>
            </div>
            <PasswordStrengthMeter cms={this.props.cms} password={this.state.password} callbackValidator={this.checkValidtor} />
            <Button auid="save_new_password_btn" className={classNames('mt-3 mb-5 mb-md-6', 'w-100')} onClick={this.handleSubmit}>
              {cms.saveNewPasswordLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

CreatePassword.propTypes = {
  cms: PropTypes.object.isRequired,
  fnSaveNewPassword: PropTypes.func,
  createNewPasswordSuccessStatus: PropTypes.bool,
  error: PropTypes.bool,
  errorCode: PropTypes.string,
  analyticsContent: PropTypes.func
};
const mapDispatchToProps = dispatch => ({
  fnSaveNewPassword: data => dispatch(saveNewPassword(data))
});

const mapStateToProps = state => ({
  createNewPasswordSuccessStatus: state.createPassword.data === undefined ? false : state.createPassword.data,
  error: state.createPassword.error === undefined ? false : state.createPassword.error,
  errorCode: state.createPassword.errorCode
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const CreatePasswordContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(CreatePassword);
  const CreatePasswordAnalyticsWrapper = AnalyticsWrapper(CreatePasswordContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CreatePasswordAnalyticsWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(CreatePassword));
