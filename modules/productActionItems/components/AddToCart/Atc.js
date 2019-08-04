import { ordersAPI, signOutURL, cartURL } from '@academysports/aso-env';
import Button from '@academysports/fusion-components/dist/Button';
import Spinner from '@academysports/fusion-components/dist/Spinner';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { get } from '@react-nitro/error-boundary';

import EnableBuyNow from '../../../enableBuyNow';
import * as actions from '../../actions';
import { ADD_TO_CART, MULTI_SKU_MESSAGE, SHOW_FUMBLED, SINGLE_SKU_MESSAGE, CREATE_PASSWORD_URL, IS_BUYNOW_ENABLED } from '../../constants';
import ErrorModal from '../ErrorModal';
import QuantityCounter from '../QuantityCounter';
import { addToCartHolder, AdjustWidth, Overlay, StyledModal, order2, spinnerOverride } from '../styles';
import { logAnalyticsEnhanced, logErrorAnalytics, logMiniCartCloseModalAnalytics, logViewMiniCartAnalytics } from './Atc.analytics';
import ErrorBuyNow from './ErrorBuyNow';
import ModalContent from './ModalContent';
import NoDiffModalContent from './NoDiffModalContent';
import { hasItemsInCart as sessionHasItemsInCart } from '../../../../utils/UserSession';
import { createAddToCartRequestObject as utilsCreateAddToCartRequestObject } from './Atc.utils';
import {
  showEnableBuyNowButton as utilsShowEnableBuyNowButton,
  showBuyNowButton as utilsShowBuyNowButton
} from '../../../../utils/buyNow/buyNow.utils';
import { getErrorMessageFrom } from '../../../../utils/buyNow/buyNow.api';
import { initializeEvergageRecommendations } from '../../../../utils/productDetailsUtils';
import { printBreadCrumb } from '../../../../utils/breadCrumb';
import StorageManager from '../../../../utils/StorageManager';

class Atc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGiftCardModalOpen: false,
      isPdpModalOpen: false,
      isAddingToCart: false,
      isBuyNowClicked: false,
      hasItemsInCart: sessionHasItemsInCart(),
      selectedQuantity:
        (props.item.bulkGiftcardMinQuantity && props.item.bulkGiftcardSeoUrl) || !props.item.bulkGiftcardMinQuantity
          ? 1
          : parseInt(props.item.bulkGiftcardMinQuantity, 10),
      atcResponse: '',
      storedOrderId: undefined,
      ctaMessage: props.item.bulkGiftcardSeoUrl ? 'BULK GIFT CARD' : 'STANDARD GIFT CARD'
    };

    this.updateAnalyticsEnhanced = this.updateAnalyticsEnhanced.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openQuantityModal = this.openQuantityModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createOnClickAddToCart = this.createOnClickAddToCart.bind(this);
    this.createOnClickBuyNow = this.createOnClickBuyNow.bind(this);
    this.processATCResponse = this.processATCResponse.bind(this);
    this.processBuyNowResponse = this.processBuyNowResponse.bind(this);
    this.handleBuyNowResponseError = this.handleBuyNowResponseError.bind(this);
    this.onClickGoToGiftCardSeoUrl = this.onClickGoToGiftCardSeoUrl.bind(this);

    this.createAddToCartRequestObject = this.createAddToCartRequestObject.bind(this);
    this.clearBuyNowErrorMessage = this.clearBuyNowErrorMessage.bind(this);

    this.onEnableBuyNowClose = this.onEnableBuyNowClose.bind(this);

    this.showEnableBuyNowButton = this.showEnableBuyNowButton.bind(this);
    this.showBuyNowButton = this.showBuyNowButton.bind(this);

    this.persistOrderId = this.persistOrderId.bind(this);
  }

  componentDidMount() {
    const { fnSetSelectedQuantity } = this.props;
    const { selectedQuantity } = this.state;
    if (fnSetSelectedQuantity) {
      fnSetSelectedQuantity(selectedQuantity);
    }
  }

  /**
   * @description logs analytics for add to cart errors
   * @param {string} errorMessage
   * @returns {undefined}
   */
  onClickAddToCartErrorLogGA(errorMessage) {
    const { gtmDataLayer, item } = this.props;
    logErrorAnalytics(gtmDataLayer, item, errorMessage);
  }

  /**
   * @description Function to redirect from Bulk to standard and standard to Bulk
   * @param  {e} event check
   * @returns {undefined}
   */
  onClickGoToGiftCardSeoUrl(e) {
    e.preventDefault();
    const { item } = this.props;
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = item.bulkGiftcardSeoUrl || item.standardGiftcardSeoUrl;
    }
  }

  /**
   * @description fetches latest profile data once enable buy now modal has closed.
   * @returns {undefined}
   */
  onEnableBuyNowClose() {
    this.props.fetchProfile();
  }

  /**
   * @description getter which pulls storeId from props.storeInfo
   * @returns {string} selected store id.
   */
  getStoreId() {
    if (!this.props.storeInfo || !this.props.storeInfo.getMystoreDetails) {
      return null;
    }
    return this.props.storeInfo.getMystoreDetails.storeId;
  }

  /**
   * @description Takes an analytics method as a parameter, wraps it with with a function that will execute both the passed in method and enhanced analytics.
   * @param  {function} logGA
   * @returns  {function} logGAAndEnahncedAnalytics
   */
  createOnClickAddToCartLogGA(logGA = () => null) {
    return () => {
      logGA();
      this.updateAnalyticsEnhanced();
    };
  }

  /**
   * @description Function to check if required quantity for Standard or Bulk gift card matches
   * @param  {qty} quantity check for gift cards
   */
  openQuantityModal() {
    const qty = this.state.selectedQuantity;
    const { item, fnSetSelectedQuantity } = this.props;
    if (
      (item.bulkGiftcardSeoUrl && qty >= parseInt(item.bulkGiftcardMinQuantity, 10)) ||
      (item.standardGiftcardSeoUrl && qty < parseInt(item.bulkGiftcardMinQuantity, 10))
    ) {
      this.setState({
        isGiftCardModalOpen: true,
        selectedQuantity: item.standardGiftcardSeoUrl ? parseInt(item.bulkGiftcardMinQuantity, 10) : qty
      });
    }
    if (fnSetSelectedQuantity) {
      fnSetSelectedQuantity(qty);
    }
  }

  /**
   * @description logs enhanced analytcs. Manages state hasItemsInCart in order to help track if item added is the first item added to cart.
   * @returns {undefined}
   */
  updateAnalyticsEnhanced() {
    const { gtmDataLayer, item, isQuickView } = this.props;
    const { selectedQuantity, atcResponse, hasItemsInCart } = this.state;
    logAnalyticsEnhanced(gtmDataLayer, item, selectedQuantity, atcResponse, hasItemsInCart, isQuickView);
    if (!this.state.hasItemsInCart) {
      this.setState({ hasItemsInCart: sessionHasItemsInCart() });
    }
  }

  /**
   * @description Creates the function to add a prodcut to cart.
   * @param  {function} onClickLogGA - analytics method to be executed when user adds a product to cart.
   * @returns  {undefined}
   */
  createOnClickAddToCart(onClickLogGA) {
    const requestObj = this.createAddToCartRequestObject();
    return () => {
      const passwordExpired = StorageManager.getCookie('PASSWORD_EXPIRED_FLAG');
      if (passwordExpired) {
        window.location.href = CREATE_PASSWORD_URL;
      } else if (!this.blockAddToCartRequest) {
        this.blockAddToCartRequest = true;
        this.setState({ isAddingToCart: this.blockAddToCartRequest, buyNowErrorMessage: undefined });
        onClickLogGA();
        axios
          .post(`${cartURL}`, requestObj, {
            validateStatus: status => {
              if (status === 503 && ExecutionEnvironment.canUseDOM) {
                window.location = `${signOutURL}`;
              } else if (status !== 200) {
                return this.openModal();
              }
              return true;
            }
          })
          .then(this.processATCResponse)
          .catch(() => {
            this.openModal();
            this.onClickAddToCartErrorLogGA('we fumbled');
          });
      }
    };
  }

  /**
   * @description Creates the function for BUY NOW product.
   * @param  {function} onClickLogGA - analytics method to be executed when user clicks BUY NOW.
   * @returns  {undefined}
   */
  createOnClickBuyNow(onClickLogGA = () => null) {
    const requestObj = this.createAddToCartRequestObject();
    return () => {
      // Prevent Buy Now, If user has not changed his/her password.
      const passwordExpired = StorageManager.getCookie('PASSWORD_EXPIRED_FLAG');
      if (passwordExpired) {
        window.location.href = CREATE_PASSWORD_URL;
      } else if (!this.blockAddToCartRequest) {
        this.blockAddToCartRequest = true;
        this.setState({ isAddingToCart: this.blockAddToCartRequest, buyNowErrorMessage: undefined, isBuyNowClicked: true });
        onClickLogGA();
        axios
          .post(ordersAPI, requestObj)
          .then(this.processBuyNowResponse)
          .catch(response => {
            this.handleBuyNowResponseError(response);
          });
      }
    };
  }

  /**
   * @description creates the request object to be used for ajax calls "add to cart" and "buy now".
   * @returns {Object} the request object to be used for ajax calls "add to cart" and "buy now".
   */
  createAddToCartRequestObject() {
    const { item, isNoDiffBundle, selectedSwatchAmount, gcAmount, isSof, shippingInfo = {} } = this.props;
    const { shippingSLA } = shippingInfo;
    let shippingMethodsItems = {};
    if (shippingSLA) {
      const { estimatedFromDate, estimatedToDate, shipmodeId } = shippingSLA;
      shippingMethodsItems = {
        estimatedFromDate,
        estimatedToDate,
        selectedShipmodeId: shipmodeId || ''
      };
    }
    const { storeInventory = {} } = item;
    const { inventoryStatus, showTick, storeInvType } = storeInventory;
    const bopisOrder = inventoryStatus === 'OUT_OF_STOCK' && showTick === 'true' && storeInvType === 'BOPIS';
    const { selectedQuantity } = this.state;
    return utilsCreateAddToCartRequestObject(
      item,
      selectedQuantity,
      isNoDiffBundle,
      selectedSwatchAmount,
      gcAmount,
      isSof,
      this.getStoreId(),
      bopisOrder,
      shippingMethodsItems
    );
  }

  /**
   * @description opens the PDP modal
   * @returns {undefined}
   */
  openModal() {
    this.props.onRequestOpenAddToCartModal();
    this.setState({
      isPdpModalOpen: true,
      atcResponse: { exceptionCode: SHOW_FUMBLED },
      isAddingToCart: false
    });
  }

  /**
   * @description closes the PDP modal & GiftCard modal.  Executes minicart analytics.  Executes passed in method props.onRequestCloseAddToCartModal if one exists.
   * @returns {undefined}
   */
  closeModal() {
    this.setState(
      {
        isPdpModalOpen: false,
        isGiftCardModalOpen: false,
        isAddingToCart: false
      },
      () => {
        // update analytics for close modal event
        const { gtmDataLayer, item } = this.props;
        logMiniCartCloseModalAnalytics(gtmDataLayer, item);
        this.props.onRequestCloseAddToCartModal();
      }
    );
  }
  /**
   *
   * @description method to persist the orderId.
   * @param {number} orderId - the orderId returned from ModalContent
   * @memberof Atc
   */
  persistOrderId(orderId) {
    this.setState({ storedOrderId: orderId });
  }

  /**
   * @description method to be executed upon successful ajax request to "add to cart".
   * @param  {Object} response - object returned from ajax request "add to cart"
   * @returns {undefined}
   */
  processATCResponse(response) {
    if (response) {
      const obj = {
        quantity: {
          totalCartQuantity: response.data && response.data.addToCart && response.data.addToCart.totalCartQuantity
        }
      };
      const orderId = get(response, 'data.addToCart.orderId[0]', '000000');
      this.props.fnFetchMiniCartSuccess({ ...obj, orderId });
      const { data } = response;

      if (Object.prototype.hasOwnProperty.call(data, 'addToCart')) {
        const { errorMessage } = data.addToCart;

        this.props.onRequestOpenAddToCartModal();
        this.setState(
          {
            atcResponse: data.addToCart,
            isPdpModalOpen: true
          },
          () => {
            // update analytics for view mini cart event
            const { gtmDataLayer, item } = this.props;
            logViewMiniCartAnalytics(gtmDataLayer, item);
            // call enhanced  analytics
            this.updateAnalyticsEnhanced();
          }
        );
        if (errorMessage) {
          this.onClickAddToCartErrorLogGA(errorMessage);
        }
      }
      initializeEvergageRecommendations();
    }

    this.blockAddToCartRequest = false;
    this.setState({ isAddingToCart: this.blockAddToCartRequest });
  }

  /**
   * @description method to be executed upon successful ajax request for "BUY NOW".
   * @param  {Object} response - object returned from ajax request "BUY NOW"
   * @returns {undefined}
   */
  processBuyNowResponse(response = {}) {
    const { gtmDataLayer } = this.props;
    const productItem = this.props.item;
    const removeAcademyLabel = {
      removeAcademyLabel: true
    };
    const { breadCrumb = [] } = productItem || [];
    const productName = productItem ? productItem.name : '';
    if (ExecutionEnvironment.canUseDOM) {
      if (response.status === 503) {
        window.location = signOutURL;
      }

      if (response.status >= 200 && response.status < 300) {
        const { buyNow } = response.data || {};
        const { orderId } = buyNow || {};
        if (orderId) {
          // push analytics data on buy now success
          gtmDataLayer.push({
            event: 'pdpDetailClick',
            eventCategory: 'pdp interactions',
            eventAction: 'pdp| buy now',
            eventLabel: `${printBreadCrumb([...breadCrumb, productName], removeAcademyLabel)}`.toLowerCase()
          });
          window.location = `/shop/OrderConfirmation?orderId=${orderId}`;
        }
      } else {
        this.handleBuyNowResponseError(response);
      }
    }
  }

  /**
   * @description method to be executed upon failed ajax request for "BUY NOW".
   * @param  {Object} response - object returned from ajax request "BUY NOW"
   * @returns {undefined}
   */
  handleBuyNowResponseError(response) {
    const { gtmDataLayer, authMsgs } = this.props;
    // push analytics data on buy now fail
    gtmDataLayer.push({
      event: 'errormessage',
      eventCategory: 'error message',
      eventAction: 'form validation error|buy now',
      eventLabel: getErrorMessageFrom(response)
    });
    this.blockAddToCartRequest = false;
    this.setState({
      buyNowErrorMessage: getErrorMessageFrom(response, authMsgs),
      isAddingToCart: this.blockAddToCartRequest,
      isBuyNowClicked: false
    });
  }

  /**
   * @description determines if "Enable Buy Now" button should be shown
   * @returns {boolean} True if "Enable Buy Now" button should be shown, else it returns false
   */
  showEnableBuyNowButton() {
    const { item, profile, isQuickView, authMsgs = {} } = this.props;
    if (authMsgs[IS_BUYNOW_ENABLED] === 'false') {
      return false;
    }
    return !isQuickView && utilsShowEnableBuyNowButton(item, profile);
  }

  /**
   * @description determines if "Buy Now" button should be shown
   * @returns {boolean} True if "Buy Now" button should be shown, else it returns false
   */
  showBuyNowButton() {
    const { item, profile, isQuickView, authMsgs = {} } = this.props;
    if (authMsgs[IS_BUYNOW_ENABLED] === 'false') {
      return false;
    }
    return !isQuickView && utilsShowBuyNowButton(item, profile);
  }

  /**
   * @description clears Buy Now Error Message from state
   * @returns {undefined}
   */
  clearBuyNowErrorMessage() {
    this.setState({ buyNowErrorMessage: undefined });
  }

  /**
   * @description helper method which renders QuantityCounter component
   * @returns {JSX} the rendered QuantityCounter
   */
  renderQuantityCounter() {
    const { onClickIncrementQuantityLogGA, onClickDecrementQuantityLogGA } = this.props;
    const { errormessage } = this.state;
    return (
      <Fragment>
        <QuantityCounter
          productItem={this.props.item}
          quantity={this.state.selectedQuantity}
          updateQuantity={qty => this.setState({ selectedQuantity: qty }, this.openQuantityModal)}
          auid="PDP_QC"
          disabled={this.props.disabled}
          onClickIncrementQuantityLogGA={onClickIncrementQuantityLogGA}
          onClickDecrementQuantityLogGA={onClickDecrementQuantityLogGA}
        />
        {errormessage !== '' && (
          <div>
            <span>{errormessage}</span>
          </div>
        )}
      </Fragment>
    );
  }

  /**
   * @description helper method which renders AddToCart button
   * @returns {JSX} the rendered AddToCart button
   */
  renderAddToCartButton() {
    const auid = 'AddToCart';
    const { labels = {} } = this.props;
    const onClickAddToCartLogGA = this.createOnClickAddToCartLogGA(this.props.onClickAddToCartLogGA);
    const buttonVariant = this.showBuyNowButton() ? 'secondary' : 'primary';

    return (
      <Button
        auid={auid}
        onClick={this.createOnClickAddToCart(onClickAddToCartLogGA)}
        disabled={this.state.isAddingToCart || this.props.disabled}
        tabIndex="0"
        className={AdjustWidth}
        btntype={buttonVariant}
      >
        {labels.ADD_TO_CART || ADD_TO_CART}
      </Button>
    );
  }

  /**
   * @description helper method which renders EnableBuyNow button
   * @returns {JSX} the rendered EnableBuyNow button
   */
  renderEnableBuyNowButton() {
    const { item, profile, disabled, isNoDiffBundle, selectedSwatchAmount, gcAmount, isSof } = this.props;
    const { selectedQuantity } = this.state;
    return (
      this.showEnableBuyNowButton() && (
        <EnableBuyNow
          auid="btnEnableBuyNow"
          className={AdjustWidth}
          profile={profile}
          onRequestClose={this.onEnableBuyNowClose}
          productItem={item}
          selectedQuantity={selectedQuantity}
          isNoDiffBundle={isNoDiffBundle}
          selectedSwatchAmount={selectedSwatchAmount}
          gcAmount={gcAmount}
          isSof={isSof}
          storeId={this.getStoreId()}
          handleBuyNowResponseError={this.handleBuyNowResponseError}
          disabled={disabled}
          createAddToCartRequestObject={this.createAddToCartRequestObject}
          gtmDataLayer={this.props.gtmDataLayer}
        />
      )
    );
  }

  /**
   * @description helper method which renders BuyNow button
   * @returns {JSX} the rendered BuyNow button
   */
  renderBuyNowButton() {
    const { disabled } = this.props;
    const { isBuyNowClicked } = this.state;
    return (
      this.showBuyNowButton() && (
        <Button
          disabled={disabled || this.state.buyNowErrorMessage || isBuyNowClicked}
          tabIndex="0"
          className={AdjustWidth}
          btntype="primary"
          onClick={this.createOnClickBuyNow()}
        >
          {!isBuyNowClicked && 'Buy Now'}
          {isBuyNowClicked && <Spinner className={spinnerOverride} />}
        </Button>
      )
    );
  }
  /**
   * @description helper method which renders PDPModal
   * @returns {JSX} the rendered PDPModal
   */
  renderPdpModal() {
    return (
      this.state.isPdpModalOpen && (
        <Modal
          ariaHideApp={false}
          isOpen={this.state.isPdpModalOpen}
          overlayClassName={Overlay.backdrop}
          className={Overlay.container}
          aria-label="Add To Cart Modal"
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick
          role="dialog"
        >
          {this.renderCloseModal()}
          {this.renderPdpModalContent()}
        </Modal>
      )
    );
  }

  /**
   * @description helper method which renders content for PDPModal.  Could be an Error message, No Diff content, or PDP Generic content.
   * @returns {JSX} the rendered content for PDPModal
   */
  renderPdpModalContent() {
    const { item, labels = {}, isNoDiffBundle, price, authMsgs } = this.props;
    const { seoURL } = item;
    const { atcResponse } = this.state;
    const { exceptionCode } = atcResponse;

    if (exceptionCode === SHOW_FUMBLED || (isNoDiffBundle && exceptionCode === '_ERR_PRODUCT_MAX_QTY')) {
      return <ErrorModal {...atcResponse} />;
    }

    if (isNoDiffBundle) {
      return (
        <NoDiffModalContent
          {...this.state.atcResponse}
          labels={labels}
          price={price}
          authMsgs={authMsgs}
          seoURL={seoURL}
          closeModal={this.closeModal}
          gtmDataLayer={this.props.gtmDataLayer}
        />
      );
    }

    return (
      <ModalContent
        {...this.state.atcResponse}
        labels={labels}
        authMsgs={authMsgs}
        price={price}
        seoURL={seoURL}
        closeModal={this.closeModal}
        gtmDataLayer={this.props.gtmDataLayer}
        storedOrderId={this.state.storedOrderId}
        persistOrderId={this.persistOrderId}
      />
    );
  }

  /**
   * @description helper method which renders GiftCardModal
   * @returns {JSX} the rendered GiftCardModal
   */
  renderGiftCardModal() {
    const { item } = this.props;
    return (
      this.state.isGiftCardModalOpen && (
        <Modal
          isOpen={this.state.isGiftCardModalOpen}
          productItem={item}
          overlayClassName={Overlay.backdrop}
          className={StyledModal}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick
          role="dialog"
        >
          {this.renderCloseModal()}

          <div className="col-12 col-md-6 offset-md-3 text-center my-3">
            <div className="row d-flex mx-3 mx-md-0 mt-6 mb-2 pt-3">
              <h3>ACADEMY GIFT CARDS</h3>
            </div>
          </div>
          <div className="col-12 d-flex justify-content-center my-1">
            <div className="col-8">
              {item.bulkGiftcardSeoUrl && <span>{SINGLE_SKU_MESSAGE}</span>}
              {item.standardGiftcardSeoUrl && <span>{MULTI_SKU_MESSAGE}</span>}
            </div>
          </div>
          <div className="row d-flex justify-content-center mb-6">
            <Button className="col-8 col-md-4 mt-2" key={item} onClick={this.closeModal} auid="HP_GC_BUTTON_CANCEL" btntype="secondary">
              CANCEL
            </Button>
            <Button
              className="col-8 col-md-4 mx-md-2 mt-2"
              key={item}
              onClick={e => this.onClickGoToGiftCardSeoUrl(e)}
              auid="HP_GC_BUTTON"
              btntype="primary"
            >
              {this.state.ctaMessage}
            </Button>
          </div>
        </Modal>
      )
    );
  }

  /**
   * @description helper method which renders the close button ('X') for all modals
   * @returns {JSX} the rendered close button ('X')
   */
  renderCloseModal() {
    return (
      <Overlay.CloseModal onClick={this.closeModal} data-auid="PDP_close_Addtocart_Modal" aria-label="Close Add To Cart Modal">
        <span className="sr-only">Close</span>
        &#10761;
      </Overlay.CloseModal>
    );
  }

  /**
   * @description main render method
   * @returns {JSX} Atc
   */
  render() {
    return (
      <Fragment>
        <div className="productActionItems row mb-0 mb-lg-2 no-gutters">
          <div className="col-12 col-md-6 pl-0 mb-2 mb-lg-0">{this.renderQuantityCounter()}</div>
          <div className={`col-12 col-md-6 pr-0 mb-2 mb-lg-0 pl-md-1 ${addToCartHolder}`}>
            {!this.showBuyNowButton() && !this.showEnableBuyNowButton() && this.renderAddToCartButton()}
          </div>
        </div>
        {!!this.state.buyNowErrorMessage && (
          <ErrorBuyNow
            message={this.props.authMsgs.GENERIC_BUYNOW_ERROR}
            onRequestClose={this.clearBuyNowErrorMessage}
            authMsgs={this.props.authMsgs}
          />
        )}
        {this.showEnableBuyNowButton() && (
          <div className="productActionItems row mb-0 mb-lg-2">
            <div className={`col-12 col-md-6 mb-2 mb-lg-0 ${addToCartHolder} ${order2}`}>{this.renderEnableBuyNowButton()}</div>
            <div className={`col-12 col-md-6 mb-2 mb-lg-0 ${addToCartHolder}`}>{this.renderAddToCartButton()}</div>
          </div>
        )}
        {this.showBuyNowButton() && (
          <div className="productActionItems row mb-0 mb-lg-2">
            <div className={`col-12 col-md-6 mb-2 mb-lg-0 ${addToCartHolder}`}>{this.renderAddToCartButton()}</div>
            <div className={`col-12 col-md-6 mb-2 mb-lg-0 ${addToCartHolder}`}>{this.renderBuyNowButton()}</div>
          </div>
        )}
        {this.renderPdpModal()}
        {this.renderGiftCardModal()}
      </Fragment>
    );
  }
}

Atc.propTypes = {
  fetchMiniCart: PropTypes.func,
  gtmDataLayer: PropTypes.array,
  onClickAddToCartLogGA: PropTypes.func,
  onClickIncrementQuantityLogGA: PropTypes.func,
  onClickDecrementQuantityLogGA: PropTypes.func,
  gcAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectedSwatchAmount: PropTypes.string,
  item: PropTypes.object,
  disabled: PropTypes.bool,
  labels: PropTypes.object,
  onRequestOpenAddToCartModal: PropTypes.func,
  onRequestCloseAddToCartModal: PropTypes.func,
  isNoDiffBundle: PropTypes.bool,
  price: PropTypes.object,
  storeInfo: PropTypes.object,
  fnFetchMiniCartSuccess: PropTypes.func,
  isQuickView: PropTypes.bool,
  isSof: PropTypes.bool,
  profile: PropTypes.object,
  fetchProfile: PropTypes.func.isRequired,
  authMsgs: PropTypes.object
};

Atc.defaultProps = {
  onRequestCloseAddToCartModal: () => null,
  onRequestOpenAddToCartModal: () => null
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const mapDispatchToProps = dispatch => ({
  fnFetchMiniCartSuccess: data => dispatch(actions.fetchMiniCartSuccess(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Atc);
