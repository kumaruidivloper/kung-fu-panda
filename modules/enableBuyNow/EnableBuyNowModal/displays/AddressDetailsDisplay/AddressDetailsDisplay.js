import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '../../../../../../src/utils/stringUtils';

const AddressDetailsDisplay = props => {
  const { className, firstName, lastName, phoneNumber, addressLine = [], city, state, zipCode } = props;
  const [addressLine1, addressLine2] = addressLine;
  return (
    <section className={className}>
      <div className="row">
        <div className="col-12">
          <div className="o-copy__16bold">
            {firstName} {lastName}
          </div>
          <div>{addressLine1}</div>
          {addressLine2 && addressLine2.length > 0 && <div>{addressLine2}</div>}
          <div>
            {city} {state} {zipCode}
          </div>
          {phoneNumber && phoneNumber.length > 0 && <div>{formatPhoneNumber(phoneNumber)}</div>}
        </div>
      </div>
    </section>
  );
};

AddressDetailsDisplay.propTypes = {
  className: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  phoneNumber: PropTypes.string,
  addressLine: PropTypes.array,
  city: PropTypes.string,
  state: PropTypes.string,
  zipCode: PropTypes.string
};

export default AddressDetailsDisplay;
