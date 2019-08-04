import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { LABEL_ADD, LABEL_CLEAR, LABEL_REMOVE, QS_FACET, QS_INTCMP } from './constants';
/**
 * Function to remove the query string from url string
 */
const getRemovedQueryString = (key, urlString) => {
  // fix it if only '?' mark is at the end
  if (urlString.lastIndexOf('?') === urlString.length - 1) {
    urlString = urlString.replace('?', ''); // eslint-disable-line
  }
  const regex = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  let updatedUrl;
  if (urlString.match(regex)) {
    if (RegExp.$1 === '?') {
      updatedUrl = urlString.replace(regex, '$1');
    } else if (RegExp.$2 === '&') {
      updatedUrl = urlString.replace(regex, '$2');
    } else {
      updatedUrl = urlString.replace(regex, '');
    }
  }
  return updatedUrl || urlString;
};

const QueryStringUtils = {
  /**
   * This function looks for the url and updates the query string based on the key provided
   */
  updateParameter: (key, value, url) => {
    if (ExecutionEnvironment.canUseDOM) {
      let urlString = url || window.location.href;
      // fix it if only '?' mark is at the end
      if (urlString.lastIndexOf('?') === urlString.length - 1) {
        urlString = urlString.replace('?', '');
      }
      const regex = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
      const separator = urlString.indexOf('?') !== -1 ? '&' : '?';
      let updatedUrl;
      if (urlString.match(regex)) {
        updatedUrl = urlString.replace(regex, '$1' + key + '=' + value + '$2'); // eslint-disable-line
      } else {
        updatedUrl = `${urlString}${separator}${key}=${value}`;
      }
      window.history.pushState(null, document.title, updatedUrl);
    }
  },

  /**
   * This function returns the value for the key provided from query string
   */
  getParameter: (key, url) => {
    if (ExecutionEnvironment.canUseDOM) {
      const urlString = url || window.location.href;
      const regex = new RegExp(`(([?&])${key}=.*?(&|$))`, 'i');
      if (urlString.match(regex)) {
        const queryParam = (RegExp.$1).split('='); // prettier-ignore
        return queryParam[1];
      }
    }
    return '';
  },

  /**
   * This function removes any value from query string with matching key
   */
  removeParameter: (key, url) => {
    if (ExecutionEnvironment.canUseDOM) {
      const urlString = url || window.location.href;
      window.history.pushState(null, document.title, getRemovedQueryString(key, urlString) || urlString);
    }
  },

  removeParameters: (keys, url) => {
    if (ExecutionEnvironment.canUseDOM) {
      let urlString = url || window.location.href;
      if (keys && keys.length > 0) {
        keys.forEach(key => {
          urlString = getRemovedQueryString(key, urlString);
        });
        window.history.pushState(null, document.title, urlString);
      }
    }
  },

  /**
   * This is specific to facet update in query string on change in facets select/deselect
   */
  updateFacetsParameter: (mode, data) => {
    if (ExecutionEnvironment.canUseDOM) {
      const url = window.location.href.split('?');
      const baseUrl = url[0];
      if (mode.toLowerCase() === LABEL_CLEAR) {
        let queryString = window.location.search;
        const facetRegex = '(?:^|[?&])facet=([^&]*)';
        queryString = queryString.replace(new RegExp(facetRegex, 'g'), '');
        if (queryString.charAt(0) === '&') {
          queryString = `?${queryString.substring(1, queryString.length)}`;
        }
        window.history.pushState(null, document.title, `${baseUrl}${queryString}`);
        return;
      }
      if (data && data.selectedLabelId) {
        let queryStrings = window.location.search;
        const specials = ['-', '.', '+'];
        const regx = RegExp(`[${specials.join('\\')}]`, 'g');
        const strRegex = `([&?]?)(facet=${data.selectedLabelId})(&|$)?`;
        const regex = new RegExp(strRegex.replace(regx, '\\$&'), 'i');
        // const regex = new RegExp(`([?&])(${QS_FACET}=${data.selectedLabelId})?(&|$)`, 'i');
        let updatedQueryString = '';
        if (mode === LABEL_ADD) {
          const separator = queryStrings.indexOf('?') !== -1 ? '&' : '?';
          updatedQueryString = queryStrings;
          if (!queryStrings.match(regex)) {
            updatedQueryString = `${queryStrings}${separator}${QS_FACET}=${data.selectedLabelId}`;
          }
        } else if (mode === LABEL_REMOVE) {
          let baseQueryStrings;
          if (queryStrings.indexOf(QS_INTCMP) !== -1) {
            const tempQueryStringArr = queryStrings.split(/&intcmp=.*?&|&intcmp=.*/g);
            queryStrings.replace(/(([&?])(intcmp=.*))/i, '$1');
            queryStrings = RegExp.$1;
            [baseQueryStrings] = tempQueryStringArr;
          } else {
            baseQueryStrings = '';
          }
          if (queryStrings.match(regex)) {
            if (RegExp.$1 === '?' && RegExp.$3 === '&') {
              updatedQueryString = queryStrings.replace(regex, '$1');
            } else if (RegExp.$1 === '&' && RegExp.$3 === '') {
              updatedQueryString = queryStrings.replace(regex, '');
            } else if (RegExp.$1 === '&' && RegExp.$3 === '&') {
              updatedQueryString = queryStrings.replace(regex, '$1');
            } else if (RegExp.$1 === '?' && RegExp.$3 === '') {
              updatedQueryString = queryStrings.replace(regex, '');
            }
            updatedQueryString = `${baseQueryStrings}${updatedQueryString}`;
          }
        }
        const updatedUrl = `${baseUrl}${updatedQueryString}`;
        window.history.pushState(null, document.title, updatedUrl);
      }
    }
  }
};

export default QueryStringUtils;
