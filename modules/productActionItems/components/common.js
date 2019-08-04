import React from 'react';
import PropTypes from 'prop-types';
import { C } from './styles';
import { ADD_TO_CART_PRESET } from '../../../utils/dynamicMediaUtils';

export const Attributes = ({ attrs, componentName }) => (
  <C.Ul>
    {Object.keys(attrs).map(key => (
      <C.Li key={key}>
        {componentName && (
          <span className="o-copy__14bold mr-half" aria-label={componentName}>
            {componentName}
          </span>
        )}
        <strong>{key}:</strong>
        <span>&#160;{attrs[key]}</span>
      </C.Li>
    ))}
  </C.Ul>
);

export const Img = ({ src, alt }) => (
  <div className={`col-12 col-md-4 ${C.ImgResponsive}`}>
    <C.Img src={`${src}${ADD_TO_CART_PRESET}`} alt={alt} />
  </div>
);

export const Price = ({ amount }) => {
  const price = amount.split('.');

  return (
    <C.Price>
      {price[0]}
      <small>{price[1]}</small>
    </C.Price>
  );
};

Attributes.propTypes = {
  attrs: PropTypes.object,
  componentName: PropTypes.object
};
Img.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string
};
Price.propTypes = {
  amount: PropTypes.string
};
