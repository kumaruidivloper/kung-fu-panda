import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { productAPI } from '@academysports/aso-env';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import ProductDetailsMultiSku from '../../modules/productDetailsMultiSku/productDetailsMultiSku.component';
import axiosSsr from '../../../axios-ssr';
import { forcePageToRenderAtTop } from '../../utils/scroll';

class ProductDetailsMultiSkuPackage extends React.PureComponent {
  componentDidMount() {
    forcePageToRenderAtTop();
  }

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

  render() {
    return (
      <Provider store={window.store}>
        <ProductDetailsMultiSku {...this.props} />
      </Provider>
    );
  }
}

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ProductDetailsMultiSkuPackage {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ProductDetailsMultiSkuPackage;
