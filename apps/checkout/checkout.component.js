/* eslint-disable*/
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { get } from '@react-nitro/error-boundary';
import { Provider, connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { reducer as form } from 'redux-form';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  USERTYPE,
  CART_PAGE_URL_PATHNAME,
  VIEW_CART_LABEL,
  errorDefaultKey,
  GIFT_CARD_EVENT_ACTION,
  GIFT_CARD_EVENT_CATEGORY,
  GIFT_CARD_EVENT_NAME,
  APPLY_GIFT_CARD_EVENT_LABEL,
  REMOVE_GIFT_CARD_EVENT_LABEL,
  LANDING_DRAWER,
  LANDING_DRAWER_LOGIN
} from './checkout.constants';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import rootReducer from './store/reducers';
import AnalyticsWrapper from '../../modules/analyticsWrapper/analyticsWrapper.component';
import saga, { setPageStateTest, signinData } from './store/sagas';
import Storage from '../../utils/StorageManager';
import * as actions from './store/actions';
import { showSigninModal } from './../../modules/loginModal/actions';
import { scrollIntoView } from '../../utils/scroll';
import { has } from './../../utils/objectUtils';
import { adBugMapper, sportsTeamName, colorForProduct, typeOfOrder } from './../../utils/analyticsUtils';
import {
  OrderSummamry,
  ShippingAddressExpanded,
  ShippingAddressCollapsed,
  ShippingMethodExpanded,
  ShippingMethodCollapsed,
  InStorePickUpExpanded,
  InStorePickUpCollapsed,
  ShipToStoreExpanded,
  ShipToStoreCollapsed,
  PaymentOptionsExpanded,
  PaymentOptionsCollapsed,
  ReviewOrder
} from './checkout.modules';
import GenericError from './../../modules/genericError/components/alertComponent';
import Loader from './../../modules/loader/loader.component';
import { sectionWrapper, breakOut, heading, StyledH2 } from './checkout.styles';
import * as styles from './checkout.styles';
import { CHECKOUT_COOKIE } from '../../utils/constants';
import { getURLparam } from '../../utils/helpers';
import { showLoader, hideLoader } from './store/actions/globalLoader';

const applyGiftCardAnalyticsData = {
  event: GIFT_CARD_EVENT_NAME,
  eventCategory: GIFT_CARD_EVENT_CATEGORY,
  eventAction: GIFT_CARD_EVENT_ACTION,
  eventLabel: APPLY_GIFT_CARD_EVENT_LABEL,
  customerleadlevel: null,
  customerleadtype: null,
  leadsubmitted: 0,
  newslettersignupcompleted: 0
};
const removeGiftCardAnalyticsData = {
  event: GIFT_CARD_EVENT_NAME,
  eventCategory: GIFT_CARD_EVENT_CATEGORY,
  eventAction: GIFT_CARD_EVENT_ACTION,
  eventLabel: REMOVE_GIFT_CARD_EVENT_LABEL,
  customerleadlevel: null,
  customerleadtype: null,
  leadsubmitted: 0,
  newslettersignupcompleted: 0
};

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landingDrawer: ''
    };
    this.onClickEditHandler = this.onClickEditHandler.bind(this);
    this.showLoginModalHandler = this.showLoginModalHandler.bind(this);
  }

  componentDidMount() {
    // if order id is not set in cookie redirect to home page
    const {
      cms: { isAuthoring },
      showLoader,
      hideLoader
    } = this.props;

    showLoader();
    if (ExecutionEnvironment.canUseDOM && isAuthoring === 'N') {
      if (Storage.getCookie(CHECKOUT_COOKIE)) {
        const orderIDInCookie = Storage.getCookie(CHECKOUT_COOKIE);
        const orderId = getURLparam('orderId');
        if (orderIDInCookie !== orderId) {
          window.location.href = '/';
        } else {
          hideLoader();
          this.setLogInStatus();

          this.props.fetchOrderDetails(); // fetch complete order details
        }
      } else {
        window.location.href = '/';
      }
    }
    this.scrollIntoView();
  }

  /**
   * Sign in link callback handler
   * @param evt
   */
  showLoginModalHandler(evt) {
    evt.preventDefault();
    this.props.showSigninModal();
    this.eCommerceAnalyticsData('checkout method');
  }

  eCommerceAnalyticsData(content) {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: 'signin',
      eventCategory: 'user account',
      eventAction: 'login initiated',
      eventLabel: 'sign in|checkout',
      authenticationcomplete: 0 // always 0 because opening of singin modal.
    };
    analyticsContent(analyticsData);
  }

  /**
   * Check the DOM if the sign in link exists, if exists, attach event handlers to call login modal action
   */
  componentWillReceiveProps(nextProps) {
    const { checkout: { pageState } } = this.props;
    const nextPageState = nextProps.checkout.pageState;
    const { isLoggedIn } = this.props.checkout.authStatus;
    const { orderDetails } = this.props.checkout;
    const giftCardDetails = this.getGiftCardDetails(orderDetails);
    const newgiftCardDetails = this.getGiftCardDetails(nextProps.checkout.orderDetails);
    const { analyticsContent } = this.props;
    if (document.querySelector('.signInLink')) {
      const singInLink = document.querySelector('.signInLink').querySelector('a');
      singInLink.removeEventListener('click', this.showLoginModalHandler);
      singInLink.addEventListener('click', this.showLoginModalHandler, false);
    }
    if (pageState !== nextProps.checkout.pageState) {
      let id = '';
      Object.keys(nextProps.checkout.pageState).map(key => (id = pageState[key] !== nextProps.checkout.pageState[key] && key));
      this.scrollIntoView(id);
    }
    let DrawerName = "shipping info";
    // if page state populates, set page state into component's state for analytics tracking.
    if (isLoggedIn && (Object.keys(nextPageState).length > Object.keys(pageState).length) && (!Storage.getLocalStorage(LANDING_DRAWER_LOGIN) || Storage.getLocalStorage(LANDING_DRAWER_LOGIN).length === 0)) {
      const landingDrawer = Object.keys(nextPageState).find(drawer => nextPageState[drawer].edit);
      // map drawer name.
      switch (landingDrawer) {
        case 'shippingAddressRequired': DrawerName =  'shipping info'; break;
        case 'shippingMethodRequired': DrawerName = 'shipping method'; break;
        case 'specialOrderDrawerRequired': DrawerName = 'special order ship to store'; break;
        case 'pickupDrawerRequired': DrawerName = 'in store pickup'; break;
        case 'paymentRequired': DrawerName = 'payment'; break;
        default: DrawerName = 'review'; 
      }
      this.setState({
        landingDrawer: DrawerName
      });
      Storage.setLocalStorage(LANDING_DRAWER_LOGIN, DrawerName);
    } else if (Object.keys(nextPageState).length === 0 &&  (!Storage.getLocalStorage(LANDING_DRAWER) || Storage.getLocalStorage(LANDING_DRAWER).length === 0)) {
      Storage.setLocalStorage(LANDING_DRAWER, DrawerName);
    } else if (Object.keys(nextPageState).length &&  (!Storage.getLocalStorage(LANDING_DRAWER) || Storage.getLocalStorage(LANDING_DRAWER).length === 0)) {
      const landingDrawer = Object.keys(nextPageState).find(drawer => nextPageState[drawer].edit);
      // map drawer name.
      switch (landingDrawer) {
        case 'shippingAddressRequired': DrawerName =  'shipping info'; break;
        case 'shippingMethodRequired': DrawerName = 'shipping method'; break;
        case 'specialOrderDrawerRequired': DrawerName = 'special order ship to store'; break;
        case 'pickupDrawerRequired': DrawerName = 'in store pickup'; break;
        case 'paymentRequired': DrawerName = 'payment'; break;
        default: DrawerName = 'review'; 
      }
      this.setState({
        landingDrawer: DrawerName
      });
      Storage.setLocalStorage(LANDING_DRAWER, DrawerName);
    }
    if (giftCardDetails && newgiftCardDetails && giftCardDetails.length < newgiftCardDetails.length) {
      analyticsContent(applyGiftCardAnalyticsData);
    } else if (giftCardDetails && newgiftCardDetails && giftCardDetails.length > newgiftCardDetails.length) {
      analyticsContent(removeGiftCardAnalyticsData);
    }
  }
  /**
   * method return giftcard data from order api data
   * @param {object} orderDetails -contains order api data
   */
  getGiftCardDetails(orderDetails) {
    return get(orderDetails, 'data.orders[0].giftCardDetails', false);
  }
  /**
   * Scroll the element to the view
   */
  scrollIntoView(id) {
    const el = document.getElementById(id);
    if (el) {
      // scrollIntoView(el, { offset: -20 });
      scrollIntoView(el, { offset: -50 });
    }
  }
  /**
   * Set the login status based on the cookie value
   */
  setLogInStatus() {
    const loggedInState = Storage.getCookie(USERTYPE);
    if (loggedInState === 'R') {
      this.props.setAuthStatus(true);
    }
  }

  /**
   * Callback function to toggle expand/collapse state of a particular drawer
   * @param stateName
   */
  onClickEditHandler(evt, stateName) {
    evt.preventDefault();
    this.props.markSectionToEdit(stateName);
  }

  /**
   * Render shipping address drawer
   * @returns {html}
   */
  renderShippingAddress() {
    const { cms, analyticsContent } = this.props;
    const { landingDrawer } = this.state;
    const {
      authStatus: { isLoggedIn },
      pageState,
      orderDetails,
      savedShippingAddress,
      validateAddress,
      fetchCityStateFromZipCode,
      addShippingAddress
    } = this.props.checkout;
    const { data } = orderDetails;
    const { edit, required, showEditLink } = pageState.shippingAddressRequired;

    return (
      <Fragment>
        {
          <li
            className={`${styles.stepProgressItem} ${
              !edit && !required ? styles.stepProgressDone : edit ? styles.stepProgressCurrent : styles.stepNotDone
            }`}
          >
            {edit === true && <StyledH2 className="text-uppercase m-0 p-0">{cms.shippingTitle}</StyledH2>}
            {required === true &&
              edit === false && <StyledH2 className={`${styles.fontNotVisited} text-uppercase  m-0 p-0`}>{cms.shippingTitle}</StyledH2>}
            {edit === true && (
              <div id="shippingAddressRequired" data-auid="checkout_shipping_address" className={`${sectionWrapper} p-1 p-md-3`}>
                <ShippingAddressExpanded
                  cms={cms}
                  orderDetails={data.orders[0]}
                  isLoggedIn={isLoggedIn}
                  savedShippingAddress={savedShippingAddress}
                  validateShippingAddress={validateAddress}
                  zipCodeCityStateData={fetchCityStateFromZipCode}
                  addShippingAddress={addShippingAddress}
                  required={required}
                  analyticsContent={analyticsContent}
                  landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                />
              </div>
            )}
            {required === false &&
              edit === false && (
                <div data-auid="checkout_shipping_address_collapsed" className={`${sectionWrapper} m-0 py-3 px-1`}>
                  <ShippingAddressCollapsed
                    cms={cms}
                    orderDetails={data.orders[0]}
                    isLoggedIn={isLoggedIn}
                    showEditLink={showEditLink}
                    onEditHandler={evt => this.onClickEditHandler(evt, 'shippingAddressRequired')}
                    landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                  />
                </div>
              )}
          </li>
        }
      </Fragment>
    );
  }

  /**
   * Render shipping methods drawer
   * @returns {html}
   */
  renderShippingMethods() {
    const { landingDrawer } = this.state;
    const { cms, analyticsContent } = this.props;
    const {
      authStatus: { isLoggedIn },
      pageState,
      orderDetails,
      savedShippingModes,
      validateShippingModes
    } = this.props.checkout;
    const { data } = orderDetails;
    const { edit, required, showEditLink } = pageState.shippingMethodRequired;

    return (
      <Fragment>
        {
          <li
            className={`${styles.stepProgressItem} ${
              !edit && !required ? styles.stepProgressDone : edit ? styles.stepProgressCurrent : styles.stepNotDone
            }`}
          >
            {edit === true && <StyledH2 className="text-uppercase  m-0 p-0">{cms.shippingMethodLabel}</StyledH2>}
            {required === true &&
              edit === false && <StyledH2 className={`${styles.fontNotVisited} text-uppercase  m-0 p-0`}>{cms.shippingMethodLabel}</StyledH2>}
            {edit === true && (
              <div id="shippingMethodRequired" data-auid="checkout_shipping_methods" className={`${sectionWrapper} p-1 p-md-3`}>
                <ShippingMethodExpanded
                  cms={cms}
                  orderDetails={data.orders[0]}
                  isLoggedIn={isLoggedIn}
                  savedShippingModes={savedShippingModes}
                  buttonLabelCondition={required}
                  analyticsContent={analyticsContent}
                  validateShippingModes={validateShippingModes}
                  landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                />
              </div>
            )}
            {required === false &&
              edit === false && (
                <div data-auid="checkout_shipping_methods_collapsed" className={`${sectionWrapper} m-0 py-3 px-1`}>
                  <ShippingMethodCollapsed
                    cms={cms}
                    orderDetails={data.orders[0]}
                    showEditLink={showEditLink}
                    editShippingMethod={evt => this.onClickEditHandler(evt, 'shippingMethodRequired')}
                    analyticsContent={analyticsContent}
                    landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                  />
                </div>
              )}
          </li>
        }
      </Fragment>
    );
  }

  /**
   * Render payment options drawer
   * @returns {html}
   */
  renderPaymentMethods() {
    const { landingDrawer } = this.state;
    const { cms, analyticsContent, messages} = this.props;
    const {
      authStatus: { isLoggedIn },
      pageState,
      orderDetails,
      savedCreditCards,
      validateAddress,
      fetchCityStateFromZipCode,
      giftCardData,
      savedCreditCardCredentials,
      savedGiftCards,
      changeBillingAddress,
      postPaymentData
    } = this.props.checkout;
    const { data } = orderDetails;
    const { edit, required, showEditLink } = pageState.paymentRequired;

    return (
      <Fragment>
        {
          <li
            className={`${styles.stepProgressItem} ${
              !edit && !required ? styles.stepProgressDone : edit ? styles.stepProgressCurrent : styles.stepNotDone
            }`}
          >
            {edit === true && <StyledH2 className="text-uppercase  m-0 p-0">{cms.paymentTitle}</StyledH2>}
            {required === true &&
              edit === false && <StyledH2 className={`${styles.fontNotVisited} text-uppercase  m-0 p-0`}>{cms.paymentTitle}</StyledH2>}
            {edit === true && (
              <div id="paymentRequired" data-auid="checkout_payment" className={`${sectionWrapper} p-1 p-md-3`}>
                <PaymentOptionsExpanded
                  cms={cms}
                  orderDetails={data.orders[0]}
                  required={required}
                  isLoggedIn={isLoggedIn}
                  savedCreditCards={savedCreditCards}
                  fetchCityStateFromZipCode={fetchCityStateFromZipCode}
                  giftCardData={giftCardData}
                  savedGiftCards={savedGiftCards}
                  validateBillingAddress={validateAddress}
                  savedCreditCardCredentials={savedCreditCardCredentials}
                  changeBillingAddress={changeBillingAddress}
                  paymentData={postPaymentData}
                  isEdited={edit}
                  analyticsContent={analyticsContent}
                  landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                  messages={messages}
                />
              </div>
            )}
            {required === false &&
              edit === false && (
                <div data-auid="checkout_payment_collapsed" className={`${sectionWrapper} m-0 py-3 px-1`}>
                  <PaymentOptionsCollapsed
                    cms={cms}
                    showEditLink={showEditLink}
                    onEditHandler={evt => this.onClickEditHandler(evt, 'paymentRequired')}
                    orderDetails={data.orders[0]}
                    landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                  />
                </div>
              )}
          </li>
        }
      </Fragment>
    );
  }

  /**
   * Render in-store pickup drawer
   * @returns {html}
   */
  renderPickUpMethods() {
    const { landingDrawer } = this.state;
    const { cms, labels, analyticsContent } = this.props;
    const { pageState, orderDetails, savedShippingModes, storeAddress, getStoreId, pickupInStore } = this.props.checkout;
    const { data } = orderDetails;
    const { edit, required, showEditLink } = pageState.pickupDrawerRequired;
    const { isLoggedIn } = this.props.checkout.authStatus;

    return (
      <Fragment>
        {
          <li
            className={`${styles.stepProgressItem} ${
              !edit && !required ? styles.stepProgressDone : edit ? styles.stepProgressCurrent : styles.stepNotDone
            }`}
          >
            {edit === true && <StyledH2 className="text-uppercase  m-0 p-0">{cms.inStorePickupLabel.inStorePickupLabel}</StyledH2>}
            {required === true &&
              edit === false && (
                <StyledH2 className={`${styles.fontNotVisited} text-uppercase  m-0 p-0`}>{cms.inStorePickupLabel.inStorePickupLabel}</StyledH2>
              )}
            {edit === true && (
              <div id="pickupDrawerRequired" data-auid="checkout_payment" className={`${sectionWrapper} p-1 p-md-3`}>
                <InStorePickUpExpanded
                  cms={cms}
                  orderDetails={data.orders[0]}
                  savedShippingModes={savedShippingModes}
                  storeAddress={storeAddress}
                  getStoreId={getStoreId}
                  buttonLabelCondition={required}
                  analyticsContent={analyticsContent}
                  pickupInStore={pickupInStore}
                  landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                />
              </div>
            )}
            {required === false &&
              edit === false && (
                <div data-auid="checkout_payment_collapsed" className={`${sectionWrapper} m-0 py-3 px-1`}>
                  <InStorePickUpCollapsed
                    cms={cms}
                    labels={labels}
                    storeAddress={storeAddress}
                    orderDetails={data.orders[0]}
                    showEditLink={showEditLink}
                    editInStorePickup={evt => this.onClickEditHandler(evt, 'pickupDrawerRequired')}
                    landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                  />
                </div>
              )}
          </li>
        }
      </Fragment>
    );
  }

  /**
   * Render Special Order Firearms
   * @returns {html}
   */
  renderSpecialOrder() {
    const { landingDrawer } = this.state;
    const { cms, analyticsContent } = this.props;
    const { pageState, orderDetails, savedShippingModes, storeAddress, getStoreId, shipToStore } = this.props.checkout;
    const { data } = orderDetails;
    const { edit, required, showEditLink } = pageState.specialOrderDrawerRequired;
    const { isLoggedIn } = this.props.checkout.authStatus;

    return (
      <Fragment>
        {
          <li
            className={`${styles.stepProgressItem} ${
              !edit && !required ? styles.stepProgressDone : edit ? styles.stepProgressCurrent : styles.stepNotDone
            }`}
          >
            {edit === true && <StyledH2 className="text-uppercase  m-0 p-0">{cms.inStorePickupLabel.specialOrderShipToStoreTitle}</StyledH2>}
            {required === true &&
              edit === false && (
                <StyledH2 className={`${styles.fontNotVisited} text-uppercase  m-0 p-0`}>
                  {cms.inStorePickupLabel.specialOrderShipToStoreTitle}
                </StyledH2>
              )}
            {edit === true && (
              <div id="specialOrderDrawerRequired" data-auid="checkout_payment" className={`${sectionWrapper} p-1 p-md-3`}>
                <ShipToStoreExpanded
                  cms={cms}
                  orderDetails={data.orders[0]}
                  savedShippingModes={savedShippingModes}
                  storeAddress={storeAddress}
                  getStoreId={getStoreId}
                  buttonLabelCondition={required}
                  analyticsContent={analyticsContent}
                  shipToStore={shipToStore}
                  landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                />
              </div>
            )}
            {required === false &&
              edit === false && (
                <div data-auid="checkout_payment_collapsed" className={`${sectionWrapper} m-0 py-3 px-1`}>
                  <ShipToStoreCollapsed
                    cms={cms}
                    storeAddress={storeAddress}
                    showEditLink={showEditLink}
                    editShipToStore={evt => this.onClickEditHandler(evt, 'specialOrderDrawerRequired')}
                    orderDetails={data.orders[0]}
                    landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
                  />
                </div>
              )}
          </li>
        }
      </Fragment>
    );
  }

  /**
   * Render review order drawer
   * @returns {html}
   */
  renderReviewOrder() {
    const { landingDrawer } = this.state;
    const { cms, analyticsContent } = this.props;
    const { pageState, orderDetails, placeOrder, checkoutInventory } = this.props.checkout;
    const { data } = orderDetails;
    const { isLoggedIn } = this.props.checkout.authStatus;
    const isCheckoutReady = Object.keys(pageState).every(drawer => {
      return pageState[drawer].edit === false;
    });
    return (
      <li className={`${styles.stepProgressItem} ${isCheckoutReady ? styles.stepProgressCurrent : styles.stepNotDone}`}>
        {isCheckoutReady === false && <StyledH2 className={`${styles.fontNotVisited} text-uppercase  m-0 p-0`}>{cms.reviewOrderTitle}</StyledH2>}
        {isCheckoutReady === true && (
          <StyledH2 className={`text-uppercase  m-0 p-0`} ref={this.reviewRef}>
            {cms.reviewOrderTitle}
          </StyledH2>
        )}
        {isCheckoutReady && (
          <div data-auid="checkout_review_order" className={`${sectionWrapper} py-3 px-1`}>
            <ReviewOrder
              cms={cms}
              orderDetails={data.orders[0]}
              placeOrder={placeOrder}
              checkoutInventory={checkoutInventory}
              analyticsContent={analyticsContent}
              landingDrawer={isLoggedIn ? Storage.getLocalStorage(LANDING_DRAWER_LOGIN) : Storage.getLocalStorage(LANDING_DRAWER)}
            />
          </div>
        )}
      </li>
    );
  }

  render() {
    const { cms, analyticsContent } = this.props;
    const {
      pageState,
      authStatus: { isLoggedIn },
      orderDetails,
      globalLoader,
      checkoutInventory
    } = this.props.checkout;
    const { data } = orderDetails;
    return (
      <section>
        <div data-auid="checkout_page" className="container mb-0 mb-md-2">
          {orderDetails.error && (
            <div className="my-4">
              <GenericError message={cms.errorMsg[errorDefaultKey]} auid="fetch_order_failed" />
            </div>
          )}
          {checkoutInventory &&
            checkoutInventory.error && (
              <div className="my-4">
                <GenericError
                  message={cms.errorMsg.outOfStockCart}
                  link={CART_PAGE_URL_PATHNAME}
                  linkLabel={VIEW_CART_LABEL}
                  auid="inventory_out_of_stock_failed"
                />
              </div>
            )}
          {globalLoader.isFetching === true && <Loader className={`${styles.minHeight}`} overlay={Object.keys(data).length > 0} />}
          {Object.keys(data).length > 0 && (
            <Fragment>
              <div className="row">
                <div className="col-lg-12 col-sm-12 my-3 my-md-3">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h1 className={`${heading} text-uppercase m-0`}>{cms.checkoutTitle}</h1>
                      {!isLoggedIn && (
                        <p
                          data-auid="checkout_unauth_description_signin_link"
                          className={`body-14-regular m-0 p-0 mt-quarter mt-md-quarter signInLink ${styles.signLinkWrapper}`}
                          dangerouslySetInnerHTML={{ __html: cms.checkoutUnauthDescriptionText }}
                        />
                      )}
                    </div>
                    <div className="ml-auto align-self-center">
                      <span className={`academyicon icon-lock ${styles.fontIconColor}`} />
                      &nbsp;&nbsp;
                      <span className="body-14-regular">Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-8 col-12">
                  <ul className={`${styles.StepProgress}`}>
                    <Fragment>{has(pageState, 'shippingAddressRequired') && this.renderShippingAddress()}</Fragment>

                    <Fragment>{has(pageState, 'shippingMethodRequired') && this.renderShippingMethods()}</Fragment>

                    <Fragment>{has(pageState, 'pickupDrawerRequired') && this.renderPickUpMethods()}</Fragment>

                    <Fragment>{has(pageState, 'specialOrderDrawerRequired') && this.renderSpecialOrder()}</Fragment>

                    <Fragment>{has(pageState, 'paymentRequired') && this.renderPaymentMethods()}</Fragment>

                    <Fragment>{this.renderReviewOrder()}</Fragment>
                  </ul>
                </div>

                <div data-auid="checkout_order_summary" className={`col-md-4 col-12 ${breakOut}`}>
                  <OrderSummamry cartUrl="shop/cart" cms={cms} orderDetails={data.orders[0]} analyticsContent={analyticsContent} />
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </section>
    );
  }
}

Checkout.propTypes = {
  cms: PropTypes.object.isRequired,
  labels: PropTypes.object,
  messages: PropTypes.object,
  analyticsContent: PropTypes.func
};

const mapStateToProps = state => {
  return {
    ...state
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ ...actions, showSigninModal, showLoader, hideLoader }, dispatch);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer: rootReducer });
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const CheckoutContainer = compose(
    withReducer,
    formReducer,
    withSaga,
    withConnect
  )(Checkout);
  const CheckoutAnalyticsWrapper = AnalyticsWrapper(CheckoutContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CheckoutAnalyticsWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(Checkout));
