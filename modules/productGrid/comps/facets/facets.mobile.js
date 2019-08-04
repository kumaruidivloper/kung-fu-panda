import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import SelectedFacets from '../selectedFacets/selectedFacets';
import { facetsCTA, facetModalContent, filterIconBlue, filtersLabel } from './styles';
import FiltersDrawer from './filters.drawer';
import { LABEL_CLEAR, LABEL_APPLY, IN_STORE_PICKUP_NAME } from './constants';
import QueryStringUtils from '../../QueryStringUtils';
import { updateSelectedFacets, updateFacets, applyFacets, toggleFindAStore } from '../../actions';
import { LABEL_ADD, LABEL_REMOVE, R_AFFCODE, R_CM_MMC, R_CID } from '../../constants';
import { printBreadCrumb } from '../../../../utils/breadCrumb';

/**
 * The FacetsMobile component provides the rendring for facets in mobile view.
 * This one also has the SelectedFacets included which is not part of desktop view facets
 * @class
 * @classdesc The mobile view facets
 * @example <caption>Example usage of FacetsMobile</caption>
 * <FacetsMobile auid="_m" {...this.props} closeModal={this.handleModalClose} />
 */
class FacetsMobile extends PureComponent {
  /**
   * The constructor function for initialization and binding the function for scope
   * @param {Object} props The props of the component
   */
  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.handleFacetsClear = this.handleFacetsClear.bind(this);
    this.handleFacetsApply = this.handleFacetsApply.bind(this);
    this.pushAnalytics = this.pushAnalytics.bind(this);
    this.pushAnalyticsOnApplyAndClear = this.pushAnalyticsOnApplyAndClear.bind(this);
    this.pushAnalyticsAnchor = this.pushAnalyticsAnchor.bind(this);
    this.state = {
      applyClearClicked: ''
    };
  }

  /**
   * Method used to push analytics once new props are received after Apply/Clear is clicked.
   */
  componentDidUpdate() {
    const { applyClearClicked } = this.state;
    if (applyClearClicked) {
      this.pushAnalyticsOnApplyAndClear(applyClearClicked);
      this.clearApplyClear();
    }
  }

  /**
   * Handling the changes in filter and pushing it to our state through actions
   * Also, pushing the analytics data
   * @param {Object} e The event object of checkbox change event
   * @param {Object} label The label object of facet
   * @param {Object} parentName The name of parent category of facets
   * @memberof FacetsMobile#
   */
  onFilterChange(e, label, parentName) {
    // e.preventDefault();
    const isChecked = e.target.checked;
    const { breadcrumb = [], selectedFacets = [] } = this.props;
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
      preventRequest: true,
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
      const modifiedBreadCrumbs = [...breadcrumb];
      this.pushAnalytics(printBreadCrumb(modifiedBreadCrumbs).toLowerCase(), `${selectedAnalytics.join('|')}`, totalCount);
    } else {
      // Enable to make async request to load facets On mobile when Instore pickup is unchecked
      // This is because Bopis filter is dynamically injected at runtime not retrieved from API
      const { selectedLabelName } = data;
      if (selectedLabelName === IN_STORE_PICKUP_NAME && selectedFacets.length === 1) {
        options.preventRequest = false;
      }
      this.props.fnUpdateSelectedFacets(options, data, LABEL_REMOVE);

      const totalItemCount = parseInt(this.props.recordSetTotal, 10) - parseInt(data.itemCount, 10);
      // total count of search results
      const totalCount = totalItemCount || (this.props.pageInfo.api && this.props.pageInfo.api.recordSetTotal);
      const analyticsArray = this.props.selectedFacets.filter(obj => obj.selectedLabelId !== label.property);
      const selectedAnalytics = [];
      if (analyticsArray && analyticsArray.length) {
        analyticsArray.forEach(item => {
          selectedAnalytics.push(`${item.selectedLabelParentDrawer}:${item.selectedLabelName}`);
        });
      }
      // desktop analytics on facet removal
      const modifiedBreadCrumbs = [LABEL_CLEAR, ...breadcrumb];
      this.pushAnalytics(printBreadCrumb(modifiedBreadCrumbs).toLowerCase(), `${selectedAnalytics.join('|')}`, totalCount);
    }
  }
  /**
   * Method to clear state after Apply/Clear have been clicked.
   */
  clearApplyClear() {
    this.setState({ applyClearClicked: '' });
  }
  /**
   * Clear out the selected facets and pushes the analytics
   * @memberof FacetsMobile#
   */
  handleFacetsClear() {
    const options = {
      selectedSortValue: this.props.sortValue,
      categoryId: this.props.categoryId,
      pageSize: this.props.pageSize,
      isSearch: this.props.isSearch,
      pageNumber: 1, // set to one always
      searchTerm: this.props.searchTerm,
      isDesktop: true
    };
    this.props.fnUpdateSelectedFacets(options, null, LABEL_CLEAR);
    this.setState({ applyClearClicked: LABEL_CLEAR });
  }
  /**
   * Applies all the facets by triggering the API call through saga
   * Updates the analytics
   * Closes the modal view of facets
   * @memberof FacetsMobile#
   */
  handleFacetsApply() {
    this.props.closeModal();
    const options = {
      selectedSortValue: this.props.sortValue,
      categoryId: this.props.categoryId,
      pageSize: this.props.pageSize,
      isSearch: this.props.isSearch,
      pageNumber: 1, // set to one always
      searchTerm: this.props.searchTerm,
      isDesktop: true
    };

    this.props.fnApplyFacets(options);
    this.setState({ applyClearClicked: LABEL_APPLY });
  }

  /**
   * Push the analytics
   * @param {String} event The envent label
   * @param {String} data The data for event action
   * @param {Number} itemCount The number of item
   * @memberof FacetsMobile#
   */
  pushAnalytics(event, data, itemCount) {
    if (this.props.pageInfo && this.props.pageInfo.isSearch) {
      this.props.gtmDataLayer.push({
        event: 'search',
        eventCategory: 'internal search',
        eventAction: data ? `search facet|${data.toLowerCase()}` : 'search facet',
        eventLabel: `${event}`,
        eventValue: `${itemCount}`
      });
    } else {
      this.props.gtmDataLayer.push({
        event: 'facetsClicks',
        eventCategory: 'plp facets clicks',
        eventAction: data ? `plp facets|${data.toLowerCase()}` : 'plp facet',
        eventLabel: `${event.toLowerCase()}`
      });
    }
  }

  /**
   * Push the analytics for clear or apply
   * @param {String} evtAction type of action operation
   * @memberof FacetsMobile#
   */
  pushAnalyticsOnApplyAndClear(evtAction) {
    const { breadcrumb, recordSetTotal, pageInfo, gtmDataLayer } = this.props;
    const { api } = pageInfo;
    const selectedAnalytics = [];
    const analyticsArray = this.props.selectedFacets;
    let breadCrumbLabel = '';
    if (!!breadcrumb && breadcrumb.length) {
      breadCrumbLabel = breadcrumb.map(list => list.label);
    }
    let itemCount = 0;
    analyticsArray.forEach(item => {
      selectedAnalytics.push(`${item.selectedLabelParentDrawer}:${item.selectedLabelName}`);
      itemCount += parseInt(item.itemCount, 10);
    });
    // Analytics data in mobile apply or clear
    const totalResult = evtAction === LABEL_APPLY ? itemCount : recordSetTotal;
    const filterValue = evtAction === LABEL_APPLY ? 1 : 0;
    const isPredictiveSearch = api && api.spellCheck && api.spellCheck.length > 0;
    if (!isPredictiveSearch) {
      if (pageInfo && pageInfo.isSearch) {
        gtmDataLayer.push({
          event: 'search',
          eventCategory: 'internal search results clicks',
          eventAction: `search facets_${selectedAnalytics.join('_')}`,
          eventLabel: breadCrumbLabel.length ? breadCrumbLabel.join(' > ').toLowerCase() : '',
          searchresultscount: `${totalResult}`
        });
      } else {
        gtmDataLayer.push({
          event: 'plpClicks',
          eventCategory: 'plp interactions',
          eventAction: `plp facet|${evtAction}${selectedAnalytics.length ? '|'.concat(selectedAnalytics.join('|')) : ''}`.toLowerCase(),
          eventLabel: breadCrumbLabel.length ? breadCrumbLabel.join(' > ').toLowerCase() : '',
          applycatalogfilter: filterValue,
          facetsused: selectedAnalytics.join('|').toLowerCase()
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
   * @memberof FacetsMobile#
   */
  pushAnalyticsAnchor(e, categoryName, url) {
    e.preventDefault();
    const { breadcrumb, pageInfo, selectedFacets } = this.props;
    const { isSearch, searchTerm, api } = pageInfo;
    // const { pageInfo, gtmDataLayer } = this.props;
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
   * Render the facets for mobile view
   * @return {Object} The react element FacetsMobile
   * @memberof FacetsMobile#
   */
  render() {
    const {
      pageInfo,
      api,
      auid,
      pageSize,
      categoryId,
      sortValue,
      pageNumber,
      isSearch,
      searchTerm,
      selectedFacets,
      gtmDataLayer,
      breadcrumb,
      fnToggleFASModal,
      cms,
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
      <Fragment>
        <div className={`${facetsCTA}`} data-auid="facetsModalCTAS_M">
          <button className="" type="button" onClick={this.handleFacetsClear}>
            Clear All
          </button>
          <button className="" onClick={this.handleFacetsApply} type="button">
            Apply
          </button>
        </div>
        <div data-auid={`facetsModalContent${auid}`} className={facetModalContent} id="mobileFacetModal">
          <div className="pt-2 pb-half px-1 text-left">
            <i role="presentation" aria-label="facets" className={classNames(`${filterIconBlue}`, 'academyicon', 'icon-filter')} />
            <span className={`${filtersLabel} o-copy__14reg`} role="button" tabIndex={0}>
              {`Filters (${selectedFacets && selectedFacets.length})`}
            </span>
            {/* <span>({facets && facets.length})</span> */}
          </div>
          <SelectedFacets
            pageSize={pageSize}
            isSearch={isSearch}
            searchTerm={searchTerm}
            categoryId={categoryId}
            sortValue={sortValue}
            api={api}
            pageNumber={pageNumber}
            gtmDataLayer={gtmDataLayer}
            selectedFacets={selectedFacets}
          />
          <FiltersDrawer
            isMobile
            auid={auid}
            pageInfo={pageInfo}
            onFilterChange={this.onFilterChange}
            pushAnalyticsAnchor={this.pushAnalyticsAnchor}
            fnToggleFASModal={fnToggleFASModal}
            cms={cms}
            displayOptions={displayOptions}
            gtmDataLayer={gtmDataLayer}
            breadcrumb={breadcrumb}
            labels={labels}
          />
        </div>
      </Fragment>
    );
  }
}

// props definition
FacetsMobile.propTypes = {
  auid: PropTypes.string.isRequired,
  pageNumber: PropTypes.number,
  isSearch: PropTypes.bool,
  gtmDataLayer: PropTypes.array.isRequired,
  pageInfo: PropTypes.object,
  recordSetTotal: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  selectedFacets: PropTypes.array,
  fnApplyFacets: PropTypes.func,
  onFacetsUpdate: PropTypes.func,
  fnUpdateSelectedFacets: PropTypes.func,
  pageSize: PropTypes.number,
  categoryId: PropTypes.string,
  searchTerm: PropTypes.string,
  sortValue: PropTypes.number,
  breadcrumb: PropTypes.array,
  api: PropTypes.object,
  fnToggleFASModal: PropTypes.func,
  cms: PropTypes.object,
  labels: PropTypes.object
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
  fnToggleFASModal: data => dispatch(toggleFindAStore(data)),
  /**
   * Update the facets and data for API call. Used in mobile view when apply button is clicked
   * @param {Object} options The option object to form the url for api
   */
  fnApplyFacets: options => dispatch(applyFacets(options))
});

// export connected facets compnent for desktop
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacetsMobile);
