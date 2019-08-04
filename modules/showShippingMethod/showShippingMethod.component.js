import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { get } from '@react-nitro/error-boundary';
import { shippingItemsThumbnail, headingBox, editBtn, shipmentSubtitle } from './styles';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { getShippingCharges, valuesCheckerSymbolPrinter } from '../../utils/productDetailsUtils';
import { dateFormatter } from '../../utils/dateUtils';

class ShowShippingMethod extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getOrderItem = this.getOrderItem.bind(this);
    this.getShipping = this.getShipping.bind(this);
    this.renderHeading = this.renderHeading.bind(this);
  }
  /**
   * it reutrn total order item count
   * @param {object} orderItems -contain order items for STH
   * @param {*} orderDetails - containa order details
   */
  getItemCount(orderItems, orderDetails) {
    let itemCount = 0;
    orderItems.map(item => {
      itemCount += orderDetails.find(data => data.orderItemId === item.orderItemId).quantity;
      return true;
    });
    return itemCount;
  }
  /**
   * It return card of images which are present in shipment
   * @param {interger} orderItemId - shipment group order item id
   * @param {array} orderItemsList - conatins order items with order images and order details
   */
  getOrderItem(orderItemId, orderItemsList, key) {
    const item = orderItemsList.find(orderItem => orderItem.orderItemId === orderItemId);
    const skuInfo = get(item, 'skuDetails.skuInfo', {});
    return (
      item && (
        <img
          key={key}
          data-auid={`checkout_shipping_method_shipment_item_image_${item}`}
          className={`${shippingItemsThumbnail} mr-half mb-half`}
          alt={skuInfo.imageAltDescription}
          src={skuInfo.thumbnail}
        />
      )
    );
  }
  /**
   * it returns complete shipping details
   * @param {object} item - contains details of shipping groups
   * @param {object} orderItemsList - contains details of order items
   * @param {object} cms - labels and text from AEM
   * @param {interger} key - key for unique object in mapping
   */
  getShipping(item, orderItemsList, cms, keyValue) {
    const selectedShippingmode = item.shippingModes.find(data => data.isSelected === true) || item.shippingModes[0];
    const fromMonth = selectedShippingmode.estimatedFromDate
      ? `${this.valuesCheckerLBracketPrinter(selectedShippingmode.estimatedToDate)}${dateFormatter(selectedShippingmode.estimatedFromDate)} ${valuesCheckerSymbolPrinter(selectedShippingmode.estimatedToDate)}`
      : '';
    const toMonth = selectedShippingmode.estimatedToDate
      ? ` ${dateFormatter(selectedShippingmode.estimatedToDate)}${this.valuesCheckerRBracketPrinter(selectedShippingmode.estimatedFromDate)}`
      : '';
    const monthName = fromMonth + toMonth;

    const cmsShipmentData = cms.shipmentTypes.find(data => data.type === selectedShippingmode.shippingType);
    const orderItemCount = this.getItemCount(item.orderItems, orderItemsList);
    return (
      <div className="w-100 pt-2" key={`shipping-methods-${keyValue}`}>
        <div className="row">
          <div className="col-12 flex-row d-flex">
            <p className="o-copy__14bold">
              {cms.shipmentLabel} {item && item.groupSeqNum} -
            </p>
            <p className="o-copy__14reg">
              {cms.commonLabels.itemsLabel} ({orderItemCount})
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-12 pb-md-0 pb-2">
            {item.orderItems.map((orderItem, key) => this.getOrderItem(orderItem.orderItemId, orderItemsList, key))}
          </div>
          <div data-auid={`checkout_shipping_method_shipment_item${selectedShippingmode.shippingType}`} className="col-md-6 col-12">
            <p className="o-copy__14bold mb-0">
              {cmsShipmentData.title ? `${cmsShipmentData.title} ` : ''}
              {monthName} {getShippingCharges(selectedShippingmode)}
            </p>
            <div className={`o-copy__14reg mb-0 ${shipmentSubtitle}`}>{cmsShipmentData.subTitle}</div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * function for checking values whether undefined or not and returning ( in the UI
   * @param {string} value string value either undefined or a particular string
   */
  valuesCheckerLBracketPrinter = value => (value ? '(' : '');
  /**
   * function for checking values whether undefined or not and returning ) in the UI
   * @param {string} value string value either undefined or a particular string
   */
  valuesCheckerRBracketPrinter = value => (value ? ')' : '');
  filterShippingGroups(orderDetails) {
    return orderDetails.shippingGroups.filter(item =>
      item.shippingModes.find(data => data.shippingType !== 'PICKUPINSTORE' && data.shippingType !== 'STS')
    );
  }
  /**
   * it returns heading of shipping method collapsed drawer
   * @param {object} cms - heading label and edit label from AEM
   */
  renderHeading(cms) {
    const { showEditLink } = this.props;
    return (
      <div className={`w-100 ${headingBox} d-flex pb-2 justify-content-between`}>
        <div className="o-copy__16bold text-uppercase">{cms.shippingMethodLabel}</div>
        {showEditLink && (
          <a data-auid="checkout_edit_shipping_method" href=" #" onClick={this.props.editShippingMethod} className={`o-copy__14reg ${editBtn}`}>
            {cms.commonLabels.editLabel}
          </a>
        )}
      </div>
    );
  }
  render() {
    const { cms, orderDetails } = this.props;
    const shippingModesData = orderDetails && this.filterShippingGroups(orderDetails);
    return (
      <div className="container showShippingMethod px-0">
        {this.renderHeading(cms)}
        {shippingModesData ? shippingModesData.map((item, key) => this.getShipping(item, orderDetails.orderItems, cms, key)) : null}
      </div>
    );
  }
}

ShowShippingMethod.propTypes = {
  cms: PropTypes.object.isRequired,
  editShippingMethod: PropTypes.func,
  orderDetails: PropTypes.object.isRequired,
  showEditLink: PropTypes.bool
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ShowShippingMethod {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ShowShippingMethod;
