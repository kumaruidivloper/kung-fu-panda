import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import Button from '@academysports/fusion-components/dist/Button';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import * as styles from './styles';
import * as action from './actions';
import { NODE_TO_MOUNT, DATA_COMP_ID, MONTHS } from './constants';
import GenericError from '../genericError/components/alertComponent';
import { STS_SHIPPING_METHOD, SELECTED_INSTORE_PICKUP, INSP_SHIPPING_METHOD } from '../../apps/cart/cart.constants';

class SpecialOrderProceedModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toggleModalFn = this.toggleModalFn.bind(this);
    this.state = {};
  }

  /**
   * Method will trigger while we selecting option in modal.
   * And assigns value for orderItemId in the state
   * @param {number} id
   * @param {string} type
   */
  onSelectOption(id, type) {
    this.setState({ [id]: type });
  }

  /**
   * Method to return selected store name in header
   */
  getStoreName() {
    return this.props.findAStore && this.props.findAStore.getMystoreDetails && this.props.findAStore.getMystoreDetails.neighborhood;
  }

  /**
   * Method to return selected store id
   */
  getStoreID() {
    return this.props.findAStore && this.props.findAStore.getMystoreDetails && this.props.findAStore.getMystoreDetails.storeId;
  }

  /**
   * Method to return available quantity in inventory
   * @param {object} item
   * @param {string} selectedInventory
   */
  getAvailableQuantityInInventory(item, selectedInventory) {
    const { inventory } = item.skuDetails;
    if (selectedInventory === SELECTED_INSTORE_PICKUP) {
      return inventory.store[0].availableQuantity;
    }

    return inventory.online[0].availableQuantity;
  }

  /**
   * Method to format the date to 'MON DATE' for displaying estimated dates.
   * @param {string} data Date to be formatted.
   */
  getFormatedDate(availableShippingMethods, identifier) {
    const data = availableShippingMethods.filter(obj => obj.shippingType !== INSP_SHIPPING_METHOD)[0][identifier];
    if (!data) {
      return '';
    }
    const date = new Date(data);
    return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
  }

  /**
   * Method will return true or false based on option selection.
   * @param {number} id
   * @param {number} type
   */
  isSelectedState(id, type) {
    if (type === 1) {
      return this.state[id] === 1 || !this.state[id];
    }
    return this.state[id] === 2;
  }

  /**
   * Method to toggle modal
   */
  toggleModalFn() {
    this.props.fnToggleModal({ status: !this.props.modalContent.status, sofItems: this.props.modalContent.sofItems });
  }

  /**
   * Method will construct object structure as per the contract.
   * Will split the order based on option selection
   * @param {object} item
   * @param {number} stsId
   * @param {number} pickupId
   */
  constructSplitOrderObject(item, stsId, pickupId) {
    const skus = [];
    const storeId = this.getStoreID();
    const { inventory } = item.skuDetails;
    if (item.shipModeCode === 'Ship To Store') {
      skus.push({
        orderItemId: item.orderItemId,
        quantity: inventory.online[0].availableQuantity,
        xitem_shipModeId: stsId,
        xitem_selectedStoreId: storeId
      });
      skus.push({
        productId: item.productId,
        quantity: JSON.stringify(parseInt(item.quantity, 10) - parseInt(inventory.online[0].availableQuantity, 10)),
        xitem_shipModeId: pickupId,
        xitem_selectedStoreId: storeId
      });
    } else {
      skus.push({
        orderItemId: item.orderItemId,
        quantity: inventory.store[0].availableQuantity,
        xitem_shipModeId: pickupId,
        xitem_selectedStoreId: storeId
      });
      skus.push({
        productId: item.productId,
        quantity: JSON.stringify(parseInt(item.proposedQuantity, 10) - parseInt(inventory.store[0].availableQuantity, 10)),
        xitem_shipModeId: stsId,
        xitem_selectedStoreId: storeId
      });
    }
    return skus;
  }

  /**
   * Method while click on Use Slected Option CTA.
   * Will construct object and return back with splitted skus
   */
  constructRequestObject() {
    const stsShipModeId = this.props.modalContent.sofItems[0].availableShippingMethods.filter(item => item.shippingType === STS_SHIPPING_METHOD)[0]
      .shipmodeId;
    const pickupShipModeId = this.props.modalContent.sofItems[0].availableShippingMethods.filter(
      item => item.shippingType === INSP_SHIPPING_METHOD
    )[0].shipmodeId;
    const skus = [];
    this.props.modalContent.sofItems.map(item => {
      if (this.state[item.orderItemId] === 1 || !this.state[item.orderItemId]) {
        const items = this.constructSplitOrderObject(item, stsShipModeId, pickupShipModeId);
        skus.push(...items);
      } else {
        const id = item.shipModeCode === SELECTED_INSTORE_PICKUP ? stsShipModeId : pickupShipModeId;
        skus.push({
          orderItemId: item.orderItemId,
          quantity: item.proposedQuantity,
          xitem_shipModeId: id
        });
      }
      return item;
    });

    this.props.fnUpdateOrderItems({
      orderItem: skus
    });
  }

  /**
   *
   * @param {*} cms
   * Function to return modal layout
   * TODO: Hardcoded values need to remove once api contract finalized. Just for testing purpose.
   * Currently functions like handleQtyChange/handleSubmit just implemented as like in product blade. Need to change logics.
   */
  constructModalContent(cms) {
    const storeName = this.getStoreName();
    return this.props.modalContent.sofItems.map(item => (
      <div className="mb-md-6">
        <label className="subTitle mb-2 o-copy__20reg">
          {cms.inStorePickupLabel.onlyForInStorePickup.replace('{{ quantityUnit}}', this.getAvailableQuantityInInventory(item, item.shipModeCode))}
        </label>
        <div className="productInfo col-12 px-0 d-flex flex-wrap">
          <div className="imageBlock col-2 col-sm-3 px-0 px-sm-1">
            <img
              data-auid="cart_product_img_in_how_to_proceed_modal"
              src={item.skuDetails.skuInfo.thumbnail}
              alt="Product"
            />
          </div>
          <div className="productInfoBlock col-10 col-sm-6">
            <div className="o-copy__14reg">{item.skuDetails.skuInfo.name}</div>
            {item.skuDetails.skuInfo.skuAttributes &&
              item.skuDetails.skuInfo.skuAttributes.length > 0 && (
                <div className="mt-1">
                  <span className="o-copy__14bold">{item.skuDetails.skuInfo.skuAttributes[0].name}:</span>
                  <span className="o-copy__14reg ml-1">{item.skuDetails.skuInfo.skuAttributes[0].value}</span>
                </div>
              )}
          </div>
          <div className="qtyInfo offset-2 offset-sm-0 col-10 col-sm-3">
            <span className={`o-copy__14bold ${styles.displayBlock}`}>Quantity</span>
            <span className={`mt-1 ${styles.displayBlock}`}>{item.proposedQuantity}</span>
          </div>
        </div>
        <hr className="mt-5 mb-1 section" />
        <div className="options px-0 px-lg-3 py-1">
          <button
            data-auid="cart_split_order_option_how_to_proceed"
            className={`option px-1 px-md-3 pr-md-6 py-1 ${this.isSelectedState(item.orderItemId, 1) ? 'active' : undefined}`}
            onClick={() => this.onSelectOption(item.orderItemId, 1)}
          >
            {this.isSelectedState(item.orderItemId, 1) && <i className="academyicon icon-check-circle" />}
            <label className="o-copy__16bold">{cms.inStorePickupLabel.optionOneSplitorderLabel}</label>
            <div className="d-flex flex-wrap">
              <div className="col-12 col-md-8 px-0">
                <label className="o-copy__14bold mb-0">
                  {cms.itemSplitLabel.replace('{{no}}', 1)}: {cms.pickUpInStoreLabel}
                </label>
                <label className="o-copy__14reg mb-0">{storeName}</label>
              </div>
              <div className="col-md-4 pl-0 pl-sm-1">
                <label className="o-copy__14bold">{cms.commonLabels.freeLabel}</label>
              </div>
            </div>
            <hr className="subSection mx-0 my-2" />
            <div className="d-flex flex-wrap">
              <div className="col-12 col-md-8 px-0">
                <label className="o-copy__14bold mb-0">
                  {cms.itemSplitLabel.replace('{{no}}', 2)}: {cms.specialOrderShipLabel}
                </label>
                <label className="o-copy__14reg">{storeName}</label>
                <label className="o-copy__14reg mb-0">
                  {cms.estArrivalLabel} {this.getFormatedDate(item.availableShippingMethods, 'estimatedFromDate')}-
                  {this.getFormatedDate(item.availableShippingMethods, 'estimatedToDate')}
                </label>
              </div>
              <div className="col-md-4 pl-0 pl-sm-1">
                <label className="o-copy__14bold">
                  ${this.props.orderSummary.specialOrderShipToStoreCharge} {cms.commonLabels.shippingLabel}
                </label>
              </div>
            </div>
          </button>
          <button
            data-auid="cart_ship_to_store_option_how_to_proceed_modal"
            className={`option px-1 px-md-3 pr-md-6 py-1 ${this.isSelectedState(item.orderItemId, 2) ? 'active' : undefined}`}
            onClick={() => this.onSelectOption(item.orderItemId, 2)}
          >
            {this.isSelectedState(item.orderItemId, 2) && <i className="academyicon icon-check-circle" />}
            <label className="o-copy__16bold mb-0">{cms.inStorePickupLabel.optionTwoEntireOrderLabel}</label>
            <div className="d-flex flex-wrap">
              <div className="col-12 col-md-8 pl-0">
                <label className="o-copy__14reg">{storeName}</label>
                <label className="o-copy__14reg mb-0">
                  {cms.estArrivalLabel} {this.getFormatedDate(item.availableShippingMethods, 'estimatedFromDate')}-
                  {this.getFormatedDate(item.availableShippingMethods, 'estimatedToDate')}
                </label>
              </div>
              <div className="col-md-4 pl-0 pl-sm-1">
                <label className="o-copy__14bold">
                  ${this.props.orderSummary.specialOrderShipToStoreCharge} {cms.commonLabels.shippingLabel}
                </label>
              </div>
            </div>
          </button>
        </div>
      </div>
    ));
  }

  render() {
    const { cms } = this.props;

    return (
      <Modal
        overlayClassName={styles.overlay}
        className={`${styles.modal} col-md-10 col-lg-8 p-0`}
        isOpen={this.props.modalContent.status}
        onRequestClose={() => this.toggleModalFn()}
        shouldCloseOnOverlayClick={false}
      >
        <div data-auid="cart_how_to_proceed_modal" className={`${styles.proceedModal}`}>
          {this.props.modalContent.error && (
            <div className="mb-3">
              <GenericError className="mb-3" message="Update Order Item Failed..!" auid="update_sof_items" />
            </div>
          )}
          <button onClick={() => this.toggleModalFn()} className={styles.clsBtn}>
            <i className="academyicon icon-close icon a-close-icon" />
          </button>
          <h4 className="header mb-3 text-uppercase">{cms.inStorePickupLabel.howtoproceedLabel}</h4>
          {this.constructModalContent(cms)}
          <div className={styles.submit}>
            <Button className="mt-3 " auid="crt_btnUseSelectedOpt" size="M" type="primary" onClick={() => this.constructRequestObject()}>
              {cms.inStorePickupLabel.useselectedOptionLabel}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fnToggleModal: data => dispatch(action.toggleSOFModal(data)),
  fnUpdateOrderItems: data => dispatch(action.updateOrderItems(data))
});

SpecialOrderProceedModal.propTypes = {
  cms: PropTypes.object.isRequired,
  modalContent: PropTypes.object,
  fnToggleModal: PropTypes.func,
  fnUpdateOrderItems: PropTypes.func,
  findAStore: PropTypes.object,
  orderSummary: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<SpecialOrderProceedModal {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default connect(
  null,
  mapDispatchToProps
)(SpecialOrderProceedModal);
