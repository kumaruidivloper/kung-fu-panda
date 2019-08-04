/* eslint-disable*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { get } from '@react-nitro/error-boundary';
import { CartHeader, EmptyCart, OrderSummary, ProductBlade, CartOption, SpecialOrderProceedModal } from './cart.modules';
import Loader from './../../modules/loader/loader.component';
import { NODE_TO_MOUNT, DATA_COMP_ID, CART_WISHLIST_KEYWORD } from './cart.constants';
import rootReducer from './store/reducers';
import saga from './store/sagas';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import AnalyticsWrapper from '../../modules/analyticsWrapper/analyticsWrapper.component';
import { getZipCodeByGeo, loadCart, showLoader, undoAction } from './store/actions/index';
import { cartBody, cartHeaderRight, optionMobileView, message, minHeight } from './cart.styles';
import { removeMessages, removeMessageWithDelay } from '../../modules/productBlade/actions';
import GenericComponent from './../../modules/genericError/genericError.component';
import { GEO_LOCATED_ZIP_CODE } from '../../modules/findAStoreModalRTwo/constants';
import Storage from '../../utils/StorageManager';
import { navigatorOptions } from '../../utils/navigator';

class Cart extends Component {
  constructor(props) {
    super(props);
    this.checkoutBtnRef = null;
    this.state = {
      orderSummaryCheckoutBtnVisible: false
    };
    this.setStateForShowingStickyBtn = this.setStateForShowingStickyBtn.bind(this);
    this.undoMessage = React.createRef();
  }

  /**
   * Method to set state for orderSummaryCheckoutBtnVisible;
   * This state is used for hiding sticky checkout button whenever Checkout button of order summary
   * is scrolled into view.
   */
  setStateForShowingStickyBtn() {
    if (!this.checkoutBtnRef) return;
    const checkoutBtnInOrderSummary = ReactDOM.findDOMNode(this.checkoutBtnRef);
    // If user scrolls further below order summary, sticky checkout button MUST not appear in page footer.
    if (checkoutBtnInOrderSummary.getBoundingClientRect().bottom < 760) {
      this.setState({ orderSummaryCheckoutBtnVisible: true });
    } else this.setState({ orderSummaryCheckoutBtnVisible: this.isButtonVisible(checkoutBtnInOrderSummary) });
  }

  /**
   * Method containing logic to find out whether checkout button of Order summary( ie, second checkout button
   * of Cart page) is visible in viewport or not. Used to set state for deciding whether sticky button
   * should be hidden.
   * @param {Object} elem DOM element corresponding to button to be found.
   */
  isButtonVisible(elem) {
    const elemCenter = {
      x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
      y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0 || elemCenter.y < 0) return false;
    if (ExecutionEnvironment.canUseDOM && (elemCenter.x > window.innerWidth || elemCenter.y > window.innerHeight)) {
      return false;
    }
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
      if (pointContainer === elem) return true;
    } while ((pointContainer = pointContainer.parentNode));
    return false;
  }

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('scroll', this.setStateForShowingStickyBtn);
    }
    // Get zipcode based on geo location. Below promise will be helpful to avoid multiple service call.
    this.props.fnShowLoader();

    if (!Storage.getSessionStorage(GEO_LOCATED_ZIP_CODE)) {
      navigator.geolocation.getCurrentPosition(
        data => this.props.fngetZipByGeo({ geo: `${data.coords.latitude},${data.coords.longitude}` }),
        this.props.fnLoadCart,
        navigatorOptions
      );
    } else {
      this.props.fnLoadCart();
    }
  }

  /**
   * Method for removing scroll listener when component unmounts.
   */
  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.removeEventListener('scroll', this.setStateForShowingStickyBtn);
    }
  }

  /**
   * Lifecycle method used to scroll to the top of the page whenever a product's object reflects
   * changes and a rerender happens.
   * @param {object} prevProps The previous received props.
   */
  componentDidUpdate(prevProps) {
    // If promotion applied, user should be anchor with order summary section
    const isPromotionNotApplied = get(prevProps, 'promotions.length', 0) === get(this.props, 'promotions.length', 0);
    if (JSON.stringify(prevProps.orderItem) !== JSON.stringify(this.props.orderItem) && ExecutionEnvironment.canUseDOM && isPromotionNotApplied) {
      window.scrollTo(0, 0);
    }
    if (this.undoMessage.current) {
      this.undoMessage.current.focus();
    }
  }

  /**
   * Method to handle click of Undo button in the message displayed after item is removed/added to wishlist.
   * Dispatches an action for the same.
   * @param {*} data : The msg object containing the item id, the type(wishList/remove) and the msg.
   */
  handleUndo(data) {
    this.props.fnUndoButton(data);
  }

  /**
   * Method to close the message corresponding to Item removed/added to wishlist.
   * Dispatches an action to remove item from list of messages displayed.
   * @param {number} id : OrderItemId corresponding to item moved.
   */
  removeMessage(id) {
    this.props.fnRemoveMsg(id);
  }

  /**
   * Method to remove the confirmation when onBlur occured on Undo button
   */
  handleUndoBlur = (event, id) => {
    event.preventDefault();
    const { fnRemoveMsgWithDelay } = this.props;
    fnRemoveMsgWithDelay(id);
  };

  /**
   * Display all messages like item moved to wishlist and removed from cart
   */
  displayMessages() {
    const { itemAddedToWishListLabel = '', itemRemoveFromCartLabel = '' } = this.props.cms.successMsg || {};
    return this.props.cartMessages.map((msg, i) => (
      <div className="px-1 px-md-0" key={msg.id}>
        <div className={`${message} mb-1 py-1 pr-3 pr-sm-1 pl-1 o-copy__14reg`}>
          <div className="pr-2">
            <span className="o-copy__14bold">{msg.name} </span>
            {msg.type === CART_WISHLIST_KEYWORD ? itemAddedToWishListLabel : itemRemoveFromCartLabel}
            {!msg.hideUndo && (
              <span
                className="undoBtn ml-quarter"
                onClick={() => this.handleUndo(msg)}
                onKeyDown={e => e.key === 'Enter' && this.handleUndo(msg)}
                role="button"
                aria-label={`${msg.name} ${msg.type === CART_WISHLIST_KEYWORD ? itemAddedToWishListLabel : itemRemoveFromCartLabel}. Press enter to ${
                  this.props.cms.commonLabels.undoLabel
                }`}
                tabIndex="0"
                ref={this.undoMessage}
                onBlur={event => this.handleUndoBlur(event, msg.id)}
              >
                {this.props.cms.commonLabels.undoLabel}
              </span>
            )}
          </div>
          <button data-auid={`crt_btnMsgClose_${i}`} onClick={() => this.removeMessage(msg.id)} aria-label="closeCartMessage">
            <span className="academyicon icon-close float-right closeBtn" />
          </button>
        </div>
      </div>
    ));
  }

  render() {
    const { cms, orderItem, orderId, findAStore, bundleProductInfo, qtyUpdateLoader, productUpdate, analyticsContent, labels = {}, messages = {} } = this.props;
    const {
      cartAPIDetails: { error, isFetching, errorInfo }
    } = this.props;
    return (
      <div className={`container mt-3 mb-5 ${cartBody}`}>
        {error && (
          <div className="mb-2">
            <GenericComponent auid="fetch_get_cart_failed" cmsErrorLabels={cms.errorMsg || {}} apiErrorList={errorInfo.errors} />
          </div>
        )}
        {isFetching === true && <Loader className={`${minHeight}`} overlay={this.props.orderItem && this.props.orderItem.length > 0} />}
        {(!orderItem || !orderItem.length > 0) && this.displayMessages()}
        {(orderItem &&
          orderItem.length > 0 && (
            <React.Fragment>
              <div className="px-1 px-sm-0 mb-2 d-flex flex-row cart-header">
                <div className="col-md-6 pl-0 cartHeaderLeft">
                  <CartHeader cms={cms} recordSetTotal={this.props.recordSetTotal} grandTotal={this.props.grandTotal} />
                </div>
                <div data-auid="crt_btnCheckoutTop" className={`col-md-6 pt-1 pl-1 pr-lg-4 pr-md-1 ${cartHeaderRight}`}>
                  <CartOption
                    cms={cms}
                    orderId={this.props.orderId}
                    orderItems={this.props.orderItem}
                    findAStore={this.props.findAStore}
                    bundleProductInfo={this.props.bundleProductInfo}
                    analyticsContent={analyticsContent}
                  />
                </div>
              </div>

              {/* Function to display messages with undo option */}
              {this.displayMessages()}

              <ProductBlade
                cms={cms}
                data={orderItem}
                orderId={orderId}
                findAStore={findAStore}
                bundleProductInfo={bundleProductInfo}
                qtyUpdateLoader={qtyUpdateLoader}
                productUpdate={productUpdate}
                analyticsContent={analyticsContent}
                labels={labels}
              />
              <div
                data-auid="crt_btnCheckout_m"
                className={`${this.state.orderSummaryCheckoutBtnVisible ? 'd-none' : optionMobileView} mt-half mb-quarter p-1`}
              >
                <CartOption
                  cms={cms}
                  orderId={this.props.orderId}
                  orderItems={this.props.orderItem}
                  findAStore={this.props.findAStore}
                  bundleProductInfo={this.props.bundleProductInfo}
                  analyticsContent={analyticsContent}
                />
              </div>
              <OrderSummary
                cms={cms}
                api={this.props.orderSummary}
                promotions={this.props.promotions}
                orderId={this.props.orderId}
                findAStore={this.props.findAStore}
                pickUpInStore={this.props.isPickUPStoreSelected}
                zipCodeAPIInfo={this.props.zipCodeValidation}
                promoApiDetails={this.props.promocodeAPIDetails}
                orderItems={this.props.orderItem}
                deliveryZipcode={this.props.deliveryZipcode}
                bundleProductInfo={this.props.bundleProductInfo}
                checkoutBtnRef={el => (this.checkoutBtnRef = el)}
                analyticsContent={analyticsContent}
                labels={labels}
                messages={messages}
              />
              {this.props.toggleSOFModalStatus &&
                this.props.toggleSOFModalStatus.status && (
                  <SpecialOrderProceedModal
                    cms={cms}
                    modalContent={this.props.toggleSOFModalStatus}
                    orderSummary={this.props.orderSummary}
                    findAStore={this.props.findAStore}
                  />
                )}
            </React.Fragment>
          )) ||
          (!isFetching && <EmptyCart cms={cms} analyticsContent={analyticsContent} />)}
      </div>
    );
  }
}

Cart.propTypes = {
  cms: PropTypes.object,
  labels: PropTypes.object,
  findAStore: PropTypes.object,
  fngetZipByGeo: PropTypes.func,
  fnShowLoader: PropTypes.func,
  analyticsContent: PropTypes.func,
  messages: PropTypes.object
};

const mapStateToProps = state => ({ ...state.cart, findAStore: state.findAStoreModalRTwo });

const mapDispatchToProps = dispatch => ({
  fnLoadCart: data => dispatch(loadCart(data)),
  fngetZipByGeo: data => dispatch(getZipCodeByGeo(data)),
  fnUndoButton: data => dispatch(undoAction(data)),
  fnShowLoader: () => dispatch(showLoader()),
  fnRemoveMsg: data => dispatch(removeMessages(data)),
  fnRemoveMsgWithDelay: data => dispatch(removeMessageWithDelay(data))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer: rootReducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const CartContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(Cart);
  const CartAnalyticsWrapper = AnalyticsWrapper(CartContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CartAnalyticsWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(Cart));
