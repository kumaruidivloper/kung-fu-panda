import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css, cx } from 'react-emotion';

const StyledButton = styled('button')`
  min-height: 62px;
  cursor: pointer;
  box-shadow: 1px 0 0 0 #ccc, 0 1px 0 0 #ccc, 1px 1px 0 0 #ccc, 0px 0 0 0 #ccc inset, 0 1px 0 0 #ccc inset !important;
  border: 0 !important;
  display: flex;
  align-items: center;
  padding: 0 18px !important;
  justify-content: space-between;
  background-color: #fff !important;
`;

const AccordionWrapStyle = css`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const AccordionContentStyle = css`
  padding: 0 18px !important;
  min-height: 62px;
  background: rgba(246, 246, 246, 0.9);
`;

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.getDefaultAccordion = this.getDefaultAccordion.bind(this);
  }

  getDefaultAccordion() {
    const { title, isOpen, className } = this.props;
    return (
      <div className={`${AccordionWrapStyle}`} data-auid={`level1Category-${title}_m`}>
        <StyledButton className={`${isOpen ? 'o-copy__16bold' : 'o-copy__16reg'} ${className}`} onClick={this.toggleAccordion} aria-expanded={isOpen}>
          {title}
          <span className={`academyicon ${isOpen ? 'icon-minus font-weight-bold' : 'icon-plus'}`} />
        </StyledButton>
        {isOpen && <div className={cx(AccordionContentStyle, 'o-copy__16reg d-flex align-items-center')}>{this.props.children}</div>}
      </div>
    );
  }

  toggleAccordion() {
    const { AccordionName, isOpen } = this.props;
    this.props.toggleAccordion(AccordionName, !isOpen);
  }
  render() {
    return this.getDefaultAccordion();
  }
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any,
  isOpen: PropTypes.bool,
  toggleAccordion: PropTypes.func,
  AccordionName: PropTypes.string,
  className: PropTypes.string
};

export default Accordion;
