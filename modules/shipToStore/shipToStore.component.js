import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { get } from '@react-nitro/error-boundary';
import { compose } from 'redux';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import Button from '@academysports/fusion-components/dist/Button';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';
import { padDigits } from '../../utils/helpers';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  ENTER,
  SPACE,
  EVENT_NAME,
  CHANGE_LOCATION_EVENT_ACTION,
  EVENT_CATEGORY,
  EVENT_ACTION,
  ON_LOAD_EVENT_LABEL,
  ON_LOAD_EVENT_NAME,
  ERROR_EVENT_ACTION,
  ERROR_EVENT_CATEGORY,
  ERROR_EVENT_NAME,
  OPTION_VALUE
} from './constants';
import { fetchSavedShippingModes } from '../../apps/checkout/store/actions/shippingModes';
import { getStoreAddress } from '../../apps/checkout/store/actions/getStoreAddress';
import { toggleFindAStore } from '../../modules/findAStoreModalRTwo/actions';
import { postShipToStore } from '../../apps/checkout/store/actions/shipToStore';
import AlertComponent from './../genericError/components/alertComponent';
import { scrollIntoView } from '../../utils/scroll';
import {
  cardStyles,
  listStyle,
  pointerStyle,
  pickupInstruction,
  changeLocation,
  checkboxWrapper,
  iconColor,
  imageStyles,
  submitButton
} from './shipToStore.styles';
import { collateAnalyticsData, typeOfOrder } from './../../utils/analyticsUtils';

const changeLocationAnalyticsData = {
  event: EVENT_NAME,
  eventCategory: EVENT_CATEGORY,
  eventAction: CHANGE_LOCATION_EVENT_ACTION,
  eventLabel: '/checkout',
  customerleadlevel: null,
  customerleadtype: null,
  leadsubmitted: 0,
  newslettersignupcompleted: 0
};
class ShipToStore extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pickupInstructionStatus: false,
      checkboxState: false,
      checkboxError: false
    };
    this.shipToStoreRef = React.createRef();
    this.renderCard = this.renderCard.bind(this);
    this.renderPickupInstructions = this.renderPickupInstructions.bind(this);
    this.handlepickupInstructions = this.handlepickupInstructions.bind(this);
    this.getShipToStoreStoreShipment = this.getShipToStoreStoreShipment.bind(this);
    this.getShipmentImages = this.getShipmentImages.bind(this);
    this.handleSubmitCall = this.handleSubmitCall.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
  }
  componentDidMount() {
    const { orderDetails, storeAddress } = this.props;
    this.props.fnShippingMethodsCall(orderDetails.orderId);
    if (Object.keys(storeAddress.data).length === 0) {
      const storeId = padDigits(parseInt(orderDetails.storeId, 10), 4);
      this.props.fnGetStoreAddress(storeId);
    }
    this.scrollIntoView();
    /* on load or edit of ship to store drawer */
    this.postOnLoadAnalyticsData();
  }
  componentWillReceiveProps(nextProps) {
    const { getStoreId, analyticsContent, shipToStore, buttonLabelCondition, cms } = this.props;
    if (getStoreId.data.storeId !== nextProps.getStoreId.data.storeId) {
      const storeId = padDigits(parseInt(nextProps.getStoreId.data.storeId, 10), 4);
      this.props.fnGetStoreAddress(storeId);
    }
    if (!shipToStore.error && shipToStore.data !== nextProps.shipToStore.data) {
      const buttonText = buttonLabelCondition ? cms.commonLabels.goToPaymentLabel : cms.commonLabels.confirmLabel;
      const confirmAnalyticsData = {
        event: EVENT_NAME,
        eventCategory: EVENT_CATEGORY,
        eventAction: EVENT_ACTION,
        eventLabel: buttonText.toLowerCase(),
        customerleadlevel: null,
        customerleadtype: null,
        leadsubmitted: 0,
        newslettersignupcompleted: 0
      };
      analyticsContent(confirmAnalyticsData);
    }
  }
  /**
   * it manage the state of chekcbox
   */
  onChangeCheckbox() {
    this.setState({ checkboxState: !this.state.checkboxState });
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
   * it return shipping address object for add shipping address action call
   * @param {object} address - contains shipping address
   */
  getShippingAddress(address) {
    return {
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      phoneNumber: address.phoneNumber || '',
      address: address.address || '',
      zipCode: address.zipCode || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || '',
      companyName: address.companyName || '',
      logonId: address.logonId || ''
    };
  }
  /**
   * scrolls the component into view on component mount
   */
  scrollIntoView() {
    const el = this.shipToStoreRef.current;
    if (el) {
      scrollIntoView(el);
    }
  }
  /**
   * collates and pushes analytics data on load/edit of ship to store drawer.
   */
  postOnLoadAnalyticsData() {
    const { orderDetails, analyticsContent, landingDrawer } = this.props;
    const orderItemsShippingMethodColln = orderDetails.orderItems.map(item => item.availableShippingMethods[0]);
    const shipToStoreShippingGroup = orderDetails && this.getShipToStoreStoreShipment(orderDetails);
    const analyticsObject = {
      event: ON_LOAD_EVENT_NAME,
      eventCategory: EVENT_CATEGORY,
      eventAction: EVENT_ACTION,
      eventLabel: ON_LOAD_EVENT_LABEL,
      ecommerce: {
        checkout: {
          actionField: { step: 6, option: OPTION_VALUE },
          products: collateAnalyticsData(orderDetails, [shipToStoreShippingGroup])
        }
      },
      dimension85: typeOfOrder(orderItemsShippingMethodColln) || ''
    };
    analyticsObject['checkout steps'] = landingDrawer;
    analyticsContent(analyticsObject);
  }
  /**
   * collects and posts analytics data in case of error
   */
  postErrorAnalyticsData() {
    const { analyticsContent, cms } = this.props;
    const analyticsObject = {
      event: ERROR_EVENT_NAME,
      eventCategory: ERROR_EVENT_CATEGORY,
      eventAction: ERROR_EVENT_ACTION,
      eventLabel: cms.errorMsg.termsAndConditions
    };
    analyticsContent(analyticsObject);
  }
  createAgeLabel(label) {
    return { __html: label };
  }
  /**
   * it handle submit post call
   * @param {object} pickupInStoreShippingGroup - contains shipping group which have shipping type ship to store
   */
  handleSubmitCall(shipToStoreShippingGroup) {
    if (!this.state.checkboxState) {
      this.setState({ checkboxError: true });
      this.postErrorAnalyticsData();
    } else {
      const { orderDetails, storeAddress } = this.props;
      const storeId =
        storeAddress && storeAddress.data && Object.keys(storeAddress.data).length !== 0 && storeAddress.data.stores[0].length !== 0
          ? parseInt(storeAddress.data.stores[0].storeId, 10).toString()
          : orderDetails.storeId;
      const shippingAddress =
        orderDetails && orderDetails.addresses.shippingAddress && this.getShippingAddress(orderDetails.addresses.shippingAddress);
      const orderItems = [];
      shipToStoreShippingGroup.orderItems.map(order => {
        orderItems.push({
          orderItemId: order.orderItemId,
          shipModeId: shipToStoreShippingGroup.shippingModes[0].shipmodeId
        });
        orderItems.push({ orderItemId: '710260174', shipModeId: '10551' });
        return true;
      });
      const addShippingData = {
        ...shippingAddress,
        orderItems,
        orderId: orderDetails.orderId,
        isAddressVerified: '1',
        URL: 'checkout',
        alternatePickup: {
          selection: 'me',
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          smsPreference: '',
          agreeAgeRestrictionForSTS: this.state.checkboxState ? 'Y' : 'N',
          agreeAgeRestrictionForPickup: ''
        },
        storeAddress: [{ storeidentifier: storeId }]
      };
      this.props.fnAddShippingDetailsCall(addShippingData);
    }
  }
  /**
   * It handles change location in ship to store drawer
   */
  handleChangeLocation() {
    const { fnOpenStoreLocator, analyticsContent } = this.props;
    analyticsContent(changeLocationAnalyticsData);
    fnOpenStoreLocator({ status: true, isBopisEligible: true });
  }
  /**
   * it handles the pickup instructions open and collapsed
   */
  handlepickupInstructions() {
    this.setState({ pickupInstructionStatus: !this.state.pickupInstructionStatus });
  }
  /**
   * it handles onKeyDown for In-store pickup instructions
   */
  handleKeyDown(event) {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this.handlepickupInstructions();
    }
  }
  /**
   * it returns pickup instruction
   * @param {object} cms - data from AEM
   */
  renderPickupInstructions(cms) {
    return (
      <div>
        <ol className="pl-1">
          <li
            className="pl-2 pb-half o-copy__14reg mb-0"
            dangerouslySetInnerHTML={this.createAgeLabel(cms.inStorePickupLabel.inStorePickupInstruction1Label)}
          />
          <li className="pl-2 pb-half o-copy__14reg">{cms.inStorePickupLabel.inStorePickupInstruction2Label}</li>
          <li className="pl-2 pb-half o-copy__14reg">{cms.inStorePickupLabel.inStorePickupInstruction3Label}</li>
        </ol>
      </div>
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
  render() {
    const { cms, orderDetails, storeAddress = {}, buttonLabelCondition } = this.props;
    const shipToStoreShippingGroup = this.getShipToStoreStoreShipment(orderDetails);
    const orderImages =
      shipToStoreShippingGroup &&
      shipToStoreShippingGroup.orderItems &&
      this.getShipmentImages(shipToStoreShippingGroup.orderItems, orderDetails.orderItems);
    const storeDetails = get(storeAddress, 'data.stores[0].properties', {});
    const buttonText = buttonLabelCondition ? cms.commonLabels.goToPaymentLabel : cms.commonLabels.confirmLabel;
    return (
      <div ref={this.shipToStoreRef}>
        <section className="border-bottom pb-2">
          <p className="o-copy__14reg">{cms.inStorePickupLabel.pickupLocationLabel}</p>
          <div className="border-bottom pb-2">
            {Object.keys(storeAddress.data).length > 0 && (
              <Fragment className="pb-half">
                <p className="mb-0 o-copy__14bold">{storeDetails.neighborhood}</p>
                <p className="o-copy__14reg mb-0">
                  {`${storeDetails.streetAddress}, ${storeDetails.city} ${storeDetails.stateCode} ${storeDetails.zipCode}`}
                </p>
              </Fragment>
            )}
            <a href=" #" className={`o-copy__14reg ${changeLocation}`} onClick={this.handleChangeLocation}>
              {cms.commonLabels.changeLocationLabel}
            </a>
          </div>
          <div className="pt-2">
            <p className="o-copy__14reg">
              {cms.inStorePickupLabel.itemShippedToStoreLabel} ({shipToStoreShippingGroup.orderItems.length})
            </p>
            <div className="d-flex flex-row flex-wrap">{orderImages && orderImages.map((item, index) => this.renderCard(item, index))}</div>
            <p className="o-copy__14reg">{cms.inStorePickupLabel.whoIsPickingupLabel}</p>
            <div className="col-12 col-md-6 pl-0 pb-2">
              <Dropdown
                DropdownOptions={[{ title: `${cms.inStorePickupLabel.meLabel}` }]}
                initiallySelectedOption={0}
                disabled
                width="100%"
                height="3.25rem"
                borderWidth="1px"
                borderRadius="4px"
                listBorderRadius="5px"
                titleClass="o-copy__14bold"
                subtitleClass="o-copy__12reg"
              />
            </div>
            <span
              className={`${pickupInstruction} o-copy__14reg mb-0`}
              role="button"
              tabIndex="0"
              onKeyDown={this.handleKeyDown}
              aria-label={cms.inStorePickupLabel.seeInStorePickupInstructionsLabel}
              onClick={() => this.handlepickupInstructions()}
            >
              <span className="storeLink">{cms.inStorePickupLabel.seeInStorePickupInstructionsLabel}</span>
              {this.state.pickupInstructionStatus ? (
                <span className={`${iconColor} academyicon icon-chevron-up ml-half align-text-bottom text-bottom`} />
              ) : (
                <span
                  className={`${iconColor} academyicon icon-chevron-down ml-half align-text-bottom text-bottom`}
                  onClick={() => this.handlepickupInstructions()}
                  role="presentation"
                />
              )}
            </span>
            {this.state.pickupInstructionStatus ? this.renderPickupInstructions(cms) : null}
            <p className="o-copy__14bold mt-1">{cms.inStorePickupLabel.pickOrderInstructionLabel}</p>
            <p className="o-copy__14reg mt-1">{cms.inStorePickupLabel.pickOrderInstructionMessage}</p>

            {this.state.checkboxError && (
              <div className="mb-1">
                <AlertComponent auid="STS_age_restriction_prompt" message={cms.errorMsg.termsAndConditions} />
              </div>
            )}

            <label className={`${pointerStyle} d-flex flex-row pb-1`}>
              <div className={checkboxWrapper}>
                <Checkbox
                  id="ship-to-store-check"
                  disabled={false}
                  checked={this.state.checkboxState}
                  labelText=""
                  labelClass="o-copy__14reg"
                  labelPosition="right"
                  onChange={() => this.onChangeCheckbox()}
                />
              </div>
              <div
                className={`${listStyle} ml-1 o-copy__14reg`}
                dangerouslySetInnerHTML={this.createAgeLabel(cms.inStorePickupLabel.sofDisclaimerNote)}
              />
            </label>
            <div className="o-copy__14reg" dangerouslySetInnerHTML={this.createAgeLabel(cms.inStorePickupLabel.sofDisclaimerFull)} />
          </div>
        </section>
        <div className="d-flex justify-content-end pt-2 pb-md-0 pb-half">
          <Button
            size="S"
            auid="checkout_ship_to_store_submit_button"
            className={`o-copy__14bold px-4 ${submitButton}`}
            onClick={() => this.handleSubmitCall(shipToStoreShippingGroup)}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    );
  }
}

ShipToStore.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetails: PropTypes.object,
  fnShippingMethodsCall: PropTypes.func,
  fnAddShippingDetailsCall: PropTypes.func,
  fnOpenStoreLocator: PropTypes.func,
  fnGetStoreAddress: PropTypes.func,
  storeAddress: PropTypes.object,
  getStoreId: PropTypes.object,
  buttonLabelCondition: PropTypes.bool,
  analyticsContent: PropTypes.func,
  shipToStore: PropTypes.object,
  landingDrawer: PropTypes.string
};
const mapDispatchToProps = dispatch => ({
  fnShippingMethodsCall: data => dispatch(fetchSavedShippingModes(data)),
  fnAddShippingDetailsCall: data => dispatch(postShipToStore(data)),
  fnOpenStoreLocator: data => dispatch(toggleFindAStore(data)),
  fnGetStoreAddress: data => dispatch(getStoreAddress(data))
});
// const mapStateToProps = () => ({
//   // miniCartResp: state.checkoutHeader.miniCartResp
// });
const withConnect = connect(
  null,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const ShipToStoreContainer = compose(
    // withReducer,
    withConnect
  )(ShipToStore);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ShipToStoreContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ShipToStore);
