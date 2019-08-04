import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { product } from '../style';

const ProductSummary = props => {
  const { defaultSku } = props;

  return (
    <Fragment>
      <div className={`col-lg-1 offset-1 product-summary-img d-flex align-items-center ${product.summaryImg}`}>
        <img src={`${defaultSku.thumbnail}?wid=150&hei=150`} className="" alt="" />
      </div>
      <div className="col-lg-6 product-summary-desc">
        <div className={product.flex}>
          <div>{props.name}</div>
          <div className={`product-edit-icon ${product.edit}`}>
            <button onClick={props.edit} className={product.editButton}>
              <span className={`academyicon icon-pencil mr-half ${product.editIcon}`} />
              <span className="o-copy__14reg">Edit</span>
            </button>
          </div>
        </div>
        <div className="product-summary-swatches">
          {defaultSku.attributes.filter(attr => attr.usage === 'Defining').map(attr => (
            <span key={attr.name}>
              <strong className={`o-copy__14bold ${product.attrName}`}>
                {attr.name}
                :&#160;
              </strong>
              <span className={`mr-4 o-copy__14reg ${product.attrValue}`}>{attr.value}</span>
            </span>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

ProductSummary.propTypes = {
  defaultSku: PropTypes.object,
  name: PropTypes.string,
  edit: PropTypes.func
};

export default ProductSummary;
