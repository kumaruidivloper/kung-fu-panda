import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const Hidden = styled('div')`
  display: none;
`;

const OfferSchema = ({ skus, inventory }) => (
  <div itemProp="offers" itemScope itemType="http://schema.org/Offer">
    {skus.map(({ skuId, price }) => {
      const inventoryFiltered = inventory.filter(inv => inv.skuId === skuId)[0];
      return (
        <Hidden key={skuId}>
          <span itemProp="sku">{skuId}</span>
          <span itemProp="price">{price.salePrice || price.listPrice}</span>
          <span itemProp="priceCurrency">USD</span>
          <span itemProp="itemCondition" itemType="http://schema.org/OfferItemCondition" content="http://schema.org/NewCondition" />
          <span
            itemProp="availability"
            content={
              inventoryFiltered && inventoryFiltered.inventoryStatus === 'IN_STOCK' ? 'http://schema.org/InStock' : 'https://schema.org/OutOfStock'
            }
          />
        </Hidden>
      );
    })}
  </div>
);

OfferSchema.propTypes = {
  skus: PropTypes.array,
  inventory: PropTypes.array
};

OfferSchema.defaultProps = {
  skus: [],
  inventory: []
};

export default OfferSchema;
