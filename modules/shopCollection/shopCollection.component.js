// It return the latest shop collection options.
// It uses bootstrap class like d-flex and emotionjs styling.
import { productsAPI } from '@academysports/aso-env';
import Link from '@academysports/fusion-components/dist/Link';
import ProductCard from '@academysports/fusion-components/dist/ProductCard';
import axios from 'axios';
import classNames from 'classnames';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Swiper from 'react-id-swiper';
import { connect, Provider } from 'react-redux';

import axiosSsr from '../../../axios-ssr';
import { enhancedAnalyticsPromoClick } from '../../utils/analytics';
import { DATA_COMP_ID, NODE_TO_MOUNT } from './constants';
import RootContainer, * as Styles from './styles';

const defaultcms = {
  collectionName: 'ACADEMY EXCLUSIVE',
  brandCollectionName: 'WENZEL CAMPING COLLECTION',
  callOut: 'FIND YOUR WILDERNEST',
  cta: 'Shop collection',
  collectionNameBackgroundColor: '#0055a6',
  textColor: '#ffffff'
};
class ShopCollection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.cms = { ...defaultcms, ...this.props.cms };
    this.renderCta = this.renderCta.bind(this);
    this.generateProductCards = this.generateProductCards.bind(this);
    this.renderProductGrid = this.renderProductGrid.bind(this);
    this.getProductInfo = this.getProductInfo.bind(this);
    this.pushAnalyticsData = this.pushAnalyticsData.bind(this);
    this.state = {
      productInfo: props.api && props.api.productinfo ? props.api.productinfo : [] // check to fectch data in SSR scenario
    };
  }

  // componentWillMount() {
  //   this.getProductInfo();
  // }

  getProductInfo() {
    const { cms } = this;
    const requestURL = `${productsAPI}${cms.productId1},${cms.productId2},${cms.productId3}&summary=true`;
    axios.get(requestURL).then(response => {
      this.setState({ productInfo: response.data.productinfo || [] });
    });
  }

  /**
   * This function parses the params and initiate the API call for SSR
   * @param {Object} params The parameters object received from node
   */
  static getInitialProps(params) {
    const envBase = params.env.API_HOSTNAME;
    const ssrProdUrl = `${envBase}${productsAPI}${params.cms.productId1},${params.cms.productId2},${params.cms.productId3}&summary=true`;
    return axiosSsr.get(ssrProdUrl, {
      params: {
        correlationId: params.correlationId,
        trueClientIp: params.trueClientIp,
        userAgent: params.userAgent
      }
    });
  }

  /**
   * @description pushes analytics data on cta button click
   * @param {Event} e - Passing event parameter.
   * @param {String} cta - Passing Text to show on button
   * @param {String} collectionName - Passing Collections name Text.
   * @param {String} ctaUrl - Passing Onclick URL.
   */
  pushAnalyticsData(e, cta, collectionName, ctaUrl) {
    e.preventDefault();
    const { cms, gtmDataLayer, pageInfo } = this.props;
    if (gtmDataLayer) {
      const collectionNameLabel = collectionName && collectionName.toLowerCase();
      const ctaLabel = cta && cta.toLowerCase();
      const eventURL = pageInfo && pageInfo.seoURL;
      enhancedAnalyticsPromoClick(gtmDataLayer, cms, eventURL);
      gtmDataLayer.push({
        event: 'shopbyCollection',
        eventCategory: 'shop by collection',
        eventAction: collectionNameLabel,
        eventLabel: ctaLabel
      });
    }
    if (ExecutionEnvironment.canUseDOM) {
      window.location = `${ctaUrl}`;
    }
  }
  /**
   * push the shopCollection product card analytics
   * @param {string} productName - name of the product
   * @memberof ShopCollection
   */
  pushCardAnalytics(productName) {
    const { page } = this.props.pageInfo;
    this.props.gtmDataLayer.push({
      event: 'productCardClicks',
      eventCategory: `${page}|product card clicks`,
      eventAction: `product card|${productName && productName.toLowerCase()}`,
      eventLabel: 'academy'
    });
  }

  /**
   * Method renders the  flexgrid of  product cards to be shown on the shop collection component
   * Cards become a carousel in mobile devices.
   */
  generateProductCards() {
    return this.state.productInfo.map(product => {
      const { imageURL, ...rest } = { ...product };
      const manufacturer = Array.isArray(product.manufacturer) ? product.manufacturer[0] : product.manufacturer;

      const modifiedProduct = {
        imageURL: `${imageURL}?wid=250&hei=250`,
        ...rest,
        ...{ manufacturer }
      };
      return (
        <ProductCard
          cardAnalytics={() => this.pushCardAnalytics(modifiedProduct.name)}
          classes="col-8 col-sm-6 col-md-4 d-flex justify-content-center swiper-slide sc-product-card"
          product={modifiedProduct}
          rating={product.bvRating}
          key={product.id}
        />
      );
    });
  }

  // Generates click tracking links
  renderCta() {
    const { cms } = this;
    return cms.ctaUrl ? (
      /* istanbul ignore onclick */
      <Link
        auid="btn1"
        btnvariant="tertiary"
        className={`${Styles.buttonContainer} ${Styles.buttonText}`}
        onClick={e => this.pushAnalyticsData(e, cms.cta, cms.collectionName, cms.ctaUrl)}
        href={cms.ctaUrl}
      >
        {cms.cta}
      </Link>
    ) : (
      <Link type="button" href="button" auid="btn2" className={`${Styles.buttonContainer} ${Styles.buttonText}`}>
        {cms.cta}
      </Link>
    );
  }

  /**
   * Converts the shopcollection cards into a carousel
   */
  renderCarousel() {
    const mobileSliderSettings = {
      slidesPerView: 'auto',
      spaceBetween: 0
    };
    return (
      <section className={Styles.mobileContainer}>
        <Swiper {...mobileSliderSettings}>{this.generateProductCards()}</Swiper>
      </section>
    );
  }

  renderProductGrid() {
    return (
      <React.Fragment>
        <div className="d-block d-md-none w-100">{this.renderCarousel()}</div>
        <div className="d-none d-md-block container">
          <div className="row">{this.generateProductCards()}</div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { cms } = this;
    const { bottomPadding, topPadding } = { cms };
    const componentPaddings = Styles.getPaddings(topPadding, bottomPadding);
    return (
      <div className={classNames(`c-promo-impression-tracking shop-collection ${RootContainer} ${componentPaddings}`)}>
        <div
          className={Styles.getBackgroundStyles({
            mobile: cms.backgroundMobileImage,
            desktop: cms.backgroundDesktopImage
          })}
          role="img"
          aria-label={cms.imageAltText}
        />
        <Styles.collectionNameDiv {...cms}>
          <div className={`o-copy__20bold ${Styles.collectionNameText(cms.textColor)}`}>{cms.collectionName}</div>
        </Styles.collectionNameDiv>
        <div className={`o-copy__18reg ${Styles.brandCollectionNameText}`}>{cms.brandCollectionName}</div>
        <hr className={Styles.horizontalRule} />
        <h3 className={Styles.calloutText}>{cms.callOut}</h3>
        {this.renderCta()}
        {this.renderProductGrid()}
      </div>
    );
  }
}

ShopCollection.propTypes = {
  cms: PropTypes.object.isRequired,
  api: PropTypes.object,
  gtmDataLayer: PropTypes.object,
  pageInfo: PropTypes.object
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const ShopCollectionContainer = connect(mapStateToProps)(ShopCollection);
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ShopCollectionContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default ShopCollectionContainer;
