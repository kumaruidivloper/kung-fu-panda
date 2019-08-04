import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import InputField from '@academysports/fusion-components/dist/InputField';
import Button from '@academysports/fusion-components/dist/Button';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  ORDER_ID,
  ZIP_CODE,
  TAB_KEY_CODE,
  ERROR_CATEGORY,
  ERROR_ACTION_LABEL,
  ERROR_EVENT_NAME,
  ERROR_FIND_ORDERS_LABEL,
  EVENT_ACTION,
  EVENT_AUTHENTICATED_LABEL,
  EVENT_CATEGORY,
  EVENT_GUEST_LABEL,
  EVENT_NAME,
  EVENT_ORDER_TYPE,
  ERR_ACCOUNT_PAGE
} from './constants';
import AlertComponent from './../genericError/components/alertComponent';
import * as styles from './noOrder.styles';
import { replaceCharactersInString } from './../../utils/stringUtils';
class NoOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      zipCode: '',
      formErrors: []
    };
    this.onChangeinput = this.onChangeinput.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const {
      redirect: nextRedirect,
      globalLoader: { isFetching }
    } = nextProps;
    if (!isFetching && nextRedirect) {
      const { authenticated, analyticsContent } = this.props;
      const { orderId, zipCode } = this.state;
      const analyticsData = {
        event: EVENT_NAME,
        eventCategory: EVENT_CATEGORY,
        eventAction: EVENT_ACTION,
        eventLabel: authenticated ? EVENT_AUTHENTICATED_LABEL : EVENT_GUEST_LABEL,
        ordertype: EVENT_ORDER_TYPE,
        orderid: orderId || ''
      };
      analyticsContent(analyticsData);
      if (orderId && zipCode) {
        this.props.history.push(`/myaccount/orderSearch/${orderId}/${zipCode}`);
      }
    }
  }
  /**
   * Function handles the client side error on tab press
   * @param {event} e
   */
  onKeyDown(e) {
    const { value, name } = e.target;
    const { formErrors } = this.state;
    const { zipCode, orderId } = formErrors;
    const fieldValidationErrors = {};
    if (e.keyCode === TAB_KEY_CODE && value.length <= 0) {
      fieldValidationErrors.orderId = name === ORDER_ID || orderId;
      fieldValidationErrors.zipCode = name === ZIP_CODE || zipCode;
      this.setState({ formErrors: fieldValidationErrors });
    }
  }
  /**
   * @function, onChangeinput function sets the value of form field email or password into the state
   * @param {*} e, event
   * @param {string} name, name is the id given to the input field
   * @returns {null}, returns nothing
   */
  onChangeinput(event) {
    const { value, name } = event.target;
    const { formErrors } = this.state;
    const { orderId, zipCode } = formErrors;
    const fieldValidationErrors = {};
    if (name === ORDER_ID) {
      this.setState({ orderId: replaceCharactersInString(value) });
    }
    if (name === ZIP_CODE) {
      this.setState({ zipCode: replaceCharactersInString(value) });
    }
    if (value.length && (orderId || zipCode)) {
      fieldValidationErrors.orderId = name === ORDER_ID ? false : orderId;
      fieldValidationErrors.zipCode = name === ZIP_CODE ? false : zipCode;
      this.setState({ formErrors: fieldValidationErrors });
    }
  }

  validateForm() {
    const fieldValidationErrors = {};
    let formValidate = true;
    const { orderId, zipCode } = this.state;
    if (orderId === '') {
      fieldValidationErrors.orderId = true;
      this.setState({ formErrors: fieldValidationErrors });
      formValidate = false;
    }
    if (zipCode === '') {
      fieldValidationErrors.zipCode = true;
      this.setState({ formErrors: fieldValidationErrors });
      formValidate = false;
    }
    this.setState({ formErrors: fieldValidationErrors });
    return formValidate;
  }
  /**
   * func to validate form at client side and make api call on success of validate form
   */
  formSubmit(e) {
    e.preventDefault();
    const { loadOrderDetails } = this.props;
    const { orderId, zipCode } = this.state;

    if (this.validateForm()) {
      loadOrderDetails(orderId, zipCode);
    }
  }
  /**
   * Method to push analytics for server side error.
   * @param {string} errorLabel string to be passed as eventlabel
   */
  pushErrorAnalytics(errorLabel = '') {
    this.props.analyticsContent({
      event: ERROR_EVENT_NAME,
      eventCategory: ERROR_CATEGORY,
      eventAction: `${ERROR_ACTION_LABEL}${ExecutionEnvironment.canUseDOM ? decodeURIComponent(window.location.pathname) : ''}`,
      eventLabel: errorLabel
    });
  }
  render() {
    const { cms, cardHeading, error, orderLabel, zipcodeLabel, buttonText, orderSearchErrorKey, authenticated, showNoOrderMessage } = this.props;
    const errorMessage = orderSearchErrorKey;
    const { enterShippingZipcode, enterBillingZipcode, enterOrderNumber } = cms.errorMsg;
    const { orderId, zipCode, formErrors } = this.state;
    return (
      <div className="container-fluid px-0 px-md-1">
        <div className={`${styles.card} row pb-6`}>
          <div className="col-12 p-0 col-md-10 offset-md-1">
            <div className="pl-1 mt-3 mt-md-6 o-copy__20reg">{cardHeading}</div>
            {error ? (
              <div className="m-1">
                <AlertComponent
                  message={cms.errorMsg[errorMessage] || cms.errorMsg[ERR_ACCOUNT_PAGE]}
                  errorTracking={() => this.pushErrorAnalytics(ERROR_FIND_ORDERS_LABEL)}
                  scrollTopOffset={-270}
                  enableAutoErrorLogging
                />
              </div>
            ) : null}
            <form>
              <div className="mx-1 mx-md-0 mt-2 d-flex flex-column flex-md-row justify-content-between">
                <div className="d-flex flex-row w-100">
                  <div className="col-7 pr-1 pr-md-2 pl-0 pl-md-1">
                    <label htmlFor="myaccount-orderid">
                      {' '}
                      <span className="o-copy__14bold">{orderLabel}</span>{' '}
                    </label>
                    <InputField
                      name="orderId"
                      type="tel"
                      id="myaccount-orderid"
                      value={orderId}
                      classname={classNames(
                        `${styles.inputBorder}`,
                        'remove-spinner__number-field',
                        'form-control w-100',
                        formErrors.orderId ? `${styles.invalid}` : ''
                      )}
                      onChange={value => this.onChangeinput(value)}
                      onKeyDown={this.onKeyDown}
                      maxlength="19"
                    />
                    <span className={formErrors.orderId ? styles.errorMsgDisp : styles.errMsg}>{enterOrderNumber}</span>
                  </div>
                  <div className="col-5 px-0">
                    <label htmlFor="myaccount-order-zipcode">
                      {' '}
                      <span className="o-copy__14bold">{zipcodeLabel}</span>{' '}
                    </label>
                    <InputField
                      name="zipCode"
                      type="tel"
                      id="myaccount-order-zipcode"
                      value={zipCode}
                      maxlength="5"
                      classname={classNames(
                        `${styles.inputBorder}`,
                        'remove-spinner__number-field',
                        'form-control w-100',
                        formErrors.zipCode ? `${styles.invalid}` : ''
                      )}
                      onChange={value => this.onChangeinput(value)}
                      onKeyDown={this.onKeyDown}
                    />
                    <span className={formErrors.zipCode ? styles.errorMsgDisp : styles.errMsg}>
                      {authenticated ? enterShippingZipcode : enterBillingZipcode}
                    </span>
                  </div>
                </div>
                <div className="pt-3 px-0 px-md-1 col-md-3 col-12">
                  <Button auid="button-3" size="S" className={`${styles.buttonHover} w-100`} onClick={this.formSubmit} type="submit">
                    {buttonText}
                  </Button>
                </div>
              </div>
            </form>
          </div>
          {authenticated &&
            showNoOrderMessage && (
              <div className="col-md-10 mt-2 w-100 offset-md-1 pl-half pr-1 pl-md-1">
                <hr />
                <div className="o-copy__14reg col-md-12 px-0">{cms.noOrderText}</div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

NoOrder.propTypes = {
  cms: PropTypes.object.isRequired,
  cardHeading: PropTypes.string,
  orderLabel: PropTypes.string,
  zipcodeLabel: PropTypes.string,
  buttonText: PropTypes.string,
  loadOrderDetails: PropTypes.func,
  error: PropTypes.bool,
  orderSearchErrorKey: PropTypes.string,
  redirect: PropTypes.bool,
  history: PropTypes.any,
  authenticated: PropTypes.bool,
  analyticsContent: PropTypes.func,
  showNoOrderMessage: PropTypes.bool,
  globalLoader: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<NoOrder {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default withRouter(NoOrder);
