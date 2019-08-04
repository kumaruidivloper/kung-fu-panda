import React from 'react';
import PropTypes from 'prop-types';
import { C } from '../style';

export const Attributes = ({ attrs }) => (
  <C.Div>
    {Object.keys(attrs).map(key => (
      <C.Div className="pb-half" key={key}>
        <strong className="o-copy__14bold mr-half">{key}:</strong>
        <span>{attrs[key]}</span>
      </C.Div>
    ))}
  </C.Div>
);

export const Img = ({ src }) => (
  <div className={`col-4 ${C.ImgResponsive} d-flex justify-content-center align-items-center`}>
    <C.Img src={`${src}?wid=150&hei=150`} />
  </div>
);

export const Price = ({ amount }) => {
  if (!amount) {
    return null;
  }
  const price = amount.split('.');
  return (
    <C.Price>
      {price[0]}
      <small>{price[1]}</small>
    </C.Price>
  );
};

Attributes.propTypes = {
  attrs: PropTypes.object
};
Img.propTypes = {
  src: PropTypes.string
};
Price.propTypes = {
  amount: PropTypes.string
};
