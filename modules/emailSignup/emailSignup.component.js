import Button from '@academysports/fusion-components/dist/Button';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import Modal from 'react-modal';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import classNames from 'classnames';
import { hideSignupModal } from './actions';
import { NODE_TO_MOUNT, DATA_COMP_ID, SIGNUP_URL, AUTH_TOKEN } from './constants';
import * as styles from './styles';
const defaultcms = {
  zipCode: 'Zip Code',
  email: 'Email address',
  ZipcodeErrorMessage: '*Please Enter Valid Zip code'
};
// const SIGNUP_URL = 'https://academysports.hosted.strongview.com/sm/rest/v1/data-sources/internal/132/records'; old URL

export class EmailSignup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      emailId: '',
      zipCode: '',
      formErrors: {},
      formSubmitted: false,
      modelShow: ''
    };

    this.cms = { ...defaultcms, ...this.props.cms };
    this.toggleModal = this.toggleModal.bind(this);
    this.onEmailSubmit = this.onEmailSubmit.bind(this);
    this.onChangeinput = this.onChangeinput.bind(this);
    this.analytics = this.analytics.bind(this);
  }

  onEmailSubmit(e) {
    e.preventDefault();
    const formValidate = this.validateForm();
    if (formValidate) {
      const { emailId, zipCode } = this.state;

      axios({
        method: 'PUT',
        url: SIGNUP_URL,
        headers: {
          'Content-Type': 'application/json',
          'X-Organization': 'AcademySports',
          Accept: 'application/json',
          Authorization: AUTH_TOKEN
        },
        data: {
          data: [[zipCode, emailId]],
          header: ['postal_code', 'email_address']
        }
      })
        .then(() => {
          this.analytics('success');
          this.setState({ formSubmitted: true, modelShow: 'success' });
        })
        .catch(() => {
          this.analytics('error');
          this.setState({ formSubmitted: true, modelShow: 'error' });
        });
    }
  }

  onChangeinput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  validateForm() {
    const fieldValidationErrors = {};
    let analyticsErrorMessages = '';
    const { emailId, zipCode } = this.state;
    const emailValid = emailId.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    fieldValidationErrors.emailId = !emailValid;
    analyticsErrorMessages = !emailValid ? this.cms.signUpError : '';

    const zipCodeValid = /^(\d{5})?$/.test(zipCode);
    fieldValidationErrors.zipCode = !zipCodeValid;
    if (!zipCodeValid) {
      analyticsErrorMessages =
        analyticsErrorMessages.length > 0 ? `${analyticsErrorMessages} | ${this.cms.ZipcodeErrorMessage}` : this.cms.ZipcodeErrorMessage;
    }
    const isValid = !fieldValidationErrors.emailId && !fieldValidationErrors.zipCode;
    this.setState({
      formErrors: fieldValidationErrors
    });
    if (!isValid) {
      this.analytics('validation', analyticsErrorMessages);
    }
    return isValid;
  }

  analytics(stage, validationErrors) {
    const validationErrorsLabel = validationErrors && validationErrors.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '');
    const { emailId, zipCode } = this.state;
    const isFullyQualified = emailId && emailId.length > 0 && zipCode && zipCode.length > 0;
    if (stage === 'success') {
      this.props.gtmDataLayer.push({
        event: 'customerLead',
        eventCategory: 'customer lead',
        eventAction: 'newsletter signup',
        eventLabel: ExecutionEnvironment.canUseDOM ? decodeURIComponent(window.location.pathname) : '',
        customerleadtype: 'newsletter signup',
        customerleadlevel: isFullyQualified ? 'fully qualified' : 'partial:email',
        leadsubmitted: 1,
        newslettersignupcompleted: 1
      });
    } else if (stage === 'validation') {
      this.props.gtmDataLayer.push({
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'form validation error|email signup',
        eventLabel: validationErrorsLabel && validationErrorsLabel.toLowerCase()
      });
    } else {
      this.props.gtmDataLayer.push({
        event: 'customerLead',
        eventCategory: 'customer lead',
        eventAction: 'newsletter signup',
        eventLabel: ExecutionEnvironment.canUseDOM ? decodeURIComponent(window.location.pathname) : '',
        leadsubmitted: 0,
        newslettersignupcompleted: 0
      });
    }
  }
  toggleModal() {
    this.setState(
      {
        emailId: '',
        zipCode: '',
        formErrors: [],
        formSubmitted: false,
        modelShow: ''
      },
      () => {
        this.props.fnHideSignupModal();
      }
    );
  }

  modalContent() {
    return (
      <div className="container" data-auid="email-signup-main-modal">
        <styles.CloseButton onClick={this.toggleModal} data-auid="email-signup-main-modal-close" aria-label="email signup main modal cose button">
          <styles.CloseIcon className={classNames('academyicon', 'icon-close')} aria-hidden="true" />
        </styles.CloseButton>
        <div className={styles.modalBox}>
          <div className="row">
            <div className="col-12">
              <h4 className={`${styles.letterSpacing} ${styles.breakWord} text-center`}>{this.cms.signUpHeadline}</h4>
              <p className={`${styles.mbtm35} o-copy__16reg col-lg-12 text-center`}>{this.cms.signUpBody}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form noValidate>
                <div className={`${styles.mbtm15}`}>
                  <label className="w-100" htmlFor="email-address">
                    <span className="o-copy__14bold">{this.cms.email}</span>
                    <div id="emailHelp">
                      <input
                        type="email"
                        id="email-address"
                        name="emailId"
                        data-auid="email-signup-emailId"
                        aria-label="emailHelp input field"
                        placeholder={this.cms.email}
                        // className={!this.state.formErrors.emailId ? styles.placeholder : styles.placeholder}
                        className={
                          this.state.formErrors.emailId
                            ? classNames(`${styles.placeholder}`, 'form-control w-100 o-copy__14reg', `${styles.invalid}`)
                            : classNames(`${styles.placeholder}`, 'form-control w-100 o-copy__14reg')
                        }
                        required
                        onChange={e => this.onChangeinput(e)}
                        value={this.state.emailId}
                      />
                      <span className={this.state.formErrors.emailId ? styles.errorMsgDisp : styles.errMsg}>{this.cms.signUpError}</span>
                    </div>
                  </label>
                </div>
                <div>
                  <label htmlFor="zip-code" className="w-100">
                    <span className="o-copy__14bold">{this.cms.zipCode}</span>
                    <div>
                      <input
                        type="tel"
                        id="zip-code"
                        name="zipCode"
                        data-auid="email-signup-zipcode"
                        placeholder={this.cms.zipCode}
                        // className={styles.placeholder}
                        className={
                          this.state.formErrors.zipCode
                            ? classNames(`${styles.placeholder}`, 'form-control w-100 o-copy__14reg', `${styles.invalid}`)
                            : classNames(`${styles.placeholder}`, 'form-control w-100 o-copy__14reg')
                        }
                        value={this.state.zipCode}
                        onChange={e => this.onChangeinput(e)}
                      />
                      <span className={this.state.formErrors.zipCode ? styles.errorMsgDisp : styles.errMsg}>{this.cms.ZipcodeErrorMessage}</span>
                    </div>
                  </label>
                </div>
                <Button auid="email-signup-button" type="submit" className={`${styles.submit}`} onClick={e => this.onEmailSubmit(e)}>
                  {this.cms.emailSubmit}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  modalSuccessful() {
    return (
      <div className="container" data-auid="email-signup-sucess-modal">
        <styles.CloseButton
          onClick={this.toggleModal}
          aria-label="email signup success modal cose button"
          data-auid="email-signup-success-modal-close"
        >
          <styles.CloseIcon className={classNames('academyicon', 'icon-close')} aria-hidden="true" />
        </styles.CloseButton>
        <div className={styles.successBox}>
          <div className={classNames(`${styles.setSvg}`, 'd-lg-none row')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 114 114">
              <g fill="none" fillRule="evenodd">
                <path
                  stroke="#0055A6"
                  strokeLinecap="round"
                  strokewidth="2"
                  d="M32.778 6.495C13.978 15.528 1 34.748 1 57c0 30.928 25.072 56 56 56s56-25.072 56-56S87.928 1 57 1"
                />
                <path
                  fill="#0055A6"
                  fillRule="nonzero"
                  d="M76.047 46.327l-3.921-3.922a1.385 1.385 0 0 0-1.96.002l-19.12 19.118-6.76-6.758a1.385 1.385 0 0 0-1.959-.002l-3.922 3.922c-.54.542-.54 1.419.002 1.961l11.16 11.16c.4.401.92.928 1.45.928.531 0 1.107-.527 1.508-.928l23.521-23.52c.542-.542.542-1.42.001-1.961z"
                />
              </g>
            </svg>
          </div>
          <div className={classNames(`${styles.setSvg} ${styles.svgStatus}`, 'row')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="114" height="114" viewBox="0 0 114 114">
              <g fill="none" fillRule="evenodd">
                <path
                  stroke="#0055A6"
                  strokeLinecap="round"
                  strokewidth="2"
                  d="M32.778 6.495C13.978 15.528 1 34.748 1 57c0 30.928 25.072 56 56 56s56-25.072 56-56S87.928 1 57 1"
                />
                <path
                  fill="#0055A6"
                  fillRule="nonzero"
                  d="M76.047 46.327l-3.921-3.922a1.385 1.385 0 0 0-1.96.002l-19.12 19.118-6.76-6.758a1.385 1.385 0 0 0-1.959-.002l-3.922 3.922c-.54.542-.54 1.419.002 1.961l11.16 11.16c.4.401.92.928 1.45.928.531 0 1.107-.527 1.508-.928l23.521-23.52c.542-.542.542-1.42.001-1.961z"
                />
              </g>
            </svg>
          </div>
          <div className="row">
            <h4 className={`${styles.set} w-100 text-center`}>{this.cms.signUpSuccess}</h4>
            <div className="col-12 text-center">
              <p className={styles.deal}>{this.cms.successBody}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  modalError() {
    return (
      <div className="container" data-auid="email-signup-error-modal">
        <styles.CloseButton onClick={this.toggleModal} data-auid="email-signup-error-modal-close" aria-label="email signup error modal cose button">
          <styles.CloseIcon className={classNames('academyicon', 'icon-close')} aria-hidden="true" />
        </styles.CloseButton>
        <div className={styles.successBox}>
          <div className={classNames(`${styles.setSvg}`, 'row')}>
            <img src={this.cms.errorAnimation} alt={this.cms.errorMessage} className={styles.errorImage} />
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="114" height="114" viewBox="0 0 114 114">
              <g fill="none" fillRule="evenodd" stroke="#333" strokeLinecap="round">
                <path strokeWidth="2" d="M32.778 6.495C13.978 15.528 1 34.748 1 57c0 30.928 25.072 56 56 56s56-25.072 56-56S87.928 1 57 1" />
                <path
                  fill="#333"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M74.043 44.46l-3.286-3.286-13.148 13.148L44.46 41.174l-3.287 3.287 13.148 13.148-13.148 13.148 3.287 3.286 13.148-13.147 13.148 13.147 3.286-3.286-13.147-13.148z"
                />
              </g>
            </svg> */}
          </div>
          <div className="row">
            <h4 className={`${styles.set} w-100 text-center`}>{this.cms.errorMessage}</h4>
            <div className="col-12 text-center">
              <p className={styles.deal}>{this.cms.errorSubText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="emailSignup" data-auid="email-signup-main">
        {/* <span role="button" tabIndex="0" onKeyDown={this.toggleModal} onClick={this.toggleModal}>
          Link to template
        </span> */}
        <Modal
          overlayClassName={styles.OverLay}
          className={styles.Modal}
          isOpen={this.props.modalStatus}
          onRequestClose={this.toggleModal}
          shouldCloseOnOverlayClick
        >
          {!this.state.formSubmitted && this.modalContent()}
          {this.state.formSubmitted && (this.state.modelShow === 'success' ? this.modalSuccessful() : this.modalError())}
        </Modal>
      </div>
    );
  }
}
EmailSignup.propTypes = {
  cms: PropTypes.object.isRequired,
  modalStatus: PropTypes.bool,
  fnHideSignupModal: PropTypes.func,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  modalStatus: state.footer ? state.footer.modalStatus : false,
  gtmDataLayer: state.gtmDataLayer
});

const mapDispatchToProps = dispatch => ({
  fnHideSignupModal: () => dispatch(hideSignupModal())
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const EmailSignupContainer = compose(withConnect)(EmailSignup);
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <EmailSignupContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(EmailSignup);
