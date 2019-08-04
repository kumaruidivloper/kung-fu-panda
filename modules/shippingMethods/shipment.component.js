import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { cardStyles } from './shippingMethods.styles';
import { valuesCheckerSymbolPrinter, getShippingCharges } from '../../utils/productDetailsUtils';
import { dateFormatter } from '../../utils/dateUtils';

export class Shipment extends React.Component {
  constructor(props) {
    super(props);
    this.getShipmentImages = this.getShipmentImages.bind(this);
    this.getShipmentText = this.getShipmentText.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.renderSingleMethod = this.renderSingleMethod.bind(this);
    this.renderShipmentHeading = this.renderShipmentHeading.bind(this);
  }
  /**
   * It returns array of images of OrderItems
   * @param {object} orderItems - contains orderItems available in shipment
   * @param {*} orderDetails - constains orderDetails with orderItemsId and complete details of orderItem
   */
  getShipmentImages(orderItems, orderDetails) {
    return orderItems.map(
      item =>
        orderDetails.find(data => data.orderItemId === item.orderItemId)
          ? orderDetails.find(data => data.orderItemId === item.orderItemId).skuDetails.skuInfo
          : ''
    );
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
   * It returns array of title and subtitle of shipping method with arrives details and sales price
   * @param {object} shipmentModes - contains all shipping methods available for shipment
   * @param {object} cms - cms for shipping method title and subtitle
   */
  getShipmentText(shipmentModes, cms) {
    // const defaultValueIndex = shipmentModes.findIndex(data => data.isSelected === true) === -1 ? 0 : shipmentModes.findIndex(data => data.isSelected === true);
    const arriveObject = shipmentModes.map(item => {
      const fromDate = item.estimatedFromDate
        ? `${this.valuesCheckerLBracketPrinter(item.estimatedToDate)}${dateFormatter(item.estimatedFromDate)} ${valuesCheckerSymbolPrinter(item.estimatedToDate)}`
        : `${this.valuesCheckerLBracketPrinter(item.estimatedToDate)}`;
      const todate = item.estimatedToDate
        ? `${dateFormatter(item.estimatedToDate)}${this.valuesCheckerRBracketPrinter(item.estimatedToDate)}`
        : '';
      const shippingType = cms.shipmentTypes.find(data => data.type === item.shippingType);
      const arriveDetail = {
        subtitle: shippingType.subTitle,
        title: `${shippingType.title ? `${shippingType.title} ` : ''} ${fromDate}${todate} ${getShippingCharges(item)}`
      };
      return arriveDetail;
    });
    return { arriveData: arriveObject };
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
  /**
   * It returns shipment heading with shipment number and number of items
   * @param {object} cms - contains all labels
   * @param {object} shipmentDetails- contains shipment number and number of order items
   */
  renderShipmentHeading(cms, shipmentDetails, orderItemCount) {
    return (
      <div className="pt-1 pt-md-2 pb-1 d-flex flex-row">
        <p className="o-copy__14bold mb-0">
          {cms.shipmentLabel} {shipmentDetails && shipmentDetails.groupSeqNum}
        </p>
        <p className="o-copy__14reg ml-quarter mb-0">
          {' '}
          {'-'} {cms.commonLabels.itemsLabel} ({orderItemCount})
        </p>
      </div>
    );
  }
  /**
   * It returns image cards with orderItems images
   * @param {array} imageDeatils - contains images urls of orderItems
   * @param {*} index - key
   */
  renderCard(imageDeatils, index) {
    return (
      <div className="mr-1 mb-1" key={`card-${index}`}>
        <img
          data-auid={`shipping_method_shipment_item_image_${index}`}
          src={imageDeatils ? imageDeatils.thumbnail : ''}
          className={`${cardStyles}`}
          alt={imageDeatils ? imageDeatils.imageAltDescription : ''}
        />
      </div>
    );
  }
  /**
   * It returns shipping method details if only one shipping method is available in shipment
   * @param {array} arrivesDetails - contains shipping method title and subtitle
   */
  renderSingleMethod(arrivesDetails) {
    return (
      <div className="d-flex flex-column">
        <p className="o-copy__14bold m-0">{arrivesDetails && arrivesDetails.arriveData && arrivesDetails.arriveData[0].title}</p>
        <p className="o-copy__12reg m-0">{arrivesDetails && arrivesDetails.arriveData && arrivesDetails.arriveData[0].subtitle}</p>
      </div>
    );
  }
  render() {
    const { cms, number, shipmentDetails, orderDetail, handleDropdown, initiallySelectedOption } = this.props;
    const arrivesDetails = shipmentDetails && shipmentDetails.shippingModes ? this.getShipmentText(shipmentDetails.shippingModes, cms) : [];
    const imageDeatils = orderDetail && shipmentDetails.orderItems ? this.getShipmentImages(shipmentDetails.orderItems, orderDetail) : [];
    const orderItemCount = orderDetail && shipmentDetails.orderItems && this.getItemCount(shipmentDetails.orderItems, orderDetail);
    return (
      <div data-auid={`shipping_method_shipment_item_${number}_container`} className="border-bottom pb-half">
        {this.renderShipmentHeading(cms, shipmentDetails, orderItemCount)}
        <div className="row justify-content-between">
          <div className="col-12 d-flex flex-wrap">{imageDeatils && imageDeatils.map((item, index) => this.renderCard(item, index))}</div>
          <div className="col-12 pb-1">
            {arrivesDetails && arrivesDetails.arriveData && arrivesDetails.arriveData.length > 1 ? (
              <Dropdown
                multi
                DropdownOptions={arrivesDetails.arriveData}
                initiallySelectedOption={initiallySelectedOption}
                disabled={false}
                width="100%"
                maxHeight="13.5rem"
                borderWidth="1px"
                borderRadius="4px"
                listBorderRadius="5px"
                titleClass="o-copy__14bold d-flex"
                subtitleClass="o-copy__12reg d-flex"
                onSelectOption={index => handleDropdown(index, number)}
                padding="0.5rem"
              />
            ) : (
              this.renderSingleMethod(arrivesDetails)
            )}
          </div>
        </div>
      </div>
    );
  }
}

Shipment.propTypes = {
  cms: PropTypes.object.isRequired,
  number: PropTypes.number,
  shipmentDetails: PropTypes.object,
  orderDetail: PropTypes.array,
  handleDropdown: PropTypes.func,
  initiallySelectedOption: PropTypes.number
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<Shipment {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default Shipment;
