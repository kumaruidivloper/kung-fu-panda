import React from 'react';
import Swatch from './Swatch';
import { prodAttr } from '../style';
import TrueFit from '../../../trueFit/trueFit.component';

const ProductAttributes = props => {
  const getNonSkuAttributes = (selectedKeys, name, item, attributes) => {
    const selectedAttributes = [];
    selectedKeys.forEach(key => {
      attributes.forEach(attribute => {
        const { name: attributeName, usage, value } = attribute;
        if (attributeName === key && usage === 'Defining') {
          selectedAttributes.push({
            ...attribute,
            value: name === attributeName ? item.value : value
          });
        }
      });
    });
    return selectedAttributes;
  };

  const updateSelection = (name, item, oos) => {
    const selection = {};
    props.attributeGroups.map(attr => {
      selection[attr] = attr === name ? item.id : props.defaultSku.skuResolvingAttrIdentifiers[attr];
      return null;
    });

    const selectedKeys = Object.keys(selection);

    const sel = props.sKUs.filter(sku => selectedKeys.every(key => selection[key] === sku.skuResolvingAttrIdentifiers[key]));

    const { attributes, ...rest } = props.defaultSku;

    const selectedSKU =
      sel.length > 0
        ? sel[0]
        : {
            ...rest,
            ...item,
            thumbnail: item.imageURL,
            name,
            skuResolvingAttrIdentifiers: { ...selection },
            skuId: 'N/A',
            attributes: getNonSkuAttributes(selectedKeys, name, item, attributes)
          };
    props.updateSku(selectedSKU, oos);
    onClickSwatchAnalytics(name, item, oos);
  };
  const onClickSwatchAnalytics = (key, item, isOos) => {
    const { gtmDataLayer, buundleClickLabel, productName } = props;
    if (!isOos) {
      gtmDataLayer.push({
        event: 'pdpDetailClick',
        eventCategory: 'pdp interactions',
        eventAction: `pdp|attribute|${key}|${item.value}`.toLowerCase(),
        eventLabel: buundleClickLabel && buundleClickLabel.toLowerCase()
      });
    } else {
      gtmDataLayer.push({
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: `product stock error|${productName}|${key}|${item.value}`.toLowerCase(),
        eventLabel: 'not sold online | not sold in store'
      });
    }
  };
  const getInventoryDetails = attr => {
    const items = {};
    const otherAttrObj = {};

    // const otherAttr = props.attributeGroups.filter(attrg => attr !== attrg)[0];
    // const otherAttrId = props.defaultSku.skuResolvingAttrIdentifiers[otherAttr];

    const otherAttrs = props.attributeGroups.filter(attrg => attr !== attrg);
    otherAttrs.map(attribute => {
      otherAttrObj[attribute] = props.defaultSku.skuResolvingAttrIdentifiers[attribute];
      return null;
    });

    props.sKUs.forEach(sku => {
      // if (sku.skuResolvingAttrIdentifiers[otherAttr] === otherAttrId) {
      if (otherAttrs.every(attribute => sku.skuResolvingAttrIdentifiers[attribute] === otherAttrObj[attribute])) {
        const item = Object.assign({}, sku);
        item.inventory = props.inventory && props.inventory.filter(inv => inv.skuId === sku.skuId)[0]; // eslint-disable-line
        items[sku.skuResolvingAttrIdentifiers[attr]] = item;
      }
    });

    return items;
  };

  const getSizeChartLink = sizeChart => (
    <div className={`row ${prodAttr.sizeChart} o-copy__14reg mt-1`}>
      <a data-auid="sizeChart" href={sizeChart[0].value} target="_blank" rel="noopener noreferrer">
        <i role="presentation" aria-label="facets" className="academyicon icon-information filter-icon--blue mr-half pr-0 pr-md-quarter" />
        Size Chart
      </a>
    </div>
  );

  return props.productAttrGroups.map(attrGrp => {
    const label = Object.keys(attrGrp)[0];
    const sizeChart = props.attributes.filter(attr => attr.key === 'sizeChartURL' && attr.usage === 'Descriptive');
    const hasSizeChart = sizeChart.length > 0;
    const selection = props.defaultSku.attributes.filter(attr => attr.name === label && attr.usage === 'Defining')[0] || {};
    return (
      <React.Fragment key={label}>
        {hasSizeChart &&
          label.toLowerCase().indexOf('size') > -1 &&
          props.partNumber && (props.messages.isTrueFitEnabled !== 'false') && (
            <div className="row">
              <TrueFit partNumber={props.partNumber} />
            </div>
          )}
        <div className="row o-copy__14reg mt-2 mb-half">
          <strong className="o-copy__14bold">
            {label}
            :&#160;
          </strong>
          <span className="o-copy__14reg">{selection.value}</span>
        </div>
        <Swatch
          itemName={label}
          items={Object.values(attrGrp)[0]}
          inventory={getInventoryDetails(Object.keys(attrGrp)[0])}
          selected={props.selected ? props.defaultSku.skuResolvingAttrIdentifiers : null}
          updateSelection={updateSelection}
        />
        {hasSizeChart && label.toLowerCase().indexOf('size') > -1 && getSizeChartLink(sizeChart)}
      </React.Fragment>
    );
  });
};

ProductAttributes.propTypes = {};

ProductAttributes.defaultProps = {
  defaultSku: {
    skuResolvingAttrIdentifiers: {},
    attributes: []
  },
  messages: {}
};

export default ProductAttributes;
