import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';
import { Provider, connect } from 'react-redux';
import Button from '@academysports/fusion-components/dist/Button';
import { fetchSavedShippingModes, postShippingAddressModes } from '../../apps/checkout/store/actions/shippingModes';
import { shippingMethodsTitle, submitButton } from './shippingMethods.styles';
import { NODE_TO_MOUNT, DATA_COMP_ID, EVENT_ACTION, EVENT_NAME, EVENT_CATEGORY } from './constants';
import { Shipment } from './shipment.component';
import { scrollIntoView } from '../../utils/scroll';
import { collateAnalyticsData, typeOfOrder } from '../../utils/analyticsUtils';

class ShippingMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedShippingModes: []
    };
    this.shippingMethodRef = React.createRef();
    this.onClickPostCall = this.onClickPostCall.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handlePreSelectedShippingMethod = this.handlePreSelectedShippingMethod.bind(this);
    this.returnSelectedMethodIndex = this.returnSelectedMethodIndex.bind(this);
  }
  componentDidMount() {
    const { orderDetails, analyticsContent, cms, savedShippingModes, landingDrawer } = this.props;
    const orderItemsShippingMethodColln = orderDetails.orderItems.map(item => item.availableShippingMethods[0]);
    if (this.props && orderDetails && orderDetails.shippingGroups && orderDetails.shippingGroups.length < 1) {
      this.props.fnShippingMethodsCall(orderDetails.orderId);
    } else {
      this.handlePreSelectedShippingMethod(this.props && this.props.orderDetails);
    }
    const status = orderDetails && orderDetails.containsProp65Warning ? `shipping method drawer|${cms.warningProp65}` : 'shipping method drawer';
    const shippingMethods = this.filterShippingGroups(orderDetails, savedShippingModes);
    const productItems = collateAnalyticsData(orderDetails, shippingMethods);
    const enhancedAnalyticsData = {
      event: EVENT_NAME,
      eventCategory: EVENT_CATEGORY,
      eventAction: EVENT_ACTION,
      eventLabel: `${status}`,
      ecommerce: {
        checkout: {
          actionField: { step: 4, option: EVENT_ACTION },
          products: productItems
        }
      },
      dimension85: typeOfOrder(orderItemsShippingMethodColln) || ''
    };
    enhancedAnalyticsData['checkout steps'] = landingDrawer;
    this.scrollIntoView();
    analyticsContent(enhancedAnalyticsData);
  }
  componentWillReceiveProps(nextProps) {
    const { validateShippingModes, analyticsContent, cms, buttonLabelCondition } = this.props;
    const buttonText = buttonLabelCondition ? this.returnButtonLabel() : cms.commonLabels.confirmLabel;
    if (!validateShippingModes.error && validateShippingModes.data !== nextProps.validateShippingModes.data) {
      const analyticsData = {
        event: EVENT_NAME,
        eventCategory: EVENT_CATEGORY,
        eventAction: EVENT_ACTION,
        eventLabel: buttonText.toLowerCase(),
        customerleadlevel: null,
        customerleadtype: null,
        leadsubmitted: 0,
        newslettersignupcompleted: 0
      };
      analyticsContent(analyticsData);
    }
  }
  /**
   * It called on onClick of "Go To Payment" and call post action
   * @param {object} order - conatins orderItems Id and shipment method Id
   * @param {object} shippingAddress- contains shipping address
   */
  onClickPostCall(order, shippingAddress, orderId) {
    const orderItems = [];
    order.map(item => {
      const selectedShippingMode = this.state.selectedShippingModes[item.groupSeqNum] ? this.state.selectedShippingModes[item.groupSeqNum] : 0;
      item.orderItems.map(orders =>
        orderItems.push({
          orderItemId: orders.orderItemId,
          shipModeId: item.shippingModes[selectedShippingMode].shipmodeId
        })
      );
      return true;
    });

    const addShippingModesData = {
      firstName: shippingAddress.firstName || ' ',
      lastName: shippingAddress.lastName || ' ',
      ...(shippingAddress.id && { addressId: shippingAddress.id }),
      phoneNumber: shippingAddress.phoneNumber || ' ',
      address: shippingAddress.address || ' ',
      zipCode: shippingAddress.zipCode || ' ',
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: shippingAddress.country || ' ',
      companyName: shippingAddress.companyName || ' ',
      logonId: shippingAddress.logonId || '',
      orderItems,
      orderId,
      isAddressVerified: '1',
      URL: 'checkout',
      storeAddress: []
    };
    this.props.fnPostShippingAddressModesCall(addShippingModesData);
  }
  /**
   * scrolls the component into view on component mount
   */
  scrollIntoView() {
    const el = this.shippingMethodRef.current;
    if (el) {
      scrollIntoView(el);
    }
  }
  /**
   * It handles already selected shipping method
   * @param {object} orderDetails - contains order details with orderId and orderItemId
   */
  handlePreSelectedShippingMethod(orderDetails) {
    const selecedModes = this.state.selectedShippingModes;
    orderDetails.shippingGroups.map(shippingGroup => {
      selecedModes[shippingGroup.groupSeqNum] =
        shippingGroup.shippingModes.findIndex(data => data.isSelected === true) === -1
          ? 0
          : shippingGroup.shippingModes.findIndex(data => data.isSelected === true);
      return true;
    });
    this.setState({ selectedShippingModes: selecedModes });
  }
  /**
   * It handles shipping method selection in dropdown
   * @param {interger} index - contains the index of selected dropdown value
   * @param {interger} number - shipment number
   */
  handleDropdown(index, number) {
    const selecedModes = this.state.selectedShippingModes;
    selecedModes[number] = index;
    this.setState({ selectedShippingModes: selecedModes });
  }
  /**
   * method return shipping groups for ship to home items
   * @param {object} orderDetails - object contains order details
   * @param {*} savedShippingModes - if order details does not contains shipping groups, saveShipping is used for shipping groups.
   */
  filterShippingGroups(orderDetails, savedShippingModes) {
    let shippingGroupData = [];
    if (orderDetails.shippingGroups.length === 0) {
      shippingGroupData =
        savedShippingModes &&
        savedShippingModes.data.results &&
        savedShippingModes.data.results.shippingGroups.filter(item =>
          item.shippingModes.find(data => data.shippingType !== 'PICKUPINSTORE' && data.shippingType !== 'STS')
        );
    } else {
      shippingGroupData = orderDetails.shippingGroups.filter(item =>
        item.shippingModes.find(data => data.shippingType !== 'PICKUPINSTORE' && data.shippingType !== 'STS')
      );
    }
    return shippingGroupData;
  }
  /**
   * It return default selected shipping method index, if any shipment is not selected it return first index
   * @param {integer} shipmentNumber - shipment number
   */
  returnSelectedMethodIndex(shipmentNumber) {
    return this.state.selectedShippingModes[shipmentNumber] ? this.state.selectedShippingModes[shipmentNumber] : 0;
  }
  /**
   * function for returning the button label based on the drawers required
   */
  returnButtonLabel = () => {
    const { cms, orderDetails } = this.props;
    if (orderDetails.checkoutStates.pickupDrawerRequired !== undefined) {
      return cms.commonLabels.goToInStorePickupLabel;
    }
    return orderDetails.checkoutStates.specialOrderDrawerRequired ? cms.commonLabels.goToShipToStoreLabel : cms.commonLabels.goToPaymentLabel;
  };

  render() {
    const { cms, orderDetails, savedShippingModes, buttonLabelCondition } = this.props;
    const shippingModesData = this.filterShippingGroups(orderDetails, savedShippingModes);
    const buttonText = buttonLabelCondition ? this.returnButtonLabel() : cms.commonLabels.confirmLabel;
    return (
      <section ref={this.shippingMethodRef}>
        <div className={`${shippingMethodsTitle} o-copy__14reg`}>{cms.shippingMethodLabel}</div>
        <div>
          {shippingModesData &&
            shippingModesData.map(item => (
              <Shipment
                cms={cms}
                shipmentDetails={item}
                orderDetail={orderDetails.orderItems}
                key={`groupSeqNum-${item.groupSeqNum}`}
                number={item.groupSeqNum}
                handleDropdown={(index, number) => this.handleDropdown(index, number)}
                initiallySelectedOption={this.returnSelectedMethodIndex(item.groupSeqNum)}
              />
            ))}
        </div>
        <div className="d-flex justify-content-end pt-2 pb-md-0 pb-half">
          <Button
            auid="checkout_goto_payment button-1"
            onClick={() => this.onClickPostCall(shippingModesData, orderDetails.addresses.shippingAddress, orderDetails.orderId)}
            size="S"
            className={`o-copy__14bold px-4 ${submitButton}`}
          >
            {buttonText}
          </Button>
        </div>
      </section>
    );
  }
}

ShippingMethods.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetails: PropTypes.object.isRequired,
  fnShippingMethodsCall: PropTypes.func,
  fnPostShippingAddressModesCall: PropTypes.func,
  savedShippingModes: PropTypes.object,
  buttonLabelCondition: PropTypes.bool,
  analyticsContent: PropTypes.func,
  validateShippingModes: PropTypes.object,
  landingDrawer: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
  fnShippingMethodsCall: data => dispatch(fetchSavedShippingModes(data)),
  fnPostShippingAddressModesCall: data => dispatch(postShippingAddressModes(data))
});

const withConnect = connect(
  null,
  mapDispatchToProps
);
const ShippingMethodsContainer = compose(withConnect)(ShippingMethods);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ShippingMethodsContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ShippingMethods);
