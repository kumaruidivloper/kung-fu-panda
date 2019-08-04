import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { updateSelectedFacets } from '../../actions';
import QueryStringUtils from '../../QueryStringUtils';
import { LABEL_CLEAR, LABEL_REMOVE, R_AFFCODE, R_CM_MMC, R_CID } from '../../constants';

const SelectedFacetContainer = css`
  display: flex;
  flex-wrap: wrap;
  line-height: 1.5;
  letter-spacing: 0.7px;
  text-align: left;
  color: #585858;
`;

const SelectedFacetItem = css`
  margin: 6px;
  cursor: pointer;
`;

const clearAllBtn = css`
  color: #0055a6;
  :hover {
    text-decoration: underline;
  }
`;

class SelectedFacets extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDesktop: ExecutionEnvironment.canUseDOM ? window.innerWidth > 420 : false
    };
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.facetChangeListener = this.facetChangeListener.bind(this);
    this.selectedFacetChangeListener = this.selectedFacetChangeListener.bind(this);
    this.onClearAll = this.onClearAll.bind(this);
    this.pushAnalytics = this.pushAnalytics.bind(this);
    // if(ExecutionEnvironment.canUseDOM) {
    //   const queryParams = window.location.search;
    //   console.log('queryParams', queryParams);
    //   console.log('stateVariables', this.state);
    // }
  }

  onRemoveItem(data) {
    this.facetChangeListener(data);
  }

  onClearAll(msg, data) {
    const selectedFacetsList = this.state.selectedFacets.filter(item => item.selectedLabelParentDrawer !== data.name);
    this.setState({
      selectedFacets: selectedFacetsList
    });
  }

  /**
   * Handling the changes in filter and pushing it to our state through actions
   * Also pushing the Analytics
   *
   * @param {object} data - The data of selected facets
   * @memberof SelectedFacets
   */
  facetChangeListener(data) {
    const { selectedFacets, breadcrumb = [] } = this.props;
    const selectedAnalyticsArray = [];
    selectedFacets.forEach(item => {
      selectedAnalyticsArray.push(`${item.selectedLabelParentDrawer}:${item.selectedLabelName}`);
    });
    const breadcrumbLabels = breadcrumb.map(item => item.label);
    const { selectedLabelId } = data;
    const options = {
      selectedSortValue: this.props.sortValue,
      categoryId: this.props.categoryId,
      pageSize: this.props.pageSize,
      preventRequest: !this.state.isDesktop,
      pageNumber: this.props.pageNumber,
      isSearch: this.props.isSearch,
      searchTerm: this.props.searchTerm
    };
    if (selectedLabelId === 0) {
      this.props.fnUpdateSelectedFacets(options);
    } else {
      this.props.fnUpdateSelectedFacets(options, data, LABEL_REMOVE);
    }
    const totalItemCount = parseInt(this.props.recordSetTotal, 10) - parseInt(data.itemCount, 10);
    // total count of search results
    const totalCount = totalItemCount || (this.props.api && this.props.api.recordSetTotal);
    let clearLabel = `${selectedAnalyticsArray.join('|')}`;
    if (data.selectedLabelId === 0) {
      clearLabel = 'clear all';
    }
    // analytics on selected facet removal
    this.pushAnalytics(`${breadcrumbLabels.join(' > ')}`.toLowerCase(), clearLabel.toLowerCase(), totalCount);
  }

  selectedFacetChangeListener(msg, data) {
    this.setState({
      selectedFacets: data.selectedFacets
    });
  }
  /**
   * Push the analytics
   * @param {String} event The envent label
   * @param {String} data The data for event action
   * @param {Number} itemCount The number of item
   *
   * @memberof SelectedFacets
   */
  pushAnalytics(event, data, itemCount) {
    if (!this.props.isPredictiveSearch) {
      if (this.props.isSearch) {
        this.props.gtmDataLayer.push({
          event: 'search',
          eventCategory: 'internal search results clicks',
          eventAction: `search facets_${data}`,
          eventLabel: this.props.searchTerm && this.props.searchTerm.toLowerCase(),
          searchresultscount: itemCount
        });
      } else {
        this.props.gtmDataLayer.push({
          event: 'facetsClicks',
          eventCategory: 'plp interactions',
          eventAction: `plp facet|${data}`,
          eventLabel: event,
          applycatalogfilter: 0,
          facetsused: data
        });
      }
    }
  }
  render() {
    const { selectedFacets } = this.props;
    return (
      <div className={`${SelectedFacetContainer}`}>
        {selectedFacets &&
          selectedFacets.map(index => (
            <div
              className={`${SelectedFacetItem} o-copy__14reg`}
              key={index.selectedLabelId}
              tabIndex={0}
              role="button"
              onClick={() =>
                this.onRemoveItem({
                  selectedLabelName: index.selectedLabelName,
                  selectedLabelId: index.selectedLabelId,
                  selectedLabelParentDrawer: index.selectedLabelParentDrawer,
                  itemCount: index.itemCount
                })
              }
              onKeyPress={() =>
                this.onRemoveItem({
                  selectedLabelName: index.selectedLabelName,
                  selectedLabelId: index.selectedLabelId,
                  selectedLabelParentDrawer: index.selectedLabelParentDrawer,
                  itemCount: index.itemCount
                })
              }
            >
              <i className="academyicon icon-close mx-half o-copy__12reg" />
              {<span>{index.selectedLabelName}</span> /*eslint-disable-line*/}
            </div>
          ))}
        {selectedFacets &&
          selectedFacets.length > 0 && (
            <div
              data-auid="clearAll"
              className={`${SelectedFacetItem} o-copy__14reg d-none d-lg-block`}
              tabIndex={0}
              role="button"
              onClick={() =>
                this.onRemoveItem({
                  selectedLabelName: 0,
                  selectedLabelId: 0
                })
              }
              onKeyPress={() => this.onRemoveItem({ selectedLabelName: 0, selectedLabelId: 0 })}
            >
              {<span className={clearAllBtn}>Clear All</span> /*eslint-disable-line*/}
            </div>
          )}
      </div>
    );
  }
}

SelectedFacets.propTypes = {
  selectedFacets: PropTypes.array,
  fnUpdateSelectedFacets: PropTypes.func,
  sortValue: PropTypes.number,
  breadcrumb: PropTypes.array,
  pageSize: PropTypes.oneOf(PropTypes.string, PropTypes.number),
  pageNumber: PropTypes.number,
  categoryId: PropTypes.string,
  isSearch: PropTypes.bool,
  searchTerm: PropTypes.string,
  recordSetTotal: PropTypes.string,
  api: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  gtmDataLayer: PropTypes.array,
  isPredictiveSearch: PropTypes.bool
};

const mapStateToProps = state => ({
  selectedFacets: state.productGrid.selectedFacets,
  gtmDataLayer: state.gtmDataLayer
});

const mapDispatchToProps = dispatch => ({
  fnUpdateSelectedFacets: (options, data, mode) => {
    QueryStringUtils.removeParameters([R_AFFCODE, R_CM_MMC, R_CID]);
    QueryStringUtils.updateFacetsParameter(mode || LABEL_CLEAR, data);
    return dispatch(updateSelectedFacets(options, data, mode));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectedFacets);
