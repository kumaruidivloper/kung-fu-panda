/**
 * This is a utility class to handle different kind of
 * query parameter needs.
 * It is in progress and more methods can be added at later point in time.
 *
 * @class
 * @classdesc This is a utility class to handle different kind of query parameter needs.
 * @example
 * ```
 * import QueryStringManager from 'utils/QueryStringManager'
 * .
 * .
 * .
 * QueryStringManager.getUrlWithRestrictedParams()
 * ```
 */
class QueryParamsManager {
  constructor() {
    throw new Error('Cannot construct QueryParamsManager!');
  }

  /**
   * This function specifically looks for three query parameter
   * and appends it into the URl as query params.
   * If any new restricted params need to be added, please update
   * the const variable ```restrictedParams``` above
   * @param {Object} options The object having queries to process, data to get query data from and the url
   * @param {Array} options.queries The query string to look for and add to url
   * @param {Object} options.data The data from which query key value to be fetched
   * @param {String} options.requestUrl The URL in which the query params need to be added
   * @return {String} The request url with added query parameter
   * @memberof #QueryParamsManager
   */
  static getUrlWithRestrictedParams(options) {
    const { queries, data, url } = options;
    let tempQueryString = '';
    if (Array.isArray(queries) && queries.length > 0) {
      queries.forEach(key => {
        const value = data && data[key];
        if (value) {
          tempQueryString += `&${key}=${value}`;
        }
      });
    }

    if (url.indexOf('?') === -1) {
      tempQueryString = `?${tempQueryString.substring(1, tempQueryString.length)}`;
    }
    console.info('__getRequestUrlWithRestrictedQueryParams__URL: ', `${url}${tempQueryString}`);
    return `${url}${tempQueryString}`;
  }
}
export default QueryParamsManager;
