import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Button from '@academysports/fusion-components/dist/Button';
import Modal from '@academysports/fusion-components/dist/Modal';
import { withRouter } from 'react-router-dom';
import { NODE_TO_MOUNT, DATA_COMP_ID, ENTER, SPACE } from './constants';
import { btnStyle, cancelOrderLabel, btnContainer, modalStyles } from './style';

class OrderCancelModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    this.getRedirectUrl = this.getRedirectUrl.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { redirect, orderDetailsById } = this.props;
    const redirection = this.getRedirectUrl(redirect, orderDetailsById, nextProps);
    if (redirection) {
      this.props.history.push(redirection);
    }
  }

  getRedirectUrl(redirect, orderDetailsById, nextProps) {
    if (redirect !== nextProps.redirect && nextProps.redirect && orderDetailsById.orders[0]) {
      return `/myaccount/order/cancellation/${orderDetailsById.orders[0].orderNumber}/${orderDetailsById.orders[0].billingAddress.zipCode}`;
    }
    return false;
  }

  closeModal(orderId, zipCode, orderItem) {
    this.setState({ isModalOpen: false });
    const { fnCancelOrder } = this.props;
    if (orderId && orderItem) {
      fnCancelOrder(orderId, zipCode, orderItem);
    }
    window.scrollTo(0, 0);
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
  render() {
    const { cms } = this.props;
    return this.props.orderDetailsById.orders.map(orderItem => (
      <div role="button" tabIndex="0" onKeyDown={this.handleKeyDown}>
        <button className={`${btnStyle}`} aria-label="Cancel Order" onClick={this.openModal} tabIndex="-1">
          <span className={classNames('o-copy__14reg', cancelOrderLabel)}>{cms.cancelOrderLabel}</span>
        </button>
        <Modal isOpen={this.state.isModalOpen} modalContentClassName={modalStyles} handleClose={() => this.closeModal()}>
          <div className="d-flex flex-column justify-content-center">
            <h4 className="pb-2">{cms.cancelOrderConfirmationMessage}</h4>
            <div className="d-flex justify-content-center">
              <div className="o-copy__14bold pb-1 pr-quarter">{cms.orderNumberMyAccount}</div>
              <div className="o-copy__14reg">{orderItem.orderNumber}</div>
            </div>
            <div className="d-flex justify-content-center">
              <span className="o-copy__14bold pb-3 pb-md-2 pr-quarter">{cms.totalItemsLabel}</span>
              <span className="o-copy__14reg">{orderItem.items.length}</span>
            </div>
          </div>
          <div className={`${btnContainer} justify-content-center o-copy__14reg`}>
            <Button className={classNames('w-100 mb-2 mr-half')} size="M" btntype="secondary" onClick={() => this.closeModal()}>
              NO
            </Button>
            <Button
              className={classNames('w-100 mb-2')}
              size="M"
              onClick={() => this.closeModal(orderItem.orderNumber, orderItem.billingAddress.zipCode, orderItem)}
            >
              {cms.cancelMyOrderButtonLabel}
            </Button>
          </div>
        </Modal>
      </div>
    ));
  }
}

OrderCancelModal.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetailsById: PropTypes.object,
  fnCancelOrder: PropTypes.func,
  history: PropTypes.any,
  redirect: PropTypes.bool
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<OrderCancelModal {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default withRouter(OrderCancelModal);
