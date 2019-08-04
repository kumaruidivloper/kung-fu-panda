import { productAPI, inventoryApi } from '@academysports/aso-env';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { enhancedAnalyticsPDP } from '../../utils/analytics';
import axiosSsr from '../../../axios-ssr';
import injectReducer from '../../utils/injectReducer';
import BreadCrumb from '../breadCrumb/breadCrumb.component';
import Bundle from './comps/Bundle';
import { hasNoStock } from './comps/helpers';
import { mobileStyles } from './comps/style';

class ProductDetailsMultiSku extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.api['product-info'],
      inventory: props.api.inventory,
      updated: false,
      noStock: false,
      inventoryAPIDone: false
    };
  }

  componentDidMount() {
    if (!this.state.updated) {
      axios
        .get(`${inventoryApi}`, {
          params: {
            productId: this.state.data.productinfo.id,
            storeId: ''
          },
          validateStatus: status => {
            if (status !== 200) {
              this.setState({ inventoryAPIDone: true });
            } else {
              return true;
            }
            return false;
          }
        })
        .then(r => {
          if (r) {
            const noStock = hasNoStock(r.data);
            if (hasNoStock) {
              this.setState({
                inventory: r.data,
                noStock,
                inventoryAPIDone: true
              });
            } else {
              this.setState({
                inventory: r.data,
                inventoryAPIDone: true
              });
            }
          }
        }, this.constructPdpData())
        .catch(() => {
          this.setState({ inventoryAPIDone: true });
        });
    }
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
  constructPdpData() {
    const { productinfo } = this.state.data;
    const { inventory } = this.state;
    const { gtmDataLayer } = this.props;
    const productItem = { ...productinfo, inventory };
    if (gtmDataLayer) {
      enhancedAnalyticsPDP({ gtmDataLayer, productItem });
    }
  }
  render() {
    const { breadCrumb, name } = this.props.api['product-info'].productinfo;
    const { messages, labels } = this.props;
    const isCSR = true;

    return (
      <div className={`m-wrapper ${mobileStyles}`}>
        <BreadCrumb breadCrumbs={{ breadCrumb, name }} isCSR={isCSR} />
        <Bundle
          {...this.state.data}
          {...this.state.inventory}
          noStock={this.state.noStock}
          inventoryAPIDone={this.state.inventoryAPIDone}
          gtmDataLayer={this.props.gtmDataLayer}
          authMsgs={messages}
          labels={labels}
        />
      </div>
    );
  }
}

ProductDetailsMultiSku.propTypes = {
  api: PropTypes.object,
  pageInfo: PropTypes.object,
  cms: PropTypes.object.isRequired,
  cmsPageInfo: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  isCSR: PropTypes.bool,
  labels: PropTypes.shape(),
  messages: PropTypes.object
};

ProductDetailsMultiSku.defaultProps = {
  isCSR: true
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const mapDispatchToProps = () => ({});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withFormReducer = injectReducer({ key: 'form', reducer: formReducer });
  const ProductDetailsMultiSkuContainer = compose(
    withConnect,
    withFormReducer
  )(ProductDetailsMultiSku);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ProductDetailsMultiSkuContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ProductDetailsMultiSku);
