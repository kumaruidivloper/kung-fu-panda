import PropTypes from 'prop-types';
import React from 'react';
import { Quantity } from '../style';

const QtyActions = {
  INC: 'increase',
  DEC: 'decrease'
};

const QuantityCounter = props => {
  /**
   * Updates Quantity +/- 1
   * @param {string} action
   */
  const changeQuantity = action => {
    if (props.disabled) return;

    let quantity = props.quantity || 1;
    const upperBoundary = getUpperBoundary() || 999;
    if (action === QtyActions.DEC && props.quantity > 1) {
      quantity = props.quantity - 1;
      analyticsDataForClicks('quantity removed');
    } else if (QtyActions.INC === action && props.quantity < upperBoundary) {
      analyticsDataForClicks('quantity added');
      quantity = props.quantity + 1;
    }
    props.updateQuantity(quantity);
  };

  const analyticsDataForClicks = action => {
    const { gtmDataLayer, bundleClickLabel } = props;
    if (gtmDataLayer) {
      gtmDataLayer.push({
        event: 'pdpDetailClick',
        eventCategory: 'pdp interactions',
        eventAction: `pdp|${action}`.toLowerCase(),
        eventLabel: bundleClickLabel.toLowerCase()
      });
    }
  };

  /**
   * returns the maximum quantity allowed to be input
   */
  const getUpperBoundary = () => {
    if (Object.prototype.hasOwnProperty.call(props, 'upperBoundary')) {
      return props.upperBoundary;
    }
    return null;
  };

  /**
   * Returns a function to be executed when 'enter' button is pressed
   * @param {func} onClick
   */
  const onEnterFireOnClick = onClick => e => {
    if (onClick && e.nativeEvent.keyCode === 13) {
      onClick(e);
    }
  };

  /**
   * Updates quantity based upon change event for input element
   * @param {nativeEvent} e
   */
  const updateQty = e => {
    let value = parseInt(e.target.value, 10);
    value = !Number.isNaN(value) ? value : '';
    if ((value && value.toString().length <= 3) || value === '') {
      props.updateQuantity(value);
    }
  };

  /**
   * On input blur sets input value to 1 when current value is invalid
   * @param {nativeEvent} e
   */
  const onBlurChange = e => {
    const quantity = e.target.value;
    if (quantity.trim().length === 0) {
      props.updateQuantity(1);
    }
  };

  return (
    <Quantity.NumberContainer>
      <Quantity.Boundary>
        <Quantity.ButtonsLeft
          data-auid={`${props.auid}_DEC`}
          role="button"
          onKeyDown={onEnterFireOnClick(() => changeQuantity(QtyActions.DEC))}
          aria-label="decrement"
          onClick={() => changeQuantity(QtyActions.DEC)}
          tabIndex={props.disabled ? -1 : 0}
        >
          <span>
            <span className="academyicon icon-minus" />
          </span>
        </Quantity.ButtonsLeft>

        <Quantity.Number>
          <Quantity.NumberInput
            disabled={props.disabled}
            value={props.quantity}
            aria-label="Enter Desired Quantity"
            onChange={updateQty}
            onBlur={onBlurChange}
            type="tel"
          />
        </Quantity.Number>

        <Quantity.ButtonsRight
          data-auid={`${props.auid}_INC`}
          role="button"
          onKeyDown={onEnterFireOnClick(() => changeQuantity(QtyActions.DEC))}
          aria-label="increment"
          onClick={() => changeQuantity(QtyActions.INC)}
          tabIndex={props.disabled ? -1 : 0}
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
  auid: PropTypes.string,
  updateQuantity: PropTypes.func,
  quantity: PropTypes.number,
  disabled: PropTypes.bool,
  upperBoundary: PropTypes.number,
  gtmDataLayer: PropTypes.array,
  bundleClickLabel: PropTypes.string
};

QuantityCounter.defaultProps = {
  upperBoundary: 99999
};

export default QuantityCounter;
