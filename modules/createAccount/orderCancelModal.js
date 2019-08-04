import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import classNames from 'classnames';
import Button from '@academysports/fusion-components/dist/Button';
import Modal from '@academysports/fusion-components/dist/Modal';

import { NODE_TO_MOUNT, DATA_COMP_ID, ENTER, SPACE } from './constants';
import { btnStyle, cancelOrderLabel, btnContainer } from './styles';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';

class OrderCancelModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    this.getRedirectUrl = this.getRedirectUrl.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.pushAnalytics = this.pushAnalytics.bind(this);
  }
  /**
   * redirect the user to cancel page.
   */
  componentWillReceiveProps(nextProps) {
    const { redirect, orderNumber, zipCode } = this.props;
    this.getRedirectUrl(redirect, orderNumber, zipCode, nextProps);
  }
  /**
   * checks if use should redirect.
   */
  getRedirectUrl(redirect, orderNumber, zipCode, nextProps) {
    if (redirect !== nextProps.redirect && nextProps.redirect) {
      window.location.href = `/myaccount/order/cancellation/${orderNumber}/${zipCode}`;
    }
    return false;
  }
  /**
   * Close modal
   */
  closeModal(orderId, zipCode) {
    this.setState({ isModalOpen: false });
    if (orderId) {
      this.props.fnCancelOrder(orderId, zipCode);
    }
    this.focusOnClose.focus();
  }
  /**
   * it handles onKeyDown for Cancel Order button
   */
  handleKeyDown(event) {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this.openModal();
    }
  }
  openModal() {
    this.setState({ isModalOpen: true });
  }
  /**
   * function is used to track analytics on confirmation click of cancel my order modal
   */
  pushAnalytics() {
    const { analyticsContent, orderNumber, zipCode } = this.props;

    const analyticsData = {
      event: 'checkoutsteps',
      eventCategory: 'checkout',
      eventAction: 'order confirmation|cancel order',
      eventLabel: `order|${orderNumber}`,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };

    analyticsContent(analyticsData);

    this.closeModal(orderNumber, zipCode);
  }
  render() {
    const { cms, orderNumber, totalItem } = this.props;
    return (
      <div role="button" tabIndex="0" onKeyDown={this.handleKeyDown}>
        <button
          ref={input => {
            this.focusOnClose = input;
          }}
          className={`text-left ${btnStyle}`}
          aria-label="Cancel Order"
          onClick={this.openModal}
          tabIndex="-1"
        >
          <span className={classNames('o-copy__14reg ', cancelOrderLabel)}>{cms.commonLabels.orderSummaryLinks[0].label}</span>
        </button>
        <Modal isOpen={this.state.isModalOpen} handleClose={() => this.closeModal()}>
          <div className="d-flex flex-column justify-content-center">
            <h4 className="pb-2">{cms.areYouSureToCancelOrderHeader}</h4>
            <div className="d-flex justify-content-center">
              <div className="o-copy__14bold pb-1 pr-quarter">{cms.orderNumberLabel}</div>
              <div className="o-copy__14reg">{orderNumber}</div>
            </div>
            <div className="d-flex justify-content-center">
              <span className="o-copy__14bold pb-3 pb-md-2 pr-quarter">{cms.totalItemsLabel}</span>
              <span className="o-copy__14reg">{totalItem}</span>
            </div>
          </div>
          <div className={`${btnContainer} justify-content-center`}>
            <Button className="mr-0 mr-md-1 mb-1 mb-md-0" btntype="secondary" onClick={() => this.closeModal()}>
              {cms.noLabel}
            </Button>
            <Button onClick={this.pushAnalytics}>{cms.yesCancelMyOrderLabel}</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

OrderCancelModal.propTypes = {
  cms: PropTypes.object.isRequired,
  fnCancelOrder: PropTypes.func,
  redirect: PropTypes.bool,
  orderNumber: PropTypes.string,
  totalItem: PropTypes.string,
  zipCode: PropTypes.string,
  analyticsContent: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  const OrderCancelModalWrapper = AnalyticsWrapper(OrderCancelModal);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <OrderCancelModalWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default AnalyticsWrapper(OrderCancelModal);
