import React from 'react';
import Product from './Product';
import { headlines } from './constants';

const Products = props => {
  let labels = [];
  if (props.productinfo.bundleSpecifications && props.productinfo.bundleSpecifications.length > 0) {
    labels = props.productinfo.bundleSpecifications.filter(specs => Object.keys(specs)[0] === 'bundleStepsLabels')[0].bundleStepsLabels.value;
  }

  const getInventory = component => {
    if (props.online && props.online[0] && props.online[0].products && props.online[0].products.length > 0) {
      return props.online[0].products.filter(inv => inv.productId === component.productDetails.uniqueID)[0].availability;
    }
    return null;
  };
  return props.productinfo.components.map((component, i) => (
    <Product
      dref={props.s.expanded === component.productDetails.uniqueID ? props.dref : null}
      key={component.productDetails.uniqueID}
      inventory={getInventory(component)}
      {...component.productDetails}
      headline={labels[i] || headlines[i]}
      selectedSku={props.s.selectedSkus[component.productDetails.uniqueID]}
      edit={props.editSelection}
      updateSelectedSku={props.updateSelectedSku}
      expanded={props.s.expanded === component.productDetails.uniqueID}
      isLast={props.productinfo.components.length - 1 === i}
      isFirst={props.s.products[0] === props.s.expanded}
      gtmDataLayer={props.gtmDataLayer}
      bundleClickLabel={props.s.bundleClickLabel}
      productName={props.productinfo.name}
      messages={props.authMsgs}
    />
  ));
};

export default Products;
