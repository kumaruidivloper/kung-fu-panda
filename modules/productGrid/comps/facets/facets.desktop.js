import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import FiltersDrawer from './filters.drawer';
import { filterIconBlue, filterMinHeight } from './styles';
import { LABEL_CLEAR, LABEL_APPLY } from './constants';
import { LABEL_ADD, LABEL_REMOVE, R_AFFCODE, R_CM_MMC, R_CID } from '../../constants';
import QueryStringUtils from '../../QueryStringUtils';
import { updateFacets, updateSelectedFacets, toggleFindAStore } from '../../actions';
import { printBreadCrumb } from '../../../../utils/breadCrumb';

/**
 * The FacetsDesktop component provides the rendring for facets in desktop view.
 * @class
 * @classdesc The desktop view facets
 * @example <caption>Example usage of FacetsMobile</caption>
 * <FacetsDesktop auid="" {...this.props} />
 */
class FacetsDesktop extends PureComponent {
  /**
   * The constructor function for initialization and binding the function for scope
   * @param {Object} props The props of the component
   */
  constructor(props) {
    super(props);
    this.pushAnalytics = this.pushAnalytics.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.pushAnalyticsAnchor = this.pushAnalyticsAnchor.bind(this);
  }

  /**
   * Handling the changes in filter and pushing it to our state through actions
   * Also, pushing the analytics data
   * @param {Object} e The event object of checkbox change event
   * @param {Object} label The label object of facet
   * @param {Object} parentName The name of parent category of facets
   *
   * @memberof FacetsDesktop#
   */
  onFilterChange(e, label, parentName) {
    e.preventDefault();
    const isChecked = e.target.checked;
    const { breadcrumb = [] } = this.props;
    const data = {
      selectedLabelName: label.name,
      selectedLabelId: label.property,
      selectedLabelParentDrawer: parentName,
      itemCount: label.count
    };
    const options = {
      selectedSortValue: this.props.sortValue,
      categoryId: this.props.categoryId,
      pageSize: this.props.pageSize,
      pageNumber: 1, // set to one always
      isSearch: this.props.isSearch,
      searchTerm: this.props.searchTerm
    };

    // Following is clear all the facets data.
    if (data.selectedLabelId === 0) {
      this.props.fnUpdateSelectedFacets(options);
      return;
    }

    this.props.onFacetsUpdate({ pageNumber: 1 });
    if (isChecked) {
      this.props.fnUpdateSelectedFacets(options, data, LABEL_ADD);
      let totalCount = 0;
      const arr = [];
      arr.push(data);
      const analyticsArray = this.props.selectedFacets.concat(arr);
      const selectedAnalytics = [];
      analyticsArray.forEach(item => {
        selectedAnalytics.push(`${item.selectedLabelParentDrawer}:${item.selectedLabelName}`);
        // total count of search results
        totalCount += parseInt(item.itemCount, 10);
      });
      // desktop analytics on facet selection
      this.pushAnalytics(LABEL_APPLY, printBreadCrumb(breadcrumb).toLowerCase(), `${selectedAnalytics.join('|')}`, totalCount);
    } else {
      this.props.fnUpdateSelectedFacets(options, data, LABEL_REMOVE);
      const totalItemCount = parseInt(this.props.totalItem, 10) - parseInt(data.itemCount, 10);
      // total count of search results
      const totalCount = totalItemCount || (this.props.pageInfo && this.props.pageInfo.api && this.props.pageInfo.api.recordSetTotal);
      const analyticsArray = this.props.selectedFacets.filter(obj => obj.selectedLabelId !== label.property);
      const selectedAnalytics = [];
      if (analyticsArray && analyticsArray.length) {
        analyticsArray.forEach(item => {
          selectedAnalytics.push(`${item.selectedLabelParentDrawer}:${item.selectedLabelName}`);
        });
      }
      // desktop analytics on facet removal
      this.pushAnalytics(LABEL_CLEAR, printBreadCrumb(breadcrumb).toLowerCase(), `${selectedAnalytics.join('|')}`, totalCount);
    }
  }

  /**
   * Push the analytics
   * @param {String} eventType The event type i.e. apply or clear
   * @param {string} breadcrumblabel the breadcrumb label
   * @param {String} data The data for event action
   * @param {Number} itemCount The number of item
   *
   * @memberof FacetsDesktop#
   */
  pushAnalytics(evtType, breadcrumblabel = '', data = '', itemCount) {
    const actionType = evtType === LABEL_APPLY ? LABEL_APPLY : LABEL_CLEAR;
    const filterValue = evtType === LABEL_APPLY ? 1 : 0;
    const { pageInfo, gtmDataLayer } = this.props;
    const { api } = pageInfo;
    const isPredictiveSearch = api && api.spellCheck && api.spellCheck.length > 0;
    if (!isPredictiveSearch) {
      if (pageInfo && pageInfo.isSearch) {
        gtmDataLayer.push({
          event: 'search',
          eventCategory: 'internal search results clicks',
          eventAction: `search facets_${actionType.toLowerCase()}_${data.toLowerCase()}`,
          eventLabel: this.props.searchTerm && this.props.searchTerm.toLowerCase(),
          searchresultscount: itemCount
        });
      } else {
        gtmDataLayer.push({
          event: 'plpClicks',
          eventCategory: 'plp interactions',
          eventAction: `plp facet|${actionType.toLowerCase()}${data.length ? `${'|'}`.concat(data.toLowerCase()) : ''}`,
          eventLabel: breadcrumblabel.toLowerCase(),
          applycatalogfilter: filterValue,
          facetsused: data.toLowerCase()
        });
      }
    }
  }

  /**
   * Push the analytics for anchor tag
   * @param {} e event
   * @param {String} categoryName category name  i.e. brand
   * @param {String} url url to go
   *
   * @memberof FacetsDesktop#
   */
  pushAnalyticsAnchor(e, categoryName, url) {
    e.preventDefault();
    const { breadcrumb, pageInfo, selectedFacets } = this.props;
    const { isSearch, searchTerm, api } = pageInfo;
    const isPredictiveSearch = api && api.spellCheck && api.spellCheck.length > 0;
    if (!isPredictiveSearch) {
      const breadcrumbLabelsArray = breadcrumb && breadcrumb.map(item => item.label);
      const breadcrumbLabels = (breadcrumbLabelsArray && breadcrumbLabelsArray.join(' > ')) || '';
      if (isSearch) {
        const { recordSetTotal } = api;
        this.props.gtmDataLayer.push({
          event: 'search',
          eventCategory: 'internal search results clicks',
          eventAction: `search facets_category:${categoryName.toLowerCase()}`,
          eventLabel: searchTerm,
          searchresultscount: recordSetTotal || 0
        });
      } else {
        this.props.gtmDataLayer.push({
          event: 'plpClicks',
          eventCategory: 'plp interactions',
          eventAction: `plp facet|category:${categoryName && categoryName.toLowerCase()}`,
          eventLabel: breadcrumbLabels && breadcrumbLabels.toLowerCase(),
          applycatalogfilter: 1,
          facetsused: `category:${categoryName && categoryName.toLowerCase()}`
        });
      }
    }
    if (!ExecutionEnvironment.canUseDOM) return;
    if (selectedFacets && selectedFacets.length > 0) {
      window.location.href = `${url}${window.location.search}`;
    } else {
      window.location.href = url;
    }
  }

  /**
   * render the desktop facets view
   * @return {Object} The react element FacetsDesktop
   *
   * @memberof FacetsDesktop#
   */
  render() {
    const {
      title,
      auid,
      selectedFacets,
      pageInfo,
      fnToggleFASModal,
      cms,
      sortValue,
      pageSize,
      categoryId,
      searchTerm,
      isSearch,
      gtmDataLayer,
      breadcrumb,
      pageNumber,
      labels
    } = this.props;
    const displayOptions = {
      selectedSortValue: sortValue,
      categoryId,
      pageSize,
      pageNumber,
      isSearch,
      searchTerm
    };
    return (
      <section>
        <div data-auid={`filtersTitle${auid}`} className={`o-copy__14reg d-flex align-items-end mb-2 ${filterMinHeight}`}>
          <span
            role="presentation"
            aria-label="facets"
            className={classNames(`${filterIconBlue}`, 'academyicon', 'icon-filter', 'mb-quarter', 'mr-half')}
          />
          <span>
            {title}
            {selectedFacets && selectedFacets.length > 0 ? <span data-auid="filtersCount">({selectedFacets.length})</span> : null}
          </span>
        </div>
        <FiltersDrawer
          fnToggleFASModal={fnToggleFASModal}
          auid={auid}
          pageInfo={pageInfo}
          onFilterChange={this.onFilterChange}
          pushAnalyticsAnchor={this.pushAnalyticsAnchor}
          cms={cms}
          displayOptions={displayOptions}
          gtmDataLayer={gtmDataLayer}
          breadcrumb={breadcrumb}
          labels={labels}
        />
      </section>
    );
  }
}

// set and define the prop types
FacetsDesktop.propTypes = {
  title: PropTypes.string,
  auid: PropTypes.string,
  pageInfo: PropTypes.object,
  fnUpdateSelectedFacets: PropTypes.func,
  selectedFacets: PropTypes.array,
  sortValue: PropTypes.number,
  pageSize: PropTypes.oneOf(PropTypes.string, PropTypes.number),
  pageNumber: PropTypes.oneOf(PropTypes.string, PropTypes.number),
  categoryId: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  searchTerm: PropTypes.string,
  isSearch: PropTypes.bool,
  breadcrumb: PropTypes.array,
  onFacetsUpdate: PropTypes.func,
  totalItem: PropTypes.string,
  fnToggleFASModal: PropTypes.func,
  cms: PropTypes.object,
  labels: PropTypes.object
};

// the default props
FacetsDesktop.defaultProps = {
  title: 'Filters'
};
/**
 * Define the props from state for facets and selected facets
 * @param {Object} state The state object of store
 * @return {Object} The props formed from store state
 */
const mapStateToProps = state => ({
  facets: state.productGrid.facets,
  selectedFacets: state.productGrid.selectedFacets,
  gtmDataLayer: state.gtmDataLayer
});

/**
 * Defining the actions to be dispatched to update state/props
 * @param {Function} dispatch The dispatcher function instance
 * @return {Object} The dispatcher functions object
 */
const mapDispatchToProps = dispatch => ({
  /**
   * Update the URL and dispatch action to update selected facets
   * @param {Object} options The options to form the url for api call
   * @param {Object} data The selected facets data
   * @param {String} mode The operation type to be performed on the state data
   * @return {Dispatcher} The dispatcher instance for triggering action
   */
  fnUpdateSelectedFacets: (options, data, mode) => {
    QueryStringUtils.removeParameters([R_AFFCODE, R_CM_MMC, R_CID]);
    QueryStringUtils.updateFacetsParameter(mode, data);
    return dispatch(updateSelectedFacets(options, data, mode));
  },
  /**
   * Update the facets in store
   * @param {Object} facets The facets to be updated
   * @return {Dispatcher} The dispatcher instance for triggering action
   */
  fnUpdateFacets: facets => dispatch(updateFacets(facets)),
  fnToggleFASModal: data => dispatch(toggleFindAStore(data))
});

// export connected facets compnent for desktop
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacetsDesktop);
