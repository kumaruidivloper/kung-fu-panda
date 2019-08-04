import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import OrderRow from '../order/orderRow';
import Pagination from '../productGrid/pagination';
import QueryStringUtils from '../productGrid/QueryStringUtils';
import { dropDown } from './style';

import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  MATCH_MIN_WIDTH,
  PAGE_SIZE,
  SELECTED_PAGE,
  QS_BEGIN_INDEX,
  R_AFFCODE,
  R_CM_MMC,
  R_CID,
  SCROLL_TIMEOUT
} from './constants';
class OrderListing extends React.PureComponent {
  constructor(props) {
    super(props);
    const beginIndex = QueryStringUtils.getParameter(QS_BEGIN_INDEX);
    const pageNumber = beginIndex ? ((+beginIndex) / PAGE_SIZE) + 1 : SELECTED_PAGE; // prettier-ignore
    this.state = {
      selectedSortValue: 'Newest',
      pageSize: PAGE_SIZE,
      isDeskTop: ExecutionEnvironment.canUseDOM ? window.matchMedia(`(min-width:${MATCH_MIN_WIDTH}px)`).matches : true,
      pageNumber,
      beginIndex: new URLSearchParams(window.location.search).get('beginIndex') || 0
    };
  }
  getSelectedOption(sortValue) {
    this.setState({ selectedSortValue: sortValue, pageNumber: 1 }, () => this.refreshProducts());
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: 'myaccount',
      eventCategory: 'user account',
      eventAction: 'my orders|sort by',
      eventLabel: `sort by|${sortValue}`,
      ordertype: null,
      orderid: null
    };
    analyticsContent(analyticsData);
  }
  /**
   * scroll up to the element captured
   */
  scrollToTop() {
    if (ExecutionEnvironment.canUseDOM) {
      const orderTotalWrap = document.getElementById('orderTotal');
      const orderWrap = document.getElementById('orderWrap');
      orderTotalWrap.scrollIntoView({ behavior: 'smooth' });
      orderWrap.focus();
    }
  }
  refreshProducts(type) {
    const options = {
      selectedSortValue: this.state.selectedSortValue,
      pageSize: type ? this.props.orderList.totalOrdersInAccount : this.state.pageSize,
      pageNumber: type ? 1 : this.state.pageNumber
    };
    this.props.fnFetchOrderList(options);
  }
  handlePageChange = params => {
    // incrementing by one for API
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: 'myaccount',
      eventCategory: 'user account',
      eventAction: 'my orders|see more orders',
      eventLabel: `orders|page-${params.selected + 1}`,
      ordertype: null,
      orderid: null
    };
    analyticsContent(analyticsData);
    const pageNumber = params.selected + 1;
    const beginIndex = params.selected === 0 ? 0 : PAGE_SIZE * params.selected;
    this.scrollToTop();
    QueryStringUtils.removeParameters([R_AFFCODE, R_CM_MMC, R_CID]);
    QueryStringUtils.updateParameter(QS_BEGIN_INDEX, beginIndex);
    this.setState({ pageNumber, beginIndex }, () => {
      setTimeout(() => {
        this.refreshProducts();
      }, SCROLL_TIMEOUT);
    });
  };
  /**
   * Render function for pagination of product grid
   */
  viewAll() {
    this.setState(
      {
        pageSize: ''
      },
      () => {
        this.scrollToTop();
        setTimeout(() => {
          this.refreshProducts('viewall');
        }, SCROLL_TIMEOUT);
      }
    );
  }
  renderPagination(recordSetTotal) {
    return (
      <div className="my-3">
        {this.state.pageSize && (
          <Pagination
            isDesktop={this.state.isDeskTop}
            totalPage={recordSetTotal}
            onPageChange={this.handlePageChange}
            pageNumber={this.state.pageNumber}
            onViewAll={this.viewAll}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>
    );
  }
  render() {
    const { cms, orderList } = this.props;
    const orderPlacedLabel = cms.orderPlacedOnLabel.replace(':', '');
    const orderNumberAccount = cms.orderNumberMyAccount.replace(':', '');
    return (
      <div className="col-12">
        <h5 className="mb-3">{cms.ordersLabel}</h5>
        <span id="orderTotal" aria-hidden="true" />
        <div className="mb-2 d-md-flex justify-content-between align-items-center">
          <span className="o-copy__16bold">
            {cms.totalOrdersLabel} : {orderList.totalOrdersInAccount}
          </span>
          <div className="d-flex align-items-center mt-1 mt-md-0">
            <span className="o-copy__14reg mr-quarter mr-md-half d-md-block">{cms.sortByLabel}:</span>
            <Dropdown
              multi
              DropdownOptions={[{ title: cms.newestLabel }, { title: cms.oldestLabel }]}
              initiallySelectedOption={0}
              onSelectOption={(index, title) => {
                this.getSelectedOption(title);
              }}
              disabled={false}
              width="9rem"
              height="2rem"
              borderColor="#d8d8d8"
              borderWidth="1px"
              borderRadius="4px"
              listBorderRadius="5px"
              padding="6px 16px 8px 12px"
              className={dropDown}
            />
          </div>
        </div>
        <hr />
        <span id="orderWrap" aria-hidden="true" tabIndex={-1} />
        <div className="d-none d-md-block">
          <div className="row my-1">
            <span className="col-12 col-md-3 o-copy__16bold">{orderPlacedLabel}</span>
            <span className="col-12 col-md-3 o-copy__16bold">{orderNumberAccount}</span>
            <span className="col-12 col-md-3 o-copy__16bold">{cms.orderTotalLabel}</span>
          </div>
          <hr />
        </div>
        {orderList.orders &&
          orderList.orders.map(orderItem => (
            <OrderRow loadSelectedOrderDetails={this.props.loadSelectedOrderDetails} beginIndex={this.state.beginIndex} orderItem={orderItem} cms={cms} />
          ))}
        {orderList.orders && this.renderPagination(orderList.totalOrdersInAccount)}
      </div>
    );
  }
}

OrderListing.propTypes = {
  cms: PropTypes.object.isRequired,
  orderList: PropTypes.object,
  loadSelectedOrderDetails: PropTypes.func,
  fnFetchOrderList: PropTypes.func,
  analyticsContent: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<OrderListing {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default OrderListing;
