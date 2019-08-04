import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';

const StyledDiv = styled('div')`
  min-height: 62px;
  background: #fff;
  color: #4c4c4c;
  cursor: pointer;
  border: 1px solid #e6e6e6;
  border-left: 0px;
  border-right: 0px;
  display: flex;
  align-items: center;
  padding: 0.72rem;
  justify-content: space-between;
`;

const AccordianWrapStyle = css`
  positioin: relative;
  display: flex;
  flex-direction: column;
`;

const AccordianContentStyle = css`
  background-color: #fff;
  min-height: 62px;
  padding: 1.5rem 1rem;
`;

class Accordian extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordian = this.toggleAccordian.bind(this);
  }

  toggleAccordian() {
    const { toggleAccordian, isOpen } = this.props;
    toggleAccordian(!isOpen);
  }
  render() {
    const { title, isOpen } = this.props;
    return (
      <div className={`${AccordianWrapStyle}`}>
        <StyledDiv onClick={this.toggleAccordian} tabIndex="0">
          {title}
          {isOpen ? <span className="academyicon icon-minus" /> : <span className="academyicon icon-plus" />}
        </StyledDiv>
        {isOpen && <div className={AccordianContentStyle}>{this.props.children}</div>}
      </div>
    );
  }
}

Accordian.defaultProps = {
  children: null
};

Accordian.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element,
  isOpen: PropTypes.bool,
  toggleAccordian: PropTypes.func
  // accordianName: PropTypes.string
};

export default Accordian;

/**
 * TODO:
 * Insert font icons.
 * Convert to pure stateless component with JS class toggle.
 * Move to pure scss
 */
