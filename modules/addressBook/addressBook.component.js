import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Provider } from 'react-redux';
import FormErrorScrollManager from '../../utils/FormErrorScrollManager';
import AddressCard from './addressCard';
import AddressSuggestions from './addressSuggestionsModal';
import AddressFormSubmitBtn from './AddressFormSubmitBtn';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  VERIFY_ADDRESS,
  INVAILD_ZIP_CODE_ERR,
  addressSubmitEvtAction,
  addressSubmitEvtLabel,
  ANALYTICS_EVENT_IN,
  ANALYTICS_EVENT_CATEGORY
} from './constants';
import EmptyCondition from './emptyCondition';
import MyAccountAddressForm from './myAccountAddressForm';
import { bgNone, boxBlock, errorWrapper, iconPlus, cancelLink } from './styles';
import withScroll from '../../hoc/withScroll';
import { myAccountClicksAnalyticsData } from '../../utils/analyticsUtils';


class AddressBook extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      editFlag: '',
      addressId: '',
      editItemIndex: ''
    };

    this.errorScrollManager = new FormErrorScrollManager('.form-scroll-to-error');

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmitSuggestHandler = this.onSubmitSuggestHandler.bind(this);
    this.toggleAddressForm = this.toggleAddressForm.bind(this);
    this.addUserAddress = this.addUserAddress.bind(this);
    this.renderAddressForm = this.renderAddressForm.bind(this);
    this.getErrorMsg = this.getErrorMsg.bind(this);
  }
  componentDidMount() {
    const { profileID, redirectLogin, fnFetchAddress, breadCrumbAction, cms, scrollPageToTop, fnshowloader, analyticsContent } = this.props;
    breadCrumbAction(cms.addressBookLabel);
    if (profileID === null) {
      fnshowloader();
      redirectLogin();
    } else {
      scrollPageToTop();
      fnFetchAddress(profileID);
    }
    myAccountClicksAnalyticsData(cms.addressBookLabel, analyticsContent);
  }
  /**
   * It checkes the reposonse of validateShippingAddress API and decide whether AVS modal will open or not.
   * @param {Object} nextProps - Fetching updated props.
   */
  componentWillReceiveProps(nextProps) {
    const { validatedAddress } = nextProps;
    const { analyticsContent } = this.props;
    if (validatedAddress && validatedAddress.data && !validatedAddress.error && validatedAddress.data.avsErrors) {
      this.setState({ modalIsOpen: true });
    } else if (validatedAddress.error || (nextProps.validatedAddress && validatedAddress.data && validatedAddress.data.address === VERIFY_ADDRESS)) {
      this.onSubmitSuggestHandler(this.state.enteredAddress);
    }
    if (nextProps.error && nextProps.error !== this.props.error) {
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'form validation error|add address',
        eventLabel: this.getErrorMsg(nextProps)
      };
      analyticsContent(analyticsData);
    }
  }
  /**
   * It closes the modal and calls the action for adding shippingaddress. And then erase the data from redux reducer.
   * @param {Object} selectedAddress - Data object contains selected shippingAddress data from validation modal.
   */
  onSubmitSuggestHandler(selectedAddress) {
    this.closeModal();
    const addressLine = [];
    const { profileID, editAddress, toggleAddressForm, addressList } = this.props;
    const { addressId, editFlag, editItemIndex } = this.state;
    addressLine.push(selectedAddress.address);
    // condition to check null case
    if (selectedAddress.companyName === null || selectedAddress.companyName === undefined) {
      addressLine.push('');
    } else {
      addressLine.push(selectedAddress.companyName);
    }
    const addressToAPI = { ...selectedAddress, addressLine };
    delete addressToAPI.address;
    delete addressToAPI.companyName;
    if (editFlag === 'edit') {
      const { country, nickName, addressType } = addressList[editItemIndex];
      addressToAPI.addressId = addressId;
      addressToAPI.country = country;
      addressToAPI.nickName = nickName;
      addressToAPI.addressType = addressType;
      editAddress(addressToAPI, addressId, profileID);
    } else {
      this.addUserAddress(addressToAPI);
    }
    toggleAddressForm(false, editFlag);
  }
  /**
   * On selecting the previous stored Address, it will either validate the new address or directly add shipping address according to index value.
   * @param {Object} data - Data object contains shippingAddress form data.
   */
  onSubmitHandler(data, flag, initialVals, index) {
    const { scrollPageToTop } = this.props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: flag === 'edit' ? addressSubmitEvtAction.EDIT : addressSubmitEvtAction.ADD,
      eventLabel: flag === 'edit' ? addressSubmitEvtLabel.EDIT : addressSubmitEvtLabel.ADD
    };
    this.props.analyticsContent(analyticsData);
    this.props.fnValidateAddress(data);
    this.setState({
      enteredAddress: data,
      editItemIndex: index,
      modalIsOpen: true,
      editFlag: flag,
      addressId: initialVals === null ? '' : initialVals.addressId
    });
    scrollPageToTop();
  }

  getErrorMsg(data) {
    const { cms, errorCode } = data;
    const errorMessageToPublish = cms.errorMsg && cms.errorMsg[errorCode];
    return errorMessageToPublish || '';
  }
  /**
   * @function this function add the user address based on condition
   * if the user adds first address the address book it will mark that address as default one
   * @param {Object} selectedAddress
   */

  addUserAddress(selectedAddress) {
    const { scrollPageToTop } = this.props;
    if (this.props.addressList !== undefined && this.props.addressList.length > 0) {
      this.props.fnAddAddress(selectedAddress, this.props.profileID);
    } else {
      const addressDetails = { ...selectedAddress, primary: true };
      this.props.fnAddAddress(addressDetails, this.props.profileID);
    }
    scrollPageToTop();
  }
  toggleAddressForm(condition, flag) {
    if (flag === 'edit') {
      this.props.toggleEditAddressForm(condition);
    } else {
      this.props.toggleAddressForm(condition);
    }
  }
  /**
   * To close the AVS modal and clear the reducer data.
   */
  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.inValidateAddressVerification();
  }
  /**
   * displays the address form
   * @param {object} cms
   * @param {object} errorMsg
   * @param {object} initialVals
   * @param {string} flag
   * @param {number} index - index of each address item
   */
  renderAddressForm({ error, scrollToTop, analyticsContent, errorCode, fnLoadCityStateData, zipCodeCityStateData, addressList }) {
    return (cms, errorMsg, initialVals, flag, index) => {
      const errorMessage = errorCode;
      let btnText = 'ADD NEW ADDRESS';
      let formHeading = cms.addNewAddressLabelUpper;
      if (flag === 'edit') {
        btnText = cms.commonLabels.updateLabel;
        formHeading = cms.editAddressLabel;
      }
      return (
        <div className={`${boxBlock} mb-half px-md-3`}>
          <div className="o-copy__16bold pb-3 pt-2">{formHeading}</div>
          {error && errorMessage !== INVAILD_ZIP_CODE_ERR ? (
            <div>
              <section className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
                <p className="o-copy__14reg mb-0">{errorMsg[errorMessage] ? errorMsg[errorMessage] : cms.errorMsg[errorMessage]}</p>
              </section>
            </div>
          ) : null}
          <MyAccountAddressForm
            cms={cms}
            onSubmit={data => this.onSubmitHandler(data, flag, initialVals)}
            fnLoadCityStateData={fnLoadCityStateData}
            zipCodeCityStateData={zipCodeCityStateData}
            initialVals={initialVals}
            addressList={addressList}
            index={index}
            flag={flag}
            errorScrollManager={this.errorScrollManager}
            scrollToTop={scrollToTop}
          />
          <div className={classNames('d-flex', 'flex-column', 'flex-md-row', 'flex-column-reverse', 'justify-content-end', 'pb-3', 'pt-2')}>
            <div className="d-flex justify-content-center">
              <button
                auid="address_cancel_btn"
                className={`${bgNone} ${cancelLink} o-copy__14reg pt-2 pt-md-0 mr-0 mr-md-2`}
                onClick={() => this.toggleAddressForm(false, flag)}
              >
                {cms.commonLabels.cancelLabel}
              </button>
            </div>
            <div>
              <AddressFormSubmitBtn
                onSubmitForm={this.onSubmitHandler}
                initialVals={initialVals}
                flag={flag}
                btnText={btnText}
                errorScrollManager={this.errorScrollManager}
                analyticsContent={analyticsContent}
                index={index}
              />
            </div>
          </div>
        </div>
      );
    };
  }
  render() {
    const {
      cms,
      errorMsg,
      validatedAddress,
      addressList,
      showAddressForm,
      deleteID,
      setDefault,
      showEditAddressForm,
      showAlertBox,
      toggleEditAddressForm,
      deleteAddress,
      setAlert,
      profileID,
      scrollPageToTop,
      analyticsContent
    } = this.props;
    const { modalIsOpen, enteredAddress } = this.state;
    if (profileID) {
      return (
        <div data-auid="address_page" className="container-fluid">
          {modalIsOpen && (
            <AddressSuggestions
              cms={cms}
              modalIsOpen={modalIsOpen}
              closeModal={this.closeModal}
              onSubmitSuggestHandler={this.onSubmitSuggestHandler}
              validatedAddress={validatedAddress}
              formStates={enteredAddress}
            />
          )}
          <div className="d-flex flex-column flex-sm-row pt-md-3 pt-sm-0 pb-1 justify-content-between">
            <div>
              <h5>{cms.addressBookLabel}</h5>
            </div>
            {(!showAddressForm && addressList.length > 0) ? (
              <button
                auid="add_address_btn"
                className={`${bgNone} o-copy__14reg pt-half text-left text-sm-right`}
                onClick={() => this.toggleAddressForm(true)}
              >
                <i className={`${iconPlus} academyicon icon-plus pr-half`} />
                <span className="linkStyle">{cms.addNewAddressLabelLower}</span>
              </button>
            ) : null}
          </div>
          {showAddressForm ? this.renderAddressForm(this.props)(cms, errorMsg, null) : null}
          {addressList.length === 0 && !showAddressForm ? (
            <EmptyCondition heading={cms.noAddressListedText} button={cms.addNewAddressLabelUpper} onClickHandler={this.toggleAddressForm} />
          ) : null}
          {addressList.length > 0 && (
            <AddressCard
              errorMsg={errorMsg}
              setDefault={setDefault}
              deleteID={deleteID}
              addressList={addressList}
              renderAddressForm={this.renderAddressForm(this.props)}
              cms={cms}
              toggleEditAddressForm={toggleEditAddressForm}
              showEditAddressForm={showEditAddressForm}
              deleteAddress={deleteAddress}
              profileID={profileID}
              showAlertBox={showAlertBox}
              setAlert={setAlert}
              scrollPageToTop={scrollPageToTop}
              analyticsContent={analyticsContent}
            />
          )}
        </div>
      );
    }
    return null;
  }
}

AddressBook.propTypes = {
  cms: PropTypes.object.isRequired,
  fnValidateAddress: PropTypes.func,
  validatedAddress: PropTypes.object,

  fnFetchAddress: PropTypes.func,
  addressList: PropTypes.object,
  fnAddAddress: PropTypes.func,
  showAddressForm: PropTypes.bool,
  toggleAddressForm: PropTypes.func,
  toggleEditAddressForm: PropTypes.func,
  showEditAddressForm: PropTypes.bool,
  profileID: PropTypes.string,
  deleteAddress: PropTypes.func,
  editAddress: PropTypes.func,
  showAlertBox: PropTypes.bool,
  setAlert: PropTypes.func,
  deleteID: PropTypes.string,
  setDefault: PropTypes.func,
  error: PropTypes.bool,
  errorMsg: PropTypes.object,
  inValidateAddressVerification: PropTypes.func,
  redirectLogin: PropTypes.func,
  breadCrumbAction: PropTypes.func,
  analyticsContent: PropTypes.func,
  scrollPageToTop: PropTypes.func,
  fnshowloader: PropTypes.func
};

const WrappedAddressBook = withScroll(AddressBook);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <WrappedAddressBook {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default WrappedAddressBook;
