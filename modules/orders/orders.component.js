import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { NODE_TO_MOUNT, DATA_COMP_ID, ORDER_NUMBER } from './constants';
import NoOrders from '../noOrder';
import Order from '../order';

import withScroll from '../../hoc/withScroll';
import { myAccountClicksAnalyticsData } from '../../utils/analyticsUtils';
import { getURLparam } from '../../utils/helpers';

class Orders extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: '10',
      selectedSortValue: 'Newest',
      pageNumber: '1'
    };
  }
  componentWillMount() {
    if (ExecutionEnvironment.canUseDOM) {
      const urlParam = getURLparam('beginIndex');
      if (urlParam) {
        const baseNumber = urlParam / 10;
        const pageNumber = baseNumber + 1;
        this.setState(() => ({
          pageNumber
        }));
      }
    }
  }
  componentDidMount() {
    const { fnFetchOrderList, breadCrumbAction, cms, scrollPageToTop, analyticsContent } = this.props;
    breadCrumbAction(cms.ordersLabel);
    fnFetchOrderList(this.state);
    scrollPageToTop();
    myAccountClicksAnalyticsData(cms.ordersLabel, analyticsContent);
  }

  render() {
    const {
      cms,
      orderDetails,
      error,
      loadOrderDetails,
      orderDetailsSuccess,
      orderSearchErrorKey,
      orderSearchRedirect,
      handleBackToOrders,
      orderDetailsById,
      orderDetailsByIdSuccess,
      loadSelectedOrderDetails,
      ordersList = {},
      fnFetchOrderList,
      authenticated,
      analyticsContent,
      globalLoader
    } = this.props;
    const { cantFindYourOrderLabel, checkOrderStatusLabel, billingZipcodeLabel, checkButtonLabel } = cms;

    const { orders = [] } = ordersList;
    const ordersExists = orders.length > 0; // This will make sure no zero is rendered on the inital page load

    return (
      <Fragment>
        {authenticated &&
          ordersExists && (
            <div className="mb-3">
              <Order
                cms={cms}
                handleBackToOrders={handleBackToOrders}
                orderDetailsById={orderDetailsById}
                orderDetailsByIdSuccess={orderDetailsByIdSuccess}
                loadSelectedOrderDetails={loadSelectedOrderDetails}
                orderList={ordersList}
                sortBy={this.state.selectedSortValues}
                fnFetchOrderList={fnFetchOrderList}
                analyticsContent={analyticsContent}
              />
            </div>
          )}
        <div className="px-1">
          <h5 className="mb-2 mb-md-3">{cantFindYourOrderLabel}</h5>
          <NoOrders
            cms={cms}
            orderDetails={orderDetails}
            error={error}
            loadOrderDetails={loadOrderDetails}
            orderDetailsSuccess={orderDetailsSuccess}
            cardHeading={checkOrderStatusLabel}
            orderLabel={ORDER_NUMBER}
            zipcodeLabel={billingZipcodeLabel}
            buttonText={checkButtonLabel}
            orderSearchErrorKey={orderSearchErrorKey}
            redirect={orderSearchRedirect}
            authenticated={authenticated}
            analyticsContent={analyticsContent}
            showNoOrderMessage={!ordersExists}
            globalLoader={globalLoader}
          />
        </div>
      </Fragment>
    );
  }
}

Orders.propTypes = {
  cms: PropTypes.object.isRequired,
  fnFetchOrderList: PropTypes.func,
  loadOrderDetails: PropTypes.func,
  handleBackToOrders: PropTypes.func,
  loadSelectedOrderDetails: PropTypes.func,
  orderDetailsSuccess: PropTypes.bool,
  authenticated: PropTypes.bool,
  orderDetailsByIdSuccess: PropTypes.bool,
  error: PropTypes.bool,
  orderDetailsById: PropTypes.object,
  orderDetails: PropTypes.object,
  ordersList: PropTypes.object,
  orderSearchErrorKey: PropTypes.string,
  orderSearchRedirect: PropTypes.string,
  breadCrumbAction: PropTypes.func,
  scrollPageToTop: PropTypes.func,
  analyticsContent: PropTypes.func,
  globalLoader: PropTypes.object
};

const WrappedOrders = withScroll(Orders);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WrappedOrders {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WrappedOrders;
