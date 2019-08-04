import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import axios from 'axios';
import { signOutURL } from '@academysports/aso-env';
import { initFitrec } from './trueFit.helper.initFitrec';
import { printBreadCrumbAndName } from '../../utils/breadCrumb';
import { areSelectedIdentifiersEquivalent } from '../../utils/productDetailsUtils';
import { fetchMiniCartSuccess } from './action';
import { SHOW_FUMBLED } from './constants';
import { Overlay } from '../productActionItems/components/styles';
import ModalContent from '../productActionItems/components/AddToCart/ModalContent';
import ErrorModal from '../productActionItems/components/ErrorModal';
import { checkStockStatus } from '../productAttributesAndSizes/helpers';
import { createEnhancedAnalyticsProductItem } from '../../utils/analytics/index';
import { hasItemsInCart } from '../../utils/UserSession';
import { naFallback } from '../../utils/analytics/generic';
const COLOR = 'Color';
const PATTERN = 'Pattern';

class TrueFit extends React.Component {
  constructor(props) {
    super(props);
    this.getAvailableSizes = this.getAvailableSizes.bind(this);
    this.fitrecSetColorId = this.fitrecSetColorId.bind(this);
    this.updateSizeByRecommendation = this.updateSizeByRecommendation.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.onClickTrueFitTarget = this.onClickTrueFitTarget.bind(this);
    this.processATCResponse = this.processATCResponse.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateAnalytics = () => null;
    this.updateAnalyticsEnhanced = () => null;
    this.preventLogRecommendationAnalytics = true;
    this.logAnalyticsOnTrueFitAddToCart = this.logAnalyticsOnTrueFitAddToCart.bind(this);

    this.state = {
      modalIsOpen: false,
      atcResponse: {},
      hasItemsInCart: hasItemsInCart()
    };
  }

  componentDidMount() {
    this.addScript();
  }

  shouldComponentUpdate(nextProps) {
    if (this.isTrueFitInitialized()) {
      const { productItem: prevProductItem = {} } = this.props;
      const { productItem: nextProductItem = {} } = nextProps;
      if (!areSelectedIdentifiersEquivalent(prevProductItem.selectedIdentifier, nextProductItem.selectedIdentifier)) {
        this.callSetColorIdOnRender = true;
      }
    }
    // defaults to true, so we continue to always return true
    return true;
  }

  onClickTrueFitTarget() {
    this.preventLogRecommendationAnalytics = false;
    this.logAnalyticsOnTrueFitTargetClick();
  }

  getColorPatternId() {
    const { productItem = {} } = this.props;
    const { selectedIdentifier = {} } = productItem;
    return selectedIdentifier[this.getColorPatternKey()];
  }

  getColorPatternKey() {
    const { productItem = {} } = this.props;
    const { selectedIdentifier = {} } = productItem;
    return selectedIdentifier[PATTERN] ? PATTERN : COLOR;
  }

  getAvailableSizes() {
    const { productItem = {} } = this.props;
    const { productAttributeGroups } = productItem;
    const { trueFitSizeLabelToIdentifiers = {}, productAttrCombinationGroups, inventory } = productItem;
    const colorPatternId = this.getColorPatternId();
    const sizeKeys = Object.keys(trueFitSizeLabelToIdentifiers);
    const attrKeys = productAttributeGroups;
    const available = sizeKeys.filter(sizeKey => {
      const sizeIdentifiers = trueFitSizeLabelToIdentifiers[sizeKey];
      const identifierValues = attrKeys.map(key => sizeIdentifiers[key] || colorPatternId);
      return checkStockStatus(identifierValues, productAttrCombinationGroups, inventory);
    });
    return available.join(':');
  }

  getColorPatternLabel() {
    const { productItem = {} } = this.props;
    const { identifiersMap = {} } = productItem;
    const colorPatternId = this.getColorPatternId();
    const colorPatternKey = this.getColorPatternKey();
    const colorPatternObjects = identifiersMap[colorPatternKey] || [];
    const colorPatternObject = colorPatternObjects.find(obj => colorPatternId && ((obj || {}).identifier || {}).value === colorPatternId) || {
      text: ''
    };
    return colorPatternObject.text;
  }

  addScript() {
    if (ExecutionEnvironment.canUseDOM && !window.tfcapi) {
      initFitrec();
      this.attachRecommendationEvent();
      this.attachAddToCartEvent();
    }
  }

  isTrueFitInitialized() {
    return ExecutionEnvironment.canUseDOM && window.tfcapi !== undefined;
  }

  logAnalyticsOnTrueFitTargetClick() {
    const { productItem } = this.props;
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|true fit',
      eventLabel: printBreadCrumbAndName(productItem.breadCrumb, productItem.name, { printEmptyValues: false }).toLowerCase()
    });
  }

  logAnalyticsOnUpdateSizeByRecommendation(product, size) {
    if (!this.preventLogRecommendationAnalytics) {
      const timestampCurrentLogRecommendationRequest = new Date().getTime();
      if (!this.blockLogRecommendationRequest(timestampCurrentLogRecommendationRequest)) {
        this.props.gtmDataLayer.push({
          event: 'pdpDetailClick',
          eventCategory: 'pdp interactions',
          eventAction: `pdp|attribute|truefit size|${size}`.toLowerCase(),
          eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name, { printEmptyValues: false }).toLowerCase()
        });
        this.timestampPreviousLogRecommendationRequest = timestampCurrentLogRecommendationRequest;
      }
    }
  }

  logAnalyticsOnTrueFitAddToCart(product) {
    try {
      const { atcResponse } = this.state;
      const analyticsProductItem = createEnhancedAnalyticsProductItem(product);
      const isFirstProduct = !this.state.hasItemsInCart && hasItemsInCart();
      if (isFirstProduct) {
        this.setState({ hasItemsInCart: hasItemsInCart() });
      }

    return this.props.gtmDataLayer.push({
      event: 'shoppingcart',
      eventAction: 'add to cart|true fit',
      eventCategory: 'shopping cart',
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
              quantity: 1,
              dimension4: analyticsProductItem.isAvailableInStore,
              dimension5: naFallback(atcResponse.orderId[0]),
              dimension25: analyticsProductItem.promoText,
              dimension77: analyticsProductItem.isSpecialOrder,
              dimension29: analyticsProductItem.productFindingMethod,
              dimension72: analyticsProductItem.childSku,
              dimension74: analyticsProductItem.parentSkuProductName,
              metric22: analyticsProductItem.salePrice,
              metric46: isFirstProduct ? '1' : '0',
              dimension68: analyticsProductItem.color,
              dimension31: analyticsProductItem.notApplicable,
              dimension42: analyticsProductItem.notApplicable,
              dimension43: analyticsProductItem.rating,
              dimension34: analyticsProductItem.onlineDeliveryMessage,
              dimension35: analyticsProductItem.storeDeliveryMessage,
              dimension70: analyticsProductItem.team
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

  blockLogRecommendationRequest(timestamp) {
    return this.timestampPreviousLogRecommendationRequest && timestamp - this.timestampPreviousLogRecommendationRequest < 500;
  }

  attachRecommendationEvent() {
    const { fnUpdateProduct, fnSaveProduct } = this.props;
    if (fnUpdateProduct && fnSaveProduct) {
      window.tfcapi('event', 'tfc-fitrec-product', 'success', this.updateSizeByRecommendation);
    }
  }

  updateSizeByRecommendation(context) {
    const { fitRecommendation } = context;
    const { status, size } = fitRecommendation;
    const { productItem } = this.props;

    if (status === 'success') {
      this.logAnalyticsOnUpdateSizeByRecommendation(productItem, size);
      const trueFitIdentiers = productItem.trueFitSizeLabelToIdentifiers[size];
      if (trueFitIdentiers) {
        const nextSelectedIdentiers = { ...productItem.selectedIdentifier, ...trueFitIdentiers };
        const newProductItem = this.props.fnUpdateProduct(productItem, nextSelectedIdentiers);
        this.props.fnSaveProduct(newProductItem);
        return true;
      }
    }
    return false;
  }

  fitrecSetColorId = (styleId, newColorId, newAvailableSizes) => {
    if (ExecutionEnvironment.canUseDOM) {
      window.tfcapi('update', 'tfc-fitrec-product', {
        products: {
          [styleId]: { colorId: newColorId, availableSizes: newAvailableSizes } // eslint-disable-line
        }
      });
    }
  };

  attachAddToCartEvent() {
    window.tfcapi('event', 'tfc-fitrec-register', 'addtobag', this.addToCart);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  addToCart() {
    const { productItem } = this.props;

    const skuItems = [
      {
        id: productItem.skuId,
        quantity: 1,
        type: 'REGULAR'
      }
    ];

    const requestObj = {
      skus: skuItems,
      inventoryCheck: true,
      isGCItem: false
    };

    if (ExecutionEnvironment.canUseDOM) {
      axios
        .post('/api/cart/sku', requestObj)
        .then(this.processATCResponse)
        .catch(() => null);
    }
  }

  processATCResponse(response) {
    if (response.status === 503 && ExecutionEnvironment.canUseDOM) {
      window.location = signOutURL;
    }
    if (response.status === 200) {
      const obj = {
        quantity: {
          totalCartQuantity: response.data && response.data.addToCart && response.data.addToCart.totalCartQuantity
        }
      };
      this.props.fnFetchMiniCartSuccess(obj);
      const { data } = response;

      if (Object.prototype.hasOwnProperty.call(data, 'addToCart')) {
        const { errorMessage } = data.addToCart;
        this.blockAddToCartRequest = false;
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
            const { productItem } = this.props;
            this.logAnalyticsOnTrueFitAddToCart(productItem);
          }
        );
        if (errorMessage) {
          this.onClickAddToCartErrorLogGA(errorMessage);
        }
      }
    }
  }

  renderModal() {
    if (!this.state.modalIsOpen) {
      return null;
    }

    const { atcResponse } = this.state;
    const { exceptionCode } = atcResponse;
    return (
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
        {exceptionCode === SHOW_FUMBLED || exceptionCode === '_ERR_PRODUCT_MAX_QTY' ? (
          <ErrorModal {...atcResponse} />
        ) : (
          <ModalContent {...this.state.atcResponse} closeModal={this.closeModal} gtmDataLayer={this.props.gtmDataLayer} />
        )}
      </Modal>
    );
  }

  render() {
    const { partNumber } = this.props;

    if (!partNumber) {
      return null;
    }

    if (this.callSetColorIdOnRender) {
      setTimeout(() => {
        this.fitrecSetColorId(partNumber, this.getColorPatternLabel(), this.getAvailableSizes());
      }, 1);
      this.callSetColorIdOnRender = false;
    }

    // disabling next line because 3rd party requires the target el to be a div
    return (
      <Fragment>
        {/* eslint-disable-next-line */}
        <div
          className="tfc-fitrec-product"
          id={partNumber}
          data-availablesizes={this.getAvailableSizes()}
          data-colorid={this.getColorPatternLabel()}
          data-locale="en_US"
          onClick={this.onClickTrueFitTarget}
        />
        {this.renderModal()}
      </Fragment>
    );
  }
}

TrueFit.propTypes = {
  partNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  productItem: PropTypes.object,
  fnUpdateProduct: PropTypes.func,
  fnSaveProduct: PropTypes.func,
  gtmDataLayer: PropTypes.array,
  fnFetchMiniCartSuccess: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({ ...ownProps, gtmDataLayer: state.gtmDataLayer });

const mapDispatchToProps = dispatch => ({
  fnFetchMiniCartSuccess: data => dispatch(fetchMiniCartSuccess(data))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default withConnect(TrueFit);

// legacy props that are not currently being used, may need to revisit.
// id={this.props.productId} // product id which will be be passsed in from PDP Component as props
// data-userid={this.props.userId} // user id which will be be passsed in from PDP Component as props
// data-colorid={this.props.colorId} // color id which will be be passsed in from PDP Component as props if a product had one common id for its color variations.

// order-tracking - <div className="tfc-order-notify" data-orderid="" data-userid/>
