import { inventoryApi, productAPI } from '@academysports/aso-env';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import fetchJsonp from 'fetch-jsonp';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';
import { reducer as formReducer } from 'redux-form';

import axiosSsr from '../../../axios-ssr';
import { SCENE7_DOMAIN_URL, SCENE7_META_DATA } from '../../../endpoints';
import BreadCrumb from '../../modules/breadCrumb/breadCrumb.component';
import HigherOrder from '../../modules/higherOrder/higherOrder.component';
import ProductActionItems from '../../modules/productActionItems/productActionItems.component';
import ProductAdditionalDetails from '../../modules/productAdditionalDetails/productAdditionalDetails.component';
import ProductAttributesAndSizes from '../../modules/productAttributesAndSizes/productAttributesAndSizes.component';
import ProductCustomerPhoto from '../../modules/productCustomerPhoto/productCustomerPhoto.component';
import ProductDetailedContent from '../../modules/productDetailedContent/productDetailedContent.component';
import ProductDetails from '../../modules/productDetails/productDetails.component';
import ProductMixedMedia from '../../modules/productMixedMedia';
import ProductMixedMediaSkeletonBox from '../../modules/productMixedMediaLoaderBox/productMixedMediaLoaderBox.component';
import { enhancedAnalyticsPDP } from '../../utils/analytics';
import { printBreadCrumb } from '../../utils/breadCrumb';
import { getMixedMediaAssets } from '../../utils/dynamicMediaUtils';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import {
  generatePDPLink,
  getInventoryMessage,
  getMixedMediaSwatchList,
  getProductItem,
  getStoreMessage,
  hasStoreChanged
} from '../../utils/productDetailsUtils';
import Storage from '../../utils/StorageManager';
import { COOKIE_STORE_ID, DATA_COMP_ID, NODE_TO_MOUNT } from './constants';
import { saveProductItem, updateProductInventory } from './store/actions';
import reducer from './store/reducers';
import saga from './store/sagas';
import { forcePageToRenderAtTopPDP } from '../../utils/scroll';
import { updateStore } from '../../utils/storeUtils';

// import AnimationWrapper from './animationWrapper';
const wordWrap = {
  wordWrap: 'break-word'
};

class ProductDetailsGeneric extends PureComponent {
  constructor(props) {
    super(props);
    const { pageInfo, api, isCSR } = this.props;
    this.getProductId = this.getProductId.bind(this);
    this.state = {
      isStoreSelected: false,
      productItem: !isCSR && getProductItem(api, pageInfo),
      isMounted: false,
      inventoryLoaded: false,
      ayorterm: null
    };
    this.onClickIncrementQuantityLogGA = this.onClickIncrementQuantityLogGA.bind(this);
    this.onClickDecrementQuantityLogGA = this.onClickDecrementQuantityLogGA.bind(this);
  }

  /**
   * Lazy loading of inventory api calls here after the component mounts
   * getProductItem initiation will be changed, based on CSR true/false.
   * If CSR is true then wait for the product API response to be resolved.
   */

  componentDidMount() {
    forcePageToRenderAtTopPDP();
    const { cms, pageInfo, isCSR } = this.props;
    if (isCSR) {
      this.constructor.getInitialProps({ cms, pageInfo, env: { API_HOSTNAME: '' } }).then((resp = {}) => {
        this.setState(
          {
            productItem: getProductItem(resp.data, pageInfo)
          },
          () => {
            this.constructPdpData();
          }
        );
      });
    } else {
      this.constructPdpData();
    }
  }
  /**
   * Make inventory api request whenever store changes
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps = {}) {
    const { productItem } = this.state;
    const { findAStore } = prevProps;
    const { findAStore: currentFindAStore } = this.props;
    const storeUpdated = hasStoreChanged(findAStore, currentFindAStore);
    const { getMystoreDetails: { bopisEligible } = {} } = currentFindAStore;
    if (storeUpdated) {
      this.getInventoryMessages(productItem, this.getSelectedStore(), bopisEligible);
    }
  }

  onClickIncrementQuantityLogGA(product) {
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|quantity added',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }

  onClickDecrementQuantityLogGA(product) {
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|quantity removed',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }

  getAyorterm() {
    if (ExecutionEnvironment.canUseDOM) {
      const hasAyortermInURL = window.location.hash.split('ayorterm=');
      if (hasAyortermInURL && hasAyortermInURL[1]) {
        this.setState({
          ayorterm: decodeURIComponent(hasAyortermInURL[1])
        });
      }
    }
    return null;
  }

  getAyortermValue() {
    const { messages = {} } = this.props;
    const { ayorterm } = this.state;
    return messages.SEARCH_AYOTERM_REDIRECT_PDP && messages.SEARCH_AYOTERM_REDIRECT_PDP.replace(/%SEARCHTERM%/g, ayorterm);
  }

  /**
   * Method to query mixed media set from scene7 server
   * if multiMediaSetName exists makes the call and update productItem
   * else set the productItem from API
   */
  getMixedMediaSetData = (productItem, makeInventoryAPICall = true) => {
    const { multiMediaSetName } = productItem || {};
    if (multiMediaSetName) {
      fetchJsonp(`${SCENE7_DOMAIN_URL}${SCENE7_META_DATA}${multiMediaSetName}?req=set,json`, {
        jsonpCallbackFunction: 's7jsonResponse'
      })
        .then(response => response.json())
        .then(json => {
          this.setProductItem(
            {
              ...productItem,
              mixedMediaMetaData: json
            },
            makeInventoryAPICall
          );
        })
        .catch(ex => {
          console.error('parsing failed', ex);
          this.setProductItem(productItem, makeInventoryAPICall);
        });
    } else {
      this.setProductItem(productItem, makeInventoryAPICall);
    }
  };

  setProductItem = (productItem, makeInventoryAPICall) =>
    this.setState(
      {
        productItem,
        isMounted: true
      },
      () => {
        if (makeInventoryAPICall) {
          const { findAStore } = this.props;
          const { getMystoreDetails: { bopisEligible } = {} } = findAStore;
          this.getInventoryMessages(productItem, this.getSelectedStore(), bopisEligible);
        }
      }
    );

  /**
   * Fix to lazy load inventory
   */
  getInventoryMessages = (productItem, storeSelectedFromCookie, bopisEligible = '') => {
    if (productItem) {
      const { inventory, skuId } = productItem;
      const { pageInfo, cmsPageInfo, getStoreId, labels: { bopisEnabled = false } = {} } = this.props;
      const storeId = getStoreId || storeSelectedFromCookie;
      const bopisValue = bopisEnabled === 'true' ? bopisEligible : 0;
      const derivedBopisEligibility = storeId && bopisValue.toString().trim().length ? bopisValue : '';
      /** Added fallback, if bopisEnabled is not present */
      const query = `${inventoryApi}?productId=${this.getProductId(
        pageInfo,
        cmsPageInfo
      )}&storeId=${storeId}&storeEligibility=${derivedBopisEligibility}&bopisEnabled=${bopisEnabled}`;

      if (storeId) {
        updateStore(storeId);
      }

      axios
        .get(`${query}`)
        .then(response => {
          const inventoryNext = response.data || inventory;
          const newProductItem = {
            ...productItem,
            inventoryMessage: getInventoryMessage(inventoryNext, skuId),
            storeInventory: getStoreMessage(inventoryNext, skuId),
            inventory: inventoryNext
          };
          this.setState({
            productItem: newProductItem,
            isStoreSelected: storeId,
            isMounted: true,
            inventoryLoaded: true
          });
        })
        .catch(() => {
          // This update to make sure even if inventory api call fails continue to work with inventory from product API
          this.setState({
            inventoryLoaded: true
          });
        });
    }
  };

  getSelectedStore = () => {
    const storeId = Storage.getCookie(COOKIE_STORE_ID);
    if (storeId && storeId !== 'undefined') {
      return storeId;
    }
    return '';
  };

  getProductId = (pageInfo, cmsPageInfo) => {
    let productId = '';
    if (pageInfo && pageInfo.productId) {
      const { productId: productIdPageInfo } = pageInfo;
      productId = productIdPageInfo;
    } else if (this.props.cms && this.props.cms.targetPreviewId) {
      productId = this.props.cms.targetPreviewId;
    } else if (cmsPageInfo) {
      const { previewId } = cmsPageInfo;
      productId = previewId;
    }
    return productId;
  };

  static getInitialProps(params) {
    if (params.pageInfo && params.pageInfo.api) {
      return Promise.resolve({ data: params.pageInfo.api });
    }
    const { pageInfo, cmsPageInfo, env, cms } = params;
    const envBase = env.API_HOSTNAME;
    let productId = '';
    if (pageInfo && pageInfo.productId) {
      const { productId: productIdPageInfo } = pageInfo;
      productId = productIdPageInfo;
    } else if (cms.targetPreviewId) {
      productId = cms.targetPreviewId;
    } else if (cmsPageInfo) {
      const { previewId } = cmsPageInfo;
      productId = previewId;
    }
    const ssrprodUrl = `${envBase}${productAPI}${productId}`;
    return axiosSsr.get(ssrprodUrl, {
      params: {
        correlationId: params.correlationId,
        trueClientIp: params.trueClientIp,
        userAgent: params.userAgent
      }
    });
  }
  /**
   * This method will be called for both SSR and CSR API response.
   * In this method we will be intitiating Inventory Messages, Mixed Media Set and Ayorterm message.
   */
  constructPdpData() {
    const { productItem } = this.state;
    const { gtmDataLayer } = this.props;
    let enhancedAnalytics = { ...productItem };
    if (productItem.isGiftCard && productItem.gcAmounts && productItem.isGiftCard === 'Y') {
      const price = { ...productItem.price, salePrice: productItem.gcAmounts[0] };
      enhancedAnalytics = { ...productItem, price };
    }
    if (gtmDataLayer) {
      enhancedAnalyticsPDP({ gtmDataLayer, productItem: enhancedAnalytics });
    }
    this.getMixedMediaSetData(productItem);
    this.getAyorterm();
  }

  handleUpdateProductItem = productItem => {
    // this.props.fnSaveProductItem(productItem);
    this.setState({
      productItem
    });
    this.updatePDPURL(productItem);
  };

  updatePDPURL(productItem) {
    const newUrl = generatePDPLink(productItem);
    if (ExecutionEnvironment.canUseDOM) {
      window.history.replaceState(null, null, newUrl);
    }
  }

  /**
   * Method to render mixed media for different view port
   */
  renderMixedMedia = (swatchImgList, imageList, name, videoAssetName, productItem) => {
    const { isMounted } = this.state;
    if (isMounted) {
      return (
        <ProductMixedMedia
          {...getMixedMediaSwatchList(swatchImgList, imageList, name)}
          videoAssetName={videoAssetName}
          productItem={productItem}
          name={name}
          isGiftCard={productItem.isGiftCard}
        />
      );
    }

    return <ProductMixedMediaSkeletonBox swatchList={swatchImgList} />;
  };

  /**
   * Method to render mixed media for different view port
   */
  renderMixedMediaMobile = (swatchImgList, imageList, name, videoAssetName, productItem) => {
    const { isMounted } = this.state;
    if (isMounted) {
      return (
        <ProductMixedMedia
          {...getMixedMediaSwatchList(swatchImgList, imageList, name)}
          videoAssetName={videoAssetName}
          productItem={productItem}
          name={name}
          isGiftCard={productItem.isGiftCard}
        />
      );
    }

    return <ProductMixedMediaSkeletonBox isMobile swatchList={swatchImgList} />;
  };

  render() {
    const { messages, labels, cms = {} } = this.props;
    const { productItem, isStoreSelected, inventoryLoaded, ayorterm } = this.state;
    const productId = this.getProductId(this.props.pageInfo, this.props.cmsPageInfo);
    let defaultOption;
    if (cms.productId) {
      if (cms.productId === productId) {
        defaultOption = cms.defaultOption ? parseInt(cms.defaultOption, 10) : 0;
      }
    } else {
      defaultOption = cms.defaultOption ? parseInt(cms.defaultOption, 10) : 0;
    }
    if (!productItem) {
      return null;
    }

    const {
      promoMessage,
      shippingMessage,
      shippingPrice,
      price,
      swatchImgList,
      breadCrumb,
      name,
      mixedMediaMetaData,
      ppuEnabled,
      ppuMessage,
      isGiftCard,
      partNumber
    } = productItem;

    const breadCrumbProps = {
      breadCrumbs: { breadCrumb: breadCrumb || [], name },
      isCSR: true
    };
    const additionalDetailsProps = {
      promoMessage,
      shippingMessage,
      shippingPrice,
      price,
      ppuEnabled,
      ppuMessage,
      isGiftCard
    };

    const attributesAndSizesProps = {
      productItem,
      updateProductItem: this.handleUpdateProductItem,
      messages
    };

    const { videoAssetName, imageList } = getMixedMediaAssets(mixedMediaMetaData);

    return (
      <Fragment>
        <div className="pb-1 pb-md-3">
          <BreadCrumb {...breadCrumbProps} disableContainer />
        </div>
        {ayorterm && (
          <div className="mb-1 o-copy__20reg" style={wordWrap}>
            <span>{this.getAyortermValue()}</span>
          </div>
        )}
        <div className="no-gutters row">
          <div className="col-12 d-none d-md-block col-md-6 pb-3 pb-md-5 pl-md-0 pr-md-2">
            {this.renderMixedMedia(swatchImgList, imageList, name, videoAssetName, productItem)}
          </div>
          <div className="col-12 col-md-6 pr-0 pl-md-2">
            <div className="pb-2 pb-md-3">
              <ProductDetails auid="pg-pd" productItem={productItem} labels={labels} />
            </div>
            <div className="row">
              <div className="col-12 d-block d-md-none col-md-6 pb-2 pb-md-5">
                {this.renderMixedMediaMobile(swatchImgList, imageList, name, videoAssetName, productItem)}
              </div>
            </div>
            {productItem.isGiftCard !== 'Y' && (
              <div className="pb-2 pb-md-3">
                <ProductAdditionalDetails {...additionalDetailsProps} labels={labels} />
              </div>
            )}
            <div>
              <ProductAttributesAndSizes {...attributesAndSizesProps} labels={labels} />
            </div>
            <div className="pb-3 pb-md-5">
              {inventoryLoaded && (
                <ProductActionItems
                  productItem={productItem}
                  isStoreSelected={isStoreSelected}
                  authMsgs={messages}
                  labels={labels}
                  fnUpdateProductInventory={this.props.fnUpdateProductInventory}
                  onClickIncrementQuantityLogGA={this.onClickIncrementQuantityLogGA}
                  onClickDecrementQuantityLogGA={this.onClickDecrementQuantityLogGA}
                />
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 pb-3 pb-md-4">
            <ProductDetailedContent productItem={productItem} labels={labels} defaultOption={defaultOption} />
            <ProductCustomerPhoto className="col-12 pb-3 pb-md-4" partNumber={partNumber} />
          </div>
        </div>
      </Fragment>
    );
  }
}

ProductDetailsGeneric.propTypes = {
  api: PropTypes.object,
  cms: PropTypes.object,
  pageInfo: PropTypes.object,
  cmsPageInfo: PropTypes.object,
  isCSR: PropTypes.bool,
  messages: PropTypes.object,
  labels: PropTypes.object,
  fnSaveProductItem: PropTypes.func,
  fnUpdateProductInventory: PropTypes.func,
  findAStore: PropTypes.object,
  productItem: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  partNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getStoreId: PropTypes.string
};

// todo: this needs to be removed while pushing to DEV server
ProductDetailsGeneric.defaultProps = {
  isCSR: true
};

const mapStateToProps = state => ({
  ...state.productDetailsGeneric,
  gtmDataLayer: state.gtmDataLayer,
  // findAStore: state.findAStoreModal,
  findAStore: state.findAStoreModalRTwo,
  getStoreId: state.findAStoreModal && state.findAStoreModal.getStoreId
});
const mapDispatchToProps = dispatch => ({
  fnSaveProductItem: data => dispatch(saveProductItem(data)),
  fnUpdateProductInventory: data => dispatch(updateProductInventory(data))
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
const withFormReducer = injectReducer({ key: 'form', reducer: formReducer });

if (ExecutionEnvironment.canUseDOM) {
  const ProductDetailsGenericContainer = compose(
    withReducer,
    withSaga,
    withConnect,
    withFormReducer
  )(ProductDetailsGeneric);
  const ProductDetailsGenericWrapped = HigherOrder(ProductDetailsGenericContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ProductDetailsGenericWrapped {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ProductDetailsGeneric);
