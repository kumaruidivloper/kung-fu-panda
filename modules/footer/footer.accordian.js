import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FooterAccordian, StyledDiv } from './styles';

class Accordian extends Component {
    constructor(props) {
        super(props);
        this.toggleAccordian = this.toggleAccordian.bind(this);
    }

    toggleAccordian() {
        const { accordianName, toggleAccordian, isOpen } = this.props;
        toggleAccordian(accordianName, !isOpen);
    }
    render() {
      const { title, isOpen } = this.props;
      return (
        <div className={`d-flex flex-column ${FooterAccordian}`}>
          <button className={`${StyledDiv} d-flex align-items-center justify-content-between o-copy__16bold`} onClick={this.toggleAccordian}>{title}
            {isOpen ? <span className="academyicon icon-minus" /> : <span className="academyicon icon-plus" />}
          </button>
          {isOpen && <div>{this.props.children}</div>}
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
    toggleAccordian: PropTypes.func,
    accordianName: PropTypes.string
};

export default Accordian;

/**
 * TODO:
 * Insert font icons.
 * Convert to pure stateless component with JS class toggle.
 * Move to pure scss
 */
