import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'react-emotion';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

const QuantityBoundary = styled('div')`
  height: 3.75em;
  border-radius: 4px;
  border: solid 1px #cccccc;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  &:hover,
  &:focus {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const QuantityButtonsLeft = styled('span')`
  display: inline-block;
  outline-style: none;
  width: 25%;
  height: 58px;
  border-radius: 4px;
  background-color: #f6f6f6;
  text-align: center;
  float: left;
  line-height: 60px;
  border-right: 1px solid #cccccc;
  @media (min-width: 768px) and (max-width: 992px) {
    width: 33%;
  }
`;
const QuantityButtonsRight = styled('span')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  outline-style: none;
  width: 25%;
  height: 58px;
  border-radius: 4px;
  background-color: #f6f6f6;
  text-align: center;
  float: left;
  line-height: 60px;
  border-left: 1px solid #cccccc;

  @media (min-width: 768px) and (max-width: 992px) {
    width: 33%;
  }
`;

// const QuantityNumber = styled('span')`
//   display: inline-block;
//   font-size: 1.1rem;
//   width: 50%;
//   height: 14px;
//   font-family: Mallory;
//   font-size: 16px;
//   font-weight: normal;
//   font-style: normal;
//   font-stretch: normal;
//   line-height: 1.25;
//   letter-spacing: 0.5px;
//   text-align: center;
//   color: #333333;
//   float: left;
//   line-heiht: 60px;
//   height: 60px;

//   @media (min-width: 768px) and (max-width: 992px) {
//     width: 33%;
//   }
// `;
const QuantityNumberContainer = styled('div')`
  height: 60px;
`;
// const QuantityNumberInput = styled('input')`
//   display: none;
//   width: 100%;
//   border: 0;
//   height: 58px;
//   text-align: center;

//   &:hover,
//   &:focus {
//     cursor: pointer;
//   }
//   -moz-appearance:textfield;
//     &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
//         -webkit-appearance: none;
//         -moz-appearance: none;
//         appearance: none;
//         margin: 0;
//     }
// `;
class QuantityCounter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      counter: '1'
    };
  }
  // getUpperBoundary() {
  //   if (Object.prototype.hasOwnProperty.call(this.props, 'upperBoundary')) {
  //     return this.props.upperBoundary;
  //   }
  //   return null;
  // }

  IncrementItem = () => {
    const quantity = parseInt(this.state.counter, 10);
    const counter = (quantity < 999 ? quantity + 1 : quantity).toString();
    this.setState({ counter });
  };
  DecrementItem = () => {
    this.setState(prevState => ({ counter: (parseInt(prevState.counter, 10) ? Math.max(parseInt(prevState.counter, 10) - 1, 1) : 1).toString() }));
  };

  handleQuantityChange = e => {
    const value = parseInt(e.target.value, 10) || 1;
    if (value <= 999 && this.state.counter.length < 4) {
      const count = value.toString();
      const counter = count[0] === '0' && count.length > 1 ? count.substr(1) : count;
      this.setState({ counter });
    } else {
      e.preventDefault();
    }
  };

  render() {
    const { auid = 'PDP_QC' } = this.props;
    return (
      <QuantityNumberContainer>
        <QuantityBoundary>
          <QuantityButtonsLeft
            data-auid={`${auid}_DEC`}
            role="button"
            onKeyDown={this.DecrementItem}
            aria-label="decrement"
            onClick={e => this.DecrementItem(e)}
            tabIndex={0}
          >
            <span>
              <span className="academyicon icon-minus" />
            </span>
          </QuantityButtonsLeft>
          {/* <QuantityNumber>
            <QuantityNumberInput
              value={this.state.counter}
              type="number"
              type="string"
              aria-label="Enter Desired Quantity"
              onChange={e => this.handleQuantityChange(e)}
            />
          </QuantityNumber> */}
          <QuantityButtonsRight
            data-auid={`${auid}_INC`}
            role="button"
            onKeyDown={this.IncrementItem}
            aria-label="increment"
            onClick={e => this.IncrementItem(e)}
            tabIndex={0}
          >
            <span>
              <span className="academyicon icon-plus" />
            </span>
          </QuantityButtonsRight>
        </QuantityBoundary>
      </QuantityNumberContainer>
    );
  }
}
QuantityCounter.propTypes = {
  auid: PropTypes.string
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<QuantityCounter {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default QuantityCounter;
