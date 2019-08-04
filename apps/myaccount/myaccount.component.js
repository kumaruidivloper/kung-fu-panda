import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import { Route, BrowserRouter } from 'react-router-dom';
import { reducer as form } from 'redux-form';
import Responsive from 'react-responsive';
import { Sidebar, AddressBook, Wishlist, ProfileInformation, MyAccountPayment } from './myaccount.modules';
import StorageManager from './../../utils/StorageManager';
import { titleCase } from '../../utils/stringUtils';
import { isMobile } from '../../utils/navigator';
import BreadCrumb from '../../modules/breadCrumb/breadCrumb.component';
import AnalyticsWrapper from '../../modules/analyticsWrapper/analyticsWrapper.component';
import AppContainer from './appContainer';
import { getProfileId } from '../../utils/UserSession';

// Address actions
import {
  fetchAddress,
  postAddress,
  toggleForm,
  toggleEditForm,
  deleteAddress,
  editAddress,
  setAlert,
  setAsDefault
} from '../../apps/myaccount/store/actions/fetchAddress';
import { validateAddress, inValidateAddressVerification } from './store/actions/validateAddress';
import { fetchMyAccountData } from './store/actions/fetchAccountData';
import { loadCityStateFromZipCode } from './store/actions/fetchCityState';
import { breadCrumbAction } from './store/actions/breadCrumb';
// profile
import {
  notificationCall,
  updateInformationRequest,
  updatePasswordRequest,
  setEditInfo,
  setPassword,
  closeMessage,
  closeProfileMessage,
  updatePasswordSuccess
} from '../../modules/profileInformation/actions';
// wishlist
import { getUserWishlist } from '../../modules/wishList/actions';
import { fetchWishlistItems, removeWishlistItem, addItemToCart } from '../../modules/wishlistItems/action';
import { addWishList, renameWishList } from '../../modules/createWishList/actions';
import { deleteWishlist } from '../../modules/wishlistDeleteModal/actions';
// payment
import {
  getCreditCards,
  getGiftCards,
  addGiftCard,
  deleteGiftCard,
  deleteCreditCard,
  addCreditCard,
  putCreditCard
} from '../../modules/myAccountPayment/actions';
import reducer from './store/reducers';
import saga from './store/sagas/index';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  CREATE_PASSWORD_LINK,
  withScrollProps,
  MOBILE_BREAD_CRUMB_TITLE,
  MOBILE_MAX_WIDTH,
  DESKTOP_MIN_WIDTH
} from './myaccount.constants';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
// orders
import { fetchOrderData, handleBackToOrders } from '../../modules/orders/action';
import { cancelOrderRequest, orderDetailsRequest, toggleRedirection } from '../../modules/orderCancellation/action';
import { shareWishlist } from '../../modules/wishlistShareModal/actions';
import Orders from '../../modules/orders';
import OrderCancellation from '../../modules/orderCancellation';
import OrderReturn from '../../modules/orderReturn';
import OrderDetails from '../../modules/orderDetails';
import { initiateOrderRequest } from '../../modules/orderReturn/action';
import { getOrderDetails } from '../../modules/noOrder/actions';
import { getOrderById } from '../../modules/order/actions';
import { getStoreDetailRequest, initiateOrderReset } from '../../modules/orderDetails/actions';
import { desktopStyles, wordWrap, outline0, BreadCrumbResponsive, AnchorStyle, BackIcon } from './myaccount.styles';
// Loader
import Loader from './../../modules/loader/loader.component';
import { showLoader } from './store/actions/globalLoader';

const URL_REDIRECTOR = {
  myaccount: {
    url: '/myaccount',
    title: 'My Account'
  },
  orders: {
    url: '/myaccount/Orders',
    title: 'Orders'
  },
  profile: {
    url: '/myaccount/profile',
    title: 'Profile'
  },
  wishlist: {
    url: '/myaccount/wishlist',
    title: 'Wish List'
  }
};

class Myaccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.getUserId(),
      // currentlySelected: '',
      // shouldRender: false,
      url: URL_REDIRECTOR.myaccount.url,
      title: URL_REDIRECTOR.myaccount.title,
      userRegistered: StorageManager.getCookie('USERTYPE') === 'R'
    };

    this.tabPanel = React.createRef();

    this.renderAddressBook = this.renderAddressBook.bind(this);
    this.renderOrderByID = this.renderOrderByID.bind(this);
    this.renderOrderCancelation = this.renderOrderCancelation.bind(this);
    this.renderOrderDetails = this.renderOrderDetails.bind(this);
    this.renderOrderReturn = this.renderOrderReturn.bind(this);
    this.renderOrders = this.renderOrders.bind(this);
    this.renderPayment = this.renderPayment.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.renderWishList = this.renderWishList.bind(this);
    this.setURLToState = this.setURLToState.bind(this);
    this.renderBreadCrumb = this.renderBreadCrumb.bind(this);
  }
  componentWillMount() {
    this.setInitialRoute();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.passwordExpiredFlag) {
      window.location.href = CREATE_PASSWORD_LINK;
    }
    if (nextProps.breadCrumbData !== this.props.breadCrumbData) {
      this.focusDiv();
    }
  }

  /**
   * Get user Id from cookies
   */
  getUserId() {
    return getProfileId();
  }
  /**
   * if cookies are there then call the profile api
   */
  setInitialRoute() {
    if (this.state.userId !== null && this.state.userRegistered) {
      this.props.fnFetchInitialData(this.state.userId);
    }
  }
  /**
   * setting breadcrumb value
   */
  setURLToState(redirectionURL) {
    this.setState({
      url: redirectionURL.url,
      title: redirectionURL.title
    });
  }
  /**
   * Focus on main content on clicking on left sidebar
   */
  focusDiv() {
    this.tabPanel.current.focus();
  }
  /**
   * redirect the user to login form.
   */
  redirectLogin() {
    window.location.href = '/shop/LogonForm';
  }
  redirectToOrders() {
    window.location.href = '/myaccount/Orders';
  }
  /**
   * Function is called when user clicks on view details of an order
   * @param {props}
   * @param {cms} labels from AEM
   */
  renderOrderByID(params) {
    this.setURLToState(URL_REDIRECTOR.orders);
    const {
      fnToggleRedirection,
      loadSelectedOrderDetails,
      fnHandleBackToOrders,
      orderDetailsById,
      fnCancelOrder,
      orderCancelError,
      orderCancelErrorKey,
      orderCancelErrorMessage,
      orderCancelRedirect,
      userId,
      cms,
      fnBreadCrumb,
      fnGetStoreDetailRequest,
      storeAddress,
      analyticsContent,
      storeAddressDetail
    } = this.props;
    const { userRegistered } = this.state;

    return (
      <OrderDetails
        {...params}
        storeAddress={storeAddress}
        storeAddressDetail={storeAddressDetail}
        getStoreAddressDetailsFn={fnGetStoreDetailRequest}
        authenticated={userRegistered}
        loadSelectedOrderDetails={loadSelectedOrderDetails}
        handleBackToOrders={fnHandleBackToOrders}
        cms={cms.order}
        orderDetailsById={orderDetailsById}
        fnCancelOrder={fnCancelOrder}
        orderCancelError={orderCancelError}
        orderCancelErrorKey={orderCancelErrorKey}
        orderCancelErrorMessage={orderCancelErrorMessage}
        orderCancelRedirect={orderCancelRedirect}
        errorMsg={cms.errorMsg}
        redirectToOrders={this.redirectToOrders}
        profileId={userId}
        fnToggleRedirection={fnToggleRedirection}
        breadCrumbAction={fnBreadCrumb}
        {...withScrollProps}
        analyticsContent={analyticsContent}
      />
    );
  }
  /**
   * This function renders the orders when user clicks the order sidebar
   */
  renderOrders() {
    this.setURLToState(URL_REDIRECTOR.myaccount);
    const {
      ordersList,
      fnFetchOrderList,
      orderDetailsSuccess,
      loadOrderDetails,
      loadSelectedOrderDetails,
      orderDetailsByIdSuccess,
      orderDetailsById,
      orderSearchError,
      orderDetails,
      fnHandleBackToOrders,
      orderSearchErrorKey,
      orderSearchRedirect,
      cms,
      fnBreadCrumb,
      analyticsContent,
      myaccount = {}
    } = this.props;
    const { globalLoader = {} } = myaccount;
    const { userRegistered, userId } = this.state;
    return (
      <Orders
        authenticated={userRegistered}
        ordersList={ordersList}
        cms={cms.order}
        errorMsg={cms.errorMsg}
        fnFetchOrderList={fnFetchOrderList}
        orderDetailsSuccess={orderDetailsSuccess}
        loadOrderDetails={loadOrderDetails}
        loadSelectedOrderDetails={loadSelectedOrderDetails}
        orderDetailsByIdSuccess={orderDetailsByIdSuccess}
        orderDetailsById={orderDetailsById}
        error={orderSearchError}
        orderDetails={orderDetails}
        handleBackToOrders={fnHandleBackToOrders}
        orderSearchErrorKey={orderSearchErrorKey}
        orderSearchRedirect={orderSearchRedirect}
        redirectLogin={this.redirectLogin}
        profileId={userId}
        breadCrumbAction={fnBreadCrumb}
        analyticsContent={analyticsContent}
        globalLoader={globalLoader}
        {...withScrollProps}
      />
    );
  }
  /**
   * Function to render order cancellation component on success of order cancellation
   * @param {object} params
   */
  renderOrderCancelation(params) {
    this.setURLToState(URL_REDIRECTOR.orders);
    const { loadOrderDetails, orderDetails, cms, fnBreadCrumb, analyticsContent } = this.props;
    return (
      <OrderCancellation
        {...params}
        authenticated={this.state.userRegistered}
        cms={cms.order}
        errorMsg={cms.errorMsg}
        loadOrderDetails={loadOrderDetails}
        orderDetails={orderDetails}
        breadCrumbAction={fnBreadCrumb}
        analyticsContent={analyticsContent}
        {...withScrollProps}
      />
    );
  }
  /**
   * this function renders the order details when user searchs the order with
   * order id and zipcode
   * @param {object} params
   */
  renderOrderDetails(params) {
    this.setURLToState(URL_REDIRECTOR.orders);
    const {
      fnToggleRedirection,
      loadOrderDetails,
      fnHandleBackToOrders,
      orderDetails,
      fnCancelOrder,
      orderCancelError,
      orderCancelErrorKey,
      orderCancelRedirect,
      cms,
      fnBreadCrumb,
      fnGetStoreDetailRequest,
      storeAddress,
      analyticsContent,
      storeAddressDetail,
      email,
      fninitiateOrderReset
    } = this.props;
    const { userRegistered } = this.state;
    const { order, errorMsg } = cms;
    return (
      <OrderDetails
        {...params}
        search="true"
        storeAddress={storeAddress}
        getStoreAddressDetailsFn={fnGetStoreDetailRequest}
        authenticated={userRegistered}
        loadSelectedOrderDetails={loadOrderDetails}
        handleBackToOrders={fnHandleBackToOrders}
        cms={order}
        errorMsg={errorMsg}
        orderDetailsById={orderDetails}
        fnCancelOrder={fnCancelOrder}
        orderCancelError={orderCancelError}
        orderCancelErrorKey={orderCancelErrorKey}
        orderCancelRedirect={orderCancelRedirect}
        fnToggleRedirection={fnToggleRedirection}
        breadCrumbAction={fnBreadCrumb}
        {...withScrollProps}
        analyticsContent={analyticsContent}
        storeAddressDetail={storeAddressDetail}
        profileEmail={email}
        fninitiateOrderReset={fninitiateOrderReset}
      />
    );
  }
  /**
   * This function is called when user clicks on return order
   */
  renderOrderReturn(params) {
    this.setURLToState(URL_REDIRECTOR.orders);
    const {
      fnInitiateReturnOrder,
      orderDetails,
      loadOrderDetails,
      fnHandleBackToOrders,
      orderDetailsByIdCancel,
      cms,
      orderReturnErrorKey,
      orderReturnError,
      orderReturnConfirmation,
      analyticsContent
    } = this.props;
    const { order, errorMsg } = cms;
    return (
      <OrderReturn
        {...params}
        cms={order}
        errorMsg={errorMsg}
        orderDetailsById={orderDetails}
        loadOrderDetails={loadOrderDetails}
        fnInitiateReturnOrder={fnInitiateReturnOrder}
        handleBackToOrders={fnHandleBackToOrders}
        orderDetailsByIdCancel={orderDetailsByIdCancel}
        error={orderReturnError}
        errorKey={orderReturnErrorKey}
        showSucessScreen={orderReturnConfirmation}
        analyticsContent={analyticsContent}
        {...withScrollProps}
      />
    );
  }
  /**
   * This function renders the user profile
   */
  renderProfile() {
    const {
      fnProfileInformationCall,
      profile,
      fnUpdateProfileInormationCall,
      fnUpdatePassword,
      editProfile,
      editPassword,
      fnSetEditInfo,
      fnSetPassword,
      email,
      cms,
      updateProfileInfoError,
      updateProfileInfoErrorCode,
      updatePasswordError,
      updatePasswordErrorCode,
      fnBreadCrumb,
      editPasswordSucceeded,
      editProfileSucceeded,
      closeMessage: onCloseMessage,
      closeProfileMessage: onCloseProfileMessage,
      passwordChanged,
      analyticsContent
    } = this.props;
    if (editProfile || editPassword) {
      this.setURLToState(URL_REDIRECTOR.profile);
    } else {
      this.setURLToState(URL_REDIRECTOR.myaccount);
    }
    const { errorMsg } = cms;
    const { userId } = this.state;
    return (
      <ProfileInformation
        cms={cms.profile}
        fnProfileInformationCall={fnProfileInformationCall}
        profile={profile}
        profileId={userId}
        fnUpdateProfileInormationCall={fnUpdateProfileInormationCall}
        fnUpdatePassword={fnUpdatePassword}
        editProfile={editProfile}
        editPassword={editPassword}
        editPasswordSucceeded={editPasswordSucceeded}
        editProfileSucceeded={editProfileSucceeded}
        closeMessage={onCloseMessage}
        closeProfileMessage={onCloseProfileMessage}
        passwordChanged={passwordChanged}
        setEditInfo={fnSetEditInfo}
        setPassword={fnSetPassword}
        email={email}
        errorMsg={errorMsg}
        updateProfileInfoError={updateProfileInfoError}
        updateProfileInfoErrorCode={updateProfileInfoErrorCode}
        updatePasswordError={updatePasswordError}
        updatePasswordErrorCode={updatePasswordErrorCode}
        redirectLogin={this.redirectLogin}
        breadCrumbAction={fnBreadCrumb}
        analyticsContent={analyticsContent}
        {...withScrollProps}
      />
    );
  }
  /**
   * This function renders the user address book
   */
  renderAddressBook() {
    this.setURLToState(URL_REDIRECTOR.myaccount);
    const {
      address,
      fnValidateAddress,
      validatedAddress,
      zipCodeCityStateData,
      fnFetchAddress,
      addressList,
      fnAddAddress,
      showAddressForm,
      toggleAddressForm,
      toggleEditAddressForm,
      showEditAddressForm,
      fnDeleteAddress,
      fnEditAddress,
      showAlertBox,
      fnSetAlert,
      deleteID,
      setDefault,
      fnLoadCityStateData,
      addressError,
      addressErrorFlag,
      cms,
      fninValidateAddressVerification,
      fnBreadCrumb,
      analyticsContent,
      fnshowloader
    } = this.props;
    const { addressBook, errorMsg } = cms;
    const { userId } = this.state;
    return (
      <AddressBook
        fnshowloader={fnshowloader}
        cms={addressBook}
        inValidateAddressVerification={fninValidateAddressVerification}
        errorMsg={errorMsg}
        address={address}
        fnValidateAddress={fnValidateAddress}
        validatedAddress={validatedAddress}
        zipCodeCityStateData={zipCodeCityStateData}
        fnFetchAddress={fnFetchAddress}
        addressList={addressList}
        fnAddAddress={fnAddAddress}
        showAddressForm={showAddressForm}
        toggleAddressForm={toggleAddressForm}
        toggleEditAddressForm={toggleEditAddressForm}
        showEditAddressForm={showEditAddressForm}
        profileID={userId}
        deleteAddress={fnDeleteAddress}
        editAddress={fnEditAddress}
        showAlertBox={showAlertBox}
        setAlert={fnSetAlert}
        deleteID={deleteID}
        setDefault={setDefault}
        fnLoadCityStateData={fnLoadCityStateData}
        errorCode={addressError}
        error={addressErrorFlag}
        redirectLogin={this.redirectLogin}
        breadCrumbAction={fnBreadCrumb}
        analyticsContent={analyticsContent}
        {...withScrollProps}
      />
    );
  }
  /**
   * This function renders the user wishlist
   */
  renderWishList() {
    this.setURLToState(URL_REDIRECTOR.myaccount);
    const {
      firstName,
      productList,
      fnGetUserWishList,
      userWishList,
      fetchSelectedWishlistItems,
      selectedWishlistDetails,
      fnCreateWishList,
      fnRenameWishList,
      fnAddItemToCart,
      fnDeleteWishlist,
      fnRemoveWishlistItem,
      fnShareWishlist,
      email,
      cms,
      fnBreadCrumb,
      analyticsContent,
      fnshowloader,
      shareWishlistData,
      userWishListErrorKey,
      userWishListError,
      userCreateWishListErrorKey,
      userCreateWishListError,
      userRenameWishListError,
      userRenameWishListErrorKey,
      deleteWishlistData,
      selectedWishlistData,
      selectedWishlistMoveToCartData,
      removeItemWishlistData,
      addItemToCartSuccess
    } = this.props;
    if (selectedWishlistData.data.profile) {
      this.setURLToState(URL_REDIRECTOR.wishlist);
    } else {
      this.setURLToState(URL_REDIRECTOR.myaccount);
    }
    const { wishlist, errorMsg } = cms;
    const { userId } = this.state;
    return (
      <Wishlist
        fnshowloader={fnshowloader}
        cms={wishlist}
        product={productList}
        fnGetUserWishList={fnGetUserWishList}
        userWishList={userWishList}
        fetchSelectedWishlistItems={fetchSelectedWishlistItems}
        selectedWishlistDetails={selectedWishlistDetails}
        fnCreateWishList={fnCreateWishList}
        fnRenameWishList={fnRenameWishList}
        fnAddItemToCart={fnAddItemToCart}
        deleteWishlist={fnDeleteWishlist}
        removeWishlistItem={fnRemoveWishlistItem}
        profileID={userId}
        fnShareWishlist={fnShareWishlist}
        email={email}
        firstName={firstName}
        redirectLogin={this.redirectLogin}
        breadCrumbAction={fnBreadCrumb}
        analyticsContent={analyticsContent}
        shareWishlistData={shareWishlistData}
        errorKey={userWishListErrorKey}
        error={userWishListError}
        errorMsg={errorMsg}
        userCreateWishListErrorKey={userCreateWishListErrorKey}
        userCreateWishListError={userCreateWishListError}
        userRenameWishListError={userRenameWishListError}
        userRenameWishListErrorKey={userRenameWishListErrorKey}
        deleteWishlistData={deleteWishlistData}
        selectedWishlistData={selectedWishlistData}
        selectedWishlistMoveToCartData={selectedWishlistMoveToCartData}
        removeItemWishlistData={removeItemWishlistData}
        addItemToCartSuccess={addItemToCartSuccess}
        {...withScrollProps}
      />
    );
  }
  /**
   * This function renders the user saved payment options
   */
  renderPayment() {
    this.setURLToState(URL_REDIRECTOR.myaccount);
    const {
      giftCard,
      address,
      fngetcreditCards,
      fngetGiftCards,
      fnaddGiftCard,
      fnRemoveCreditCard,
      fnRemoveGiftCard,
      fnEditCreditCard,
      fnaddCreditCard,
      userGiftCards,
      userCreditCards,
      userCreditCardList,
      fnLoadCityStateData,
      zipCodeCityStateData,
      email,
      fnValidateAddress,
      validatedAddress,
      cms,
      fnBreadCrumb,
      analyticsContent,
      fnshowloader,
      addGiftCardData,
      deleteGiftCardData
    } = this.props;
    const { payment } = cms;
    const { userId } = this.state;
    return (
      <MyAccountPayment
        fnshowloader={fnshowloader}
        cms={payment}
        giftCard={giftCard}
        address={address}
        fngetcreditCards={fngetcreditCards}
        fngetGiftCards={fngetGiftCards}
        fnaddGiftCard={fnaddGiftCard}
        fnRemoveGiftCard={fnRemoveGiftCard}
        fnRemoveCreditCard={fnRemoveCreditCard}
        fnEditCreditCard={fnEditCreditCard}
        fnaddCreditCard={fnaddCreditCard}
        userGiftCards={userGiftCards}
        profileID={userId}
        userCreditCards={userCreditCards}
        userCreditCardList={userCreditCardList}
        fnLoadCityStateData={fnLoadCityStateData}
        zipCodeCityStateData={zipCodeCityStateData}
        email={email}
        fnValidateAddress={fnValidateAddress}
        validatedAddress={validatedAddress}
        redirectLogin={this.redirectLogin}
        breadCrumbAction={fnBreadCrumb}
        analyticsContent={analyticsContent}
        {...withScrollProps}
        addGiftCardData={addGiftCardData}
        deleteGiftCardData={deleteGiftCardData}
      />
    );
  }

  renderBaseSideNav = () => {
    const { cms, analyticsContent, firstName } = this.props;
    const { commonLabels } = cms || {};
    const { helloLabel } = commonLabels || {};
    return (
      <div className="col-12 col-md-3">
        <div className="o-copy__16bold text-center text-md-left">
          <span className={wordWrap}>
            {helloLabel.toUpperCase()}, {firstName && firstName.toUpperCase()}
          </span>
        </div>
        <div className="pt-3">
          <Sidebar cms={cms} analyticsContent={analyticsContent} />
        </div>
      </div>
    );
  };
  renderBreadCrumb(breadCrumbData) {
    return (
      <div className="breadCrumbComponent" aria-label="breadcrumb navigation region" area-role="breadcrumb">
        <div className="container d-flex d-md-none">
          <BreadCrumbResponsive>
            {!breadCrumbData.data ? (
              <AnchorStyle href="/" data-auid="breadcrumb_m">
                <BackIcon className="academyicon icon-chevron-left" data-auid="breadCrumb_backIcon" />
                {MOBILE_BREAD_CRUMB_TITLE}
              </AnchorStyle>
            ) : (
              <AnchorStyle href={this.state.url} data-auid="breadcrumb_m">
                <BackIcon className="academyicon icon-chevron-left" data-auid="breadCrumb_backIcon" />
                {this.state.title}
              </AnchorStyle>
            )}
          </BreadCrumbResponsive>
        </div>
      </div>
    );
  }
  renderDesktopSideNav = () => {
    const { userRegistered } = this.state;
    return userRegistered && <Responsive minWidth={DESKTOP_MIN_WIDTH}>{this.renderBaseSideNav()}</Responsive>;
  };

  renderMobileSideNav = () => {
    const { userRegistered } = this.state;
    return userRegistered && <Responsive maxWidth={MOBILE_MAX_WIDTH}>{this.renderBaseSideNav()}</Responsive>;
  };
  render() {
    const { breadCrumbData } = this.props;
    const { globalLoader } = this.props.myaccount;
    const breadCrumbProps = {
      breadCrumbs: {
        breadCrumb: [
          {
            label: 'My Account',
            seoURL: '/myaccount'
          }
        ],
        name: breadCrumbData && breadCrumbData.data && titleCase(breadCrumbData.data)
      },
      isCSR: true
    };
    return (
      <BrowserRouter>
        <AppContainer>
          <div className="myaccount">
            {globalLoader.isFetching === true && <Loader className="loader-height" overlay />}
            {this.state.userRegistered && !isMobile() ? <BreadCrumb {...breadCrumbProps} /> : null}
            {this.state.userRegistered && isMobile() ? this.renderBreadCrumb(breadCrumbData) : null}
            <div data-auid="act_page" className={`container ${desktopStyles}`}>
              <div className="row pt-2 pt-md-4 pb-md-6 no-gutters">
                {this.renderDesktopSideNav()}
                <Switch>
                  <Route exact path="/myaccount" render={this.renderMobileSideNav} />
                </Switch>
                <div className={`${outline0} col-12 col-md-9`} ref={this.tabPanel} tabIndex="0" role="tabpanel">
                  <Switch>
                    <Route path="/myaccount/orders/:id" render={this.renderOrderByID} />
                    <Route path="/myaccount/orders" render={this.renderOrders} />
                    <Route path="/myaccount/order/cancellation/:id/:zipCode" render={this.renderOrderCancelation} />
                    <Route path="/myaccount/orderSearch/:id/:zipCode" render={this.renderOrderDetails} />
                    <Route path="/myaccount/return/orders/:id/:zipCode/:shipmentNum" render={this.renderOrderReturn} />
                    <Route path="/myaccount/profile" render={this.renderProfile} />
                    <Route path="/myaccount/addressBook" render={this.renderAddressBook} />
                    <Route path="/myaccount/wishlist" render={this.renderWishList} />
                    <Route path="/myaccount/payment" render={this.renderPayment} />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </AppContainer>
      </BrowserRouter>
    );
  }
}

Myaccount.propTypes = {
  cms: PropTypes.object.isRequired,
  address: PropTypes.array.isRequired,
  productList: PropTypes.array.isRequired,
  giftCard: PropTypes.array,
  fnValidateAddress: PropTypes.func,
  validatedAddress: PropTypes.object,
  zipCodeCityStateData: PropTypes.object,
  fnFetchAddress: PropTypes.func,
  addressList: PropTypes.func,
  fnAddAddress: PropTypes.func,
  showAddressForm: PropTypes.bool,
  toggleAddressForm: PropTypes.func,
  toggleEditAddressForm: PropTypes.func,
  showEditAddressForm: PropTypes.bool,
  fnDeleteAddress: PropTypes.func,
  fnEditAddress: PropTypes.func,
  fnProfileInformationCall: PropTypes.func,
  profile: PropTypes.object,
  showAlertBox: PropTypes.bool,
  fnSetAlert: PropTypes.func,
  deleteID: PropTypes.string,
  fnUpdateProfileInormationCall: PropTypes.func,
  fnUpdatePassword: PropTypes.func,
  fnCancelOrder: PropTypes.func,
  fnFetchInitialData: PropTypes.func,
  firstName: PropTypes.string,
  fnGetUserWishList: PropTypes.func,
  userWishList: PropTypes.object,
  fngetcreditCards: PropTypes.func,
  fngetGiftCards: PropTypes.func,
  fnaddGiftCard: PropTypes.func,
  fnRemoveGiftCard: PropTypes.func,
  userCreditCards: PropTypes.array,
  userGiftCards: PropTypes.array,
  setDefault: PropTypes.func,
  fetchSelectedWishlistItems: PropTypes.func,
  selectedWishlistDetails: PropTypes.object,
  fnCreateWishList: PropTypes.func,
  fnRenameWishList: PropTypes.func,
  fnAddItemToCart: PropTypes.func,
  fnDeleteWishlist: PropTypes.func,
  fnRemoveWishlistItem: PropTypes.func,
  editProfile: PropTypes.bool,
  editPassword: PropTypes.bool,
  fnSetEditInfo: PropTypes.func,
  fnSetPassword: PropTypes.func,
  userCreditCardList: PropTypes.func,
  fnRemoveCreditCard: PropTypes.func,
  fnEditCreditCard: PropTypes.func,
  fnaddCreditCard: PropTypes.func,
  fnLoadCityStateData: PropTypes.func,
  email: PropTypes.string,
  ordersList: PropTypes.object,
  fnFetchOrderList: PropTypes.func,
  fnInitiateReturnOrder: PropTypes.func,
  orderDetailsSuccess: PropTypes.bool,
  loadOrderDetails: PropTypes.func,
  fnOrderDetailsRequest: PropTypes.func,
  loadSelectedOrderDetails: PropTypes.func,
  orderDetailsByIdSuccess: PropTypes.bool,
  orderDetailsById: PropTypes.object,
  orderDetailsByIdCancel: PropTypes.object,
  orderSearchError: PropTypes.bool,
  orderDetails: PropTypes.object,
  history: PropTypes.any,
  fnShareWishlist: PropTypes.func,
  fnHandleBackToOrders: PropTypes.func,
  addressError: PropTypes.string,
  addressErrorFlag: PropTypes.bool,
  myaccount: PropTypes.any,
  orderSearchErrorKey: PropTypes.string,
  orderCancelError: PropTypes.bool,
  orderCancelErrorKey: PropTypes.string,
  orderSearchRedirect: PropTypes.bool,
  orderCancelRedirect: PropTypes.bool,
  fnToggleRedirection: PropTypes.func,
  fninValidateAddressVerification: PropTypes.func,
  fnBreadCrumb: PropTypes.func,
  breadCrumbData: PropTypes.object,
  fnGetStoreDetailRequest: PropTypes.func,
  storeAddress: PropTypes.object,
  orderReturnError: PropTypes.bool,
  orderReturnErrorKey: PropTypes.string,
  orderReturnConfirmation: PropTypes.bool,
  analyticsContent: PropTypes.func,
  addGiftCardData: PropTypes.object,
  deleteGiftCardData: PropTypes.object,
  shareWishlistData: PropTypes.object,
  storeAddressDetail: PropTypes.object,
  userWishListError: PropTypes.bool,
  userWishListErrorKey: PropTypes.string,
  deleteWishlistData: PropTypes.object,
  selectedWishlistData: PropTypes.object,
  selectedWishlistMoveToCartData: PropTypes.object,
  removeItemWishlistData: PropTypes.object,
  fetchWishlistItems: PropTypes.object,
  addItemToCartSuccess: PropTypes.object,
  fninitiateOrderReset: PropTypes.func
};

const mapStateToProps = state => ({
  ...state,
  validatedAddress: state.myaccount.validateAddress,
  zipCodeCityStateData: state.myaccount.fetchCityStateFromZipCode,
  addressList: state.myaccount.fetchAddress.data,
  showAddressForm: state.myaccount.fetchAddress.showAddressForm,
  showEditAddressForm: state.myaccount.fetchAddress.showEditAddressForm,
  profile: state.myaccount.fetchAccountData.data.profile,
  showAlertBox: state.myaccount.fetchAddress.showAlertBox,
  deleteID: state.myaccount.fetchAddress.deleteID,
  firstName: state.myaccount.fetchAccountData.data.profile.firstName,
  email: state.myaccount.fetchAccountData.data.profile.email,
  passwordExpiredFlag: state.myaccount.fetchAccountData.data.profile.passwordExpired,
  userWishList: state.myaccount.userWishListStatus.data,
  userWishListError: state.myaccount.userWishListStatus.error,
  userWishListErrorKey: state.myaccount.userWishListStatus.errorKey,
  userCreateWishListErrorKey: state.myaccount.createWishListStatus.createErrorKey,
  userCreateWishListError: state.myaccount.createWishListStatus.createError,
  userRenameWishListError: state.myaccount.createWishListStatus.renameError,
  userRenameWishListErrorKey: state.myaccount.createWishListStatus.renameErrorKey,
  userCreditCards: state.myaccount.userCreditCardList,
  userGiftCards: state.myaccount.userGiftCards,
  selectedWishlistDetails: state.myaccount.fetchWishlistItems.fetchWishlistItems.data,
  selectedWishlistData: state.myaccount.fetchWishlistItems.fetchWishlistItems,
  selectedWishlistMoveToCartData: state.myaccount.fetchWishlistItems.addItemToCart,
  removeItemWishlistData: state.myaccount.fetchWishlistItems.deleteWishlistItem,
  editProfile: state.myaccount.updateProfileInfo.editProfile,
  editProfileSucceeded: state.myaccount.updateProfileInfo.editProfileSucceeded,
  editPassword: state.myaccount.updatePassword.editPassword,
  editPasswordSucceeded: state.myaccount.updatePassword.editPasswordSucceeded,
  updateProfileInfoError: state.myaccount.updateProfileInfo.error,
  updateProfileInfoErrorCode: state.myaccount.updateProfileInfo.errorCode,
  updatePasswordError: state.myaccount.updatePassword.error,
  updatePasswordErrorCode: state.myaccount.updatePassword.errorCode,
  ordersList: state.myaccount.orderList.data,
  orderDetails: state.myaccount.orderDetails.data,
  orderDetailsSuccess: state.myaccount.orderDetails.success,
  orderDetailsByIdSuccess: state.myaccount.orderDetailsById.success,
  orderDetailsById: state.myaccount.orderDetailsById.data,
  orderDetailsByIdCancel: state.myaccount.orderDetailsByIdCancel.data,
  orderCancelError: state.myaccount.cancelOrder.error,
  orderCancelErrorKey: state.myaccount.cancelOrder.errorKey,
  orderCancelErrorMessage: state.myaccount.cancelOrder.errorMsg,
  orderCancelRedirect: state.myaccount.cancelOrder.redirect,
  orderSearchError: state.myaccount.orderDetails.error,
  orderSearchRedirect: state.myaccount.orderDetails.redirect,
  orderSearchErrorKey: state.myaccount.orderDetails.errorKey,
  // shareWishListSuccessStatus: state.shareWishList === undefined ? false : state.wishList.shareWishlist.data.success,
  addressError: state.myaccount.fetchAddress.errorCode,
  addressErrorFlag: state.myaccount.fetchAddress.error,
  breadCrumbData: state.myaccount.breadCrumb,
  storeAddress: state.myaccount.getStoreAddressDetails,
  orderReturnError: state.myaccount.initiateOrder.error,
  orderReturnErrorKey: state.myaccount.initiateOrder.errorKey,
  orderReturnConfirmation: state.myaccount.initiateOrder.showSucessScreen,
  addGiftCardData: state.myaccount.addGiftCardData,
  deleteGiftCardData: state.myaccount.deleteGiftCardData,
  shareWishlistData: state.myaccount.shareWishlist,
  deleteWishlistData: state.myaccount.deleteWishlist,
  storeAddressDetail: state.myaccount.getStoreAddressDetails,
  addItemToCartSuccess: state.myaccount.fetchWishlistItems.addItemToCart
});

const mapDispatchToProps = dispatch => ({
  fnshowloader: () => dispatch(showLoader()),
  fnFetchInitialData: profileId => dispatch(fetchMyAccountData(profileId)),
  fnValidateAddress: data => dispatch(validateAddress(data)),
  fnFetchAddress: data => dispatch(fetchAddress(data)),
  fnAddAddress: (data, profileID) => dispatch(postAddress(data, profileID)),
  toggleAddressForm: data => dispatch(toggleForm(data)),
  toggleEditAddressForm: data => dispatch(toggleEditForm(data)),
  fnDeleteAddress: (addressID, profileID) => dispatch(deleteAddress(addressID, profileID)),
  fnEditAddress: (selectedAddress, addressID, profileID) => dispatch(editAddress(selectedAddress, addressID, profileID)),
  fnSetAlert: (data, flag) => dispatch(setAlert(data, flag)),
  fnNotificationCall: data => dispatch(notificationCall(data)),
  fnUpdateProfileInormationCall: (profileId, data) => dispatch(updateInformationRequest(profileId, data)),
  fnUpdatePassword: (data, profileId, logonId) => dispatch(updatePasswordRequest(data, profileId, logonId)),
  fnCancelOrder: (orderId, zipCode, orderItem) => dispatch(cancelOrderRequest(orderId, zipCode, orderItem)),
  fnInitiateReturnOrder: data => dispatch(initiateOrderRequest(data)),
  fnOrderDetailsRequest: orderId => dispatch(orderDetailsRequest(orderId)),
  fnGetUserWishList: profileID => dispatch(getUserWishlist(profileID)),
  fngetcreditCards: data => dispatch(getCreditCards(data)),
  fngetGiftCards: data => dispatch(getGiftCards(data)),
  fnaddGiftCard: (id, data) => dispatch(addGiftCard(id, data)),
  fnRemoveGiftCard: (profileID, itemID) => dispatch(deleteGiftCard(profileID, itemID)),
  setDefault: (profileId, addressId, nickName) => dispatch(setAsDefault(profileId, addressId, nickName)),
  fetchSelectedWishlistItems: (profileID, wishlistId) => dispatch(fetchWishlistItems(profileID, wishlistId)),
  fnCreateWishList: (data, profileID) => dispatch(addWishList(data, profileID)),
  fnRenameWishList: (profileID, wishlistId, data) => dispatch(renameWishList(profileID, wishlistId, data)),
  fnAddItemToCart: data => dispatch(addItemToCart(data)),
  fnDeleteWishlist: (wishlistId, profileID) => dispatch(deleteWishlist(wishlistId, profileID)),
  fnRemoveWishlistItem: (profileID, wishlistId, itemId) => dispatch(removeWishlistItem(profileID, wishlistId, itemId)),
  fnSetEditInfo: flag => dispatch(setEditInfo(flag)),
  fnSetPassword: flag => dispatch(setPassword(flag)),
  fnRemoveCreditCard: (profileID, ccID) => dispatch(deleteCreditCard(profileID, ccID)),
  fnEditCreditCard: (profileID, ccID, data, makePrimary) => dispatch(putCreditCard(profileID, ccID, data, makePrimary)),
  fnaddCreditCard: (id, data) => dispatch(addCreditCard(id, data)),
  fnLoadCityStateData: data => dispatch(loadCityStateFromZipCode(data)),
  fnFetchOrderList: options => dispatch(fetchOrderData(options)),
  loadOrderDetails: (orderId, zipCode) => dispatch(getOrderDetails(orderId, zipCode)),
  loadSelectedOrderDetails: orderId => dispatch(getOrderById(orderId)),
  fnShareWishlist: (data, profileId, wishlistId) => dispatch(shareWishlist(data, profileId, wishlistId)),
  fnHandleBackToOrders: () => dispatch(handleBackToOrders()),
  fnToggleRedirection: () => dispatch(toggleRedirection()),
  fninValidateAddressVerification: () => dispatch(inValidateAddressVerification()),
  fnBreadCrumb: data => dispatch(breadCrumbAction(data)),
  fnGetStoreDetailRequest: data => dispatch(getStoreDetailRequest(data)),
  closeMessage: () => dispatch(closeMessage()),
  closeProfileMessage: () => dispatch(closeProfileMessage()),
  passwordChanged: () => dispatch(updatePasswordSuccess()),
  fninitiateOrderReset: () => dispatch(initiateOrderReset())
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const MyaccountContainer = compose(
    withReducer,
    withSaga,
    withConnect,
    formReducer
  )(Myaccount);
  const MyaccountAnalyticsWrapper = AnalyticsWrapper(MyaccountContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <MyaccountAnalyticsWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(Myaccount));
