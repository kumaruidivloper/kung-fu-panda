import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Modal from 'react-modal';
import { filterIconBlue, facetsModal, facetsModalAfterOpen, facetsModalBeforeClose, facetsOverlay, facetsContentWrapper } from './styles';
import FacetsDesktop from './facets.desktop';
import FacetsMobile from './facets.mobile';
import { LABEL_ADD, R_AFFCODE, R_CM_MMC, R_CID } from '../../constants';
import { FACETDRAWER_ADBUG, FACETDRAWER_PRICE } from './constants';
import ArrayUtils from '../../../../utils/arrayUtils';
import BodyScrollFix from '../../../../utils/BodyScrollFix';
import QueryStringUtils from '../../QueryStringUtils';
import { updateSelectedFacets, updateFacets } from '../../actions';
import { ExecutionEnvironment } from '../../../../vendor/includes/utils';
const CLOSE_TIMEOUT = 300;

/**
 * This Facets component is used to render the filters used on PLP page
 * @class
 * @classdesc The Facets component
 * @example <caption>Example usage of Facets component</caption>
 *  <Facets
 *    isDesktop={this.state.isDeskTop}
 *    isSearch={pageInfo && pageInfo.isSearch}
 *    searchTerm={pageInfo && pageInfo.searchTerm}
 *    pageSize={pageSize}
 *    categoryId={pageInfo && pageInfo.categoryId}
 *    sortValue={selectedSortValue}
 *    pageNumber={pageNumber}
 *    pageInfo={pageInfo}
 *    breadcrumb={this.props.api.breadcrumb}
 *    totalItem={recordSetTotal}
 *    onFacetsUpdate={this.onFacetChangeListener}
 *  />
 */
class Facets extends PureComponent {
  /**
   * The constructor function initializing handlers and state
   * @param {Object} props The props of the component
   */
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
  }

  /**
   * Parse the query string and update the facets to show it as selected
   * @memberof Facets#
   */
  componentDidMount() {
    const url = this.props.pageInfo ? decodeURIComponent(decodeURIComponent(this.props.pageInfo.pageURL)) : '';
    const qsData = this.getQueryStringData(url);
    if (qsData) {
      if (qsData.qsFacetsToHide) {
        this.initialFacetsUpdateFromQS(qsData.qsFacetsToHide);
      }
      // selected facets
      if (qsData.qsFacetsToSelect) {
        this.initialSelectedFacetsUpdate(qsData.qsFacetsToSelect);
      }
    } else {
      console.log('No query string to process!');
    }
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM && !this.props.isDesktop) {
      BodyScrollFix.enableBodyScroll('#mobileFacetModal');
    }
  }

  onModalOpen() {
    const targetModal = document.querySelector('.c-targetmodal');
    targetModal.addEventListener('click', e => {
      this.forceModalClose(e);
    });
  }

  onModalClose() {
    const targetModal = document.querySelector('.c-targetmodal');
    targetModal.removeEventListener('click', e => {
      this.forceModalClose(e);
    });
  }

  /**
   * This function process the querystring and returns all facets label in array
   * @param {String} queryString The query string data
   * @return {Object} Returns the facets taken out from query string
   * @memberof Facets#
   */
  getFacetsFromQueryString(queryString) {
    const arrQueryies = queryString.split('&');
    const facets = [];
    const queryLength = arrQueryies.length;
    for (let i = 0; i < queryLength; i += 1) {
      const query = arrQueryies[i].split('=');
      const key = query[0];
      const value = query[1];
      if (key === 'facet') {
        const newval = value.replace(/\+/g, ' '); /* Added to remove the + character in URL beforehand  */
        facets.push(decodeURIComponent(decodeURIComponent(newval)));
      }
    }
    return facets;
  }

  /**
   * This function parses the url and gets the facets to be selected or to be hidden
   * @param {String} url The URl to get the query string data
   * @return {Object} Returns the object if data found or null
   * @memberof Facets#
   */
  getQueryStringData(url) {
    const queries = url.split('?');
    if (queries.length > 1) {
      const queryString = queries[1];
      const splitFacetsQueries = queryString.split(/&intcmp=.*?&|&intcmp=.*/g);
      let qsFacetsToHide = '';
      let qsFacetsToSelect = '';
      if (splitFacetsQueries.length > 1) {
        [qsFacetsToHide, qsFacetsToSelect] = splitFacetsQueries;
        // qsFacetsToSelect = splitFacetsQueries[1];
      } else {
        [qsFacetsToSelect] = splitFacetsQueries;
      }
      return {
        qsFacetsToHide,
        qsFacetsToSelect
      };
    }
    return null;
  }
  /**
   * Event handler to close to handle modal closing when the transparent part of the overlay is clicked
   * @param {*} e  event object to check which target is being clicked
   */
  forceModalClose(e) {
    if (e.target === e.currentTarget) {
      this.handleModalClose();
    }
  }

  /**
   * This function Looks for the facets to be hidden and updates the facets in store
   * @param {Object} facetsData The facets data to be process
   * @return {Object} The facets
   * @memberof Facets#
   */
  initialFacetsUpdateFromQS(facetsData) {
    const facetsToHide = this.getFacetsFromQueryString(facetsData);
    if (facetsToHide.length) {
      const { facets } = this.props;
      const filteredFacetsToShow = ArrayUtils.cleanup(
        facets.filter(facet => {
          let isMatchFound = false;
          facetsToHide.forEach(item => {
            if (!isMatchFound) {
              const facetLabelId = item.replace('%3A', ':');
              const facetLabelIDs = facetLabelId.split(':');
              const tempFacet = {};
              [tempFacet.key, tempFacet.value] = [...facetLabelIDs];
              isMatchFound = facet.property === tempFacet.key;
            }
          });
          return !isMatchFound;
        })
      );
      if (filteredFacetsToShow.length) {
        this.props.fnUpdateFacets(filteredFacetsToShow);
      }
    }
  }

  /**
   * This function is processing the selected facets to be updated in redux store from query parameter
   * @param {Object} facetsData The facets data to be process
   * @return {Object} The facets
   * @memberof Facets#
   */
  initialSelectedFacetsUpdate(facetsData) {
    const facetsToSelect = this.getFacetsFromQueryString(facetsData);
    if (facetsToSelect.length) {
      // this.props.fnUpdateSelectedFacets(null, facetsToSelect, 'add');
      const selectedFacets = ArrayUtils.cleanup(
        facetsToSelect.map(item => {
          const facetLabelId = item.replace('%3A', ':');
          const facetLabelIDs = facetLabelId.split(':');
          const facet = {};
          const objSelectedFacet = {};
          [facet.key, facet.value] = [...facetLabelIDs];
          facet.value = facet.value.replace(/"/g, '');
          const facetParent = this.props.facets.filter(subFacet => subFacet.property === facet.key);
          const objFacetParent = facetParent[0];
          let objFacet = [];
          /* Added for KER-8563 : Price is handled in a different way then the rest of the facets, due to a data limitation from WCS */
          if (objFacetParent && (objFacetParent.name === FACETDRAWER_PRICE || objFacetParent.name === FACETDRAWER_ADBUG)) {
            objFacet = objFacetParent.labels.filter(subLabel => {
              const decodedProperty = decodeURIComponent(subLabel.property);
              const decodedPropertyArray = decodedProperty.split(':');
              if (decodedPropertyArray.length > 0) {
                const valueToCompare = decodedPropertyArray[1].replace(/"/g, '');
                return valueToCompare === facet.value;
              }
              return false;
            });
          } else {
            objFacet = objFacetParent && objFacetParent.labels.filter(subLabel => subLabel.name === facet.value);
          }
          if (objFacet && objFacet.length > 0) {
            objSelectedFacet.selectedLabelName = objFacet[0].name;
            objSelectedFacet.selectedLabelId = objFacet[0].property;
            objSelectedFacet.selectedLabelParentDrawer = objFacetParent.name;
            // selectedFacets.push(objSelectedFacet);
            return objSelectedFacet;
          }
          return null;
        })
      );
      if (selectedFacets.length) {
        this.props.fnUpdateSelectedFacets(null, selectedFacets, LABEL_ADD);
      }
    }
  }

  /**
   * Function to update state for modal's visibility
   * @memberof Facets#
   */
  handleModalOpen() {
    this.setState({ isModalOpen: true });
    Modal.setAppElement('body');
    if (ExecutionEnvironment.canUseDOM && !this.props.isDesktop) {
      BodyScrollFix.disableBodyScroll('#mobileFacetModal');
    }
  }
  /**
   * Closes the modal
   * @memberof Facets#
   */
  handleModalClose() {
    this.setState({ isModalOpen: false });
    if (ExecutionEnvironment.canUseDOM && !this.props.isDesktop) {
      BodyScrollFix.enableBodyScroll('#mobileFacetModal');
    }
  }

  /**
   * The render function for facets. It handles the rendering for mobile and desktop
   * @returns {Object} The react element for Facets
   * @default <FacetsDesktop />
   * @memberof Facets#
   */
  render() {
    const { isDesktop, title, selectedFacets } = this.props;
    const { isModalOpen } = this.state;
    return (
      <section>
        <div className="d-lg-none d-flex justify-content-between">
          <div className="facet-wrap text-right">
            <span role="button" onKeyDown={this.handleOpenModal} data-auid="filtersTitle_m" onClick={this.handleModalOpen} tabIndex={0}>
              <i role="presentation" aria-label="facets" className={classNames(`${filterIconBlue}`, 'academyicon', 'icon-filter')} />
              <span className="ml-half o-copy__14reg">{title}</span>
              {selectedFacets && selectedFacets.length > 0 ? <span>({selectedFacets.length})</span> : null}
            </span>
          </div>
        </div>
        {isDesktop && (
          <div className="d-none d-lg-block w-100">
            <FacetsDesktop auid="" {...this.props} />
          </div>
        )}
        {!isDesktop && (
          <Modal
            id="test_id"
            data-auid="facetsModal_M"
            isOpen={isModalOpen}
            onAfterOpen={this.onModalOpen}
            onRequestClose={this.onModalClose}
            contentLabel="Filters Modal"
            className={{
              base: `${facetsModal} c-targetmodal`,
              afterOpen: facetsModalAfterOpen,
              beforeClose: facetsModalBeforeClose
            }}
            closeTimeoutMS={CLOSE_TIMEOUT}
            overlayClassName={facetsOverlay}
          >
            {/* a interim div is added to handle edge cases on ios */}
            <div className={`${facetsContentWrapper} c-targetcontent`}>
              <FacetsMobile auid="_m" {...this.props} closeModal={this.handleModalClose} />
            </div>
          </Modal>
        )}
      </section>
    );
  }
}

// defining the prop types for facets
Facets.propTypes = {
  pageInfo: PropTypes.object,
  selectedFacets: PropTypes.array,
  title: PropTypes.string,
  isDesktop: PropTypes.bool,
  facets: PropTypes.array,
  breadcrumb: PropTypes.array,
  fnUpdateSelectedFacets: PropTypes.func,
  fnUpdateFacets: PropTypes.func,
  onFacetsUpdate: PropTypes.func.isRequired
};

// default props for title
Facets.defaultProps = {
  title: 'Filters'
};

/**
 * Define the props from state for facets and selected facets
 * @param {Object} state The state object of store
 * @return {Object} The props formed from store state
 */
const mapStateToProps = state => {
  if (!state || !state.productGrid) return null;
  return {
    facets: state.productGrid.facets,
    selectedFacets: state.productGrid.selectedFacets
  };
};

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
  fnUpdateFacets: facets => dispatch(updateFacets(facets))
});

// export the connected components
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Facets);
