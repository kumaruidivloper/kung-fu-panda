import React from 'react';
import PropTypes from 'prop-types';
import { googlepay, googlepayLong } from './googlePayButton.style';

export const GooglePayButton = props => (
  <div lang="en"><button data-auid="checkout_payment_google_pay_btn" className={`${googlepay} ${googlepayLong}`} onClick={props.googlePayClicked} title="Buy with Google Pay"></button></div>
);

GooglePayButton.propTypes = {
  googlePayClicked: PropTypes.func
};

export default GooglePayButton;
