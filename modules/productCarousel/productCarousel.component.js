import { productsAPI } from '@academysports/aso-env';
import ProductCard from '@academysports/fusion-components/dist/ProductCard';
import axios from 'axios';
import { cx } from 'emotion';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Swiper from 'react-id-swiper';
import { connect, Provider } from 'react-redux';

import axiosSsr from '../../../axios-ssr';
import { ANALYTICS_EVENT, ANALYTICS_EVENT_CATEGORY, ARROW_LEFT, ARROW_RIGHT, CAROUSEL_INDICATOR, DATA_COMP_ID, NODE_TO_MOUNT } from './constants';
import * as styles from './css';
import { enhancedAnalyticsPromoClick } from '../../utils/analytics';

class ProductCarousel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: props.api && props.api.productinfo ? props.api.productinfo : [], // check to fectch data in SSR scenario
      productIds: this.props.cms.productIDs.map(product => product.productId).join()
    };
    this.swiper = React.createRef();
    this.productList = this.productList.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.onClickAnalytics = this.onClickAnalytics.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goPrev = this.goPrev.bind(this);
  }

  /**
   * @description This is a function used to push analytics to gtmDataLayer. Returns nothing.
   * @param {string} an eventAction.
   * @param {string} an position - Slide number.
   */
  onClickAnalytics(eventAction, index) {
    const { cms, pageInfo } = this.props;
    this.props.gtmDataLayer.push({
      event: `${ANALYTICS_EVENT}`,
      eventCategory: `${ANALYTICS_EVENT_CATEGORY}`,
      eventAction: `${cms.carouselHeadline && cms.carouselHeadline.toLowerCase()} | ${eventAction.toLowerCase()}${
        eventAction.includes('arrow') ? '' : ' '
      }${index}`,
      eventLabel: `${pageInfo && pageInfo.seoURL.toLowerCase()}`
    });
  }

  /**
   * This function parses the params and initiate the API call for SSR
   * @param {Object} params The parameters object received from node
   */
  static getInitialProps(params) {
    const envBase = params.env.API_HOSTNAME;
    const productIds = params.cms.productIDs.map(product => product.productId).join();
    const ssrProdUrl = `${envBase}${productsAPI}${productIds}&summary=true`;
    return axiosSsr.get(ssrProdUrl, {
      params: {
        correlationId: params.correlationId,
        trueClientIp: params.trueClientIp,
        userAgent: params.userAgent
      }
    });
  }
  /**
   * This method is used to fetch productinfo list
   */
  getProducts() {
    axios
      .get(`${productsAPI}${this.state.productIds}&summary=true`)
      .then(response => {
        this.setState({ products: response.data.productinfo || [] });
      })
      .catch(err => err);
  }

  /**
   * Trigger next slide call
   */
  goNext() {
    this.onClickAnalytics(`${ARROW_RIGHT}`, '');
    if (this.swiper.current.swiper) this.swiper.current.swiper.slideNext();
  }

  /**
   * Trigger previous slide call
   */
  goPrev() {
    this.onClickAnalytics(`${ARROW_LEFT}`, '');
    if (this.swiper.current.swiper) this.swiper.current.swiper.slidePrev();
  }
  /**
   * push the productCarousel product card analytics
   * @param {string} productName - name of the product
   * @memberof productCarousel
   */
  pushCardAnalytics(productName, seoURL) {
    const { gtmDataLayer, cms, pageInfo } = this.props;
    const { page } = pageInfo;
    const { name, id } = cms;
    if (name || id) {
      enhancedAnalyticsPromoClick(gtmDataLayer, cms, seoURL);
    }
    gtmDataLayer.push({
      event: 'productCardClicks',
      eventCategory: `${page}|product card clicks`,
      eventAction: `product card|${productName && productName.toLowerCase()}`,
      eventLabel: 'academy'
    });
  }
  productList(products) {
    return products
      ? products.map((prod, index) => {
          const { imageURL, ...rest } = { ...prod };
          const auid = `HP_PC_A_${index}`;
          const manufacturer = Array.isArray(prod.manufacturer) ? prod.manufacturer[0] : prod.manufacturer;
          const prod1 = {
            imageURL: `${imageURL}?wid=250&hei=250`,
            ...rest,
            ...{ manufacturer }
          };
          const productProps = {
            auid
          };
          productProps.cms = {
            ...prod,
            ...{ manufacturer }
          };
          return (
            <ProductCard
              classes="col-8 col-md-4 pc-product-card swiper-slide px-quarter px-md-1 d-flex"
              cardAnalytics={() => this.pushCardAnalytics(prod1.name, prod1.seoURL)}
              key={prod.id}
              product={prod1}
              imageSmall
              promoMessage={prod.promoMessage ? prod.promoMessage : ''}
              {...productProps}
            />
          );
        })
      : '';
  }

  render() {
    const { products } = this.state;

    const desktopSliderSettings = {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 0,
      loop: true,
      pagination: {
        el: '.swiper-pagination.dark',
        clickable: true
      },
      on: {
        paginationRender: () => {
          const elems = [...document.querySelectorAll('.productCarousel .swiper-pagination-bullet')];
          elems.forEach((elem, index) => {
            elem.addEventListener(
              'click',
              () => {
                this.onClickAnalytics(`${CAROUSEL_INDICATOR}`, index + 1);
              },
              { passive: true }
            );
          });
        },
        init: () => {
          const maxHeight = [...document.querySelectorAll('.productCarousel section.mt-half')]
            .map(c => c.offsetHeight)
            .reduce((a, b) => Math.max(parseInt(a, 10), parseInt(b, 10)));
          [...document.querySelectorAll('.productCarousel section.mt-half')].forEach(c => {
            // eslint-disable-next-line
            c.style.height = `${maxHeight}px`;
          });
        }
      }
    };
    const mobileSliderSettings = {
      slidesPerView: 'auto',
      spaceBetween: 0,
      loop: true
    };
    const { carouselHeadline, bgColor, textColor } = this.props.cms;
    const isProductsAvailable = products && products.length > 0;
    const { bottomPadding, topPadding } = this.props.cms;
    const componentPaddings = styles.getPaddings(topPadding, bottomPadding);
    if (isProductsAvailable) {
      return (
        <Fragment>
          <div className={`c-promo-impression-tracking product-carousel ${componentPaddings}`}>
            <div className="text-center">
              <span className={styles.carouselTitleBox(bgColor, textColor)}>{carouselHeadline}</span>
            </div>
            <div className={cx('d-none d-md-block pb-3 pt-5 position-relative', styles.backgroundColor(this.props.cms.desktopImage))}>
              <section className="p-0 pt-3 container">
                {isProductsAvailable && (
                  <Swiper {...desktopSliderSettings} ref={this.swiper}>
                    {this.productList(products)}
                  </Swiper>
                )}
              </section>
              <button aria-label="Previous slide" className="swiper-button-next academyicon icon-chevron-left" onClick={this.goPrev} />
              <button aria-label="Next slide" className="swiper-button-prev academyicon icon-chevron-right" onClick={this.goNext} />
            </div>
            <div className={cx('d-block d-md-none pb-3 pt-5', styles.backgroundColor(this.props.cms.desktopImage))}>
              <section className={cx('p-0 pt-3', styles.marginLeftOffset)}>
                {isProductsAvailable && <Swiper {...mobileSliderSettings}>{this.productList(products)}</Swiper>}
              </section>
            </div>
          </div>
        </Fragment>
      );
    }
    return <div />;
  }
}

ProductCarousel.propTypes = {
  cms: PropTypes.object,
  api: PropTypes.object,
  productArray: PropTypes.array,
  gtmDataLayer: PropTypes.array,
  pageInfo: PropTypes.object
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const ProductCarouselContainer = connect(mapStateToProps)(ProductCarousel);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ProductCarouselContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default ProductCarouselContainer;
