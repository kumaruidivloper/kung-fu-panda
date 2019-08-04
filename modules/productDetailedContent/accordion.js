import React from 'react';
import PropTypes from 'prop-types';
import { style } from './style';

const Accordian = ({ accordianName, title, isOpen, className, auid, children, toggleAccordian }) => (
  <div className={style.AccordianWrapStyle}>
    <style.StyledDiv
      data-auid={auid}
      className={className}
      onClick={() => {
        toggleAccordian(accordianName, !isOpen);
      }}
      tabIndex="0"
    >
      {title}
      <span className={`academyicon ${isOpen ? 'icon-minus' : 'icon-plus'}`} />
    </style.StyledDiv>
    <div className={`${style.AccordianContentStyle} 'o-copy__14reg' ${isOpen ? '' : style.hidden}`}>{children}</div>
  </div>
);

Accordian.defaultProps = {
  children: null
};

Accordian.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element,
  isOpen: PropTypes.bool,
  toggleAccordian: PropTypes.func,
  accordianName: PropTypes.string,
  className: PropTypes.string,
  auid: PropTypes.string.isRequired
};

export default Accordian;
