import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const Wrapper = styled('span')`
  color: ${({ color }) => color || '#333333'};
`;

const Span = styled('span')`
  font-family: ${({ strikethrough }) => (strikethrough ? 'Mallory-Condensed-Medium' : 'Mallory-Condensed-Black')};
  font-size: ${({ bigger }) => (bigger ? '2em' : '1em')};
  text-decoration: ${({ strikethrough }) => (strikethrough ? 'line-through' : 'none')};
`;

const Small = styled('small')`
  font-family: ${({ strikethrough }) => (strikethrough ? 'Mallory-Condensed-Medium' : 'Mallory-Condensed-Black')};
  display: inline-block;
  vertical-align: top;
  padding-top: 0.3em;
  font-size: ${({ bigger }) => (bigger ? '0.777778em' : '0.4em')};
  text-decoration: ${({ strikethrough }) => (strikethrough ? 'line-through' : 'none')};
`;

// looking to refactor code with atomic Price component
const cleanPrice = val => {
  if (val === null || val === undefined) {
    return val;
  }

  // assume val is number || string
  let result = typeof val === 'number' ? val.toString() : val;
  let floatResult = parseFloat(result.replace(/[^\d\.]/gi, ''), 10); // eslint-disable-line no-useless-escape
  floatResult = floatResult.toFixed(2);
  result = floatResult.toString();
  return result;
};

class Price extends PureComponent {
  render() {
    const { price, color, strikethrough = false, bigger = false } = this.props;
    const cleanedPrice = cleanPrice(price);
    // eslint-disable-next-line no-useless-escape
    const [num, dec] = cleanedPrice.split('.');

    if (num.length === 0 && dec.length === 0) {
      return null;
    }

    return (
      <Wrapper color={color}>
        <Small bigger={bigger} strikethrough={strikethrough}>
          $
        </Small>
        <Span bigger={bigger} strikethrough={strikethrough}>
          {num}
        </Span>
        <Small bigger={bigger} strikethrough={strikethrough}>
          {dec}
        </Small>
      </Wrapper>
    );
  }
}

Price.propTypes = {
  price: PropTypes.string.isRequired,
  color: PropTypes.string,
  strikethrough: PropTypes.bool,
  bigger: PropTypes.bool
};

export default Price;
