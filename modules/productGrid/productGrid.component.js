import { facetSearchAPI, productInfoAPI, SEARCHTERM_API } from '@academysports/aso-env';
import ProductCard from '@academysports/fusion-components/dist/ProductCard';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import QueryParser from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'react-emotion';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames';

import axiosSsr from '../../../axios-ssr';
import { loader } from '../../assets/images/loader.svg';
import { naFallback } from '../../utils/analytics/generic';
import errorHandler from '../../utils/ErrorHandler';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import media from '../../utils/media';
import QueryStringManager from '../../utils/QueryParamsManager';
import HigherOrder from '../higherOrder/higherOrder.component';
import { openModalForProductId as openQuickView } from '../quickView/actions';
import { loadProducts, productsLoaded } from './actions';
import Facets from './comps/facets';
import Selectedfacets from './comps/selectedFacets/selectedFacets';
import SortBy from './comps/sortBy/sortBy';
import {
  DATA_COMP_ID,
  GTM_D,
  HOT_MARKET_CODE,
  MATCH_MIN_WIDTH,
  MESSAGE_NO_PRODUCTS_FOUND,
  MESSAGE_NO_PRODUCTS_FOUND_BOPIS,
  NODE_TO_MOUNT,
  PAGE_SIZE,
  QS_BEGIN_INDEX,
  R_AFFCODE,
  R_CID,
  R_CM_MMC,
  SCROLL_TIMEOUT,
  SELECTED_PAGE,
  QS_ORDER_BY,
  PPU_MESSAGE
} from './constants';
import Pagination from './pagination';
import QueryStringUtils from './QueryStringUtils';
import reducer from './reducer';
import saga from './saga';
import { getPromotionText } from '../../utils/analytics';
import { imageTag } from './productgrid.styles';

const restrictedQueries = [R_AFFCODE, R_CM_MMC, R_CID];
// deprecated - in place for reference purpose, will be removed in further commits.
// eslint-disable-next-line
const productGridMobileSpaces_deprecated = css`
  @media screen and (min-width: 320px) and (max-width: 523px) {
    padding-left: calc(4px + (100vw - 320px) / 2);
    padding-right: calc(4px + (100vw - 320px) / 2);
  }
  @media screen and (min-width: 524px) and (max-width: 767px) {
    padding-left: calc(4px + (100vw - 524px) / 2);
    padding-right: calc(4px + (100vw - 524px) / 2);
  }
`;

const mobileContainer = css`
  ${media.md`
    overflow-x: hidden;
  `};

  ${media.lg`
    max-width:100vw;
    width:100%;
  `};
`;

const tabletContainer = css`
  @media (min-width: 768px) and (max-width: 991px) {
    margin-left: 0px;
    margin-right: 0px;
  }
`;

const StyledDivViewAll = styled('div')`
  color: #0556a4;
  color: #0556a4;
  cursor: pointer;
`;
const productGridCardStylesOverRide = {
  Vertical: {
    rating: css`
      font-size: 14px;
      @media only screen and (min-width: 768px) {
        font-size: 14px;
      }
    `,
    description: css`
      height: 50px;
      overflow: hidden;
    `,
    title: css`
      color: #767676;
    `
  },
  Horizontal: {
    rating: css`
      font-size: 14px;
      @media only screen and (min-width: 768px) {
        font-size: 14px;
      }
    `,
    description: css`
      height: 45px;
      overflow: hidden;
    `,
    price: css`
      line-height: 1.2;
    `,
    title: css`
      color: #767676;
    `
  }
};

/**
 * This function provides the querystring having facets sent from node
 * @param {Object} params The params object received from node
 */
const getQueryString = params => {
  /* Regular Listing Page - Make API call and return the info to Node */
  let facets = params.pageInfo && params.pageInfo.facet;
  let queryString = 'facets=';
  if (facets && typeof facets === 'string') {
    facets = [facets];
  }
  if (facets && facets.length > 0) {
    facets.map(item => {
      queryString = `${queryString},${item}`;
      return queryString;
    });
  }
  if (params.cms.preSelectedFilter) {
    let tempFacet = params.cms.preSelectedFilter;
    tempFacet = tempFacet.slice(tempFacet.indexOf('facet') + 6);
    queryString = `${queryString}${tempFacet}`;
  }
  queryString.replace(/,/, '');
  return queryString;
};

/**
 * This function prepares and returns the product url for api call based on data sent from node
 * @param {String} envBase The base api url per environment set from node
 * @param {Object} params The params object received from node
 */
const getSsrProdUrl = (envBase, params) => {
  let ssrProdUrl;
  const orderBy = params.cms.sortOption ? params.cms.sortOption : params.pageInfo && params.pageInfo.orderBy;
  const beginIndex = params.pageInfo && params.pageInfo.beginIndex;
  const pageNumber = beginIndex ? ((+beginIndex) / PAGE_SIZE) + 1 : SELECTED_PAGE; // prettier-ignore
  let newCategoryId;
  if (params.pageInfo && params.pageInfo.categoryId) {
    newCategoryId = params.pageInfo.categoryId;
  } else if (params.cms && params.cms.targetPreviewId) {
    newCategoryId = params.cms.targetPreviewId;
  } else {
    newCategoryId = params.cmsPageInfo && params.cmsPageInfo.previewId;
  }

  const queryString = getQueryString(params);
  if ((params.pageInfo && params.pageInfo.facet) || params.cms.preSelectedFilter) {
    ssrProdUrl = `${envBase}${productInfoAPI}${newCategoryId}/products?displayFacets=true&${queryString}&pageSize=${PAGE_SIZE}&pageNumber=${pageNumber}`;
  } else {
    ssrProdUrl = `${envBase}${productInfoAPI}${newCategoryId}/products?displayFacets=true&pageSize=${PAGE_SIZE}&pageNumber=${pageNumber}`;
  }
  if (orderBy) {
    ssrProdUrl = `${ssrProdUrl}&orderBy=${orderBy}`;
  }

  return QueryStringManager.getUrlWithRestrictedParams({
    queries: restrictedQueries,
    data: params.pageInfo,
    url: ssrProdUrl
  });
};

class ProductGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    const defaultOrderBy = QueryStringUtils.getParameter(QS_ORDER_BY) ? QueryStringUtils.getParameter(QS_ORDER_BY) : 7;
    const defaultSearchPageOrderBy = QueryStringUtils.getParameter(QS_ORDER_BY) ? QueryStringUtils.getParameter(QS_ORDER_BY) : 0;
    const beginIndex = QueryStringUtils.getParameter(QS_BEGIN_INDEX);
    const pageNumber = beginIndex ? ((+beginIndex) / PAGE_SIZE) + 1 : SELECTED_PAGE; // prettier-ignore

    this.state = {
      errorData: '',
      pageSize: PAGE_SIZE,
      selectedFacets: [],
      isDeskTop: ExecutionEnvironment.canUseDOM ? window.matchMedia(`(min-width:${MATCH_MIN_WIDTH}px)`).matches : true,
      selectedSortValue: this.props.pageInfo && this.props.pageInfo.isSearch ? defaultSearchPageOrderBy : defaultOrderBy,
      pageNumber,
      categoryId: this.props.pageInfo && this.props.pageInfo.categoryId
    };
    this.onFacetChangeListener = this.onFacetChangeListener.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onMobileFacetsApply = this.onMobileFacetsApply.bind(this);
    this.viewAll = this.viewAll.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onSort = this.onSort.bind(this);
    this.getBreadCrumbLabel = this.getBreadCrumbLabel.bind(this);
    this.updateAnalatics = this.updateAnalatics.bind(this);
    this.enhancedAnalytics = this.enhancedAnalytics.bind(this);
    this.renderProductCard = this.renderProductCard.bind(this);

    // Refs

    this.productListingRef = React.createRef();
    this.resizeTimer = null;
    this.firstEcommerce = false;
  }

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('resize', () => {
        if (this.resizeTimer) {
          clearTimeout(this.resizeTimer);
        }
        this.resizetimer = setTimeout(this.onWindowResize, 250);
      });
      if (this.props.isCSR) {
        const { pageInfo, cms } = this.props;
        const parsedQueryParams = QueryParser.parse(window.location.search);
        const asyncGridDataPromise = this.constructor.getInitialProps({
          cms,
          env: {
            API_HOSTNAME: '' // seems awkward?
          },
          pageInfo: {
            categoryId: pageInfo.categoryId, // how do we get this ?s
            orderBy: parsedQueryParams.orderBy,
            facet: parsedQueryParams.facet,
            beginIndex: parsedQueryParams.beginIndex
          }
        });

        asyncGridDataPromise
          .then(res => {
            if (res.status === 200) {
              this.props.productsLoaded(res.data);
            }
          })
          .catch(err => {
            console.error('Error on CSR of productGrid ::', err);
          });
      }
      window.onpopstate = function popHandler() {
        window.location.reload();
      };
      // Initialize the Intersection observer
      this.lazyLoadObserver = this.attachIntersectionObserver();
    }
  }

  componentDidUpdate(prevProps) {
    if (ExecutionEnvironment.canUseDOM) {
      // Initialize the Intersection observer
      if (this.props.productinfo !== prevProps.productinfo) {
        this.lazyLoadObserver = this.attachIntersectionObserver();
      }
    }
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      clearTimeout(this.resizeTimer);
      window.removeEventListener('resize', this.onWindowResize);
      window.onpopstate = () => {}; // assigning the popstate event to a no-op JIC.
    }
    this.lazyLoadObserver.disconnect();
  }

  onWindowResize() {
    this.setState({ isDeskTop: window.matchMedia(`(min-width:${MATCH_MIN_WIDTH}px)`).matches });
  }

  onFacetChangeListener(options) {
    // Before modifying anything here, make sure to change the facets from where this function is invoked
    this.setState({ ...options });
    QueryStringUtils.removeParameter(QS_BEGIN_INDEX);
  }

  onMobileFacetsApply(msg, data) {
    this.setState({ selectedFacets: data }, () => this.onSearch());
  }
  onSearch(options = { pageNumber: SELECTED_PAGE }) {
    const pageNumber = options.pageNumber || SELECTED_PAGE;
    const SelectedFacetIds = this.state.selectedFacets.map(item => item.selectedLabelId);
    const facetsvalue = SelectedFacetIds.toString();
    const sortValue = this.state.selectedSortValue;
    const { categoryId, pageSize } = this.state;
    let queryFilter = '';
    let searchUrl = `${facetSearchAPI}?facets=`;
    if (this.props.pageInfo && this.props.pageInfo.isSearch) {
      searchUrl = `${SEARCHTERM_API}${this.props.pageInfo.searchTerm}&facet=`;
    }
    // Needs to get more insight on the below code part. todo: refactoring
    if (SelectedFacetIds && SelectedFacetIds.length > 0) {
      queryFilter = `${facetsvalue}&orderBy=${sortValue}&pageSize=${pageSize}&categoryId=${categoryId}&pageNumber=${pageNumber}`;
    } else {
      // if no facet selected search all products
      queryFilter = `${facetsvalue}&orderBy=${sortValue}&categoryId=${categoryId}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    }
    console.log('SEARCH URL:: '`${searchUrl}${queryFilter}`);
    axios
      .get(`${searchUrl}${queryFilter}`)
      .then(response => {
        if (response.data && response.data !== null) {
          this.setState(
            {
              pageNumber,
              errorData: ''
            },
            () => {}
          );
        } else {
          this.setState({ errorData: '' });
        }
      })
      .catch(() => {
        this.setState({ errorData: 'something went wrong, please try after sometime ' });
      });
  }

  onSort(sortValue) {
    this.setState({ selectedSortValue: sortValue, pageNumber: 1 }, () => this.refreshProducts());
  }

  /**
   * This function parses the params and initiate the API call for SSR
   * @param {Object} params The parameters object received from node
   */
  static getInitialProps(params) {
    const previewId = params.cmsPageInfo && parseInt(params.cmsPageInfo.previewId, 10);
    const envBase = params.env.API_HOSTNAME;
    if (params.pageInfo && params.pageInfo.api) {
      /* Search Result page - Send back the received response to Node */
      return Promise.resolve({ data: params.pageInfo.api });
    } else if (params.cmsPageInfo && Number.isNaN(previewId)) {
      /* search Result page - preview mode */
      const searchUrl = `${SEARCHTERM_API}${params.cmsPageInfo.previewId}&facet=`;
      const orderById = params.cms.sortOption ? params.cms.sortOption : '';
      const queryFilter = `&orderBy=${orderById}&categoryId=&pageSize=${PAGE_SIZE}&pageNumber=${SELECTED_PAGE}`;
      return axios.get(
        QueryStringManager.getUrlWithRestrictedParams({
          queries: restrictedQueries,
          data: params.pageInfo,
          url: `${envBase}${searchUrl}${queryFilter}`
        })
      );
    }

    // return axios.get(ssrprodUrl);
    return axiosSsr.get(getSsrProdUrl(envBase, params), {
      params: {
        correlationId: params.correlationId,
        trueClientIp: params.trueClientIp,
        userAgent: params.userAgent
      }
    });
  }
  /**
   * gives an array of the breadcrumb label
   * @returns an array of the label of breadcrumb
   * @memberof ProductGrid
   */
  getBreadCrumbLabel() {
    const { breadcrumb } = this.props.api;
    const breadCrumbLabel = breadcrumb.map(list => list.label);
    return breadCrumbLabel;
  }
  /**
   * This method will get product id and return analytics object
   * @param  {*} productId index of single product
   */
  getSingleProductDetails(productId) {
    const { pageInfo, productinfo, api } = this.props;
    const product = productinfo[productId];
    const { name, defaultSkuPrice, manufacturer, partNumber } = product;
    const position = parseInt(productId, 10) + 1;
    let listitem = '';
    if (api && api.breadcrumb) {
      const { breadcrumb } = api;
      const breadcrumbLength = breadcrumb.length;
      listitem = breadcrumb[breadcrumbLength - 1] && breadcrumb[breadcrumbLength - 1].label;
    }
    const productData = {
      name: naFallback(name),
      id: partNumber,
      price: defaultSkuPrice.salePrice,
      brand: manufacturer && manufacturer.toLowerCase(),
      category: listitem && listitem.toLowerCase(),
      list: pageInfo.searchTerm ? 'search results' : listitem.toLowerCase(),
      position,
      dimension25: getPromotionText(product),
      metric38: pageInfo.searchTerm ? 1 : 0
    };
    return productData;
  }

  /**
   * Method to display no products message
   * If Bopis available in the filter selection then Bopis message takes priority or default no products message
   */
  getNoProductsMessage = (productinfo, isBopisPresent) => {
    let message = null;
    if (typeof productinfo === typeof undefined || productinfo.length === 0) {
      message = isBopisPresent.length ? MESSAGE_NO_PRODUCTS_FOUND_BOPIS : MESSAGE_NO_PRODUCTS_FOUND;
    }
    return message;
  };

  /**
   * Method attaches an intersection observer on the product card for lazy-loading images
   */
  attachIntersectionObserver() {
    // add check for use dom
    if (!('IntersectionObserver' in window)) return '';
    const cards = [...document.querySelectorAll('.product-card')];
    const options = {
      root: null, // avoiding 'root' or setting it to 'null' sets it to default value: viewport
      rootMargin: '0px',
      threshold: 0.5
    };
    if (this.lazyLoadObserver) {
      this.lazyLoadObserver.disconnect();
    }
    const observer = new IntersectionObserver((entries, self) => this.lazyLoadCallback(entries, self), options);

    cards.forEach(card => observer.observe(card));
    return observer;
  }
  /**
   * This method lazyloads images when we enter the viewport and unobserves it once it is done
   * @param {*} cardentries the card to observe
   * @param {*} observer the observer instance to stop observation
   */
  lazyLoadCallback(cardentries, observer) {
    const interSectionArray = [];
    cardentries.forEach(card => {
      if (card.intersectionRatio > 0.5) {
        this.lazyLoadImage(card.target);
        const productIdxNode = card.target.attributes['data-productidx'];
        if (productIdxNode && productIdxNode.nodeValue) {
          interSectionArray.push(productIdxNode.nodeValue);
        }
        observer.unobserve(card.target);
      } else {
        console.log('...image out of view');
      }
    });
    if (interSectionArray.length > 0) {
      this.updateAnalatics(interSectionArray);
    }
  }

  /**
   * The method hides the spinner and toggles the src prop of the image tag , so that the image is downloaded on demand.
   * @param {*} cardnode the DOM node of the product card
   */
  lazyLoadImage(cardnode) {
    const imgnode = cardnode.querySelector('img');
    const spinner = cardnode.querySelector('span.c-product__lazyspinner');
    const src = imgnode.getAttribute('data-src');
    if (!src) {
      return;
    }
    imgnode.src = src;
    spinner.classList.add('d-none'); //eslint-disable-line
    imgnode.classList.remove('d-none');
  }

  /** This method push analytics on scroll
   * @param  {} analyticsIdx array of ids push to analytics
   */
  updateAnalatics(analyticsIdx) {
    const { pageInfo, recordSetTotal, api } = this.props;
    const impressions = [];
    analyticsIdx.forEach(productsIdx => {
      const productData = this.getSingleProductDetails(productsIdx);
      if (pageInfo.searchTerm) {
        productData[`dimension${GTM_D[21]}`] = pageInfo.searchTerm && pageInfo.searchTerm.toLowerCase();
        // productData[`dimension${GTM_D[49]}`] = 'ta:keyword';
        productData[`dimension${GTM_D[23]}`] = recordSetTotal;
      } else {
        productData.category = api.sectionTitle && api.sectionTitle.toLowerCase();
      }
      impressions.push(productData);
    });
    const finalDatalayer = {
      /* event: 'productListImpression', commenting out the event due to KER-13195 */
      ecommerce: {
        currencyCode: 'USD',
        impressions
      }
    };
    if (this.firstEcommerce) {
      /* need to add event after first ecommerce push event due to KER-13195 */
      finalDatalayer.event = 'productListImpression';
    } else {
      this.firstEcommerce = true;
    }
    this.props.gtmDataLayer.push(finalDatalayer);
  }

  viewAll() {
    // Analytics data
    this.props.gtmDataLayer.push({
      event: 'search',
      eventCategory: 'internal search results clicks',
      eventAction: 'search results_view all',
      eventLabel: `${this.props.pageInfo.searchTerm && this.props.pageInfo.searchTerm.toLowerCase()}`,
      searchresultscount: `${this.props.recordSetTotal}`
    });

    this.setState(
      {
        pageSize: ''
      },
      () => {
        this.scrollToTop();
        setTimeout(() => {
          this.refreshProducts('viewall');
        }, SCROLL_TIMEOUT);
      }
    );
  }

  sortByOnChange(msg, data) {
    this.setState({ selectedSortValue: data, pageNumber: 1 }, () => this.onSearch({ pageNumber: 1 }));
  }
  /**
   * scroll up to the element captured
   *
   * @memberof ProductGrid
   */
  scrollToTop() {
    if (ExecutionEnvironment.canUseDOM) {
      const recordsetWrap = document.getElementById('recordsettotal');
      const productWrap = document.getElementById('productWrap');
      recordsetWrap.scrollIntoView({ behavior: 'smooth' });
      productWrap.focus();
    }
  }

  /**
   * Function to check if the URL has restricted query string
   *
   * @returns {Boolean} true or false based on the data found in qs
   * @memberof ProductGrid
   */
  hasRestrictedQS() {
    let found = false;
    restrictedQueries.forEach(key => {
      const val = QueryStringUtils.getParameter(key);
      if (val !== '') {
        found = true;
      }
    });
    return found;
  }

  handlePageChange = params => {
    // incrementing by one for API
    const pageNumber = params.selected + 1;
    const beginIndex = params.selected === 0 ? 0 : PAGE_SIZE * params.selected;
    this.scrollToTop();
    QueryStringUtils.removeParameters([R_AFFCODE, R_CM_MMC, R_CID]);
    QueryStringUtils.updateParameter(QS_BEGIN_INDEX, beginIndex);

    this.setState({ pageNumber }, () => {
      setTimeout(() => {
        this.refreshProducts();
      }, SCROLL_TIMEOUT);
    });
    const { breadcrumb } = this.props.api;
    const breadCrumbLabel = breadcrumb.map(list => list.label);
    // Analytics data
    this.props.gtmDataLayer.push({
      event: 'plpPageClicks',
      eventCategory: 'plp interactions',
      eventAction: `pagination|${pageNumber}`,
      eventLabel: breadCrumbLabel.join(' > ').toLowerCase()
    });
  };
  /**
   * push the product card analytics
   * @param {} productData - array of product details
   * @param  {} idx - postion of product card
   * @memberof ProductGrid
   */
  pushCardAnalytics(productData, idx) {
    const { breadcrumb, spellCheck } = this.props.api;
    const productName = productData.name;
    this.enhancedAnalytics(productData, idx);
    const breadCrumbLabel = breadcrumb.map(list => list.label);
    let pageType = 'plp';
    if (this.props.pageInfo && this.props.pageInfo.isSearch) {
      pageType = 'search results';
      let eventActionPrefix = 'search results_result';
      let itemCount = this.props.recordSetTotal;
      if (spellCheck && spellCheck.length > 0) {
        eventActionPrefix = 'search results_preditive search results';
        itemCount = 0;
      }
      this.props.gtmDataLayer.push({
        event: 'search',
        eventCategory: 'internal search results clicks',
        eventAction: `${eventActionPrefix} click_${productName && productName.toLowerCase()}`,
        eventLabel: `${this.props.pageInfo.searchTerm && this.props.pageInfo.searchTerm.toLowerCase()}`,
        searchresultscount: itemCount
      });
    }
    this.props.gtmDataLayer.push({
      event: 'productCardClicks',
      eventCategory: `${pageType}|product card clicks`,
      eventAction: `product card|${productName && productName.toLowerCase()}`,
      eventLabel: `${breadCrumbLabel.join(' > ').toLowerCase()}`
    });
  }
  /**
   * updating enhanced analytics
   * @param  {Object} product product array
   * @param  {String} idx - postion of product card
   */
  enhancedAnalytics(product, idx) {
    const { pageInfo, api, gtmDataLayer, selectedFacets } = this.props;
    const { searchTerm, isSearch } = pageInfo;
    const { name, defaultSkuPrice, manufacturer, partNumber } = product;
    const position = parseInt(idx, 10) + 1;
    const selectedAnalytics = [];
    let listitem = '';
    if (api && api.breadcrumb) {
      const { breadcrumb } = api;
      const breadcrumbLength = breadcrumb.length;
      listitem = breadcrumb[breadcrumbLength - 1] && breadcrumb[breadcrumbLength - 1].label;
    }
    selectedFacets.forEach(item => {
      const { selectedLabelParentDrawer, selectedLabelName } = item;
      selectedAnalytics.push(`${selectedLabelParentDrawer}:${selectedLabelName}`);
    });
    const selectedAnalyticsString = selectedAnalytics.join('|') || 'no facet applied';
    const gaProduct = {
      name: naFallback(name),
      id: partNumber,
      price: defaultSkuPrice && defaultSkuPrice.salePrice,
      brand: manufacturer && manufacturer.toLowerCase(),
      category: listitem && listitem.toLowerCase(),
      position,
      dimension7: selectedAnalyticsString.toLowerCase(),
      metric5: selectedAnalytics.length > 0 ? 1 : 0,
      dimension25: getPromotionText(product)
    };

    if (isSearch) {
      gaProduct.dimension21 = searchTerm && searchTerm.toLowerCase();
      // gaProduct.dimension49 = 'ta:keyword';
      gaProduct.dimension23 = api.recordSetTotal;
      gaProduct.dimension25 = getPromotionText(product);
    }

    const dataLayer = {
      event: 'productClick',
      ecommerce: {
        click: {
          actionField: { list: isSearch ? 'search results' : listitem.toLowerCase() },
          products: [gaProduct]
        }
      }
    };

    gtmDataLayer.push(dataLayer);
  }

  refreshProducts(type) {
    const options = {
      selectedSortValue: this.state.selectedSortValue,
      categoryId: this.state.categoryId,
      pageSize: type ? this.props.recordSetTotal : this.state.pageSize,
      pageNumber: type ? 1 : this.state.pageNumber,
      isSearch: this.props.pageInfo && this.props.pageInfo.isSearch,
      searchTerm: this.props.pageInfo && this.props.pageInfo.searchTerm
    };
    this.props.loadProducts(options);
  }

  /**
   * Method determines if quickView CTA should be shown when user hovers over the product card
   * @param {*} isQuickViewOnPage variable which says if quickview component is authored on page, received from global state as props
   * @param {*} product productinfo from which properties are used to further check if quick view CTA shoud be shown.
   */
  shouldEnableQuickView(isQuickViewOnPage, product) {
    return (
      isQuickViewOnPage &&
      product.isGiftCard !== 'Y' &&
      product.field3 !== HOT_MARKET_CODE &&
      product.varianttype &&
      product.varianttype === 'regular'
    );
  }

  /**
   * Method renders the productcard atomic components based on the productInfo
   */
  renderProductCard() {
    const { productinfo, selectedFacets = [], labels } = this.props;
    /**
     * if BOPIS filter is selected send the bopis store id to PDP page.
     */
    const isBopisPresent = selectedFacets.filter(item => item.selectedLabelName === 'In-Store Pickup');

    const message = this.getNoProductsMessage(productinfo, isBopisPresent);
    if (message) {
      return <div className="px-3 py-half px-md-1 pb-md-1">{message}</div>;
    }

    let newSelectedLabel = '';
    if (isBopisPresent.length) {
      const selectedLabel = isBopisPresent[0].selectedLabelId;
      newSelectedLabel = `&${decodeURIComponent(selectedLabel)
        .replace(/"/g, '')
        .replace(/:/g, '=')}`;
    }

    return productinfo.map((catlog, idx) => {
      const manufacturer = Array.isArray(catlog.manufacturer) ? catlog.manufacturer[0] : catlog.manufacturer;
      // to fetch ppuMessage from AEM.
      const ppuMessage = (catlog.ppuEnabled && labels[catlog.ppuMessage]) || PPU_MESSAGE;
      const { imageURL, seoURL, ...rest } = { ...catlog };
      const productData = {
        imageURL: `${imageURL}?wid=250&hei=250`,
        seoURL: `${seoURL}${newSelectedLabel}`,
        ...rest,
        ppuMessage,
        ...{ manufacturer }
      };
      const onClickQuickView = onCloseQuickViewFocusAnchorId => {
        this.props.fnOpenQuickView(catlog.id, catlog.seoURL, onCloseQuickViewFocusAnchorId, labels && labels.bopisEnabled);
        const breadCrumbLabel = this.getBreadCrumbLabel();
        const productName = productData.name;
        this.props.gtmDataLayer.push({
          event: 'productCardClicks',
          eventCategory: 'plp|product card clicks',
          eventAction: `product card|${productName && productName.toLowerCase()}|quick view`,
          eventLabel: `${breadCrumbLabel.join(' > ').toLowerCase()}`
        });
      };
      return (
        <ProductCard
          cardAnalytics={() => this.pushCardAnalytics(productData, idx)}
          classes={classNames('col-12 col-md-4 d-flex', imageTag)}
          cardType="hold240"
          key={catlog.id}
          loaderImage={loader}
          tabIndex={0}
          product={productData}
          imageSmall
          horizontalMobile
          enableQuickView={this.shouldEnableQuickView(!!this.props.quickView, productData)}
          onClickQuickView={onClickQuickView}
          styleOverride={productGridCardStylesOverRide}
          auid={`productCard_${catlog.id}`}
          badge={catlog.adBug ? catlog.adBug[0] : ''}
          promoMessage={catlog.promoMessage ? catlog.promoMessage : ''}
          productIdx={idx}
        />
      );
    });
  }

  renderSortDropdown = () => {
    const { api } = this.props;
    const defaultSelected = this.props.sortByInfo && this.props.sortByInfo.find(item => item.selectedProperty === 'yes');
    const isPredictiveSearch = api && api.spellCheck && api.spellCheck.length > 0;
    return (
      <SortBy
        defaultSelected={defaultSelected ? defaultSelected.id : '0'}
        onSort={this.onSort}
        sortByInfo={this.props.sortByInfo}
        isSearch={this.props.pageInfo && this.props.pageInfo.isSearch}
        itemsCount={this.props.recordSetTotal}
        breadcrumb={this.props.api.breadcrumb}
        searchTerm={this.props.pageInfo && this.props.pageInfo.searchTerm}
        cms={this.props.cms}
        isPredictiveSearch={isPredictiveSearch}
        gtmDataLayer={this.props.gtmDataLayer}
      />
    );
  };

  /**
   * render function for facets
   */
  renderFacets() {
    const { recordSetTotal, pageInfo, api, breadcrumb, facets, selectedFacets, cms, labels } = this.props;
    const { pageSize, selectedSortValue, pageNumber } = this.state;

    if (facets && facets.length === 0 && selectedFacets.length === 0) {
      return null;
    }

    return (
      <Facets
        api={api}
        isDesktop={this.state.isDeskTop}
        isSearch={pageInfo && pageInfo.isSearch}
        searchTerm={pageInfo && pageInfo.searchTerm}
        pageSize={pageSize}
        categoryId={pageInfo && pageInfo.categoryId}
        sortValue={selectedSortValue}
        pageNumber={pageNumber}
        pageInfo={pageInfo}
        breadcrumb={breadcrumb}
        cms={cms}
        labels={labels}
        totalItem={recordSetTotal}
        onFacetsUpdate={this.onFacetChangeListener}
      />
    );
  }

  /**
   * Render function for pagination of product grid
   */
  renderPagination() {
    const { recordSetTotal } = this.props;
    return (
      <div className="mb-3">
        {this.state.pageSize && (
          <Pagination
            isDesktop={this.state.isDeskTop}
            totalPage={recordSetTotal}
            showAll={this.props.pageInfo && this.props.pageInfo.isSearch}
            onPageChange={this.handlePageChange}
            pageNumber={this.state.pageNumber}
            onViewAll={this.viewAll}
          />
        )}
      </div>
    );
  }

  /**
   * render function for selected facets
   */
  renderSelectedFacets() {
    const { pageInfo, recordSetTotal, api, breadcrumb } = this.props;
    const { pageSize, categoryId, selectedSortValue, pageNumber } = this.state;
    const isPredictiveSearch = api && api.spellCheck && api.spellCheck.length > 0;
    return (
      <div className="row">
        <Selectedfacets
          breadcrumb={breadcrumb}
          isSearch={pageInfo && pageInfo.isSearch}
          searchTerm={pageInfo && pageInfo.searchTerm}
          pageSize={pageSize}
          categoryId={categoryId}
          sortValue={selectedSortValue}
          pageNumber={pageNumber}
          api={api}
          isPredictiveSearch={isPredictiveSearch}
          recordSetTotal={recordSetTotal}
        />
      </div>
    );
  }

  /**
   * render function for sortby, and view all details which renders as header of the product grid.
   */
  renderProductGridHeader() {
    return (
      <div className="d-flex align-items-center justify-content-end col-8 ">
        <div data-auid="product-sort-dropdown" className="d-none d-lg-flex align-items-center pr-1 pr-lg-0">
          {this.state.isDeskTop && this.renderSortDropdown()}
        </div>
        {this.props.pageInfo &&
          this.props.pageInfo.isSearch && (
            <StyledDivViewAll
              data-auid="viewallCta_D"
              role="button"
              tabIndex={0}
              className="pl-lg-2  d-none o-copy__14reg"
              onKeyDown={this.viewAll}
              onClick={this.viewAll}
            >
              View All
            </StyledDivViewAll>
          )}
      </div>
    );
  }

  render() {
    const { recordSetTotal, productinfo } = this.props;
    const { errorData } = this.state;
    const { cms } = this.props;
    const localeRecordSetTotal = /^[0-9]*$/.test(recordSetTotal) ? parseInt(recordSetTotal, 10).toLocaleString('en-US') : recordSetTotal;
    if (errorData.length > 0) {
      return <div>{errorData}</div>;
    }
    if (this.hasRestrictedQS() && (typeof productinfo === typeof undefined || productinfo.length <= 0)) {
      return <div />;
    }
    return (
      <div className={`container ${mobileContainer}`}>
        <span id="recordsettotal" aria-hidden="true" />
        <div className="row mt-md-3">
          <div className="col-lg-3 col-12 d-flex d-lg-block justify-content-between align-items-center pt-2 pt-md-0 pb-2 pb-md-3 ">
            <div className="d-lg-none">{!this.state.isDeskTop && this.renderSortDropdown()}</div>
            {this.renderFacets()}
          </div>
          <div className="col-12 d-flex justify-content-between py-2 d-lg-none border-bottom ">
            <div className="o-copy__16bold">
              {localeRecordSetTotal} {cms && cms.items}
            </div>
            {this.props.pageInfo &&
              this.props.pageInfo.isSearch && (
                <StyledDivViewAll
                  data-auid="viewallCta_M"
                  role="button"
                  tabIndex={0}
                  className="pl-lg-2 d-none"
                  onKeyDown={this.viewAll}
                  onClick={this.viewAll}
                >
                  View All
                </StyledDivViewAll>
              )}
          </div>
          <div className="col-12 col-lg-9 px-0 px-lg-1">
            {this.state.isDeskTop && this.renderSelectedFacets()}
            <div className="d-none row d-lg-flex mb-lg-2 align-items-end justify-content-between">
              <div className="col-4 o-copy__16bold">
                {localeRecordSetTotal} {cms && cms.items}
              </div>
              {this.renderProductGridHeader()}
            </div>
            <span id="productWrap" aria-hidden="true" tabIndex={-1} />
            <section
              ref={this.productListingRef}
              id="productCardListing"
              className={`d-flex flex-wrap row ${tabletContainer}`}
              aria-live="polite"
              aria-label="Product Listing region"
            >
              {this.renderProductCard()}
            </section>
            {this.renderPagination()}
          </div>
        </div>
      </div>
    );
  }
}

ProductGrid.propTypes = {
  /* Shows the total items in the grid */
  recordSetTotal: PropTypes.string,
  /* Shows the product tiles */
  productinfo: PropTypes.any,
  /* Array of breadcrumbs on the page */
  breadcrumb: PropTypes.array,
  facets: PropTypes.array,
  sortByInfo: PropTypes.array,
  cms: PropTypes.object,
  labels: PropTypes.object,
  pageInfo: PropTypes.object,
  loadProducts: PropTypes.func,
  productsLoaded: PropTypes.func,
  gtmDataLayer: PropTypes.array,
  api: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  quickView: PropTypes.object,
  fnOpenQuickView: PropTypes.func,
  selectedFacets: PropTypes.array,
  /* Determine if the component needs to be Client Side Rendered */
  isCSR: PropTypes.bool
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer,
  quickView: state.quickView,
  error: state.err,
  breadcrumb: state.breadCrumb,
  ...state.productGrid
});
const mapDispatchToProps = dispatch => ({
  loadProducts: options => dispatch(loadProducts(options)),
  productsLoaded: data => dispatch(productsLoaded(data)),
  fnOpenQuickView: (productId, seoURL, onCloseFocusId, bopisEnabled) => dispatch(openQuickView(productId, seoURL, onCloseFocusId, bopisEnabled))
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const ConnectedComponent = withConnect(ProductGrid);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const ProductGridContainer = compose(
    withReducer,
    withSaga,
    withConnect,
    errorHandler
  )(HigherOrder(ProductGrid));
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ProductGridContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default errorHandler(ConnectedComponent);
