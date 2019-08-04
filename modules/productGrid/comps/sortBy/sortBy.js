import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from './../../../select/select.component';
import QueryStringUtils from '../../QueryStringUtils';
import { QS_BEGIN_INDEX, QS_ORDER_BY, R_AFFCODE, R_CM_MMC, R_CID } from '../../constants';
import { select, custom, mobileDropdown, mobileDropdownSelect, mobileDropdownIcon, desktopDropdownSelect, SortByDiv } from './styles';
import { printBreadCrumb } from '../../../../utils/breadCrumb';

class SortBy extends React.PureComponent {
  constructor(props) {
    super(props);
    const { defaultSelected, sortByInfo } = this.props;
    this.state = {
      selectedSortValue: this.props.defaultSelected,
      selectedIndex: this.props.defaultSelected,
      selectedOption: this.getDefaultOption(defaultSelected, sortByInfo)
    };
    //  this.pushAnalyticsData = this.pushAnalyticsData.bind(this);
    //  this.renderSortBsydata = this.renderSortBydata.bind(this);
  }
  /**
   * Method returns selected option in a format expected by the 'select' plugin.
   * @param {string} defaultSelected default selected option number
   * @param {array} sortByInfo array of sort options
   */
  getDefaultOption(defaultSelected, sortByInfo) {
    let selectedOption = sortByInfo.find(item => item.id === defaultSelected) || {};
    // Map the object to match Select component data format
    selectedOption = {
      label: selectedOption.name,
      value: selectedOption.id,
      className: `${custom}`
    };

    return selectedOption;
  }

  /**
   * Updates the analytics data
   * @param {string} label - sort option
   */
  pushAnalyticsData(label) {
    if (!this.props.isPredictiveSearch) {
      const { breadcrumb = [] } = this.props;
      const modifiedBreadCrumbs = ['Academy', ...breadcrumb];
      if (this.props.isSearch) {
        this.props.gtmDataLayer.push({
          event: 'search',
          eventCategory: 'internal search results clicks',
          eventAction: `search sort_${label && label.toLowerCase()}`,
          eventLabel: `${this.props.searchTerm && this.props.searchTerm.toLowerCase()}`,
          searchresultscount: `${this.props.itemsCount}`
        });
      } else {
        this.props.gtmDataLayer.push({
          event: 'plpPageClicks',
          eventCategory: 'plp interactions',
          eventAction: `sort|${label}`.toLowerCase(),
          eventLabel: printBreadCrumb(modifiedBreadCrumbs).toLowerCase()
        });
      }
    }
  }

  /**
   * Updates the state with selected sort option
   * @param {object} e - onChange event object
   */
  sortByOnChange = e => {
    if (e && e.value) {
      const sortVal = parseInt(e.value, 10);
      QueryStringUtils.removeParameters([QS_BEGIN_INDEX, R_AFFCODE, R_CM_MMC, R_CID]);
      QueryStringUtils.updateParameter(QS_ORDER_BY, sortVal);
      this.props.onSort(sortVal);
      this.setState({
        selectedSortValue: sortVal,
        selectedOption: e
      });
      this.pushAnalyticsData(e.label);
    }
  };

  /**
   * Updates the state with selected sort option
   * @param {object} e - onChange event object
   */
  sortByOnChangeMobile = e => {
    const data = e.target.value;
    this.setState({ selectedIndex: data });
    const index = e.nativeEvent.target.selectedIndex;
    const label = e.nativeEvent.target[index].text;
    QueryStringUtils.removeParameters([QS_BEGIN_INDEX, R_AFFCODE, R_CM_MMC, R_CID]);
    QueryStringUtils.updateParameter(QS_ORDER_BY, data);
    this.props.onSort(data);
    this.pushAnalyticsData(label);
  };

  render() {
    const { sortByInfo, defaultSelected } = this.props;
    /** options is temporary  sortbyData */
    const data = [];
    /** we have to replace options with sortbyData  */
    /* eslint-disable */
    sortByInfo &&
      sortByInfo.map(item => {
        data.push({ label: item.name, value: item.id, className: `${custom} o-copy__14reg` });
      });
    /* eslint-enable */
    const selectedOption = this.getDefaultOption(defaultSelected, sortByInfo);
    return (
      <Fragment>
        {this.props.cms && (
          <div data-auid="product-sort-dropdown" className={`mr-1 d-none d-lg-block ${SortByDiv}`}>
            {this.props.cms.sortBy}: <span className="d-none">{selectedOption.label}</span>
          </div>
        )}
        <div className={`d-none d-lg-block ${desktopDropdownSelect}`} data-auid="sort_by">
          <Select labelId="sortbylabel" classes={select} selectedItem={selectedOption} onSelect={this.sortByOnChange} options={data} />
        </div>
        <div className={classNames(mobileDropdownSelect, 'd-lg-none')} data-auid="sort_by_m">
          <select title="mobileDropdown" className={`o-copy__14reg pr-2 ${mobileDropdown}`} onChange={this.sortByOnChangeMobile}>
            {/** we have to replace options with sortbyData  */}
            <option value="" disabled>
              Sort By
            </option>
            {sortByInfo &&
              sortByInfo.map(sortby => (
                <option
                  value={sortby.id}
                  key={sortby.id}
                  selected={this.props.defaultSelected === sortby.id}
                  aria-selected={this.props.defaultSelected === sortby.id}
                >
                  {sortby.name}
                </option>
              ))}
          </select>
          <span className={mobileDropdownIcon}>
            <i className="academyicon icon-chevron-down" />
          </span>
        </div>
      </Fragment>
    );
  }
}

SortBy.propTypes = {
  sortByInfo: PropTypes.array,
  onSort: PropTypes.func,
  defaultSelected: PropTypes.string,
  isSearch: PropTypes.bool,
  itemsCount: PropTypes.string,
  breadcrumb: PropTypes.array,
  searchTerm: PropTypes.string,
  cms: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  isPredictiveSearch: PropTypes.bool
};

export default SortBy;
