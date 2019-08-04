import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames';
import InputField from '@academysports/fusion-components/dist/InputField';
import Button from '@academysports/fusion-components/dist/Button';
import { get } from '@react-nitro/error-boundary';
import saga from './saga';
import reducer from './reducer';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import { addPromoCode as addPromoCodeAction, removePromoCode, promocodeSuccess } from './action';

import { iconPlus, iconMinus, enterField, iconBtn, inputField, borderError } from './styles';
import * as constants from './constants';

class PromotionalMessaging extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addPromoCode: false,
      promoCode: '',
      error: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangePromocode = this.onChangePromocode.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.submitAnalytics = this.submitAnalytics.bind(this);
  }

  /**
   * Method to push analytics data whenever error is returned by promocode API.
   * @param {object} prevProps Previous props received.
   */
  componentDidUpdate(prevProps) {
    const { apiErrorDetails, api } = this.props;
    if (apiErrorDetails && prevProps.apiErrorDetails !== apiErrorDetails && apiErrorDetails.error) {
      this.submitAnalytics(true);
    }
    if (prevProps.api.length === 0 && api.length === 1) {
      this.submitAnalytics(false);
    }
  }

  /**
   * Method to set state when promo code is changed.
   * @param  {object} event Event object
   */
  onChangePromocode(event) {
    this.setState({ promoCode: event.target.value });
  }

  /**
   * Method to be called when 'Submit' button is clicked.
   */
  onSubmit(e) {
    e.preventDefault();
    const { promoCode } = this.state;
    const { fnTogglePromocodeState, fnAddPromocode, orderId } = this.props;
    this.setState({ error: false });
    fnTogglePromocodeState();
    if (!promoCode) {
      this.setState({ error: true });
      this.submitAnalytics(true);
      return;
    }
    fnAddPromocode({ orderId, code: promoCode });
  }

  /**
   * Method called when remove promo code is clicked.
   * @param  {string} code Promocode which is removed.
   */
  onRemove(code) {
    const { analyticsContent, fnremovePromoCode, orderId } = this.props;
    const { promoCode } = this.state;
    this.setState({ addPromoCode: false });
    fnremovePromoCode({ orderId, code });
    const analyticsDataObject = {
      event: constants.EVENT_NAME,
      eventCategory: constants.EVENT_CATEGORY_NAME,
      eventAction: constants.EVENT_ACTION_REMOVED_PROMOCODE,
      eventLabel: `removed|${promoCode}`,
      applypromocode: 0
    };
    analyticsContent(analyticsDataObject);
  }

  /**
   * Method to push analytics object for 'Submit' of promocode.
   * If error is true, if errorMessage exists, use it for label.
   * If error is true, If error Message does not exist, it is a case of empty string being submitted.
   * @param {bool} error Flag set to false for pushing success object, true for pushing error object.
   */
  submitAnalytics(error = false) {
    const { analyticsContent, apiErrorDetails, cms } = this.props;
    const { promoCode } = this.state;
    const analyticsDataObject = {
      event: constants.EVENT_NAME,
      eventCategory: constants.EVENT_CATEGORY_NAME,
      eventAction: error ? constants.EVENT_ACTION_ERROR : constants.EVENT_ACTION_SUCCESS,
      eventLabel: error
        ? `error|${promoCode}|${get(apiErrorDetails, 'errorInfo.errors[0].errorMessage') ||
            get(cms, 'errorMsg.promoCodeEnter', 'Please enter a promocode.')}`
        : `applied|${promoCode}`,
      applypromocode: error ? 0 : 1
    };
    analyticsContent(analyticsDataObject);
  }

  /**
   * Method to toggle promo code field and button
   * @param  {boolean} flag flag for maintaining if field should be open or not.
   */
  togglePromo(flag) {
    this.props.fnTogglePromocodeState();
    this.setState({ addPromoCode: flag, promoCode: '', error: false });
  }

  /**
   * Method to return if either promo field is submit blank or with a wrong value.
   */
  invalidValueInPromoField() {
    const { error } = this.state;
    const { apiErrorDetails } = this.props;
    return error || (apiErrorDetails && apiErrorDetails.error);
  }

  /**
   * Method to submit field on "Enter" press.
   */
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.onSubmit(e);
    }
  }

  render() {
    const { cms, api, apiErrorDetails } = this.props;
    const { addPromoCode, error, promoCode } = this.state;
    const promoError = get(apiErrorDetails, 'errorInfo.errors[0].errorKey', '');
    return (
      <div className="mb-3">
        {!api.length && (
          <React.Fragment>
            {!addPromoCode && (
              <div className="d-flex flex-row">
                <button
                  data-auid="crt_btnAddPromo"
                  role="link"
                  onClick={() => this.togglePromo(true)}
                  aria-label="Add promo code button"
                  className={`${iconBtn} mr-1`}
                >
                  <span className={classNames('academyicon icon-plus mr-1', iconPlus)} />
                  <span className="o-copy__14reg addLabel">{cms.commonLabels.addPromoCodeLabel}</span>
                </button>
              </div>
            )}
            {addPromoCode && (
              <form action="." method="post">
                <div data-auid="c_btnInputPromo">
                  <div className="d-flex flex-row">
                    <button
                      type="button"
                      data-auid="crt_btnHidePromo"
                      role="link"
                      onClick={() => this.togglePromo(false)}
                      aria-label="Hide promo code textbox"
                      className={iconBtn}
                    >
                      <i className={classNames('academyicon icon-minus', 'mr-1 mr-md-1', iconMinus)} />
                      <span className="o-copy__14reg hideLabel">{cms.commonLabels.hidePromoCodeLabel || cms.hidePromoCodeLabel}</span>
                    </button>
                  </div>
                  <label htmlFor="promofield" className="o-copy__14bold mt-half mb-half ml-3">
                    {cms.enterPromoCodeLabel}
                  </label>
                  <div className={classNames('d-flex', 'pl-3', 'pl-md-0', enterField)}>
                    <InputField
                      data-auid="crt_inputPromo"
                      classname={`mr-0 mr-md-1 ${!this.invalidValueInPromoField() && 'mb-1'} mb-md-0 ml-0 ml-md-3 ${inputField} ${error &&
                        borderError}`}
                      height={constants.PROMOFIELD_MOBILE_HEIGHT}
                      autoFocus
                      value={promoCode}
                      onChange={this.onChangePromocode}
                      onKeyDown={this.handleKeyDown}
                      id="promofield"
                    />
                    {error && (
                      <div className="o-copy__14reg mt-half mb-1 text-danger d-block d-md-none" role="alert">
                        {get(cms, 'errorMsg.promoCodeEnter', 'Please enter a promocode.')}
                      </div>
                    )}
                    {apiErrorDetails &&
                      apiErrorDetails.error && (
                        <div className="o-copy__14reg mt-half mb-1 text-danger d-block d-md-none" role="alert">
                          {apiErrorDetails.errorInfo.errors && apiErrorDetails.errorInfo.errors.length
                            ? apiErrorDetails.errorInfo.errors[0].errorMessage
                            : constants.FALLBACK_GENERIC_ERROR_MSG}
                        </div>
                      )}
                    <Button auid="crt_btnPromoSbmt" type="submit" size="S" btntype="secondary" className="ml-0 submitBtn" onClick={this.onSubmit}>
                      {cms.commonLabels.submitLabel}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </React.Fragment>
        )}
        {api.length > 0 &&
          api.map((promo, i) => (
            <div key={promo.code}>
              <div className="o-copy__14reg mb-1 mb-md-1">{cms.commonLabels.promoCodeAddedLabel.replace('{{promocode}}', promo.code)}</div>
              <div className="d-flex flex-row">
                <button
                  data-auid={`crt_btnRmPromo_${i}`}
                  role="link"
                  onClick={() => this.onRemove(promo.code)}
                  aria-label="Remove promo code"
                  className={iconBtn}
                >
                  <i className="academyicon icon-x-circle mr-1 mr-md-1" />
                </button>
                <div className="o-copy__14reg promoCode"> {cms.commonLabels.removeLabel} </div>
              </div>
            </div>
          ))}
        {error && (
          <div className="o-copy__14reg mt-half ml-3 text-danger d-none d-md-block" role="alert">
            {get(cms, 'errorMsg.promoCodeEnter', 'Please enter a promocode.')}
          </div>
        )}
        {apiErrorDetails &&
          apiErrorDetails.error && (
            <div className="o-copy__14reg mt-half ml-3 text-danger d-none d-md-block" role="alert">
              {cms.errorMsg[promoError] || constants.FALLBACK_GENERIC_ERROR_MSG}
            </div>
          )}
      </div>
    );
  }
}

PromotionalMessaging.propTypes = {
  cms: PropTypes.object.isRequired,
  fnAddPromocode: PropTypes.func,
  fnremovePromoCode: PropTypes.func,
  fnTogglePromocodeState: PropTypes.func,
  api: PropTypes.array,
  orderId: PropTypes.string,
  apiErrorDetails: PropTypes.object,
  analyticsContent: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  fnAddPromocode: data => dispatch(addPromoCodeAction(data)),
  fnremovePromoCode: data => dispatch(removePromoCode(data)),
  fnTogglePromocodeState: data => dispatch(promocodeSuccess(data))
});

const withConnect = connect(
  null,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withSaga = injectSaga({ key: constants.NODE_TO_MOUNT, saga });
  const withReducer = injectReducer({ key: constants.NODE_TO_MOUNT, reducer });
  const PromotionalMessagingContainer = compose(
    withSaga,
    withReducer,
    withConnect
  )(PromotionalMessaging);
  [...document.querySelectorAll(`[data-component="${constants.NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <PromotionalMessagingContainer {...window.ASOData[el.getAttribute(`${constants.DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(PromotionalMessaging);
