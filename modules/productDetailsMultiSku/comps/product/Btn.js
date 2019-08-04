import React from 'react';
import PropTypes from 'prop-types';
import { product } from '../style';

const Btn = props => (
  <button onClick={props.onClick} className={`${props.className} ${product.btn}`}>
    {props.label}
  </button>
);

Btn.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.string
};

export default Btn;
