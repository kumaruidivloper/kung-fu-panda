import { productsAPI } from '@academysports/aso-env';
import Button from '@academysports/fusion-components/dist/Button';
import ProductCard from '@academysports/fusion-components/dist/ProductCard';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';

import { NODE_TO_MOUNT, DATA_COMP_ID, SORT_BY_OPTIONS, PRICE_H_L, PRICE_L_H, DEFAULT, HOT_MARKET_PARAM } from './constants';
import { openModalForProductId as openQuickView } from '../quickView/actions';
import Select from '../select/select.component';
import { hotMarketCta, hotMarketMobileContainer, hotMarketMobileDropdown, hotMarketMobileSpaces, mobileDropdownDiv } from './styles';

class HotMarket extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: [], // api.mockResponse
      defaultProducts: [],
      productIds: this.props.cms.prodIds.map(product => product).join()
    };
    this.getProducts = this.getProducts.bind(this);
    this.productList = this.productList.bind(this);
    this.sortByOnSelect = this.sortByOnSelect.bind(this);
    this.analyticsData = this.analyticsData.bind(this);
  }

  componentDidMount() {
    this.getProducts();
  }

  /**
   * Get product list
   */
  getProducts() {
    axios
      .get(`${productsAPI}${this.state.productIds}${HOT_MARKET_PARAM}`)
      .then(response => {
        this.setState({
          products: response.data.productinfo || [],
          defaultProducts: response.data.productinfo || []
        });
      })
      .catch(err => err);
  }

  /**
   * Push hot market analytics
   * @param {object} e - Event object
   * @param {string} linkname - Link name
   * @param {string} linkURL - Link URL
   */
  analyticsData(e) {
    const { ctaLabel, ctaLink, eventAction } = this.props.cms;
    e.preventDefault();
    this.props.gtmDataLayer.push({
      event: 'hotMarketContentClicks',
      eventCategory: 'hot market content clicks',
      eventAction: eventAction || 'hotmarket',
      eventLabel: `${ctaLabel}`.toLowerCase()
    });
    if (ExecutionEnvironment.canUseDOM) {
      window.location = `${ctaLink}`;
    }
  }

  /**
   * Push product card analytics
   * @param {string} productName - Product name
   */
  pushCardAnalytics(productName) {
    this.props.gtmDataLayer.push({
      event: 'hotMarketContentClicks',
      eventCategory: 'hot market content clicks',
      eventAction: 'Product Detail',
      eventLabel: productName.toLowerCase()
    });
  }
  productList(products) {
    return products
      ? products.map(prod => {
          const manufacturer = Array.isArray(prod.manufacturer) ? prod.manufacturer[0] : prod.manufacturer;
          const { imageURL, ...rest } = { ...prod };
          const productdetails = {
            imageURL: `${imageURL}?wid=150&hei=150`,
            ...rest,
            ...{ manufacturer }
          };
          const onClickQuickView = () => {
            this.props.fnOpenQuickView(prod.id, productdetails.seoURL);
          };
          return (
            <ProductCard
              cardAnalytics={() => this.pushCardAnalytics(productdetails.name)}
              classes="col-12 col-md-3"
              cardType="hold240"
              key={productdetails.id}
              tabIndex={0}
              product={productdetails}
              imageSmall
              horizontalMobile
              enableQuickView={!!this.props.quickView}
              onClickQuickView={onClickQuickView}
              auid={`hotMarketCard_${prod.id}`}
              badge={prod.adBug ? prod.adBug[0] : ''}
              gtmDataLayer={this.props.gtmDataLayer}
              promoMessage={prod.promoMessage ? prod.promoMessage : ''}
            />
          );
        })
      : '';
  }
  sortByOnSelect(item) {
    const { value } = item;
    const filteredProducts = this.state.defaultProducts.slice(0);
    filteredProducts.sort((a, b) => {
      const listPriceA = a.defaultSkuPrice.listPrice;
      const listPriceB = b.defaultSkuPrice.listPrice;
      if (value === PRICE_L_H) {
        return listPriceA - listPriceB;
      } else if (value === PRICE_H_L) {
        return listPriceB - listPriceA;
      }
      return false;
    });
    this.setState({ products: filteredProducts.splice(0) });
  }
  render() {
    const { cms } = this.props;
    return (
      <div className={`container ${hotMarketMobileContainer}`}>
        <div className="row mt-md-5 mb-md-2 mb-1 align-items-center">
          <div className={`${mobileDropdownDiv} d-md-none col-12 py-2 ${hotMarketMobileSpaces}`}>
            <select
              title="hotMarketMobileDropdown"
              className={hotMarketMobileDropdown}
              onChange={e => this.sortByOnSelect({ value: e.target.value })}
              defaultValue={DEFAULT}
            >
              {/** we have to replace options with sortbyData  */}
              {SORT_BY_OPTIONS &&
                SORT_BY_OPTIONS.map(sortby => (
                  <option value={sortby.value} key={sortby.value}>
                    {sortby.label}
                  </option>
                ))}
            </select>
            <i className="academyicon icon-chevron-down" />
          </div>
          <div className="d-none row d-md-flex col-md-4 order-md-2 ml-md-auto align-items-center">
            <div className="col-3 o-copy__16reg">SortBy</div>
            <div className="col-9">
              <Select onSelect={this.sortByOnSelect} options={SORT_BY_OPTIONS} selectedItem={SORT_BY_OPTIONS[0]} />
            </div>
          </div>
          <div className={`col-12 col-md-2 order-md-1 py-2 py-md-none ${hotMarketMobileSpaces}`}>{`${cms.prodIds.length} Items`}</div>
        </div>
        <div className="row justify-content-center">{this.productList(this.state.products)}</div>
        <div className="row justify-content-center mb-6 mt-3">
          <Button
            auid="hotMarketCtaLink"
            target={cms.ctaTarget}
            onClick={this.analyticsData}
            className={`d-flex justify-content-center align-items-center col-10 col-md-3 p-0 o-copy__14bold ${hotMarketCta}`}
          >
            {cms.ctaLabel}
          </Button>
        </div>
      </div>
    );
  }
}

HotMarket.propTypes = {
  cms: PropTypes.object.isRequired,
  gtmDataLayer: PropTypes.array,
  quickView: PropTypes.object,
  fnOpenQuickView: PropTypes.func
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer,
  quickView: state.quickView
});
const mapDispatchToProps = dispatch => ({
  fnOpenQuickView: (productId, seoURL) => dispatch(openQuickView(productId, seoURL))
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const HotMarketContainer = compose(withConnect)(HotMarket);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <HotMarketContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(HotMarket);
