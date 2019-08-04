import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line
const ListItem = props => {
  return (
    <li idx={props.idx} className={props.listclass}>
      <a
        data-auid={props.auid}
        className={props.cname}
        href={props.href}
        aria-label={props.arialabel}
        onClick={props.click}
        onMouseEnter={props.mouseEnter}
        onFocus={props.focus}
        onTouchEnd={props.touch}
        onKeyDown={props.keydown}
      >
        {props.anchorLabel}
        {!props.anchorLabel && props.children}
      </a>
      {props.anchorLabel && props.children}
    </li>
  );
};

ListItem.propTypes = {
  href: PropTypes.string,
  children: PropTypes.any,
  auid: PropTypes.string.isRequired,
  cname: PropTypes.string,
  arialabel: PropTypes.string,
  click: PropTypes.func,
  mouseEnter: PropTypes.func,
  listclass: PropTypes.string,
  focus: PropTypes.func,
  anchorLabel: PropTypes.string,
  touch: PropTypes.func,
  keydown: PropTypes.func,
  idx: PropTypes.number
};

export default ListItem;
