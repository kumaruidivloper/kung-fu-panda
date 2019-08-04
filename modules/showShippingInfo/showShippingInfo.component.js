import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { headingBox, editBtn, nameWrap } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { titleCase, formatPhoneNumber } from './../../utils/stringUtils';

class ShowShippingInfo extends React.PureComponent {
  renderHeading(cms) {
    const { showEditLink } = this.props;
    return (
      <div className={`w-100 ${headingBox} pb-2 d-flex justify-content-between`}>
        <div className="o-copy__16bold text-uppercase">{cms.shippingTitle}</div>
        {showEditLink && (
          <a data-auid="checkout_edit_shipping_address" href=" #" onClick={this.props.onEditHandler} className={`o-copy__14reg ${editBtn}`}>
            {cms.commonLabels.editLabel}
          </a>
        )}
      </div>
    );
  }
  /**
   * func to render address in different format depending on company address
   * @param {object} address
   */
  renderAddress(address) {
    const {
      firstName = ' ',
      lastName = ' ',
      companyName = ' ',
      address: shippingAddress = ' ',
      city = ' ',
      state = ' ',
      zipCode = ' ',
      phoneNumber = ' '
    } = address;
    return (
      <div>
        <div className={`o-copy__14bold pt-half ${nameWrap}`}>
          {titleCase(firstName)} {titleCase(lastName)}
        </div>
        {!companyName && <div className="o-copy__14reg">{`${titleCase(`${shippingAddress}, ${city}`)} ${state} ${zipCode}`}</div>}
        {companyName && (
          <div>
            <div className="o-copy__14reg">{titleCase(shippingAddress)}</div>
            <div className="o-copy__14reg">{titleCase(companyName)}</div>
            <div className="o-copy__14reg">{`${city} ${state} ${zipCode}`}</div>
          </div>
        )}
        <div className="o-copy__14reg">{formatPhoneNumber(phoneNumber)}</div>
      </div>
    );
  }
  renderBody(cms, address) {
    return (
      <div className="w-100 d-flex flex-column">
        <div className="w-100 o-copy__14reg text-uppercase pt-2">{cms.shippingAddressLabel}</div>
        {this.renderAddress(address)}
      </div>
    );
  }
  render() {
    const { cms, orderDetails } = this.props;
    return (
      <div className="w-100 container px-0">
        {this.renderHeading(cms)}
        {(orderDetails &&
          orderDetails.addresses &&
          orderDetails.addresses.shippingAddress &&
          this.renderBody(cms, orderDetails.addresses.shippingAddress)) ||
          'No Address available'}
      </div>
    );
  }
}

ShowShippingInfo.propTypes = {
  cms: PropTypes.object.isRequired,
  onEditHandler: PropTypes.func.isRequired,
  orderDetails: PropTypes.object,
  showEditLink: PropTypes.bool
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ShowShippingInfo {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ShowShippingInfo;
