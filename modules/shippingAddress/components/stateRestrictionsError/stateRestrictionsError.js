import React from 'react';
import PropTypes from 'prop-types';
import { errorWrapper } from './../../shippingAddress.styles';

const StateRestrictionsError = props => {
    const { errorDetails } = props;
    return (
      <section className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
        <p data-auid="checkout_state_restriction_error_details" className="o-copy__14reg mb-0">{errorDetails}</p>
      </section>
    );
  };

StateRestrictionsError.propTypes = {
    errorDetails: PropTypes.object
};

export default StateRestrictionsError;
