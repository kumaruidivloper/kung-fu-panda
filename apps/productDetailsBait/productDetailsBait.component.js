import { inventoryApi, productAPI } from '@academysports/aso-env';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';

import axiosSsr from '../../../axios-ssr';
import BaitAtc from '../../modules/baitAtc/baitAtc.component';
import BaitThumbnail from '../../modules/baitThumbnail/baitThumbnail.component';
import BaitVariant from '../../modules/baitVariant/baitVariant.component';
import BreadCrumb from '../../modules/breadCrumb/breadCrumb.component';
import ProductDetailedContent from '../../modules/productDetailedContent/productDetailedContent.component';
import ProductDetails from '../../modules/productDetails/productDetails.component';
import { getInventoryMessage, getProductItem, getStoreMessage } from '../../utils/productDetailsUtils';
import Storage from '../../utils/StorageManager';
import { COOKIE_STORE_ID, DATA_COMP_ID, NODE_TO_MOUNT } from './constants';
import { checkSuppressSubTotal, getDefaultSkuItem, groupRelatedProducts } from './helpers';
import { ProductDetailsBaitWrapper, PromoMessage } from './styles';
import { forcePageToRenderAtTop } from '../../utils/scroll';
import { enhancedAnalyticsPDP } from '../../utils/analytics';

class ProductDetailsBait extends React.PureComponent {
  constructor(props) {
    super(props);
    const { pageInfo, api } = this.props;
    const productItem = getProductItem(api, pageInfo);
    const { sKUs, productAttrGroups, productAttrCombinationGroups, defaultSku } = productItem;
    const products = groupRelatedProducts(sKUs, productAttrGroups, productAttrCombinationGroups);
    const { filtered, selectedIndex } = getDefaultSkuItem(products, defaultSku);
    const defaultProduct = filtered || (products && products.length > 0 && products[0]);
    const shouldSuppressSubTotal = checkSuppressSubTotal(sKUs);
    this.state = {
      productItem,
      selectedProduct: defaultProduct,
      itemDetails: this.getInitialItemDetails(products),
      products,
      selectedIndex,
      shouldSuppressSubTotal,
      shippingSLA: null,
      currentSelected: {}
    };
    this.getSelectedImage = this.getSelectedImage.bind(this);
    this.handleUpdateQuantity = this.handleUpdateQuantity.bind(this);
  }

  /**
   * Lazy loading of inventory api calls here after the component mounts
   */
  componentDidMount() {
    forcePageToRenderAtTop();
    const { productItem } = this.state;
    const { gtmDataLayer } = this.props;
    enhancedAnalyticsPDP({ gtmDataLayer, productItem });
    this.getInventoryMessages(productItem, this.getSelectedStore());
  }

  /**
   * Make inventory api request whenever store changes
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps = {}) {
    const { productItem } = this.state;
    const storeUpdated = this.hasStoreChanged(prevProps);
    if (storeUpdated) {
      this.getInventoryMessages(productItem, this.getSelectedStore());
    }
  }
  /**
   * Method to get initial itemDetails list
   * itemDetails used to display all the quantity cards
   */
  getInitialItemDetails = products => {
    const itemDetails = [];
    if (products) {
      products.forEach(({ list }) => list.forEach(listItem => itemDetails.push({ ...listItem, totalQty: 0 })));
    }
    return itemDetails;
  };

  /**
   * Fix to lazy load inventory.
   * Todo: Better place to relocate this logic using saga
   */
  getInventoryMessages = productItem => {
    if (productItem) {
      const { productId, inventory, skuId } = productItem;
      const store = this.getSelectedStore();

      axios
        .get(`${inventoryApi}?productId=${productId}&storeId=${store}&storeEligibility=`)
        .then(response => {
          const inventoryNext = response.data || inventory;
          const newProductItem = {
            ...productItem,
            inventoryMessage: getInventoryMessage(inventoryNext, skuId),
            storeInventory: getStoreMessage(inventoryNext, skuId),
            inventory: inventoryNext
          };
          this.setState({
            productItem: newProductItem
          });
        })
        .catch(error => console.error('Inventory API fails', error));

      axios
        .get(`/api/product/${productId}/shipping?selectedStore=${store || ''}`)
        .then(r => {
          if (r.status === 200 && r.data.shippingSLA) {
            this.setState({
              shippingSLA: r.data.shippingSLA
            });
          }
        })
        .catch(r => {
          console.error(r);
        });
    }
  };

  getSelectedStore() {
    if (Storage.getCookie(COOKIE_STORE_ID)) {
      const storeId = Storage.getCookie(COOKIE_STORE_ID);
      switch (storeId.length) {
        case 1:
          return `00${storeId}`;
        case 2:
          return `0${storeId}`;
        default:
          return storeId;
      }
    }
    return '';
  }

  getStoreNameFromFindAStore(findAStore = {}) {
    const { getMystoreDetails = {} } = findAStore;
    return getMystoreDetails.storeName;
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

  getSelectedImage(selectedProduct) {
    this.setState({ selectedProduct });
  }

  /**
   * Method to handle update quantity
   * this will add/update item details to make list of items.
   * @param {object} item
   */
  handleUpdateQuantity(item) {
    const { itemDetails, currentSelected } = this.state;
    const nextItemDetails = [];
    let currentSelectedItem = {
      ...currentSelected
    };
    itemDetails.forEach(row => {
      const { itemId } = row;
      if (itemId === item.itemId) {
        currentSelectedItem = item;
        nextItemDetails.push(item);
      } else {
        nextItemDetails.push(row);
      }
    });
    this.setState(() => ({
      itemDetails: nextItemDetails,
      resetFields: false,
      currentSelected: currentSelectedItem
    }));
  }

  hasStoreChanged(prevProps = {}) {
    const newStoreName = this.getStoreNameFromFindAStore(this.props.findAStore);
    const oldStoreName = this.getStoreNameFromFindAStore(prevProps.findAStore);
    if (!newStoreName || oldStoreName === newStoreName) return false;
    return true;
  }

  handleResetFields = resetFields => {
    const { products } = this.state;
    this.setState({
      resetFields,
      itemDetails: this.getInitialItemDetails(products)
    });
  };

  render() {
    const { itemDetails, productItem, selectedProduct, products, shouldSuppressSubTotal, resetFields, selectedIndex, currentSelected } = this.state;
    const { labels, cms = {}, messages, gtmDataLayer } = this.props;
    const { defaultOption = 0 } = cms;
    if (!productItem || productItem.length <= 0) {
      return null;
    }

    const { name, breadCrumb, promoMessage, shippingMessage } = productItem;

    const breadCrumbProps = {
      breadCrumbs: { breadCrumb, name },
      isCSR: true
    };

    const { imageURL } = selectedProduct;

    return (
      <ProductDetailsBaitWrapper>
        <div className="container pdp-container">
          <div className="pb-1 pb-md-3">
            <BreadCrumb {...breadCrumbProps} disableContainer />
          </div>
          <div className="row pb-3 justify-content-center">
            <div className="col-12 col-md-3 order-1 order-md-0 text-center pl-0 pr-md-2">
              <BaitThumbnail imageURL={imageURL} />
            </div>
            <div className="col-12 col-md-5 px-md-2 pb-2">
              <ProductDetails productItem={productItem} labels={labels} />
              {promoMessage && (
                <Fragment>
                  {' '}
                  {shippingMessage && <p>{shippingMessage}</p>}
                  <PromoMessage className="o-copy__14reg">{promoMessage}</PromoMessage>
                </Fragment>
              )}
            </div>
            <div className="col-12 col-md-4 p-0">
              <BaitAtc
                labels={labels}
                itemDetails={itemDetails}
                shouldSuppressSubTotal={shouldSuppressSubTotal}
                resetFields={resetFields}
                handleResetFields={this.handleResetFields}
                authMsgs={messages}
                productItem={productItem}
                currentSelected={currentSelected}
              />
            </div>
          </div>
          <BaitVariant
            productItem={productItem}
            labels={labels}
            selectedProduct={selectedProduct}
            getSelectedImage={this.getSelectedImage}
            handleUpdateQuantity={this.handleUpdateQuantity}
            products={products}
            resetFields={resetFields}
            selectedIndex={selectedIndex}
            itemDetails={itemDetails}
            messages={messages}
            shippingSLA={this.state.shippingSLA}
            gtmDataLayer={gtmDataLayer}
          />
          <div className="pb-md-3 order-3 order-md-3">
            <ProductDetailedContent defaultOption={defaultOption} isBait productItem={productItem} labels={labels} />
          </div>
        </div>
      </ProductDetailsBaitWrapper>
    );
  }
}

ProductDetailsBait.propTypes = {
  api: PropTypes.object,
  cms: PropTypes.object,
  pageInfo: PropTypes.object,
  cmsPageInfo: PropTypes.object,
  fnSaveProductItem: PropTypes.func,
  findAStore: PropTypes.object,
  isCSR: PropTypes.bool,
  labels: PropTypes.object,
  messages: PropTypes.object,
  gtmDataLayer: PropTypes.array
};

// todo: this needs to be removed while pushing to DEV server
ProductDetailsBait.defaultProps = {
  gtmDataLayer: []
};

const mapStateToProps = state => ({
  findAStore: state.findAStoreModal,
  gtmDataLayer: state.gtmDataLayer
});

const withConnect = connect(mapStateToProps);

if (ExecutionEnvironment.canUseDOM) {
  const ProductDetailsGenericContainer = withConnect(ProductDetailsBait);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ProductDetailsGenericContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ProductDetailsBait);
