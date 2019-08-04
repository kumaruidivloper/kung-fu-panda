import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';
import { connect, Provider } from 'react-redux';
import Responsive from 'react-responsive';
import { cx, css } from 'react-emotion';
import { Overlay, ContentWide, ContentNarrow, CloseButton, CloseIcon } from './styles';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { closeModal } from './actions';
import { getProductItem } from '../../utils/productDetailsUtils';
import { printBreadCrumbAndName } from '../../utils/breadCrumb';

import ErrorModalContent from './lib/errorModalContent';
import ProductThumbnail from '../productThumbnail/productThumbnail.component';
import ProductDetails from '../productDetails/productDetails.component';
import ProductAttributesAndSizes from '../productAttributesAndSizes/productAttributesAndSizes.component';
import ProductActionItems from '../productActionItems/productActionItems.component';
import ProductAdditionalDetails from '../productAdditionalDetails/productAdditionalDetails.component';
// import Loader from './loader';
import Spinner from './spinner';
import { enhancedAnalyticsPDP } from '../../utils/analytics';

/**
 * Overview:
 * Opening the modal
 */

class QuickView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      productItem: null,
      hideWithCss: false
    };
    this.onClickProductThumbnailDetailsLogGA = this.onClickProductThumbnailDetailsLogGA.bind(this);
    this.onClickAttributesSwatchLogGA = this.onClickAttributesSwatchLogGA.bind(this);
    this.onClickAttributesSeeMoreColorsLogGA = this.onClickAttributesSeeMoreColorsLogGA.bind(this);
    this.onClickIncrementQuantityLogGA = this.onClickIncrementQuantityLogGA.bind(this);
    this.onClickDecrementQuantityLogGA = this.onClickDecrementQuantityLogGA.bind(this);
    this.onRequestOpenAddToCartModal = this.onRequestOpenAddToCartModal.bind(this);
    this.onRequestCloseAddToCartModal = this.onRequestCloseAddToCartModal.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);

    this.onUpdateProductItem = this.onUpdateProductItem.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    let productChanged = (!!props.product && !state.productItem) || (!props.product && !!state.productItem);
    productChanged = productChanged || (props.product && props.product['product-info'].productinfo.id !== state.productItem.id);

    if (!productChanged) {
      return null;
    }

    const productItem = !props.product ? null : getProductItem(props.product, { productId: props.product['product-info'].productinfo.id });
    return { productItem };
  }

  componentDidUpdate(prevProps, prevState) {
    const executePdpPageLoad = !prevState.productItem && this.state.productItem;
    if (executePdpPageLoad && this.props.gtmDataLayer) {
      enhancedAnalyticsPDP({ gtmDataLayer: this.props.gtmDataLayer, productItem: this.state.productItem, isQuickView: true });
    }
  }

  onClickProductThumbnailDetailsLogGA(product) {
    this.props.gtmDataLayer.push({
      event: 'plpPageClicks',
      eventCategory: 'plp interactions',
      eventAction: 'plp|quickview|see details',
      eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name).toLowerCase()
    });
  }

  /** Analytics for QuickView Attribute Swatches begins */

  onClickAttributesSwatchLogGA(product, selectedItem) {
    const { identifier } = selectedItem;
    this.props.gtmDataLayer.push({
      event: 'plpPageClicks',
      eventCategory: 'plp interactions',
      eventAction: `plp|quickview|attribute|${identifier.key}|${selectedItem.text}`.toLowerCase(),
      eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name).toLowerCase()
    });
  }
  /** Analytics for QuickView Attribute Swatches ends */

  /** Analytics for QuickView Attribute See More Logs begins */
  onClickAttributesSeeMoreColorsLogGA(product) {
    this.props.gtmDataLayer.push({
      event: 'plpPageClicks',
      eventCategory: 'plp interactions',
      eventAction: 'plp|quickview|attribute|see colors',
      eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name).toLowerCase()
    });
  }
  /** Analytics for QuickView Quantity Counter-inc Logs begins */
  onClickIncrementQuantityLogGA(product) {
    this.props.gtmDataLayer.push({
      event: 'plpPageClicks',
      eventCategory: 'plp interactions',
      eventAction: 'plp|quickview|quantity added',
      eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name).toLowerCase()
    });
  }
  /** Analytics for QuickView Quantity Counter-inc Logs ends */

  /** Analytics for QuickView Quantity Counter-dec Logs begins */
  onClickDecrementQuantityLogGA(product) {
    this.props.gtmDataLayer.push({
      event: 'plpPageClicks',
      eventCategory: 'plp interactions',
      eventAction: 'plp|quickview|quantity removed',
      eventLabel: printBreadCrumbAndName(product.breadCrumb, product.name).toLowerCase()
    });
  }
  /** Analytics for QuickView Quantity Counter-dec Logs ends */
  onRequestOpenAddToCartModal() {
    this.setState({ hideWithCss: true });
  }

  onRequestCloseAddToCartModal() {
    this.setState({ hideWithCss: false });
    this.onRequestClose();
  }

  onRequestClose() {
    const { onCloseFocusId, fnCloseModal = () => null } = this.props;
    this.focusAnchorById(onCloseFocusId);
    fnCloseModal();
  }

  onUpdateProductItem(productItem) {
    this.setState({
      productItem
    });
  }

  focusAnchorById(onCloseFocusId) {
    if (ExecutionEnvironment.canUseDOM && onCloseFocusId) {
      const anchor = document.querySelector(`#${onCloseFocusId}`);
      if (anchor) {
        anchor.focus();
      }
    }
  }

  buildChildProps(productItem, labels) {
    const productThumbnail = {
      productItem,
      labels,
      onClickProductDetailsLogGA: this.onClickProductThumbnailDetailsLogGA
    };

    const productDetails = {
      productItem,
      labels,
      disableBizaarVoice: true
    };

    const additionalDetails = {
      labels,
      promoMessage: productItem.promoMessage,
      shippingMessage: productItem.shippingMessage,
      price: productItem.price
    };

    const attributesAndSizes = {
      productItem,
      labels,
      updateProductItem: this.onUpdateProductItem,
      quickView: true,
      trueFit: false,
      onClickSwatchLogGA: this.onClickAttributesSwatchLogGA,
      onClickSeeMoreColorsLogGA: this.onClickAttributesSeeMoreColorsLogGA,
      disableSizeChart: true
    };

    const productActionItems = {
      productItem,
      labels,
      notification: false,
      onClickIncrementQuantityLogGA: this.onClickIncrementQuantityLogGA,
      onClickDecrementQuantityLogGA: this.onClickDecrementQuantityLogGA,
      onRequestOpenAddToCartModal: this.onRequestOpenAddToCartModal,
      onRequestCloseAddToCartModal: this.onRequestCloseAddToCartModal,
      showSeeDetailsOnDisableAddToCart: true,
      isQuickView: true,
      forceSeeDetails: this.hasInventoryRequestError()
    };

    return { productThumbnail, productDetails, additionalDetails, attributesAndSizes, productActionItems }; // eslint-disable-line object-curly-newline
  }

  hasInventoryRequestError() {
    return !!this.props.errorInventoryRequest;
  }

  renderModelContent() {
    const { productItem } = this.state;
    const { labels, error } = this.props;

    if (error) {
      return (
        <div className="row">
          <ErrorModalContent onClickContinueShopping={this.props.fnCloseModal} seoURL={this.props.seoURL} />
        </div>
      );
    }

    if (!productItem) {
      return (
        <div className="row">
          {/* <Loader /> */}
          <Spinner />
        </div>
      );
    }

    const childProps = this.buildChildProps(productItem, labels);

    return (
      <div className="row my-6 mx-4">
        <div className="col-sm-4 pl-0">
          <div className="col-sm-12 pb-3 pl-0 center">
            <ProductThumbnail {...childProps.productThumbnail} />
          </div>
        </div>
        <div className="col-sm-8 pl-4 pr-0">
          <div className="col-sm-12 pb-2 pr-0">
            <ProductDetails auid="pg-pd" {...childProps.productDetails} />
          </div>
          <div className="col-sm-12 pb-1 pr-0">
            <ProductAdditionalDetails {...childProps.additionalDetails} />
          </div>
          <div className="col-sm-12 pb-2 pr-0">
            <ProductAttributesAndSizes {...childProps.attributesAndSizes} />
          </div>
          <div className="col-sm-12 pb-2 pr-0">
            <ProductActionItems {...childProps.productActionItems} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { open, error } = this.props;
    const computedOverlayStyle = this.state.hideWithCss
      ? css`
          ${Overlay};
          display: none;
        `
      : Overlay;
    const computedContentStyles = error ? ContentNarrow : ContentWide;
    return (
      <Responsive minWidth={768}>
        <Modal
          isOpen={open}
          overlayClassName={computedOverlayStyle}
          className={computedContentStyles}
          onRequestClose={this.onRequestClose}
          shouldCloseOnOverlayClick
          ariaHideApp={false}
        >
          <div className="container">
            <div className="row">
              <CloseButton onClick={this.onRequestClose}>
                <CloseIcon className={cx('academyicon', 'icon-close')} aria-hidden="true" />
              </CloseButton>
            </div>
            {this.renderModelContent()}
          </div>
        </Modal>
      </Responsive>
    );
  }
}
QuickView.propTypes = {
  cms: PropTypes.object.isRequired,
  gtmDataLayer: PropTypes.array,
  product: PropTypes.object,
  seoURL: PropTypes.string,
  error: PropTypes.object,
  open: PropTypes.bool,
  fnCloseModal: PropTypes.func.isRequired,
  analyticsConfig: PropTypes.object,
  labels: PropTypes.object,
  onCloseFocusId: PropTypes.string
};

QuickView.defaultProps = {
  analyticsConfig: { event: 'plpPageClicks', eventCategory: 'PLP Page Clicks' }
};

const mapStateToProps = state => ({ gtmDataLayer: state.gtmDataLayer, ...state.quickView });
const mapDispatchToProps = dispatch => ({
  fnCloseModal: () => dispatch(closeModal())
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const QuickViewContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(QuickView);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <QuickViewContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(QuickView);
