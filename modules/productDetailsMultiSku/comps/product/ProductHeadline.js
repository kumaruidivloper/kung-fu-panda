import React from 'react';
import PropTypes from 'prop-types';
import { product } from '../style';

const ProductHeadline = props => (
  <div className={product.headline}>
    <h3 className={props.expanded ? '' : 'small'}>{props.headline}</h3>
  </div>
);

ProductHeadline.propTypes = {
  expanded: PropTypes.bool,
  headline: PropTypes.string
};

ProductHeadline.defaultProps = {};

export default ProductHeadline;
