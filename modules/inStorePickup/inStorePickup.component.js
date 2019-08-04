import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { get } from '@react-nitro/error-boundary';
import { cx } from 'react-emotion';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import { reducer as form } from 'redux-form';
import injectReducer from '../../utils/injectReducer';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  ENTER,
  SPACE,
  EVENT_ACTION,
  EVENT_CATEGORY,
  EVENT_LABEL,
  EVENT_NAME,
  CHANGE_LOCATION_EVENT_ACTION,
  CHANGE_LOCATION_EVENT_NAME
} from './constants';
import { cardStyles, pointerStyle, errorWrapper, pickupInstruction, changeLocation, iconColor, marginBottomNull } from './inStorePickup.styles';
import { padDigits } from '../../utils/helpers';
import { getStoreAddress } from '../../apps/checkout/store/actions/getStoreAddress';
import { toggleFindAStore } from '../../modules/findAStoreModalRTwo/actions';
import { postPickupInStore } from '../../apps/checkout/store/actions/pickupInStore';
import AlternatePickupForm from './components/alternatePickupForm/alternatePickupForm';
import RenderButton from './components/renderButton/renderButton';
import { errorText } from '../genericError/styles';
import { scrollIntoView } from '../../utils/scroll';
import { collateAnalyticsData, typeOfOrder } from '../../utils/analyticsUtils';

// analytics data for change location
const changeLocationAnalyticsData = {
  event: CHANGE_LOCATION_EVENT_NAME,
  eventCategory: EVENT_CATEGORY,
  eventAction: CHANGE_LOCATION_EVENT_ACTION,
  eventLabel: EVENT_LABEL,
  customerleadlevel: null,
  customerleadtype: null,
  leadsubmitted: 0,
  newslettersignupcompleted: 0
};

class InStorePickup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pickupInstructionStatus: false,
      formStatus: false,
      ageCheckboxStatus: false,
      checkboxError: false
    };
    this.inStorePickupRef = React.createRef();
    this.renderCard = this.renderCard.bind(this);
    this.renderPickupInstructions = this.renderPickupInstructions.bind(this);
    this.handlepickupInstructions = this.handlepickupInstructions.bind(this);
    this.handleFormStatus = this.handleFormStatus.bind(this);
    this.getPickupInStoreShipment = this.getPickupInStoreShipment.bind(this);
    this.getShipmentImages = this.getShipmentImages.bind(this);
    this.handleSubmitCall = this.handleSubmitCall.bind(this);
    this.renderDropdownOption = this.renderDropdownOption.bind(this);
    this.getAlternatePickupDetails = this.getAlternatePickupDetails.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
  }
  componentDidMount() {
    const { orderDetails, storeAddress } = this.props;
    if (Object.keys(storeAddress.data).length === 0) {
      const storeId = padDigits(parseInt(orderDetails.storeId, 10), 4);
      this.props.fnGetStoreAddress(storeId);
    }
    const pickupGroup = this.getPickupInStoreShipment(orderDetails);
    const hasSofItems = get(orderDetails, 'checkoutStates.hasSOFItems', false);
    if (pickupGroup.shippingModes[0].alternatePickup.selection === 'alternate' && !hasSofItems) {
      this.handleFormStatus(1);
    }
    this.scrollIntoView();
    this.getOrderDetailsForAnalytics();
  }
  componentWillReceiveProps(nextProps) {
    const { getStoreId, analyticsContent, pickupInStore, alternatePickupForm, buttonLabelCondition, cms } = this.props;
    if (getStoreId.data.storeId !== nextProps.getStoreId.data.storeId) {
      const storeId = padDigits(parseInt(nextProps.getStoreId.data.storeId, 10), 4);
      this.props.fnGetStoreAddress(storeId);
    }
    if (!pickupInStore.error && pickupInStore.data !== nextProps.pickupInStore.data) {
      const buttonText = buttonLabelCondition ? this.returnButtonLabel() : cms.commonLabels.confirmLabel;
      const goToPaymentAnalyticsData = {
        event: 'checkoutsteps',
        eventCategory: 'checkout',
        eventAction: 'in store pickup',
        eventLabel: buttonText.toLowerCase(),
        leadsubmitted: alternatePickupForm && alternatePickupForm.values && alternatePickupForm.values.smsPreference ? 1 : 0,
        newslettersignupcompleted: alternatePickupForm && alternatePickupForm.values && alternatePickupForm.values.smsPreference ? 1 : 0
      };
      if (alternatePickupForm && alternatePickupForm.values && alternatePickupForm.values.smsPreference) {
        goToPaymentAnalyticsData.customerleadlevel = 'fully qualified';
        goToPaymentAnalyticsData.customerleadtype = 'registration';
      }
      analyticsContent(goToPaymentAnalyticsData);
    }
  }
  /**
   * it manage the state of chekcbox
   */
  onChangeCheckbox() {
    this.setState({ ageCheckboxStatus: !this.state.ageCheckboxStatus });
  }

  /**
   * it handles on page load or edit analytics data
   */
  getOrderDetailsForAnalytics() {
    const { orderDetails, analyticsContent, landingDrawer } = this.props;
    const orderItemsShippingMethodColln = orderDetails.orderItems.map(item => item.availableShippingMethods[0]);
    const pickupInStoreOrderItems = orderDetails && this.getPickupInStoreShipment(orderDetails);
    const productsDetails = pickupInStoreOrderItems && collateAnalyticsData(orderDetails, [pickupInStoreOrderItems]);
    const analyticsData = {
      event: EVENT_NAME,
      eventCategory: EVENT_CATEGORY,
      eventAction: EVENT_ACTION,
      eventLabel: EVENT_LABEL,
      ecommerce: {
        checkout: {
          actionField: {
            step: 5,
            option: EVENT_ACTION
          },
          products: productsDetails
        }
      },
      dimension85: typeOfOrder(orderItemsShippingMethodColln) || ''
    };
    analyticsData['checkout steps'] = landingDrawer;
    analyticsContent(analyticsData);
  }
  /**
   * it checks for shipping method of length one and shipping type pick up in storeand returns shipping group
   * @param {object} shipmentDetails - contains shipping groups
   */
  getPickupInStoreShipment(shipmentDetails) {
    return shipmentDetails.shippingGroups.find(
      shipment => shipment.shippingModes.length === 1 && shipment.shippingModes[0].shippingType === 'PICKUPINSTORE'
    );
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
   * it returns object of alternate pickup person details for post call
   * @param {object} data -contains alternate pickup person details
   */
  getAlternatePickupDetails(data, pickupInStoreShippingGroup) {
    const { formStatus, ageCheckboxStatus } = this.state;
    return formStatus
      ? {
          selection: 'alternate',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.mobile,
          smsPreference: data.emailNotification ? 'Y' : 'N',
          agreeAgeRestrictionForSTS: '',
          agreeAgeRestrictionForPickup: ''
        }
      : {
          selection: 'me',
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          smsPreference: '',
          agreeAgeRestrictionForSTS: '',
          agreeAgeRestrictionForPickup: pickupInStoreShippingGroup.hasSOFItems && ageCheckboxStatus ? 'Y' : 'N'
        };
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
  getInstructionLabel = label => {
    const updatedLabel = label.replace(/(\r\n|\n|\r)/gm, '');
    return <li className={cx('pl-2 pb-half o-copy__14reg', marginBottomNull)} dangerouslySetInnerHTML={{ __html: updatedLabel }} />;
  };
  /**
   * scrolls the component into view on component mount
   */
  scrollIntoView() {
    const el = this.inStorePickupRef.current;
    if (el) {
      scrollIntoView(el);
    }
  }
  createAgeLabel(label) {
    return { __html: label };
  }
  /**
   * it handles the pickup instructions open and collapsed
   */
  handlepickupInstructions() {
    this.setState({ pickupInstructionStatus: !this.state.pickupInstructionStatus });
  }
  /**
   * it handles the dropdown selection
   * @param {integer} index - contains the dropdown selection
   */
  handleFormStatus(index) {
    if (index === 1) {
      this.setState({ formStatus: true });
    } else {
      this.setState({ formStatus: false });
    }
  }
  /**
   * it handle submit post call
   * @param {object} pickupInStoreShippingGroup - contains shipping group which have shipping type pickup in store
   */
  handleSubmitCall(data, pickupInStoreShippingGroup) {
    const { ageCheckboxStatus } = this.state;
    if (!ageCheckboxStatus && pickupInStoreShippingGroup.hasSOFItems) {
      this.setState({ checkboxError: true });
    } else {
      const { orderDetails, storeAddress } = this.props;
      const storeId =
        storeAddress && storeAddress.data && Object.keys(storeAddress.data).length !== 0 && storeAddress.data.stores[0].length !== 0
          ? parseInt(storeAddress.data.stores[0].storeId, 10).toString()
          : orderDetails.storeId;
      const shippingAddress =
        orderDetails && orderDetails.addresses.shippingAddress && this.getShippingAddress(orderDetails.addresses.shippingAddress);
      const orderItems = [];
      pickupInStoreShippingGroup.orderItems.map(order => {
        orderItems.push({
          orderItemId: order.orderItemId,
          shipModeId: pickupInStoreShippingGroup.shippingModes[0].shipmodeId
        });
        return true;
      });
      const addShippingData = {
        ...shippingAddress,
        orderItems,
        orderId: orderDetails.orderId,
        isAddressVerified: '1',
        URL: 'checkout',
        alternatePickup: this.getAlternatePickupDetails(data, pickupInStoreShippingGroup),
        storeAddress: [{ storeidentifier: storeId }]
      };
      this.props.fnAddShippingDetailsCall(addShippingData);
    }
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
   * @param  {} {const{fnOpenStoreLocator
   * Method to handle location change
   */
  handleChangeLocation() {
    const { fnOpenStoreLocator, analyticsContent } = this.props;
    fnOpenStoreLocator({ status: true, isBopisEligible: true });
    analyticsContent(changeLocationAnalyticsData);
  }
  /**
   * function for returning the button label based on the drawers required
   */
  returnButtonLabel = () => {
    const { cms, orderDetails } = this.props;
    return orderDetails.checkoutStates.specialOrderDrawerRequired ? cms.commonLabels.goToShipToStoreLabel : cms.commonLabels.goToPaymentLabel;
  };
  /**
   * it returns dropdown option like me or me+alternate
   * @param {object} pickupInStoreShippingGroup - contains shipping group which contains shipping type pick up in store
   * @param {object} cms - data from AEM
   */
  renderDropdownOption(pickupInStoreShippingGroup, cms) {
    let option = [];
    if (pickupInStoreShippingGroup.hasSOFItems === true) {
      option = [{ title: `${cms.inStorePickupLabel.meLabel}` }];
    } else {
      option = [{ title: `${cms.inStorePickupLabel.meLabel}` }, { title: `${cms.inStorePickupLabel.meAlternatePersonLabel}` }];
    }
    return option;
  }
  /**
   * it returns pickup instruction
   * @param {object} cms - data from AEM
   */
  renderPickupInstructions(cms) {
    const { inStorePickupInstruction1Label, inStorePickupInstruction2Label, inStorePickupInstruction3Label } = cms.inStorePickupLabel;
    const instructionLabels = [inStorePickupInstruction1Label, inStorePickupInstruction2Label, inStorePickupInstruction3Label];
    return (
      <div className="pt-1">
        <ol className="pl-1">{instructionLabels.map(label => this.getInstructionLabel(label))}</ol>
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
      <div className="mr-1 mb-1" key={`card-${index}`}>
        <img
          src={imageDeatils ? imageDeatils.thumbnail : ''}
          className={`${cardStyles}`}
          alt={imageDeatils ? imageDeatils.imageAltDescription : ''}
        />
      </div>
    );
  }
  renderCheckbox(cms, pickupInStoreShippingGroup) {
    const { ageCheckboxStatus } = this.state;
    if (pickupInStoreShippingGroup.hasSOFItems === true) {
      return (
        <div className="pt-1">
          {this.renderCheckboxError(pickupInStoreShippingGroup)}
          <label className={`${pointerStyle} d-flex flex-row pb-1`}>
            <Checkbox
              id="in-store-pickup-check"
              disabled={false}
              checked={ageCheckboxStatus}
              labelText=""
              labelClass="o-copy__14reg"
              labelPosition="right"
              onChange={() => this.onChangeCheckbox()}
            />
            <div className="ml-1 o-copy__14reg" dangerouslySetInnerHTML={this.createAgeLabel(cms.inStorePickupLabel.sofDisclaimerNote)} />
          </label>
          <div className="o-copy__14reg" dangerouslySetInnerHTML={this.createAgeLabel(cms.inStorePickupLabel.sofDisclaimerFull)} />
        </div>
      );
    }
    return null;
  }
  renderCheckboxError(pickupInStoreShippingGroup) {
    const { cms } = this.props;
    const { checkboxError } = this.state;
    return checkboxError && pickupInStoreShippingGroup.hasSOFItems ? (
      <div className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
        <p className={`o-copy__14reg mb-0 ${errorText}`}>{cms.errorMsg.agreeAgeRestrictionNotSelected}</p>
      </div>
    ) : null;
  }
  render() {
    const { cms, orderDetails, storeAddress, buttonLabelCondition } = this.props;
    const { formStatus, pickupInstructionStatus } = this.state;
    const pickupInStoreShippingGroup = this.getPickupInStoreShipment(orderDetails);
    const orderImages =
      pickupInStoreShippingGroup &&
      pickupInStoreShippingGroup.orderItems &&
      this.getShipmentImages(pickupInStoreShippingGroup.orderItems, orderDetails.orderItems);
    const smsCheckboxStatus = pickupInStoreShippingGroup && pickupInStoreShippingGroup.shippingModes[0].alternatePickup.smsPreference === 'Y';
    const dropdownInitialValue = formStatus ? 1 : 0;
    const storeDetails = Object.keys(storeAddress.data).length > 0 && storeAddress.data.stores[0].properties;
    const buttonText = buttonLabelCondition ? this.returnButtonLabel() : cms.commonLabels.confirmLabel;
    return (
      <div ref={this.inStorePickupRef}>
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
            <a
              href=" #"
              data-auid="checkout_in_store_pickup_change_location"
              className={`o-copy__14reg ${changeLocation}`}
              onClick={this.handleChangeLocation}
            >
              {cms.commonLabels.changeLocationLabel}
            </a>
          </div>
          <div className="pt-2">
            <p className="o-copy__14reg">
              <span>{cms.inStorePickupLabel.itemsForPickupLabel}</span> ({pickupInStoreShippingGroup.orderItems.length})
            </p>
            <div className="d-flex flex-row flex-wrap pb-half">{orderImages && orderImages.map((item, index) => this.renderCard(item, index))}</div>
            <p className="o-copy__14reg">{cms.inStorePickupLabel.whoIsPickingupLabel}</p>
            <div className="col-12 col-md-6 pl-0 pb-2">
              <Dropdown
                DropdownOptions={this.renderDropdownOption(pickupInStoreShippingGroup, cms)}
                initiallySelectedOption={dropdownInitialValue}
                disabled={false}
                width="100%"
                height="3.25rem"
                borderWidth="1px"
                borderRadius="4px"
                listBorderRadius="5px"
                titleClass="o-copy__14reg"
                subtitleClass="o-copy__12reg"
                onSelectOption={index => this.handleFormStatus(index)}
                data-auid="checkout_in_store_pickup_person_dropdown"
              />
            </div>
            {formStatus ? (
              <AlternatePickupForm cms={cms} formData={pickupInStoreShippingGroup.shippingModes[0].alternatePickup} status={smsCheckboxStatus} />
            ) : null}
            <span
              className={`${pickupInstruction} o-copy__14reg mb-0`}
              role="button"
              tabIndex="0"
              onKeyDown={this.handleKeyDown}
              aria-label={cms.inStorePickupLabel.seeInStorePickupInstructionsLabel}
              onClick={() => this.handlepickupInstructions()}
            >
              <span className="storeLink">{cms.inStorePickupLabel.seeInStorePickupInstructionsLabel}</span>
              {pickupInstructionStatus ? (
                <span className={`${iconColor} academyicon icon-chevron-up ml-half align-text-bottom`} />
              ) : (
                <span
                  className={` ${iconColor} academyicon icon-chevron-down ml-half align-text-bottom`}
                  onClick={() => this.handlepickupInstructions()}
                  role="presentation"
                />
              )}
            </span>
            {pickupInstructionStatus ? this.renderPickupInstructions(cms) : null}
            {this.renderCheckbox(cms, pickupInStoreShippingGroup)}
          </div>
        </section>
        <div className="d-flex justify-content-end pt-2 pb-md-0 pb-half">
          <RenderButton buttonText={buttonText} buttonClickAction={data => this.handleSubmitCall(data, pickupInStoreShippingGroup)} />
        </div>
      </div>
    );
  }
}

InStorePickup.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetails: PropTypes.object.isRequired,
  fnAddShippingDetailsCall: PropTypes.func,
  fnGetStoreAddress: PropTypes.func,
  storeAddress: PropTypes.object,
  fnOpenStoreLocator: PropTypes.func,
  getStoreId: PropTypes.object,
  buttonLabelCondition: PropTypes.bool,
  analyticsContent: PropTypes.func,
  pickupInStore: PropTypes.func,
  alternatePickupForm: PropTypes.object,
  landingDrawer: PropTypes.string
};
const mapDispatchToProps = dispatch => ({
  fnAddShippingDetailsCall: data => dispatch(postPickupInStore(data)),
  fnOpenStoreLocator: data => dispatch(toggleFindAStore(data)),
  fnGetStoreAddress: data => dispatch(getStoreAddress(data))
});
// const mapStateToProps = state => ({
//   storeIdFromFasm: state.findAStoreModalRTwo.getMystoreDetails
// });
const withConnect = connect(
  null,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const InStorePickupContainer = compose(
    withConnect,
    formReducer
  )(InStorePickup);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <InStorePickupContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(InStorePickup);
