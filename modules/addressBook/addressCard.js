import PropTypes from 'prop-types';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import CardCommonMyAccount from '../cardCommonMyAccount';
import WishListAlert from '../wishListAlert/wishListAlert.component';
import { formatPhoneNumber } from '../../utils/stringUtils';
import { isMobile } from '../../utils/navigator';
class AddressCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      display: ''
    };

    this.wrapperRef = React.createRef();

    this.deleteAddress = this.deleteAddress.bind(this);
    this.displayCardCommonComponent = this.displayCardCommonComponent.bind(this);
    this.addressCardContainer = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { showEditAddressForm, scrollPageToTop } = this.props;
    if (showEditAddressForm !== prevProps.showEditAddressForm && !showEditAddressForm && isMobile()) {
      scrollPageToTop(this.wrapperRef.current);
    }
  }

  addressDetails(item) {
    return (
      <div>
        <div className="o-copy__20reg">
          {item.firstName} {item.lastName}
        </div>
        <div className="o-copy__16reg">
          <div>{item.address}</div>
          <div>{item.companyName}</div>
          <div>
            {item.city} {item.state} {item.zipCode}
          </div>
          <div>{formatPhoneNumber(item.phoneNumber)}</div>
        </div>
      </div>
    );
  }
  removeAddress = flag => {
    if (flag && this.props.deleteID !== '') {
      this.props.deleteAddress(this.props.deleteID, this.props.profileID);
    } else {
      this.props.setAlert('', false);
    }
  };
  /**
   * delete address function Handler
   * @param {*} address
   */
  deleteAddress(address) {
    const { cms, analyticsContent } = this.props;
    const analyticsData = {
      event: 'myaccount',
      eventCategory: 'user account',
      eventAction: 'remove address',
      eventLabel: 'address removed'
    };
    analyticsContent(analyticsData);
    const text = `${address.firstName} ${address.lastName} ${address.address} ${address.companyName} ${address.city} ${address.state} ${
      address.zipCode
      }`;
    const value = this.renderInterpolation(cms.hasBeenDeletedLabel, text);
    this.setState({ display: value });
    this.props.setAlert(address.addressId, true);
    if (ExecutionEnvironment.canUseDOM) {
      window.scrollTo(0, 0);
    }
  }
  /**
   * This component displays card common component if remove button is clicked
   * then it will not display that address
   * @param {Object} item address details of user
   * @returns card component for each address
   */
  displayCardCommonComponent(item) {
    const { toggleEditAddressForm, cms, profileID, setDefault, deleteID } = this.props;
    const { primary, addressId, nickName } = item;
    if (deleteID !== item.addressId) {
      return (
        <CardCommonMyAccount
          render={this.addressDetails(item)}
          showEdit
          showRemove={!primary}
          showDefaultBanner={primary}
          showSetAsDefaultButton={!primary}
          EditHandler={toggleEditAddressForm}
          RemoveHandler={this.deleteAddress}
          deleteItemID={addressId}
          cms={cms}
          profileID={profileID}
          deleteItem={item}
          setAsDefaultHandler={setDefault}
          id={nickName}
        />
      );
    }
    this.deleteAddress(item);
    return null;
  }
  /**
   * render delete message with cms data
   * @param {*} value
   * @param {*} rpt
   */
  renderInterpolation(value, rpt) {
    if (value) {
      return value.replace(/{{\s*\w*\s*}}/, rpt);
    }
    return value;
  }
  render() {
    const { addressList, cms, showAlertBox, showEditAddressForm, renderAddressForm, errorMsg } = this.props;
    return (
      <div ref={this.addressCardContainer}>
        <div className="pb-2">
          {showAlertBox ? <WishListAlert alertType="remove" removedItem={this.state.display} cms={cms} callback={this.removeAddress} /> : null}
        </div>
        {// passed index to renderAddressForm to access the default flag value of each address
          addressList.map(
            (item, index) =>
              showEditAddressForm === item.addressId ? renderAddressForm(cms, errorMsg, item, 'edit', index) : this.displayCardCommonComponent(item)
          )}
      </div>
    );
  }
}

AddressCard.propTypes = {
  addressList: PropTypes.array,
  renderAddressForm: PropTypes.func,
  toggleEditAddressForm: PropTypes.func,
  cms: PropTypes.object,
  showEditAddressForm: PropTypes.bool,
  deleteAddress: PropTypes.func,
  profileID: PropTypes.string,
  showAlertBox: PropTypes.bool,
  setAlert: PropTypes.func,
  deleteID: PropTypes.string,
  setDefault: PropTypes.func,
  errorMsg: PropTypes.object,
  scrollPageToTop: PropTypes.func,
  analyticsContent: PropTypes.func
};

export default AddressCard;
