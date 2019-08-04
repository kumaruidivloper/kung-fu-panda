import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { get } from '@react-nitro/error-boundary';
import { compose } from 'redux';
import { getStoreAddress } from '../../apps/checkout/store/actions/getStoreAddress';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { padDigits, handlePickupDates } from '../../utils/helpers';
import { cardStyles, imageStyles } from './showShipToStore.styles';

class ShowShipToStore extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderHeading = this.renderHeading.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.getShipToStoreStoreShipment = this.getShipToStoreStoreShipment.bind(this);
    this.getShipmentImages = this.getShipmentImages.bind(this);
  }
  componentDidMount() {
    const { orderDetails, storeAddress } = this.props;
    if (Object.keys(storeAddress.data).length === 0) {
      const storeId = padDigits(parseInt(orderDetails.storeId, 10), 4);
      this.props.fnGetStoreAddress(storeId);
    }
  }
  /**
   * it checks for shipping method of length one and shipping type ship to store and returns shipping group
   * @param {object} shipmentDetails - contains shipping groups
   */
  getShipToStoreStoreShipment(shipmentDetails) {
    return shipmentDetails.shippingGroups.find(shipment => shipment.shippingModes.length === 1 && shipment.shippingModes[0].shippingType === 'STS');
  }
  /**
   * It returns array of images of OrderItems
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
   * it returns images cards
   * @param {object} imageDeatils -contains image details
   * @param {integer} index - key
   */
  renderCard(imageDeatils, index) {
    return (
      <div className={cardStyles} key={`card-${index}`}>
        <img src={imageDeatils ? imageDeatils.thumbnail : ''} className={imageStyles} alt={imageDeatils ? imageDeatils.imageAltDescription : ''} />
      </div>
    );
  }
  /**
   * it reuturns heading of ship to store collapsed drawer
   * @param {object} cms - data from AEM
   */
  renderHeading(cms) {
    const { showEditLink } = this.props;
    return (
      <div className="w-100 border-bottom d-flex justify-content-between pb-2">
        <div className="o-copy__16bold text-uppercase">{cms.inStorePickupLabel.specialOrderShipToStoreTitle}</div>
        {showEditLink && (
          <a data-auid="checkout_edit_ship_to_store" href=" #" onClick={this.props.editShipToStore} className="o-copy__14reg text-primary">
            {cms.commonLabels.editLabel}
          </a>
        )}
      </div>
    );
  }
  render() {
    const { cms, orderDetails, storeAddress = {} } = this.props;
    const shipToStoreShippingGroup = this.getShipToStoreStoreShipment(orderDetails);
    const orderImages =
      shipToStoreShippingGroup &&
      shipToStoreShippingGroup.orderItems &&
      this.getShipmentImages(shipToStoreShippingGroup.orderItems, orderDetails.orderItems);
    const storeDetails = get(storeAddress, 'data.stores[0].properties', {});
    const pickupDate = handlePickupDates(shipToStoreShippingGroup);
    return (
      <div className="col-12">
        {this.renderHeading(cms)}
        <div className="pt-2">
          <p className="o-copy__14reg">
            {cms.inStorePickupLabel.itemShippedToStoreLabel} ({shipToStoreShippingGroup.orderItems.length})
          </p>
          <div className="d-flex flex-row flex-wrap">{orderImages && orderImages.map((item, index) => this.renderCard(item, index))}</div>
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
                <p className="o-copy__14reg mb-0">{`Available For Pickup ${pickupDate}`}</p>
              </Fragment>
            )}
          </div>
          <div className="col-md-4 col-12 pt-2 pt-md-0">
            <p className="o-copy__14reg mb-half">{cms.inStorePickupLabel.pickupPersonLabel}</p>
            <p className="mb-0 o-copy__14bold">Me</p>
          </div>
        </div>
      </div>
    );
  }
}

ShowShipToStore.propTypes = {
  cms: PropTypes.object.isRequired,
  editShipToStore: PropTypes.func,
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
  const ShowShipToStoreContainer = compose(withConnect)(ShowShipToStore);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ShowShipToStoreContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ShowShipToStore);
