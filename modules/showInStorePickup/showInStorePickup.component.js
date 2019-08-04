import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import { get } from '@react-nitro/error-boundary';
import { getStoreAddress } from '../../apps/checkout/store/actions/getStoreAddress';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { cardStyles } from './showInStorePickup.styles';
import { pickupDayInfo, dateFormatter } from './../../utils/dateUtils';
import { TODAY, TOMORROW } from './../../utils/constants';
import { replaceGlobalCharacters } from './../../utils/stringUtils';
import { padDigits } from '../../utils/helpers';

class ShowInStorePickup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderHeading = this.renderHeading.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.getPickupInStoreShipment = this.getPickupInStoreShipment.bind(this);
    this.getShipmentImages = this.getShipmentImages.bind(this);
  }
  componentDidMount() {
    const { orderDetails, storeAddress } = this.props;
    if (Object.keys(storeAddress.data).length === 0) {
      const storeId = padDigits(parseInt(orderDetails.storeId, 10), 4);
      this.props.fnGetStoreAddress(storeId);
    }
  }
  // /**
  //  * Method returns month name
  //  * @param {string} date - date string format-'2018-07-26'
  //  */
  // getMonthName(date) {
  //   const monthNumber = new Date(date).getMonth();
  //   return MONTH[monthNumber];
  // }
  /**
   * Method checks for shipping method of length one and shipping type pick up in storeand returns shipping group
   * @param {object} shipmentDetails - contains shipping groups
   */
  getPickupInStoreShipment(shipmentDetails) {
    return shipmentDetails.shippingGroups.find(
      shipment => shipment.shippingModes.length === 1 && shipment.shippingModes[0].shippingType === 'PICKUPINSTORE'
    );
  }
  /**
   * Method returns array of images of OrderItems
   * @param {object} orderItems - contains orderItems available in shipment
   * @param {object} orderDetails - constains orderDetails with orderItemsId and complete details of orderItem
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
   * Get pick up Date
   * @returns {string}
   */
  getPickUpDate() {
    const {
      orderDetails,
      labels: { pickupTodayIfOrdered, pickupTomorrow }
    } = this.props;
    const pickupInStoreShippingGroup = orderDetails && orderDetails.shippingGroups && this.getPickupInStoreShipment(orderDetails);
    const shippingMode =
      (pickupInStoreShippingGroup &&
        pickupInStoreShippingGroup.shippingModes &&
        pickupInStoreShippingGroup.shippingModes.length !== 0 &&
        pickupInStoreShippingGroup.shippingModes[0]) ||
      false;
    const estimatedDate = shippingMode && shippingMode.estimatedFromDate;
    const estimatedTim = shippingMode && shippingMode.estimatedTime;
    const pickUpDate = pickupDayInfo(dateFormatter(estimatedDate));
    switch (pickUpDate) {
      case TODAY: {
        let pickUpMsg = '';
        pickUpMsg = replaceGlobalCharacters(pickupTodayIfOrdered, '{{today}}', 'today');
        pickUpMsg = replaceGlobalCharacters(pickUpMsg, '{{time}}', estimatedTim);
        return pickUpMsg;
      }
      case TOMORROW: {
        return pickupTomorrow;
      }
      default:
        // TODO - CMS label to be added
        return replaceGlobalCharacters('Pickup on {{date}}', '{{date}}', pickUpDate);
    }
  }
  /**
   * Method reuturns heading of pickup in store collapsed drawer
   * @param {object} cms - data from AEM
   */
  renderHeading(cms) {
    const { showEditLink } = this.props;
    return (
      <div className="w-100 border-bottom d-flex justify-content-between pb-2">
        <div className="o-copy__16bold text-uppercase">{cms.inStorePickupLabel.inStorePickupLabel}</div>
        {showEditLink && (
          <a data-auid="checkout_edit_in_store_pickup" href=" #" onClick={this.props.editInStorePickup} className="o-copy__14reg text-primary">
            {cms.commonLabels.editLabel}
          </a>
        )}
      </div>
    );
  }
  /**
   * Method returns images cards
   * @param {object} imageDeatils -contains image details
   * @param {integer} index - key
   */
  renderCard(imageDeatils, index) {
    return (
      <div className="mr-1 mb-1" key={`card-${index}`}>
        <img
          src={imageDeatils ? imageDeatils.thumbnail : ''}
          className={`${cardStyles}`}
          alt={imageDeatils ? imageDeatils.imageAltDescription : ''}
        />
      </div>
    );
  }
  render() {
    const { cms, orderDetails, storeAddress = {} } = this.props;
    const pickupInStoreShippingGroup = orderDetails && orderDetails.shippingGroups && this.getPickupInStoreShipment(orderDetails);
    const orderImages =
      pickupInStoreShippingGroup &&
      pickupInStoreShippingGroup.orderItems &&
      this.getShipmentImages(pickupInStoreShippingGroup.orderItems, orderDetails.orderItems);
    const storeDetails = get(storeAddress, 'data.stores[0].properties', {});
    return (
      <div className="">
        {this.renderHeading(cms)}
        <div className="pt-2">
          <p className="o-copy__14reg">
            <span>{cms.inStorePickupLabel.itemsForPickupLabel}</span> ({pickupInStoreShippingGroup.orderItems.length})
          </p>
          <div className="d-flex flex-row flex-wrap pb-half">{orderImages && orderImages.map((item, index) => this.renderCard(item, index))}</div>
        </div>
        <div className="row">
          <div className="col-12 col-md-8">
            <p className="o-copy__14reg mb-half">{cms.inStorePickupLabel.pickupLocationLabel}</p>
            {Object.keys(storeAddress.data).length > 0 && (
              <Fragment>
                <p className="mb-0 o-copy__14bold">{storeDetails.neighborhood}</p>
                <p className="o-copy__14reg mb-0">
                  {`${storeDetails.streetAddress}, ${storeDetails.city} ${storeDetails.stateCode} ${storeDetails.zipCode}`}
                </p>
                <p className="o-copy__14reg mb-0">{this.getPickUpDate()}</p>
              </Fragment>
            )}
          </div>
          <div className="col-md-4 col-12 pt-2 pt-md-0">
            <p className="o-copy__14reg mb-half">{cms.inStorePickupLabel.pickupPersonLabel}</p>
            {Object.keys(pickupInStoreShippingGroup.shippingModes[0].alternatePickup).length === 0 ||
            pickupInStoreShippingGroup.shippingModes[0].alternatePickup.selection === 'me' ? (
              <p className="mb-0 o-copy__14bold">{cms.inStorePickupLabel.meLabel}</p>
            ) : (
              <div>
                <p className="mb-0 o-copy__14bold">
                  {`${cms.inStorePickupLabel.meLabel} + ${pickupInStoreShippingGroup.shippingModes[0].alternatePickup.firstName} ${
                    pickupInStoreShippingGroup.shippingModes[0].alternatePickup.lastName
                  }`}
                </p>
                <p className="mb-0 o-copy__14reg">{pickupInStoreShippingGroup.shippingModes[0].alternatePickup.email}</p>
                <p className="mb-0 o-copy__14reg">{pickupInStoreShippingGroup.shippingModes[0].alternatePickup.mobile}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ShowInStorePickup.propTypes = {
  cms: PropTypes.object.isRequired,
  labels: PropTypes.object,
  editInStorePickup: PropTypes.func,
  orderDetails: PropTypes.object,
  fnGetStoreAddress: PropTypes.func,
  storeAddress: PropTypes.func,
  showEditLink: PropTypes.bool
};

const mapDispatchToProps = dispatch => ({
  fnGetStoreAddress: data => dispatch(getStoreAddress(data))
});

const withConnect = connect(
  null,
  mapDispatchToProps
);
if (ExecutionEnvironment.canUseDOM) {
  const ShowInStorePickupContainer = compose(withConnect)(ShowInStorePickup);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ShowInStorePickupContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ShowInStorePickup);
