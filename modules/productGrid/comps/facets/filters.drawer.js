import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styled from 'react-emotion';
import Drawer from '@academysports/fusion-components/dist/Drawer';
import Rating from '@academysports/fusion-components/dist/Rating';
import { facetDrawerBackground, filterListItem } from './styles';
import { isElementInViewport } from '../../../../utils/domUtils';
import {
  LABEL_PICKUP_LOCATION,
  SHIPPING_PICKUP_TITLE,
  IN_STORE_PICKUP_NAME,
  IN_STORE_PICKUP_ID,
  BOPIS_STORE_ID,
  NO_STORES_WITHIN_250_MI_FACET,
  IN_STORE_PICKUP_FACET
} from './constants';
import QueryStringUtils from '../../QueryStringUtils';
import { LABEL_REMOVE, LABEL_ADD, LABEL_REPLACE } from '../../constants';
import { updateSelectedFacets } from '../../actions';
import { printBreadCrumb } from '../../../../utils/breadCrumb';

const OPEN_MODE_SINGLE = 'single';
const SCROLL_OFFSET = 82;
const Input = styled('input')`
  opacity: 0;
  width: 20px;
  height: 20px;
  position: absolute;
  & + label::after {
    content: none;
  }
  &:checked + label::after {
    content: '';
  }
  &:focus + label::before {
    outline: rgb(59, 153, 252) auto 5px;
  }
`;

const Label = styled('label')`
  position: relative;
  display: inline-block;
  font-size: 18px;
  span {
    -webkit-font-smoothing: auto;
    -moz-osx-font-smoothing: auto;
  }

  &.icon-checkbox-inactive:before {
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  }
`;

/**
 * The FiltersDrawer component
 * @class
 * @classdesc The FiltersDrawer component used in both facets for desktop and mobile
 * @example
 * <FiltersDrawer auid={auid} pageInfo={pageInfo} onFilterChange={this.onFilterChange} />
 */
class FiltersDrawer extends PureComponent {
  /**
   * The constructor function
   * @param {Object} props The property of the component
   */
  constructor(props) {
    super(props);
    this.state = {
      drawerId: '',
      isDrawerOpen: false
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.renderToggleFilter = this.renderToggleFilter.bind(this);
    this.renderAnchorFilter = this.renderAnchorFilter.bind(this);
    this.renderFiltersItem = this.renderFiltersItem.bind(this);
    this.renderFacetsDrawer = this.renderFacetsDrawer.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.clickPickupLocationLogGA = this.clickPickupLocationLogGA.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { selectedStore = {} } = prevProps;
    const { selectedStore: currentSelectedStore = {}, fnUpdateSelectedFacets, displayOptions, selectedFacets = [] } = this.props;
    const filteredBopisFacet = selectedFacets.filter(({ selectedLabelName }) => selectedLabelName === IN_STORE_PICKUP_NAME);

    /*
      Update Query params, Selected facets and reload data if store selection change happens
      This will work even if store selection happens from Header/PDP
    */
    if (filteredBopisFacet.length && selectedStore.gx_id && selectedStore.gx_id !== currentSelectedStore.gx_id) {
      fnUpdateSelectedFacets(displayOptions, this.getSelectedBopisData(selectedStore, currentSelectedStore), LABEL_REPLACE);
    } else if (
      filteredBopisFacet.length === 0 &&
      ExecutionEnvironment.canUseDOM &&
      window.location.href.indexOf(BOPIS_STORE_ID) > 0 &&
      currentSelectedStore &&
      currentSelectedStore.gx_id
    ) {
      fnUpdateSelectedFacets(displayOptions, this.getSelectedBopisData(selectedStore, currentSelectedStore), LABEL_ADD);
    }
  }

  /**
   * Method to get currently selected bopis data based on the current store selection
   * and update url query param with the latest bopis id
   */
  getSelectedBopisData = (selectedStore, currentSelectedStore) => {
    const commonBopis = {
      selectedLabelName: IN_STORE_PICKUP_NAME,
      selectedLabelParentDrawer: SHIPPING_PICKUP_TITLE
    };
    const currentBopisData = {
      selectedLabelId: `${BOPIS_STORE_ID}:%22${selectedStore.gx_id}%22`,
      ...commonBopis
    };
    const selectedBopisData = {
      selectedLabelId: `${BOPIS_STORE_ID}:%22${currentSelectedStore.gx_id}%22`,
      ...commonBopis,
      currentSelectedLabelId: currentBopisData.selectedLabelId
    };
    QueryStringUtils.updateFacetsParameter(LABEL_REMOVE, currentBopisData);
    QueryStringUtils.updateFacetsParameter(LABEL_ADD, selectedBopisData);
    return selectedBopisData;
  };

  /**
   * Send the store id id when calling the facets.
   */
  getInStorePickUpLbl = label => {
    if (label.id === IN_STORE_PICKUP_ID) {
      return { ...label, property: `bopisStoreId:%22${this.props.selectedStore.gx_id}%22` };
    }
    return label;
  };

  handleDrawerToggle(id, isOpen) {
    // handle it here...
    // setting drawerId to 'NA' to handle rendering of the drawer better on checkbox selection
    this.setState(
      {
        drawerId: id || 'NA',
        isDrawerOpen: isOpen
      },
      () => {
        // Added for KER-11026 : current opened drawer is always kept in view if previous opened drawer collapses.
        if (ExecutionEnvironment.canUseDOM) {
          const drawerToFocus = document.getElementById(`drawer${id}`);
          const drawerBtnToFocus = drawerToFocus.querySelector('button');
          // Added check for detection on drawer content instead of just button to fix it for mobile.
          if (!isElementInViewport(drawerToFocus)) {
            drawerBtnToFocus.scrollIntoView();
            /* Following is to keep the button in view
             * Default behaviour hides the button because of header
             * being fixed at the top.
             * Mobile view does not need this so only for desktop
             */
            if (!this.props.isMobile) {
              // adjust the scroll
              window.scrollBy(0, -SCROLL_OFFSET);
            }
          }
        }
      }
    );
  }

  /**
   * Function to handle checkbox click of facet/filter
   * @param {Object} e The change event
   * @param {Object} label The filters in a group
   * @param {Object} The facet object
   * @memberof #FiltersDrawer
   */
  handleCheckboxClick(e, label = {}, facet = {}) {
    this.setState({ drawerId: facet.id, isDrawerOpen: true });
    this.props.onFilterChange(e, this.getInStorePickUpLbl(label), facet.name);
  }

  /**
   * call analytics when change pick up location is clicked
   */
  clickPickupLocationLogGA() {
    const { breadcrumb = [], gtmDataLayer = [] } = this.props;
    gtmDataLayer.push({
      event: 'plpClicks',
      eventCategory: 'plp interactions',
      eventAction: 'change location initiated',
      eventLabel: printBreadCrumb(breadcrumb).toLowerCase(),
      applycatalogfilter: 0,
      facetsused: null
    });
  }

  openFindAStoreModal = e => {
    e.preventDefault();
    this.props.fnToggleFASModal({ status: true, isBopisEligible: true });
    this.clickPickupLocationLogGA();
  };

  /**
   * The render function for anchors if the seo url is available in the data
   * @param {Object} label The label object to render the link
   *
   * @return {Object} The anchor tag to be rendered
   * @memberof FiltersDrawer#
   */
  renderAnchorFilter(label) {
    return (
      <a href={label.seoUrl} onClick={e => this.props.pushAnalyticsAnchor(e, label.name, label.seoUrl)} className="o-copy__14reg">
        {label.name}
        &nbsp;
        {label.count && `(${label.count})`}
      </a>
    );
  }

  /**
   * The render function for checkbox and labels which depicts the filter
   * @param {Object} facet The facet object
   * @param {Object} label The label object of the facet
   * @param {Array} currentSelectedFacetIds Currently selected facet's ID
   * @param {Number} index The index number of current item
   *
   * @return {Object} The render object for individual filter item
   *
   * @memberof FiltersDrawer#
   */
  renderToggleFilter(facet, label, currentSelectedFacetIds, index, selectedStore) {
    const newLabel = this.getInStorePickUpLbl(label);
    const isChecked = currentSelectedFacetIds && currentSelectedFacetIds.indexOf(newLabel.property) !== -1;
    const defaultHref = '#';
    const { disabled = false } = label;
    return (
      <Fragment>
        <Input
          id={label.id}
          type="checkbox"
          value={label.id}
          disabled={disabled}
          onChange={e => this.handleCheckboxClick(e, label, facet)}
          // checked={this.isFacetSelectionExist(item.property)}
          checked={isChecked}
        />
        <Label
          className={classNames({
            'd-flex align-items-start': true,
            'academyicon icon-checkbox-active': isChecked,
            'academyicon icon-checkbox-inactive': !isChecked,
            'mb-1': index !== facet.labels.length - 1,
            'mb-0': index === facet.labels.length - 1
          })}
          htmlFor={label.id}
          disabled={disabled}
        >
          <span className="o-copy__14reg pl-1 w-100">
            {facet.id !== '2506' ? label.name : <Rating value={label.name} />}
            &nbsp;
            {label.count && `(${label.count})`}
            {label.showStore && selectedStore.neighborhood ? (
              <span className="row pt-1">
                <span className="o-copy__12reg pl-1 w-100">{`${selectedStore.neighborhood}`}</span>
                <span className="o-copy__12reg pl-1 w-100">
                  <a href={defaultHref} onClick={e => this.openFindAStoreModal(e)}>{`${LABEL_PICKUP_LOCATION}`}</a>
                </span>
              </span>
            ) : (
              ''
            )}
          </span>
        </Label>
      </Fragment>
    );
  }

  /**
   * The render function for filters
   * @param {Object} facet The facet object
   *
   * @return {Object} The render object for categorised facet
   * @memberof FiltersDrawer#
   */
  renderFiltersItem(facet) {
    const { selectedFacets, auid, selectedStore = {} } = this.props;
    const currentSelectedFacetIds = selectedFacets && selectedFacets.map(sFacet => sFacet.selectedLabelId);
    const { labels } = facet;
    if (!labels.length) return <ul />;
    return (
      <ul className={filterListItem}>
        {labels.map((label, index) => (
          <li className={`o-copy__14reg ${index < labels.length - 1 && 'mb-2'}`} key={label.id} data-auid={`drawer_${label.name}${auid}`}>
            {label.seoUrl ? this.renderAnchorFilter(label) : this.renderToggleFilter(facet, label, currentSelectedFacetIds, index, selectedStore)}
          </li>
        ))}
      </ul>
    );
  }

  /**
   * This function renders the drawer and its filter items
   *
   * @returns
   * @memberof FiltersDrawer
   */
  renderFacetsDrawer() {
    const { facets, auid, mode, isMobile } = this.props;
    const { isDrawerOpen, drawerId } = this.state;
    return (
      facets &&
      facets.map(facet => {
        let isOpened = false;
        /* added for KER-11436, where mobile filters should not have any default opened drawers */
        const openDefault = isMobile ? false : facet.facetExpanded;
        if (mode === OPEN_MODE_SINGLE) {
          isOpened = ((!drawerId && openDefault) || ((facet.id === drawerId && isDrawerOpen) || false)); // prettier-ignore
        }
        return (
          <Drawer
            domid={`drawer${facet.id}`}
            isOpen={isOpened}
            key={`${facet.id}`}
            auid={`_drawer_${facet.name}${auid}`}
            title={`${facet.name.toUpperCase()}`}
            closeIcon="academyicon icon-plus"
            openIcon="academyicon icon-minus"
            tabIndex={0}
            onToggle={isOpen => this.handleDrawerToggle(facet.id, isOpen)}
          >
            {facet.labels.length && this.renderFiltersItem(facet)}
          </Drawer>
        );
      })
    );
  }

  /**
   * The main render method of the component which usage drawer atomic component to render facets
   *
   * @return {Object} the render object of the component FiltersDrawer
   * @memberof FiltersDrawer#
   */
  render() {
    return <div className={facetDrawerBackground}>{this.renderFacetsDrawer()}</div>;
  }
}

// prop-types definition
FiltersDrawer.propTypes = {
  facets: PropTypes.array,
  selectedFacets: PropTypes.array,
  auid: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  mode: PropTypes.string,
  pushAnalyticsAnchor: PropTypes.func,
  isMobile: PropTypes.bool,
  selectedStore: PropTypes.object,
  fnToggleFASModal: PropTypes.func,
  fnUpdateSelectedFacets: PropTypes.func,
  displayOptions: PropTypes.object,
  breadcrumb: PropTypes.array,
  gtmDataLayer: PropTypes.array
};

FiltersDrawer.defaultProps = {
  mode: 'single',
  selectedStore: {}
};

const addFacetsFromCMS = (facets, getMystoreDetails, ownProps) => {
  const { labels = {} } = ownProps;
  const { bopisEnabled } = labels;

  /**
   * CMS value determines if the bopis option should be shown or not.
   * If the store is set then only show the BOPIS facets
   */
  if (bopisEnabled === 'true') {
    if (getMystoreDetails && getMystoreDetails.isCompleted) {
      return [IN_STORE_PICKUP_FACET, ...facets];
    }
    return [NO_STORES_WITHIN_250_MI_FACET, ...facets];
  }

  return facets;
};

/**
 * Define the props from state for facets and selected facets
 * @param {Object} state The state object of store
 * @return {Object} The props formed from store state
 */
const mapStateToProps = (state, ownProps) => ({
  facets: addFacetsFromCMS(state.productGrid.facets, state.findAStoreModalRTwo && state.findAStoreModalRTwo.getMystoreDetails, ownProps),
  selectedFacets: state.productGrid.selectedFacets,
  selectedStore: state.findAStoreModalRTwo && state.findAStoreModalRTwo.getMystoreDetails && state.findAStoreModalRTwo.getMystoreDetails
});

const mapDispatchToProps = dispatch => ({
  fnUpdateSelectedFacets: (options, data, mode) => dispatch(updateSelectedFacets(options, data, mode))
});

// the hoc component exported as module
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersDrawer);
