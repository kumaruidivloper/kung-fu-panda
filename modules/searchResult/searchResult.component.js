import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import * as styles from './styles';
import { NODE_TO_MOUNT, DATA_COMP_ID, SEARCH_TYPES } from './constants';
import { cx } from '../../../node_modules/emotion';

class SearchResult extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchMsg: this.props.api.searchTerm ? this.props.api.searchTerm : this.props.pageInfo.ayorterm,
      searchResult: this.props.api.searchResult /* TODO : Change this thing */
    };
    this.renderPredictiveResults = this.renderPredictiveResults.bind(this);
    this.pushSearchPerformedAnalytics = this.pushSearchPerformedAnalytics.bind(this);
  }
  /**
   * pushing analytics when component mounts for search results page
   *
   * @memberof SearchResult
   */
  componentDidMount() {
    const { pageInfo } = this.props;
    if (pageInfo && (pageInfo.isSearch || pageInfo.ayorterm)) {
      this.pushSearchPerformedAnalytics();
    }
  }
  static getInitialProps(params) {
    /* Search Result page - Send back the received response to Node */
    return Promise.resolve({
      data: {
        searchTerm: params.pageInfo ? params.pageInfo.searchTerm : params.cmsPageInfo && params.cmsPageInfo.previewId,
        searchResult: params.pageInfo ? params.pageInfo.api : params.cmsPageInfo && params.cmsPageInfo.previewId
      }
    });
  }

  /**
   * getInternalSearchType based on searchType performed
   *
   * @memberof SearchResult
   */
  getInternalSearchType() {
    const searchType = window.location.href.split('searchType=')[1];
    return SEARCH_TYPES[searchType] || 'reg';
  }

  /**
   * Returns message to display on search result page
   */
  getDisplayMessage() {
    const { cms, pageInfo, labels } = this.props;
    const { searchMsg, searchResult } = this.state;
    let str = '';
    let nullSearch = false;
    if (searchResult && searchResult.spellCheck === undefined) {
      str = cms.sectionTitle;
      if (pageInfo.productNotFound) {
        str = labels.srpRedirectMessage;
      }
      // this.pushSearchPerformedAnalytics('Internal Search Performed', searchMsg, searchResult.recordSetTotal);
    } else if (searchResult && searchResult.spellCheck) {
      str = cms.predictiveSearchMsg;
      // this.pushSearchPerformedAnalytics('Null Search Performed', searchMsg, 0);
    } else if (!searchResult && searchMsg && pageInfo.ayorterm) {
      str = cms.notSoldSearchMsg;
      // this.pushSearchPerformedAnalytics('Null Search Performed', searchMsg, 0);
    } else if (!searchResult && searchMsg) {
      str = cms.nullSearchMsg;
      nullSearch = true;
      // this.pushSearchPerformedAnalytics('Null Search Performed', searchMsg, 0);
    } else if (!searchResult && pageInfo.isHotMarketRedirect) {
      str = (labels && labels.hotMarketMessage) || '';
      // this.pushSearchPerformedAnalytics('Null Search Performed', searchMsg, 0);
    } else if (!searchResult && pageInfo.productNotFound) {
      str = labels && labels.oosRedirectMessage;
    }
    return { str, nullSearch };
  }

  replaceString(str, target, replacestr) {
    if (!target) {
      return str;
    }
    return (
      <span className={styles.searchString}>
        {str.split(target).reduce((prev, curr, i) => {
          if (!i) {
            return [curr];
          }
          return prev.concat(<b>{`"${replacestr}"`}</b>, curr);
        }, [])}
      </span>
    );
  }

  /**
   * pushes Analytics data on predictive results label click
   *
   * @param { object } e event data
   * @param { object } item - object containing information related to predictive label
   * @memberof SearchResult
   */
  pushAnalyticsData(e, item) {
    e.preventDefault();
    const { searchResult } = this.state;
    const { pageInfo } = this.props;
    const { api } = pageInfo;
    const isPredictive = api && api.spellCheck && api.spellCheck.length > 0;
    const eventAction = isPredictive ? 'search results_predictive help click_' : 'null search_predictive help click_';
    const searchresultscount = isPredictive ? 0 : searchResult.recordSetTotal;
    this.props.gtmDataLayer.push({
      event: 'search',
      eventCategory: 'internal search',
      eventAction: `${eventAction}${item.scTerm && item.scTerm.toLowerCase()}`,
      eventLabel: `${item.scTerm && item.scTerm.toLowerCase()}`,
      searchresultscount
    });
    if (ExecutionEnvironment.canUseDOM) {
      window.location = item.scURL;
    }
  }
  /**
   * pushes Analytics data as per the type of search performed
   * e.g.- NullSearch, predictive search etc.
   * This function is executing at node side as well and there
   * access to gtmDataLayer is not available so returning from the function.
   * At client, it will work as expected.
   * @param { string } evtAction - internal search
   * @param { string } evtLabel - the search term
   * @param { string } evtValue - number of results found
   * @memberof SearchResult
   */
  pushSearchPerformedAnalytics() {
    if (!ExecutionEnvironment.canUseDOM) return;
    const { searchResult } = this.state;
    let previousPage = '/';
    if (document.referrer && document.referrer !== '') {
      const previousPageUrl = new URL(document.referrer);
      previousPage = previousPageUrl.pathname;
    }
    console.log('previousPage', previousPage);
    this.props.gtmDataLayer.push({
      searchresultscount: searchResult && searchResult.recordSetTotal && !searchResult.spellCheck ? searchResult.recordSetTotal : 0
    });
  }
  /**
   *
   * @description different predictive search result label shown as alternative of searched item.
   * @returns dom content showing predictive search label
   * @memberof SearchResult
   */
  renderPredictiveResults() {
    const { spellCheck } = this.state.searchResult;
    const resultLength = spellCheck.length;
    return spellCheck.map((item, index) => (
      <Fragment>
        <a className={`${styles.predictiveText} ml-half`} href={item.scURL} onClick={e => this.pushAnalyticsData(e, item)}>
          {item.scTerm}
        </a>
        {index < resultLength - 1 && <span>,</span>}
      </Fragment>
    ));
  }

  render() {
    const { searchMsg, searchResult } = this.state;
    const { str, nullSearch } = this.getDisplayMessage();

    return (
      <div className={cx('container', { 'mb-2 mb-md-0': nullSearch })}>
        <section className={`${styles.searchResultTitle} mt-half mb-1`}>
          {str && this.replaceString(str, '%SEARCHTERM%', decodeURIComponent(searchMsg))}
        </section>
        {searchResult &&
          searchResult.spellCheck !== undefined && (
            <div>
              <div className={`${styles.predictiveResultConatiner} row mt-1 py-1`}>
                <div className="col-12 col-lg align-items-center justify-content-center mb-half px-1 d-lg-none d-block">You might try:</div>
                <div className="col p-0 col-lg d-flex flex-wrap">
                  <span className="d-none pl-1 d-lg-block">You might try:</span>
                  {this.renderPredictiveResults()}
                </div>
              </div>
              <div className={`mt-1 ${styles.DYMText}`}>{`Showing results for "${searchResult.spellCheck[0].scTerm}"`}</div>
            </div>
          )}
      </div>
    );
  }
}

SearchResult.propTypes = {
  cms: PropTypes.object.isRequired,
  api: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  pageInfo: PropTypes.object,
  labels: PropTypes.object
};
const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const SearchResultContainer = connect(mapStateToProps)(SearchResult);
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <SearchResultContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default SearchResultContainer;
