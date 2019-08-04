import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { get } from '@react-nitro/error-boundary';
import Button from '@academysports/fusion-components/dist/Button';
import { Overlay, addToCartHolder, AdjustWidth, StyledModal } from './styles';
import ModalContent from './AddToCart/ModalContent';
import NoDiffModalContent from './AddToCart/NoDiffModalContent';
import ErrorModal from './ErrorModal';
import QuantityCounter from './QuantityCounter';
import { ADD_TO_CART, SINGLE_SKU_MESSAGE, MULTI_SKU_MESSAGE, SHOW_FUMBLED, CREATE_PASSWORD_URL } from '../constants';
import { printBreadCrumbAndName } from '../../../utils/breadCrumb';
import { createEnhancedAnalyticsProductItem } from '../../../utils/analytics';
import { naFallback } from '../../../utils/analytics/generic';
import * as actions from '../actions';
import { hasItemsInCart } from '../../../utils/UserSession';
import { initializeEvergageRecommendations } from '../../../utils/productDetailsUtils';
import { signOutURL, cartURL } from '../../../environments/environment';
import StorageManager from '../../../utils/StorageManager';

class Atc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      modalIsOpen: false,
      isAddingToCart: false,
      hasItemsInCart: hasItemsInCart(),
      selectedQuantity:
        (props.item.bulkGiftcardMinQuantity && props.item.bulkGiftcardSeoUrl) || !props.item.bulkGiftcardMinQuantity
          ? 1
          : parseInt(props.item.bulkGiftcardMinQuantity, 10),
      atcResponse: '',
      ctaMessage: props.item.bulkGiftcardSeoUrl ? 'BULK GIFT CARD' : 'STANDARD GIFT CARD'
    };
    this.updateAnalyticsEnhanced = this.updateAnalyticsEnhanced.bind(this);
    this.updateAnalytics = this.updateAnalytics.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openQuantityModal = this.openQuantityModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createOnClickAddToCart = this.createOnClickAddToCart.bind(this);
    this.processATCResponse = this.processATCResponse.bind(this);
    this.onClickGoTo = this.onClickGoTo.bind(this);
    this.hasModalOpen = this.hasModalOpen.bind(this);
    this.hasErrorMessage = this.hasErrorMessage.bind(this);
  }
  /* Add To cart Analytics  new implementation ended  */
  /* Add To cart Analytics new implementation error message */
  onClickAddToCartErrorLogGA(errorMessage) {
    this.updateAnalytics({
      event: 'errormessage',
      eventCategory: 'error message',
      eventAction: `cart modal error|${this.props.item.name}`,
      eventLabel: errorMessage
    });
  }

  /**
   * Function to redirect from Bulk to standard and standard to Bulk
   * @param  {e} event check
   */
  onClickGoTo(e) {
    e.preventDefault();
    const { item } = this.props;
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = item.bulkGiftcardSeoUrl || item.standardGiftcardSeoUrl;
    }
  }

  /* Add To cart Analytics new implementation */
  createOnClickAddToCartLogGA(logGA = () => null) {
    return () => {
      logGA();
      this.updateAnalyticsEnhanced();
    };
  }
  /**
   * Function to check if required quantity for Standard or Bulk gift card matches
   * @param  {qty} quantity check for gift cards
   */
  openQuantityModal() {
    const qty = this.state.selectedQuantity;
    const { item } = this.props;
    if (
      (item.bulkGiftcardSeoUrl && qty >= parseInt(item.bulkGiftcardMinQuantity, 10)) ||
      (item.standardGiftcardSeoUrl && qty < parseInt(item.bulkGiftcardMinQuantity, 10))
    ) {
      this.setState({
        isModalOpen: true,
        selectedQuantity: item.standardGiftcardSeoUrl ? parseInt(item.bulkGiftcardMinQuantity, 10) : parseInt(item.bulkGiftcardMinQuantity, 10) - 1
      });
    }
  }

  /* Add To cart Analytics new implementation error message  ended */
  updateAnalytics(analytics = {}) {
    const { item: product } = this.props;
    const breadCrumbData = product.breadCrumb || '';
    const defaultAnalytics = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventLabel: printBreadCrumbAndName(breadCrumbData, product.name, { printEmptyValues: false }).toLowerCase()
    };
    this.props.gtmDataLayer.push({
      ...defaultAnalytics,
      ...analytics
    });
  }
  updateAnalyticsEnhanced() {
    try {
      const { selectedQuantity, atcResponse } = this.state;
      if (!atcResponse || !atcResponse.orderId) return false;
      const { item: product, gtmDataLayer, isQuickView } = this.props;
      const price = product.isGiftCard ? { ...product.price, salePrice: atcResponse.items && atcResponse.items[0].price } : { ...product.price };
      const isFirstProduct = !this.state.hasItemsInCart && hasItemsInCart();
      if (isFirstProduct) {
        this.setState({ hasItemsInCart: hasItemsInCart() });
      }
      const analyticsProductItem = createEnhancedAnalyticsProductItem({ ...product, price });
      const eventAction = isQuickView ? 'add to cart|quick view' : 'add to cart';
      return gtmDataLayer.push({
        event: 'shoppingcart',
        eventCategory: 'shopping cart',
        eventAction,
        eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name, { printEmptyValues: false }).toLowerCase(),
        ecommerce: {
          currencyCode: 'US',
          add: {
            products: [
              {
                name: analyticsProductItem.name,
                id: analyticsProductItem.parentSku,
                price: analyticsProductItem.salePrice,
                brand: analyticsProductItem.brand,
                category: analyticsProductItem.category,
                variant: analyticsProductItem.childSku,
                quantity: naFallback(selectedQuantity),
                dimension4: analyticsProductItem.isAvailableInStore,
                dimension5: naFallback(atcResponse.orderId[0]),
                dimension25: analyticsProductItem.promoText,
                dimension29: analyticsProductItem.productFindingMethod,
                dimension72: analyticsProductItem.childSku,
                dimension74: analyticsProductItem.parentSkuProductName,
                dimension68: analyticsProductItem.color,
                dimension70: analyticsProductItem.team,
                dimension77: analyticsProductItem.isSpecialOrder,
                metric22: analyticsProductItem.salePrice,
                metric46: isFirstProduct ? '1' : '0'
              }
            ]
          }
        },
        dimension76: analyticsProductItem.isSpecialOrder,
        dimension24: analyticsProductItem.promoText,
        dimension28: analyticsProductItem.productFindingMethod,
        metric21: analyticsProductItem.salePrice,
        metric45: isFirstProduct ? '1' : '0'
      });
    } catch (e) {
      return null;
    }
  }
  createOnClickAddToCart(onClickLogGA, item, isNoDiffBundle) {
    let skuItems = [];
    const passwordExpired = StorageManager.getCookie('PASSWORD_EXPIRED_FLAG');
    if (isNoDiffBundle) {
      const { SKUs } = item;
      if (SKUs) {
        skuItems = SKUs.map(skuObj => ({
          id: skuObj.skuId,
          quantity: this.state.selectedQuantity,
          type: 'REGULAR'
        }));
      }
    } else {
      skuItems = [
        {
          id: item.skuId,
          quantity: this.state.selectedQuantity,
          type: 'REGULAR'
        }
      ];
    }
    const requestObj = {
      skus: skuItems,
      giftAmount: this.props.selectedSwatchAmount ? this.props.selectedSwatchAmount : `${this.props.gcAmount}`,
      inventoryCheck: true,
      isGCItem: item.isGiftCard === 'Y'
    };
    if (isNoDiffBundle) {
      requestObj.isBundle = true;
      requestObj.isGCItem = false;
    }
    return () => {
      if (passwordExpired) {
        window.location.href = CREATE_PASSWORD_URL;
      } else if (!this.state.isAddingToCart) {
        this.setState({ isAddingToCart: true });
        onClickLogGA(item);
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
  openModal() {
    this.props.onRequestOpenAddToCartModal();
    this.setState({
      modalIsOpen: true,
      atcResponse: { exceptionCode: SHOW_FUMBLED },
      isAddingToCart: false
    });
  }
  closeModal() {
    this.setState(
      {
        modalIsOpen: false,
        isModalOpen: false,
        isAddingToCart: false
      },
      () => {
        // update analytics for close modal event
        this.updateAnalytics({ eventAction: 'mini cart action', eventLabel: 'close modal', minicartimpressions: 0 });
        this.props.onRequestCloseAddToCartModal();
      }
    );
  }
  processATCResponse(response) {
    if (response) {
      // this.setState({ isAddingToCart: false });
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
            modalIsOpen: true
          },
          () => {
            // update analytics for view mini cart event
            this.updateAnalytics({ eventAction: 'view mini cart', minicartimpressions: 1 });
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
  }
  hasModalOpen() {
    const { item } = this.props;
    return (
      <Fragment>
        {this.state.isModalOpen && (
          <Modal
            isOpen={this.state.isModalOpen}
            productItem={this.props.item}
            overlayClassName={Overlay.backdrop}
            className={StyledModal}
            onRequestClose={this.closeModal}
            shouldCloseOnOverlayClick
            role="dialog"
          >
            <Overlay.CloseModal onClick={this.closeModal} data-auid="PDP_close_Addtocart_Modal" role="button" aria-label="Close Add To Cart Modal">
              <span className="sr-only">Close</span>
              &#10761;
            </Overlay.CloseModal>
            <div className="col-12 col-md-6 offset-md-3 text-center my-3">
              <div className="row d-flex mx-3 mx-md-0 mt-6 mb-2 pt-3">
                <h3>ACADEMY GIFT CARDS</h3>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-center my-1">
              <div className="col-8">
                {this.props.item.bulkGiftcardSeoUrl && <span>{SINGLE_SKU_MESSAGE}</span>}
                {this.props.item.standardGiftcardSeoUrl && <span>{MULTI_SKU_MESSAGE}</span>}
              </div>
            </div>
            <div className="row d-flex justify-content-center mb-6">
              <Button className="col-8 col-md-4 mt-2" key={item} onClick={this.closeModal} auid="HP_GC_BUTTON_CANCEL" btntype="secondary">
                CANCEL
              </Button>
              <Button className="col-8 col-md-4 mx-md-2 mt-2" key={item} onClick={e => this.onClickGoTo(e)} auid="HP_GC_BUTTON" btntype="primary">
                {this.state.ctaMessage}
              </Button>
            </div>
          </Modal>
        )}
      </Fragment>
    );
  }
  hasErrorMessage() {
    return (
      <Fragment>
        {this.state.errormessage !== '' && (
          <div>
            <span>{this.state.errormessage}</span>
          </div>
        )}
      </Fragment>
    );
  }
  render() {
    const auid = 'AddToCart';
    const { item, onClickIncrementQuantityLogGA, onClickDecrementQuantityLogGA, labels = {}, isNoDiffBundle, price } = this.props;
    const { seoURL } = item;
    const { atcResponse } = this.state;
    const { exceptionCode } = atcResponse;
    const onClickAddToCartLogGA = this.createOnClickAddToCartLogGA(this.props.onClickAddToCartLogGA);
    return (
      <div className="productActionItems row mb-0 mb-lg-2">
        <div className="col-12 col-md-6 mb-2 mb-lg-0">
          <QuantityCounter
            productItem={this.props.item}
            quantity={this.state.selectedQuantity}
            updateQuantity={qty => this.setState({ selectedQuantity: qty })}
            onBlurQuantityValidation={this.openQuantityModal}
            auid="PDP_QC"
            disabled={this.props.disabled}
            onClickIncrementQuantityLogGA={onClickIncrementQuantityLogGA}
            onClickDecrementQuantityLogGA={onClickDecrementQuantityLogGA}
          />
        </div>
        {this.hasModalOpen()}
        {this.hasErrorMessage()}
        <div className={`col-12 col-md-6 mb-2 mb-lg-0 ${addToCartHolder}`}>
          <Button
            auid={auid}
            onClick={this.createOnClickAddToCart(onClickAddToCartLogGA, item, isNoDiffBundle)}
            disabled={this.state.isAddingToCart || this.props.disabled}
            tabIndex="0"
            className={AdjustWidth}
          >
            {labels.ADD_TO_CART || ADD_TO_CART}
          </Button>
          {this.state.modalIsOpen && (
            <Modal
              ariaHideApp={false}
              isOpen={this.state.modalIsOpen}
              overlayClassName={Overlay.backdrop}
              className={Overlay.container}
              aria-label="Add To Cart Modal"
              onRequestClose={this.closeModal}
              shouldCloseOnOverlayClick
              role="dialog"
            >
              <Overlay.CloseModal onClick={this.closeModal} data-auid="PDP_close_Addtocart_Modal" aria-label="Close Add To Cart Modal">
                <span className="sr-only">Close</span>
                &#10761;
              </Overlay.CloseModal>
              {exceptionCode === SHOW_FUMBLED || (isNoDiffBundle && exceptionCode === '_ERR_PRODUCT_MAX_QTY') ? (
                <ErrorModal {...atcResponse} />
              ) : (
                <Fragment>
                  {!isNoDiffBundle && (
                    <ModalContent
                      {...this.state.atcResponse}
                      labels={labels}
                      price={price}
                      seoURL={seoURL}
                      closeModal={this.closeModal}
                      gtmDataLayer={this.props.gtmDataLayer}
                    />
                  )}
                  {isNoDiffBundle && (
                    <NoDiffModalContent
                      {...this.state.atcResponse}
                      labels={labels}
                      price={price}
                      seoURL={seoURL}
                      closeModal={this.closeModal}
                      gtmDataLayer={this.props.gtmDataLayer}
                    />
                  )}
                </Fragment>
              )}
            </Modal>
          )}
        </div>
      </div>
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
  fnFetchMiniCartSuccess: PropTypes.func,
  isQuickView: PropTypes.bool
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
