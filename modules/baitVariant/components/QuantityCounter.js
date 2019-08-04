import PropTypes from 'prop-types';
import React from 'react';
import { BaitQuantity, QtyNumberInputStyle } from '../baitVariantStyles';
import { QtyActions } from '../constants';
import { printBreadCrumb } from '../../../utils/breadCrumb';

class QuantityCounter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.counterInput = React.createRef();
    this.state = {
      timestamp: new Date().getTime()
    };
    this.onClickDecrementQuantityLogGA = this.onClickDecrementQuantityLogGA.bind(this);
    this.onClickIncrementQuantityLogGA = this.onClickIncrementQuantityLogGA.bind(this);
  }

  componentDidMount() {
    const { quantity } = this.props;
    this.counterInput.current.value = quantity;
  }

  componentWillUpdate(nextProps) {
    const { quantity } = nextProps;
    this.counterInput.current.value = quantity;
  }

  onBlurChange = e => {
    const quantity = e.target.value;
    if (quantity.trim().length === 0) {
      this.props.updateQuantity(1);
    }
    if (quantity === 0) {
      this.props.updateQuantity(1);
      this.setState({ timestamp: new Date().getTime() });
    }
  };

  onClickIncrementQuantityLogGA(product) {
    if (!product) return;
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|quantity added',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }

  onClickDecrementQuantityLogGA(product) {
    if (!product) return;
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|quantity removed',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }

  getUpperBoundary = () => {
    if (Object.prototype.hasOwnProperty.call(this.props, 'upperBoundary')) {
      return this.props.upperBoundary;
    }
    return null;
  };

  changeQuantity = action => {
    const { quantity, updateQuantity } = this.props;
    const upperBoundary = this.getUpperBoundary() || 999;
    let qty = quantity;
    if (quantity === 1 && action === QtyActions.DEC) {
      updateQuantity(qty);
      this.onClickIncrementQuantityLogGA(this.props.productItem);
      return;
    }
    if (action === QtyActions.DEC && quantity >= 1) {
      qty = quantity - 1;
    } else if (QtyActions.INC === action && quantity < upperBoundary) {
      qty = quantity + 1;
    }
    updateQuantity(qty);
    this.onClickIncrementQuantityLogGA(this.props.productItem);
  };

  /**
   * This method works on input field onBlur event
   */
  updateQty = e => {
    let value = parseInt(e.target.value, 10);
    value = !Number.isNaN(value) ? value : '';

    const { lowerBoundary, upperBoundary } = this.props;
    if (value || value === 0) {
      if (value > upperBoundary) {
        value = upperBoundary;
      } else if (value < lowerBoundary) {
        value = lowerBoundary;
      }
    }
    this.props.updateQuantity(value);
  };

  isDisabled = () => this.props.disabled;

  /**
   * Method to find out a state(disabled state) for quantity minus button
   * Disable - if quanity is 0 for accessiblity
   * Disable - if disabled prop is true
   */
  shouldQuantityMinusButtonDisabled = quantity => this.isDisabled() || quantity === 0;

  render() {
    const { quantity } = this.props;
    return (
      <BaitQuantity.QtyNumberContainer>
        <BaitQuantity.ButtonLeft
          data-auid={`${this.props.auid}_DEC`}
          aria-label="decrement"
          onClick={() => this.changeQuantity(QtyActions.DEC)}
          disabled={this.shouldQuantityMinusButtonDisabled(quantity)}
        >
          <span>
            <span className="academyicon icon-minus" />
          </span>
        </BaitQuantity.ButtonLeft>
        <BaitQuantity.QtyNumber>
          <input
            ref={this.counterInput}
            className={QtyNumberInputStyle}
            defaultValue={quantity}
            aria-label="Enter Desired Quantity"
            value={quantity}
            type="tel"
            onBlur={this.onBlurChange}
            onChange={this.updateQty}
            maxLength="3"
            data-timestamp={this.state.timestamp}
            disabled={this.isDisabled()}
          />
        </BaitQuantity.QtyNumber>
        <BaitQuantity.ButtonRight
          data-auid={`${this.props.auid}_INC`}
          aria-label="increment"
          tabIndex="0"
          onClick={() => this.changeQuantity(QtyActions.INC)}
          disabled={this.isDisabled()}
        >
          <span>
            <span className="academyicon icon-plus" />
          </span>
        </BaitQuantity.ButtonRight>
      </BaitQuantity.QtyNumberContainer>
    );
  }
}

QuantityCounter.propTypes = {
  productItem: PropTypes.object,
  auid: PropTypes.string,
  updateQuantity: PropTypes.func,
  quantity: PropTypes.number,
  upperBoundary: PropTypes.number,
  disabled: PropTypes.bool,
  gtmDataLayer: PropTypes.array,
  lowerBoundary: PropTypes.number
};

QuantityCounter.defaultProps = {
  gtmDataLayer: []
};

export default QuantityCounter;
