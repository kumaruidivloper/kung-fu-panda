import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import reducer from '../createAccount/reducer';
import injectReducer from '../../utils/injectReducer';
import {
  confirmationLinksText,
  confirmationLinks,
  imageBanner,
  confirmationBannerHeading,
  confirmationBannerSubHeading,
  orderNumber,
  orderNumberTitle,
  iconSize
} from './styles';
import Storage from '../../utils/StorageManager';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { getURLparam } from './../../utils/helpers';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';

class OrderConfirmation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      guest: true
    };
    this.handlePrint = this.handlePrint.bind(this);
    this.onAccountClick = this.onAccountClick.bind(this);
    this.pushAnalytics = this.pushAnalytics.bind(this);
  }
  componentDidMount() {
    this.checkSignIn();
  }
  /**
   * willrecieveprops function so that any change in the reducer should detect and we can check the cookie value for updation.
   * @param {object} nextProps updated props object containing create account reducer
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.modalStatus !== nextProps.modalStatus && Object.keys(nextProps.modalStatus).length !== 0) {
      this.checkSignIn();
    }
  }
  /**
   * function is used to track analytics on click of myaccount/createAccount link
   */
  onAccountClick() {
    const { cms } = this.props;
    const label = this.state.guest ? cms.createAccount : cms.seeMyAccount;

    this.pushAnalytics(label);
  }
  /**
   * function which checks for sign in cookies
   * @return {boolean} status of whether guest user or not
   */
  checkSignIn() {
    const status = !Storage.getCookie('USERTYPE') || Storage.getCookie('USERTYPE') !== 'R';
    this.setState({
      guest: status
    });
    return status;
  }
  /**
   * function for checking whether user is guest or not, if not then to display create account or my account
   * @param {object} cms cms object
   */
  guestCheck(cms) {
    const label = this.state.guest ? cms.createAccount : cms.seeMyAccount;

    return (
      <p
        className={`${confirmationLinksText} o-copy__14reg`}
      >
        {label}
      </p>);
  }
  /**
   * function is used for printing the page
   */
  handlePrint() {
    const { cms } = this.props;
    const label = cms && cms.commonLabels && cms.commonLabels.printLabel ? cms.commonLabels.printLabel : 'print';

    this.pushAnalytics(label);
    window.print();
  }
  /**
   * function is used to track analytics on click of links
   * @param {string} label link label
   */
  pushAnalytics(label) {
    const { analyticsContent } = this.props;
    const landingDrawer = Storage.getCookie('ANALYTICS_CHECKOUT_LANDING_DRAWER');
    const analyticsData = {
      event: 'checkoutsteps',
      eventCategory: 'checkout',
      eventAction: 'order confirmation',
      'checkout steps': landingDrawer || '',
      eventLabel: `${label.toLowerCase()}`,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };

    analyticsContent(analyticsData);
  }

  render() {
    const { cms } = this.props;
    return (
      <div className={`orderConfirmation ${imageBanner(cms.backgroundImage)}`}>
        <div className="d-flex flex-column align-items-center">
          <h1 className={`${confirmationBannerHeading} pt-5`}>{cms.thankYouMessage}</h1>
          <p className={`${confirmationBannerSubHeading}`}>{cms.confirmationMail}</p>
          <p className={`${orderNumberTitle} o-copy__16bold`}>{cms.orderNumber}</p>
          <p className={`${orderNumber}`}>{getURLparam('orderId')}</p>
          <div className="d-flex flex-row mt-1">
            <a
              onClick={this.handlePrint}
              href="# "
              data-auid="checkout_order_confirmation_print_orderDetails_link"
              className={`d-flex mr-1 ${confirmationLinks}`}
            >
              <i className={`academyicon icon-print ${iconSize} pr-half`} />
              <p className={`${confirmationLinksText} o-copy__14reg`}>{cms.commonLabels.printLabel}</p>
            </a>
            <a
              href={this.state.guest ? cms.signupLink : cms.myAccountSeoUrl}
              data-auid="checkout_order_confirmation_create_account_link"
              className={`d-flex ${confirmationLinks}`}
              onClick={this.onAccountClick}
            >
              <i className={`academyicon icon-person ${iconSize} pr-half`} />
              {this.guestCheck(cms)}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

OrderConfirmation.propTypes = {
  cms: PropTypes.object.isRequired,
  modalStatus: PropTypes.object,
  analyticsContent: PropTypes.func
};
const mapStateToProps = state => ({
  modalStatus: state.createAccount.createAccount
});
const withConnect = connect(mapStateToProps);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const OrderConfirmationContainer = compose(
    withReducer,
    withConnect
  )(OrderConfirmation);
  const OrderConfirmationWrapper = AnalyticsWrapper(OrderConfirmationContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <OrderConfirmationWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default AnalyticsWrapper(withConnect(OrderConfirmation));
