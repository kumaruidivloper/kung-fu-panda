import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import OrderListing from '../orderListing';

class Order extends React.PureComponent {
  render() {
    const { cms, analyticsContent } = this.props;
    return (
      <OrderListing
        cms={cms}
        orderList={this.props.orderList}
        loadSelectedOrderDetails={this.props.loadSelectedOrderDetails}
        sortBy={this.props.sortBy}
        fnFetchOrderList={this.props.fnFetchOrderList}
        analyticsContent={analyticsContent}
      />
    );
  }
}

Order.propTypes = {
  cms: PropTypes.object.isRequired,
  orderList: PropTypes.object,
  sortBy: PropTypes.string,
  loadSelectedOrderDetails: PropTypes.func,
  fnFetchOrderList: PropTypes.func,
  analyticsContent: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<Order {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default Order;
