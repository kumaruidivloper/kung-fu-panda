import PropTypes from 'prop-types';
import React from 'react';
import { card } from '../orderDetails.styles';
import { titleCase, formatPhoneNumber } from './../../../utils/stringUtils';
import { dateFormatter, isDate } from './../../../utils/dateUtils';

class ShowShippingInfo extends React.PureComponent {
  renderDate(fromDate, toDate) {
    const hasFromDate = isDate(fromDate);
    const hasToDate = isDate(toDate);
    if (hasFromDate && hasToDate) {
      return (
        <span className="o-copy__14reg">
          {dateFormatter(fromDate).split(',')[0]} - {dateFormatter(toDate).split(',')[0]}
        </span>
      );
    } else if (hasFromDate) {
      return <span className="o-copy__14reg">{dateFormatter(fromDate).split(',')[0]}</span>;
    } else if (hasToDate) {
      return <span className="o-copy__14reg">{dateFormatter(toDate).split(',')[0]}</span>;
    }
    return null;
  }

  renderBody(cms, address, shipment, emailOrderLevel = ' ') {
    const {
      firstName = ' ',
      lastName = ' ',
      companyName = ' ',
      addressLine1: shippingAddress = ' ',
      city = ' ',
      state = ' ',
      zipCode = ' ',
      phone = ' ',
      email
    } = address;
    const { estimatedFromDate, estimatedToDate } = shipment[0] || {};
    return (
      <div>
        <div className="w-100 o-copy__14reg text-uppercase pb-1">{cms.shippingAddressLabel}</div>
        <div className="d-flex flex-column flex-md-row">
          <div className="col-md-8 d-flex flex-column p-0">
            <div className="o-copy__14bold">
              {titleCase(firstName)} {titleCase(lastName || ' ')}
            </div>
            {companyName && <div className="o-copy__14reg">{titleCase(companyName)}</div>}
            <div className="o-copy__14reg">{`${titleCase(`${shippingAddress}`)}`}</div>
            <div className="o-copy__14reg">{`${titleCase(`${city}`)} ${state} ${zipCode}`}</div>
            <div className="o-copy__14reg">{` ${formatPhoneNumber(phone)} | ${email === null ? emailOrderLevel : email} `}</div>
          </div>
          <div>
            {estimatedFromDate || estimatedToDate ? (
              <div className="mt-1 mt-md-0">
                <div className="o-copy__14bold"> {cms.estimatedArrivalLabel} </div>
                <div className="o-copy__14reg">
                  <span> {this.renderDate(estimatedFromDate, estimatedToDate)} </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { cms, orderDetails, shipment, email: emailOrderLevel } = this.props;
    return (
      <div className={`mt-half mt-md-2 pt-2 pb-2 pb-md-3 ${card}`}>
        <div className="px-1 px-md-3">
          <span className="o-copy__16bold text-uppercase">{cms.commonLabels.shippingLabel}</span>
          <hr className="my-1" />
          {(orderDetails && this.renderBody(cms, orderDetails, shipment, emailOrderLevel)) || 'No Address available'}
        </div>
      </div>
    );
  }
}

ShowShippingInfo.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetails: PropTypes.object,
  shipment: PropTypes.object,
  email: PropTypes.string
};

export default ShowShippingInfo;
