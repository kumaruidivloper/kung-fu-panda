/**
 * shippingAddres.component.js renders the form container and contains the shippingAddress Form
 */
// ToDo :- send and validate save address to my account checkbox value to API.
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { combineReducers, compose } from 'redux';
import { reducer as form } from 'redux-form';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import { get } from '@react-nitro/error-boundary';
import { titleStyle } from './shippingAddress.styles';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  ANALYTICS_EVENT_IN,
  ANALYTICS_SUB_EVENT_IN,
  ANALYTICS_EVENT_CATEGORY,
  analyticsEventAction,
  analyticsEventLabel,
  APOFPOSTATE_ERROR_KEY
} from './constants';
import { PROP65ERRORCODE, STATE_RESTRICTION_ERROR } from '../../apps/checkout/checkout.constants';
import ShippingAddressForm from './shippingAddressForm';
import AddressSuggestions from './addressSuggestionsModal';
import GenericError from './../genericError';
import Prop65Error from './components/prop65Error/prop65Error';
import ShippingAddressFormSubmitBtn from './shippingAddressFormSubmitBtn';
import { fetchSavedShippingAddress, addshippingAddress, invalidateShippingAddress } from '../../apps/checkout/store/actions/savedShippingAddress';
import { checkoutRemoveOrderItem } from '../../apps/checkout/store/actions/removeOrderItem';
import { validateAddress, inValidateAddressVerification } from '../../apps/checkout/store/actions/validateAddress';
import { loadCityStateFromZipCode } from '../../apps/checkout/store/actions/fetchCityState';
import injectReducer from '../../utils/injectReducer';
import StorageManager from './../../utils/StorageManager';
import { getURLparam } from './../../utils/helpers';
import { mapOrderItems, collateAnalyticsData, typeOfOrder } from '../../utils/analyticsUtils';
import { scrollIntoView } from '../../utils/scroll';
import RestrictionsError from './components/restrictionsError';

const getShippingAdressOrderItemErrorsFromProps = props => {
  const { addShippingAddress = {}, orderDetails = {} } = props;
  const { data: { errors = [] } = {} } = addShippingAddress;
  if (errors.length) {
    const { excData: { orderItems = [] } = {} } = errors[0];
    return orderItems;
  }

  const { addresses: { addressRestrictions = [] } = {} } = orderDetails;
  const { excData: { orderItems = [] } = {} } = addressRestrictions.length ? addressRestrictions[0] : {};
  return orderItems;
};

export class ShippingAddress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addressStateIndex: 0,
      modalIsOpen: false
    };
    this.contentForDropdown = this.contentForDropdown.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onSubmitSuggestHandler = this.onSubmitSuggestHandler.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onRemoveItemHandler = this.onRemoveItemHandler.bind(this);
    this.wrapperRef = React.createRef();
  }
  /**
   * It fetches the previous stored shipping addresses.
   */
  componentDidMount() {
    const { isLoggedIn, analyticsContent, orderDetails, landingDrawer } = this.props;
    const orderItemsShippingMethodColln = orderDetails.orderItems.map(item => item.availableShippingMethods[0]);
    if (isLoggedIn) {
      const userId = StorageManager.getSessionStorage('userId');
      this.props.fnfetchSavedShippingAddress(userId);
    }
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventAction,
      eventLabel: analyticsEventLabel,
      ecommerce: {
        checkout: {
          actionField: { step: 3, option: 'shipping information' },
          products: collateAnalyticsData(orderDetails, orderDetails.shippingGroups)
        }
      },
      dimension85: typeOfOrder(orderItemsShippingMethodColln) || ''
    };
    analyticsData['checkout steps'] = landingDrawer;
    this.scrollIntoView();
    analyticsContent(analyticsData);
  }
  /**
   * It checkes the reposonse of validateShippingAddress API and decide whether AVS modal will open or not.
   * @param {Object} nextProps - Fetching updated props.
   */
  componentWillReceiveProps(nextProps) {
    const { analyticsContent } = this.props;
    if (nextProps.addShippingAddress.error) {
      const errorAnalyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'form validation error|shipping info',
        eventLabel: get(nextProps, 'addShippingAddress.data.errors[0].errorMessage', '')
      };
      analyticsContent(errorAnalyticsData);
    }
    if (
      nextProps.validateShippingAddress &&
      nextProps.validateShippingAddress.data &&
      !nextProps.validateShippingAddress.error &&
      nextProps.validateShippingAddress.data.avsErrors
    ) {
      this.setState({ modalIsOpen: true });
    } else if (
      nextProps.validateShippingAddress.error ||
      (nextProps.validateShippingAddress && nextProps.validateShippingAddress.data && nextProps.validateShippingAddress.data.address === 'Verified')
    ) {
      this.onSubmitSuggestHandler(this.state.enteredAddress, false);
    }
    // To find the index value of savedshippingAddress for the authenticated user dropdown.
    // TODO: New API changes the json structure too. Hence checking every corner case.
    const nextPropsAddressObj = Object.keys(get(nextProps, 'savedShippingAddress.data.profile.address', {}));
    const currentPropsAddressObj = Object.keys(get(this.props, 'savedShippingAddress.data.profile.address', {}));
    if (nextPropsAddressObj.length !== currentPropsAddressObj.length) {
      const { address } = nextProps.savedShippingAddress.data.profile;
      this.setState({ addressStateIndex: this.getDefaultAddressIndex(address) });
    }
  }

  componentDidUpdate(prevProps) {
    const previousShippingAddress = prevProps && prevProps.addShippingAddress;
    const { addShippingAddress } = this.props;
    /* On successfull click of submit/confirm. button, push following analytics data */
    if (
      previousShippingAddress &&
      addShippingAddress &&
      !addShippingAddress.error &&
      previousShippingAddress.isFetching &&
      !addShippingAddress.isFetching &&
      addShippingAddress.data &&
      Object.keys(addShippingAddress.data).length > 0
    ) {
      this.onSubmitConfirmPushAnalyticsData();
    }
  }
  componentWillUnmount() {
    this.props.invalidateShippingAddress();
  }

  /**
   * On selecting the previous stored Address, it will either validate the new address or directly add shipping address according to index value.
   * @param {Object} data - Data object contains shippingAddress form data.
   */
  onSubmitHandler(data) {
    const { isLoggedIn, savedShippingAddress } = this.props;
    this.setState({ enteredAddress: data });
    this.setState({ enteredAddress: data });
    const shippingAddressList = get(savedShippingAddress, 'data.profile.address', []);
    const index = isLoggedIn ? shippingAddressList.length : 0;
    if (this.state.addressStateIndex === index) {
      const { orderId } = this.props.orderDetails;
      this.props.fnvalidateshippingAddress(data, orderId);
    } else {
      // TODO: Due to api structure change, needs to restruture.
      const savedData = this.props.savedShippingAddress.data.profile.address[this.state.addressStateIndex];
      const newAddress = {
        id: savedData.addressId,
        firstName: savedData.firstName,
        lastName: savedData.lastName,
        phoneNumber: savedData.phoneNumber,
        companyName: savedData.companyName ? savedData.companyName : '',
        address: savedData.address,
        zipCode: savedData.zipCode,
        city: savedData.city,
        state: savedData.state
      };
      this.onSubmitSuggestHandler(newAddress, true);
    }
  }
  /**
   * It closes the modal and calls the action for adding shippingaddress. And then erase the data from redux reducer.
   * @param {Object} selectedAddress - Data object contains selected shippingAddress data from validation modal.
   */
  onSubmitSuggestHandler(selectedAddress, isAddressVerified) {
    const { id, ...rest } = selectedAddress;
    const analyticsData = {
      event: ANALYTICS_SUB_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_IN,
      eventAction: 'shipping information',
      eventLabel: 'go to shipping method',
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };
    this.props.analyticsContent(analyticsData);
    this.closeModal();
    const { orderId } = this.props.orderDetails;
    StorageManager.setSessionStorage('cartUserChangedZip', selectedAddress.zipCode);
    this.props.fnAddshippingAddress({ ...(selectedAddress.id && { addressId: id }), ...rest }, orderId, isAddressVerified);
  }
  /**
   * it handle remove of order items on prop 65 error conditon.
   * TO BE TESTED, AEM REMOVE LINK NOT PRESENT WHILE TESTING.
   */
  onRemoveItemHandler() {
    const { orderDetails } = this.props;
    const errorData = getShippingAdressOrderItemErrorsFromProps(this.props);
    const orderItem = errorData.map(item => ({ orderItemId: item, quantity: '0' }));
    const apidata = { orderId: orderDetails.orderId, orderItem };
    this.onRemoveProp65LogAnalytics(errorData, orderItem);
    this.props.fnRemoveItems(apidata);
  }

  onRemoveProp65LogAnalytics(errorData, orderItem) {
    const { analyticsContent, orderDetails, landingDrawer } = this.props;
    const { checkoutStates = {} } = orderDetails;
    const hasSOFItems = checkoutStates.hasSOFItems || false;
    const enhancedAnalyticsData = {
      event: 'removeFromCart',
      eventCategory: 'shopping cart',
      eventAction: 'remove from shipping information drawer',
      eventLabel: `quantity removed - ${errorData.length}`,
      'checkout steps': landingDrawer,
      ecommerce: {
        remove: {
          products: mapOrderItems(this.getRemovedOrderItems(orderItem), { dimension5: '' })
        }
      },
      dimension76: `${hasSOFItems}`
    };

    analyticsContent(enhancedAnalyticsData);
  }

  /**
   * pushes analytics data on successfull click of submit/confirm CTA in shipping information drawer.
   */
  onSubmitConfirmPushAnalyticsData() {
    const {
      analyticsContent,
      addShippingAddress: { data }
    } = this.props;
    const evtLabel = data && Object.keys(data).includes('updateShippingAddress') ? 'confirm' : 'submit';
    const analyticsData = {
      event: ANALYTICS_SUB_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_IN,
      eventAction: analyticsEventAction,
      eventLabel: evtLabel,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };
    analyticsContent(analyticsData);
  }

  /**
   * Get default shipping address index
   * @param address
   * @returns {number}
   */
  getDefaultAddressIndex(address) {
    const { orderDetails } = this.props;
    const addressId = get(orderDetails, 'addresses.shippingAddress.id', '');
    const defaultIndex = address.findIndex(data => data.addressId === addressId);
    const fallbackIndex = address.length > 0 ? 0 : address.length;
    const derivedIndex = defaultIndex > -1 ? defaultIndex : fallbackIndex;
    return derivedIndex;
  }

  /**
   * get initial form values
   * @return {Object}
   */
  getInitialFromData() {
    const { orderDetails } = this.props;
    const initialData = orderDetails.addresses.shippingAddress ? orderDetails.addresses.shippingAddress : {};
    const zipcode = getURLparam('deliveryzip');
    let formValues = initialData;
    // if zipCode does not exist in shippingAddress node, set the default zipCode that is present in the URL
    // if zipcode is coming as "null", it will go as empty.
    const zipCode = zipcode === 'null' ? '' : zipcode;
    if (typeof initialData.zipCode === typeof undefined) {
      formValues = Object.assign({}, initialData, { zipCode });
    } else if (typeof initialData.zipCode !== typeof undefined && initialData.zipCode.trim().length === 0) {
      // if zipCode exists in shippingAddress node and zipCode value is empty string, set the default zipCode that is present in the URL
      formValues = Object.assign({}, initialData, { zipCode });
    }
    formValues.saveAddressCheckbox = true; // defaults saving address to true.
    return formValues;
  }

  /**
   * To send only the city state values while editing the data in redux form.
   * @param {*} initialData - Prepopulated form values
   */
  getCityState(initialData) {
    if (initialData.city && initialData.state) {
      return { city: initialData.city, state: initialData.state, zipCode: initialData.zipCode };
    }
    return null;
  }
  /**
   * returns order items removed.
   * @param {Array} errorData - contain order item list which are restricted to prop 65.
   */
  getRemovedOrderItems(orderItemsToRemove) {
    const { orderDetails = {} } = this.props;
    const { orderItems = [] } = orderDetails;
    const filteredArray = [];
    orderItemsToRemove.forEach(item => {
      const { orderItemId } = item;
      const tempFiltered = orderItems.filter(row => row.orderItemId === orderItemId);
      if (tempFiltered.length) {
        filteredArray.push(...tempFiltered);
      }
    });
    return filteredArray;
  }

  /**
   * scrolls the component into view on component mount
   */
  scrollIntoView() {
    const el = this.wrapperRef.current;
    if (el) {
      scrollIntoView(el, { offset: -300 });
    }
  }

  /**
   * Update the state to close the modal.
   */
  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.inValidateAddressVerification();
  }
  /**
   * It renders the stored address to dropdown.
   * @param {Array} data- It contains the array of previous stored shippingAddress.
   * @return {Array} dropdownOptions - It return the formated data for dropdown.
   */
  contentForDropdown(data) {
    const shippingAddressList = [].concat(data);
    shippingAddressList.push({ firstName: this.props.cms.addNewShippingAddressLabel });
    const dropdownOptions = [];
    shippingAddressList.map((item, i) => {
      if (i === shippingAddressList.length - 1) {
        dropdownOptions.push({ title: item.firstName });
      } else {
        dropdownOptions.push({
          title: `${item.firstName} ${item.lastName}`,
          subtitle: `${item.addressLine ? item.addressLine.join(' ') : ''}${item.addressLine ? ',' : ''} ${item.city}, ${item.state} ${item.zipCode}`
        });
      }
      return null;
    });
    return dropdownOptions;
  }

  /**
   * Method to check whether error key exist
   */
  checkErrorKeyExist = (errors = [], key) => errors.length > 0 && errors.filter(error => error.errorKey === key).length > 0;

  /**
   * renders prop65 errors
   * @param errorList
   * @returns {array}
   */
  renderAddressRestrictionErrors(errorList) {
    const { cms, orderDetails, analyticsContent } = this.props;
    return errorList.map(error => (
      <Prop65Error
        onRemove={this.onRemoveItemHandler}
        cms={cms}
        orderDetails={orderDetails}
        excData={error.excData}
        analyticsContent={analyticsContent}
      />
    ));
  }

  /**
   * renders restrictions based on key
   * @param errorList
   * @returns {array}
   */
  renderRestrictionErrors(errorList, itemKey, errorMessage, orderKey) {
    const { orderDetails } = this.props;
    return errorList.map(({ excData = {} }) => (
      <RestrictionsError
        errorMsg={errorMessage}
        orderDetails={orderDetails}
        restrictedItems={excData[itemKey]}
        orderKey={orderKey}
        state={excData.state}
      />
    ));
  }

  /**
   * returns error message in shipping address drawer
   * @param {object} addShippingAddress - contains error message of add shipping address call
   */
  renderErrorMessage(errors) {
    const { cms } = this.props;
    const { errorMsg = {} } = cms;

    if (this.checkErrorKeyExist(errors, PROP65ERRORCODE)) {
      return this.renderAddressRestrictionErrors(errors);
    }

    if (this.checkErrorKeyExist(errors, APOFPOSTATE_ERROR_KEY)) {
      const { _ERR_RESTRICTEDITEM_APOFPOSTATE_ERROR } = errorMsg;
      return this.renderRestrictionErrors(errors, 'poRestrictedItems', _ERR_RESTRICTEDITEM_APOFPOSTATE_ERROR, 'productId');
    }

    if (this.checkErrorKeyExist(errors, STATE_RESTRICTION_ERROR)) {
      const { _ERR_ITEM_STATE_RESTRICTION_ERROR } = errorMsg;
      return this.renderRestrictionErrors(errors, 'orderItems', _ERR_ITEM_STATE_RESTRICTION_ERROR, 'orderItemId');
    }

    return (
      <div className="mb-1" key="generic-error">
        <GenericError auid="checkout_state_restriction_error_details" cmsErrorLabels={cms.errorMsg} apiErrorList={errors} />
      </div>
    );
  }

  render() {
    const { isLoggedIn, savedShippingAddress, cms, addShippingAddress, required, orderDetails, analyticsContent } = this.props;
    const {
      addresses: { addressRestrictions }
    } = orderDetails;
    const initialData = this.getInitialFromData();
    const confirmStatus = required ? cms.goToShippingMethodLabel : cms.commonLabels.confirmLabel;
    const cityStateData = this.getCityState(initialData);
    return (
      <div ref={this.wrapperRef}>
        {this.state.modalIsOpen && (
          <AddressSuggestions
            cms={cms}
            modalIsOpen={this.state.modalIsOpen}
            closeModal={this.closeModal}
            formStates={this.state.enteredAddress}
            onSubmitSuggestHandler={this.onSubmitSuggestHandler}
            validateShippingAddress={this.props.validateShippingAddress}
            analyticsContent={analyticsContent}
          />
        )}
        {addShippingAddress.error === true && addShippingAddress.data && this.renderErrorMessage(get(addShippingAddress, 'data.errors', []))}
        {addShippingAddress.error !== true && addressRestrictions.length > 0 && this.renderErrorMessage(addressRestrictions)}
        <span className={`${titleStyle} o-copy__14reg d-block pb-1`}> {cms.shippingAddressMandatoryLabel} </span>
        {isLoggedIn &&
        (savedShippingAddress.isFetching === false &&
          savedShippingAddress.error === false &&
          savedShippingAddress.data &&
          savedShippingAddress.data.profile &&
          Object.keys(savedShippingAddress.data.profile.address).length > 0) ? (
            <div>
              <div className="p-0 mb-2 col-12 col-md-10 col-lg-7">
                <Dropdown
                  onSelectOption={index => this.setState({ addressStateIndex: index })}
                  multi
                  DropdownOptions={this.contentForDropdown(savedShippingAddress.data.profile.address)}
                  initiallySelectedOption={this.state.addressStateIndex}
                  width="100%"
                  titleClass="o-copy__14bold d-flex"
                  name="Dropdown"
                  id="1"
                  subtitleClass="o-copy__14reg d-flex"
                  padding="0.5rem"
                />
              </div>
              {this.state.addressStateIndex === savedShippingAddress.data.profile.address.length ? (
                <div>
                  <ShippingAddressForm {...this.props} initialVals={cityStateData} saveAddressForLater onSubmitForm={this.onSubmitHandler} />
                  <ShippingAddressFormSubmitBtn
                    onSubmitForm={this.onSubmitHandler}
                    btnText={confirmStatus}
                    orderDetails={orderDetails}
                    cms={cms}
                    analyticsContent={analyticsContent}
                  />
                </div>
            ) : (
              <ShippingAddressFormSubmitBtn
                analyticsContent={analyticsContent}
                onSubmitForm={this.onSubmitHandler}
                btnText={cms.commonLabels.confirmLabel}
                orderDetails={orderDetails}
                cms={cms}
              />
            )}
            </div>
        ) : (
          <div>
            <ShippingAddressForm {...this.props} initialVals={initialData} saveAddressForLater={isLoggedIn} onSubmitForm={this.onSubmitHandler} />
            <ShippingAddressFormSubmitBtn
              onSubmitForm={this.onSubmitHandler}
              btnText={confirmStatus}
              orderDetails={orderDetails}
              cms={cms}
              analyticsContent={analyticsContent}
            />
          </div>
        )}
      </div>
    );
  }
}

ShippingAddress.propTypes = {
  cms: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  savedShippingAddress: PropTypes.object.isRequired,
  validateShippingAddress: PropTypes.object.isRequired,
  fnfetchSavedShippingAddress: PropTypes.func,
  fnAddshippingAddress: PropTypes.func,
  fnvalidateshippingAddress: PropTypes.func,
  orderDetails: PropTypes.object.isRequired,
  inValidateAddressVerification: PropTypes.func,
  addShippingAddress: PropTypes.object,
  fnRemoveItems: PropTypes.func,
  required: PropTypes.any,
  analyticsContent: PropTypes.func,
  landingDrawer: PropTypes.string
};
const mapDispatchToProps = dispatch => ({
  fnfetchSavedShippingAddress: profileId => dispatch(fetchSavedShippingAddress(profileId)),
  fnAddshippingAddress: (data, orderid, isAddressVerified) => dispatch(addshippingAddress(data, orderid, isAddressVerified)),
  fnvalidateshippingAddress: (data, orderId) => dispatch(validateAddress(data, orderId)),
  fnvalidateZipCodeshippingAddress: data => dispatch(loadCityStateFromZipCode(data)),
  inValidateAddressVerification: () => dispatch(inValidateAddressVerification()),
  fnRemoveItems: data => dispatch(checkoutRemoveOrderItem(data)),
  invalidateShippingAddress: data => dispatch(invalidateShippingAddress(data))
});
const withConnect = connect(
  null,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer: combineReducers({ key: 'vals' }) });
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const ShippingAddressContainer = compose(
    withReducer,
    formReducer,
    withConnect
  )(ShippingAddress);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ShippingAddressContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ShippingAddress);
