import React from 'react';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import { submitButton } from './../../styles';
const OrderSubmitButton = props => {
  const { label, disableSubmit } = props;
  return (
    <Button
      className={`o-copy__14bold px-4 ${submitButton}`}
      aria-label="place order button"
      btnType="primary"
      size="S"
      auid="Place_Order"
      role="button"
      disabled={disableSubmit}
      onClick={props.onSubmitOrder}
    >
      {label}
    </Button>
  );
};

OrderSubmitButton.propTypes = {
  label: PropTypes.string.isRequired,
  onSubmitOrder: PropTypes.func,
  disableSubmit: PropTypes.bool
};

export default OrderSubmitButton;
