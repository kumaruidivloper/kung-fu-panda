import PropTypes from 'prop-types';
import React from 'react';
import { Quantity } from './styles';
import { QtyActions } from '../constants';

const QuantityCounter = props => {
  const onClickIncrementQuantityLogGA = props.onClickIncrementQuantityLogGA || (() => null);
  const onClickDecrementQuantityLogGA = props.onClickDecrementQuantityLogGA || (() => null);

  const changeQuantity = action => {
    let quantity = props.quantity || 1;
    const upperBoundary = getUpperBoundary() || 999;

    if (action === QtyActions.DEC && props.quantity > 1) {
      quantity = props.quantity - 1;
      onClickDecrementQuantityLogGA(props.productItem);
    } else if (QtyActions.INC === action && props.quantity < upperBoundary) {
      quantity = props.quantity + 1;
      onClickIncrementQuantityLogGA(props.productItem);
    }
    props.updateQuantity(quantity);
    props.onBlurQuantityValidation();
  };

  const getUpperBoundary = () => {
    if (Object.prototype.hasOwnProperty.call(props, 'upperBoundary')) {
      return props.upperBoundary;
    }
    return null;
  };

  const updateQty = e => {
    let value = parseInt(e.target.value, 10);
    value = !Number.isNaN(value) ? value : '';
    if ((value && value.toString().length <= 3) || value === '') {
      props.updateQuantity(value);
    }
  };
  const onBlurChange = e => {
    const quantity = e.target.value;
    if (quantity.trim().length === 0) {
      props.updateQuantity(1);
    }
    props.onBlurQuantityValidation();
  };

  const isDisabled = () => props.disabled;
  // const quantity = props.productItem.bulkGiftcardMinQuantity ? props.productItem.bulkGiftcardMinQuantity : props.quantity;
  return (
    <Quantity.NumberContainer>
      <Quantity.Boundary>
        <Quantity.ButtonsLeft
          data-auid={`${props.auid}_DEC`}
          role="button"
          tabIndex="0"
          aria-label="decrement"
          onClick={() => changeQuantity(QtyActions.DEC)}
          disabled={isDisabled()}
        >
          <span>
            <span className="academyicon icon-minus" />
          </span>
        </Quantity.ButtonsLeft>

        <Quantity.Number>
          <Quantity.NumberInput
            value={props.quantity}
            aria-label="Enter Desired Quantity"
            type="tel"
            onBlur={onBlurChange}
            onChange={updateQty}
            disabled={isDisabled()}
          />
        </Quantity.Number>

        <Quantity.ButtonsRight
          data-auid={`${props.auid}_INC`}
          role="button"
          aria-label="increment"
          tabIndex="0"
          onClick={() => changeQuantity(QtyActions.INC)}
          disabled={isDisabled()}
        >
          <span>
            <span className="academyicon icon-plus" />
          </span>
        </Quantity.ButtonsRight>
      </Quantity.Boundary>
    </Quantity.NumberContainer>
  );
};

QuantityCounter.propTypes = {
  productItem: PropTypes.object,
  auid: PropTypes.string,
  updateQuantity: PropTypes.func,
  onBlurQuantityValidation: PropTypes.func,
  quantity: PropTypes.number,
  upperBoundary: PropTypes.number,
  disabled: PropTypes.bool,
  onClickIncrementQuantityLogGA: PropTypes.func,
  onClickDecrementQuantityLogGA: PropTypes.func
};

export default QuantityCounter;
