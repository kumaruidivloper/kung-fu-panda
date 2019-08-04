import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Safe from 'react-safe';
import * as HTML from 'html-parse-stringify';
import { seoCategoryAPI, seoProductAPI, apporigin, searchDexCanonical } from '@academysports/aso-env';
import Storage from '../../utils/StorageManager';
import { NODE_TO_MOUNT, DATA_COMP_ID, HOMEPAGE, ACADEMY, STR_NONE } from './constants';
import axiosSsr from '../../../axios-ssr';
import { isLoggedIn, getRegistrationStatus } from '../../utils/UserSession';
import { printBreadCrumb } from '../../utils/breadCrumb';
import { decodeURLRecursively } from '../../utils/helpers';
import { getSelectedStoreFromCookies } from '../../utils/cookies/SelectedStore';

class Seo extends React.PureComponent {
  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      this.loadAnalytics();
    }
  }
  static getInitialProps(params) {
    const defaultProductId = 3717858;
    const defaultSeo = { data: { seoTitle: '', seoMetaDescription: '', seoMetaKeyword: '' } };
    const envBase = params.env.API_HOSTNAME;
    if (params.pageInfo.isSearch) {
      const searched = params.pageInfo.searchTerm;
      const defaultSearchData = {
        data: {
          seoTitle: `Search Results - ${searched} | Academy`,
          seoMetaDescription: `Find ${searched} at Academy Sports + Outdoors`,
          seoMetaKeyword: `${searched}, academy, sports, sporting goods, academy sports, academy sports and outdoors`
        }
      };
      return new Promise((resolve, reject) => {
        try {
          resolve(defaultSearchData);
        } catch (error) {
          reject(error);
        }
      });
    } else if (!!params.pageInfo.categoryId || (params.cmsPageInfo && params.cmsPageInfo.previewId)) {
      // listing pages - perform seo  calls and calls for searchdex canonical links
      const promises = [];
      const categoryId = params.pageInfo && params.pageInfo.categoryId ? params.pageInfo.categoryId : params.cmsPageInfo.previewId;
      const seoDetailsAPI = `${envBase}${seoCategoryAPI}${categoryId}`;
      const canonicalLinkAPI = `${searchDexCanonical}${categoryId}.html`;
      const canonicalPromise = new Promise((resolve, reject) => {
        axios
          .get(canonicalLinkAPI, {
            headers: {
              'Content-Type': 'text/html'
            }
          })
          .then(resp => {
            // Removed fluff and retain only meta and link tags from the HTML Response
            const strippedHTML = resp.data
              .replace(/[\r\n\t]+/g, '')
              .replace(/<!?[/]?--.*?[--]?>/g, '')
              .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/"/g, "'")
              .replace(/>\s*</, '><');
            // Convert them into a array of tokens to be sent via node to our react component, since we cannot set pure string as a HTML on head
            const sdxASTokens = HTML.parse(strippedHTML);
            resolve({
              data: sdxASTokens
            });
          })
          .catch(error => {
            reject(error);
          });
      });
      promises.push(axios.get(seoDetailsAPI));
      promises.push(canonicalPromise.catch(err => err)); // Trying to resolve the promise in casea
      return axios.all(promises);
    } else if (params.pageInfo && params.pageInfo.productId) {
      const { productId } = params.pageInfo;
      const productEndpoint = `${envBase}${seoProductAPI}${productId || defaultProductId}`;
      return axiosSsr.get(productEndpoint, {
        params: {
          correlationId: params.correlationId,
          trueClientIp: params.trueClientIp,
          userAgent: params.userAgent
        }
      });
    }
    return new Promise((resolve, reject) => {
      try {
        resolve(defaultSeo);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Get store name from cookie
   */
  getStoreName = () => {
    const cookieMyStore = getSelectedStoreFromCookies();
    if (cookieMyStore) {
      const { neighborhood = STR_NONE } = cookieMyStore;
      return neighborhood;
    }
    return STR_NONE;
  };

  /**
   * Load Analytics only after dom content loaded event.
   * */
  loadAnalytics = () => {
    if (ExecutionEnvironment.canUseDOM) {
      const pxRation = window.devicePixelRatio;
      const screenResolution = `${window.screen.width * pxRation} x ${window.screen.height * pxRation}`;
      const componentsViewed = [...document.querySelectorAll('[data-component]')].reduce((prev, el) => {
        if (typeof prev === 'object') {
          return `${prev.getAttribute('data-component')}|${el.getAttribute('data-component')}`;
        }
        return `${prev}|${el.getAttribute('data-component')}`;
      });
      const userData = {
        // ToDo pageHierarchy
        event: 'analytics-pageload',
        visitorStatus: isLoggedIn() ? 'authenticated' : 'not authenticated',
        registrationStatus: getRegistrationStatus() ? 'registered' : 'not registered',
        visitor_ID: Storage.getCookie('USERACTIVITY') || 'guest',
        authenticationMethod: isLoggedIn() ? 'email' : 'guest',
        storeSelected: this.getStoreName(),
        componentsViewed,
        screenResolution,
        serverType: 'google cloud',
        correlationId: Storage.getCookie('correlationId')
      };
      if (document.referrer && document.referrer !== '') {
        const previousPage = new URL(document.referrer);
        userData.previousPage = previousPage.pathname;
      } else {
        userData.previousPage = '/';
      }
      window.dataLayer.push(userData);
    }
  };
  /**
   * Returns a collection of DOM nodes ,(mainly meta and link tags) which are to be set in the head section of the page.
   * @param {*} sdxAST - tokens retuned from the SDX API hit
   */
  returnSDXSnippets(sdxAST) {
    return sdxAST.map(item => {
      if (item.name === 'meta') {
        return <meta content={item.attrs.content} name={item.attrs.name} />;
      } else if (item.name === 'link') {
        return <link rel={item.attrs.rel} href={item.attrs.href} />;
      }
      return null;
    });
  }
  computePageHierarchy(breadCrumb, page, title) {
    if (breadCrumb) {
      const arrBreadCrumb = breadCrumb.split('>');
      return printBreadCrumb([ACADEMY, ...arrBreadCrumb]);
    }
    return page === HOMEPAGE ? ACADEMY : printBreadCrumb([ACADEMY, title]);
  }
  render() {
    if (!Object.keys(this.props).length && this.props.constructor === Object) {
      return null;
    }
    let seoData;
    let sdxHTML;
    let sdxAST;
    let seoTitle;
    let seoMetaDescription;
    let seoMetaKeyword;
    let canonicalURL;
    let breadcrumb;
    const { api, pageInfo } = this.props;
    // If the API is of type Array, it probably means that we have resolved multiple promises in getInitialProps,
    if (api.constructor && api.constructor.name === 'Array') {
      [seoData, sdxAST] = api;
      seoTitle = seoData.seoTitle; // eslint-disable-line
      seoMetaDescription = seoData.seoMetaDescription; // eslint-disable-line
      seoMetaKeyword = seoData.seoMetaKeyword; // eslint-disable-line
      breadcrumb = seoData.breadcrumb; // eslint-disable-line
      canonicalURL = seoData.canonicalURL; // eslint-disable-line
      sdxHTML = sdxAST && HTML.stringify(sdxAST);
    } else {
      seoTitle = api.seoTitle; // eslint-disable-line
      seoMetaDescription = api.seoMetaDescription; // eslint-disable-line
      seoMetaKeyword = api.seoMetaKeyword; // eslint-disable-line
      breadcrumb = api.breadcrumb; // eslint-disable-line
      canonicalURL = api.canonicalURL; // eslint-disable-line
    }
    const { template = '', pageURL = '' } = pageInfo;
    let pageType = template;
    if (!pageInfo || (!pageInfo.categoryId && !pageInfo.productId && !pageInfo.isSearch)) {
      return null;
    }
    if (pageInfo && pageInfo.isSearch) {
      pageType = 'Search Results';
    }
    const pageName = pageURL && decodeURLRecursively(pageURL).replace(/"/g, '');
    return (
      <React.Fragment>
        <title>{seoTitle}</title>
        <meta name="seoTitle" content={seoTitle} />
        <meta name="description" content={seoMetaDescription} />
        <meta name="keywords" content={seoMetaKeyword} />
        {sdxHTML ? this.returnSDXSnippets(sdxAST) : <link rel="canonical" href={`${apporigin}${canonicalURL}`} />}
        <Safe.script>
          {`dataLayer = [{ 'pageType': "${pageType && pageType.toLowerCase()}",
           'pageTitle': "${seoTitle && seoTitle.toLowerCase()}",
           'pageName': "${pageName && pageName.toLowerCase()}",
           'load' : 'pageload',
           'pageHierarchy':"${this.computePageHierarchy(breadcrumb, (pageInfo || {}).page, seoTitle).toLowerCase()}"
           }];`}
        </Safe.script>
      </React.Fragment>
    );
  }
}
Seo.propTypes = {
  api: PropTypes.object,
  pageInfo: PropTypes.object
};

Seo.defaultProps = {
  api: {},
  pageInfo: {}
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<Seo {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default Seo;
