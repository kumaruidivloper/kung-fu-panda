import { productAPI } from '@academysports/aso-env';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import fetchJsonp from 'fetch-jsonp';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { css } from 'react-emotion';
import Storage from '../../utils/StorageManager';
import axiosSsr from '../../../axios-ssr';
import { SCENE7_DOMAIN_URL, SCENE7_META_DATA } from '../../../endpoints';
import BreadCrumb from '../../modules/breadCrumb/breadCrumb.component';
import NoDiffProductDetailedContent from '../../modules/noDiffProductDetailedContent/noDiffProductDetailedContent.component';
import ProductActionItems from '../../modules/productActionItems/productActionItems.component';
import ProductAdditionalDetails from '../../modules/productAdditionalDetails/productAdditionalDetails.component';
import ProductDetails from '../../modules/productDetails/productDetails.component';
import ProductMixedMedia from '../../modules/productMixedMedia';
import { getMixedMediaAssets } from '../../utils/dynamicMediaUtils';
import { getMixedMediaSwatchList } from '../../utils/productDetailsUtils';
import { COOKIE_STORE_ID, DATA_COMP_ID, NODE_TO_MOUNT } from './constants';
import { getProductItem } from './helpers';
import ProductMixedMediaSkeletonBox from '../../modules/productMixedMediaLoaderBox/productMixedMediaLoaderBox.component';
import { sizes } from '../../utils/media';
import { enhancedAnalyticsPDP } from '../../utils/analytics';
import { printBreadCrumb } from '../../utils/breadCrumb';

const containerWidth = css`
  @media (max-width: ${sizes.md}px) {
    max-width: 100%;
  }
`;

class ProductDetailsNoDifferentSelection extends PureComponent {
  constructor(props) {
    super(props);
    const { api, pageInfo } = props;
    this.getProductId = this.getProductId.bind(this);
    this.state = {
      productItem: (api && getProductItem(api, pageInfo)) || null,
      isStoreSelected: false,
      isMounted: false
    };
    this.onClickIncrementQuantityLogGA = this.onClickIncrementQuantityLogGA.bind(this);
    this.onClickDecrementQuantityLogGA = this.onClickDecrementQuantityLogGA.bind(this);
  }

  componentDidMount() {
    const { productItem } = this.state;
    const { gtmDataLayer } = this.props;
    if (productItem) {
      this.getMixedMediaSetData(productItem);
      enhancedAnalyticsPDP({ gtmDataLayer, productItem });
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

  /**
   * Method to query mixed media set from scene7 server
   * if multiMediaSetName exists makes the call and update productItem
   * else set the productItem from API
   */
  getMixedMediaSetData = productItem => {
    const { multiMediaSetName } = productItem || {};
    if (multiMediaSetName) {
      fetchJsonp(`${SCENE7_DOMAIN_URL}${SCENE7_META_DATA}${multiMediaSetName}?req=set,json`, {
        jsonpCallbackFunction: 's7jsonResponse'
      })
        .then(response => response.json())
        .then(json => {
          this.setProductItem({
            ...productItem,
            mixedMediaMetaData: json
          });
        })
        .catch(ex => {
          console.error('parsing failed', ex);
          this.setProductItem(productItem);
        });
    } else {
      this.setProductItem(productItem);
    }
  };

  setProductItem = productItem =>
    this.setState({
      productItem,
      isMounted: true
    });

  getSelectedStore() {
    if (Storage.getCookie(COOKIE_STORE_ID)) {
      const storeId = Storage.getCookie(COOKIE_STORE_ID);
      this.setState({
        isStoreSelected: true
      });
      return storeId.length > 3 ? `?storeId=${storeId}` : `?storeId=0${storeId}`;
    }
    return '';
  }

  getProductId = (pageInfo, cmsPageInfo) => {
    let productId = '';
    if (pageInfo && pageInfo.productId) {
      const { productId: productIdPageInfo } = pageInfo;
      productId = productIdPageInfo;
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
    const { pageInfo, cmsPageInfo, env } = params;
    const envBase = env.API_HOSTNAME;
    let productId = '';
    if (pageInfo && pageInfo.productId) {
      const { productId: productIdPageInfo } = pageInfo;
      productId = productIdPageInfo;
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

    return <ProductMixedMediaSkeletonBox isMobile swatchList={swatchImgList} />;
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
    const { productItem } = this.state;
    const { messages, labels } = this.props;

    if (!productItem) {
      return null;
    }

    const { promoMessage, shippingMessage, productPrice, breadCrumb, name, swatchImgList, mixedMediaMetaData } = productItem;

    const price = productPrice;

    const breadCrumbProps = {
      breadCrumbs: { breadCrumb: breadCrumb || [], name },
      isCSR: true
    };

    const additionalDetailsProps = {
      promoMessage,
      shippingMessage,
      price
    };

    const { videoAssetName, imageList } = getMixedMediaAssets(mixedMediaMetaData);

    return (
      <Fragment>
        <div className={`container pdpNoDiffContainer ${containerWidth}`}>
          <div className="pb-3">
            <BreadCrumb {...breadCrumbProps} />
          </div>
          <div className="row pr-0">
            <div className="col-12 d-none d-md-block col-md-6">
              {this.renderMixedMedia(swatchImgList, imageList, name, videoAssetName, productItem)}
            </div>
            <div className="col-12 col-md-6">
              <div>
                <ProductDetails auid="pg-pd" isNoDiffBundle productItem={productItem} labels={labels} />
              </div>
              <div className="row">
                <div className="col-12 d-block d-md-none col-md-6 pb-2 pb-md-5">
                  {this.renderMixedMediaMobile(swatchImgList, imageList, name, videoAssetName, productItem)}
                </div>
              </div>
              <div className="pt-md-3">
                <ProductAdditionalDetails {...additionalDetailsProps} />
              </div>
              <div>
                <div className="pt-md-3">
                  <ProductActionItems
                    productItem={productItem}
                    isStoreSelected={this.state.isStoreSelected}
                    authMsgs={messages}
                    NoDiffDisableATC={productItem && productItem.allUnitsInStock}
                    isNoDiffBundle
                    labels={labels}
                    onClickIncrementQuantityLogGA={this.onClickIncrementQuantityLogGA}
                    onClickDecrementQuantityLogGA={this.onClickDecrementQuantityLogGA}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 pt-md-5 pb-3 pb-md-5">
              <NoDiffProductDetailedContent productItem={productItem} labels={labels} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

ProductDetailsNoDifferentSelection.propTypes = {
  api: PropTypes.object,
  pageInfo: PropTypes.object,
  cmsPageInfo: PropTypes.object,
  isCSR: PropTypes.bool,
  messages: PropTypes.object,
  labels: PropTypes.object,
  gtmDataLayer: PropTypes.array
};

ProductDetailsNoDifferentSelection.defaultProps = {
  gtmDataLayer: []
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const withConnect = connect(mapStateToProps);

if (ExecutionEnvironment.canUseDOM) {
  const ProductDetailsNoDifferentSelectionContainer = withConnect(ProductDetailsNoDifferentSelection);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ProductDetailsNoDifferentSelectionContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ProductDetailsNoDifferentSelection);
