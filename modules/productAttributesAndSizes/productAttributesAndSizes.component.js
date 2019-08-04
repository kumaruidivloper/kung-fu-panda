import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { cx } from 'react-emotion';
import {
  COLOR,
  PATTERN,
  CLEARANCE,
  SWATCH_TO_DROPDOWN_SIZE,
  SIZE_CHART,
  SINGLE_SKU_MESSAGE,
  MULTI_SKU_MESSAGE,
  SKU_LINK,
  IS_TRUEFIT_ENABLED
} from './constants';
import Swatches from '../swatches/swatches.component';
import { ProductAttributeWrapper, AttributeWrapper, SizeChart, SoldOutText, smallIconlink, LinkSpan, AttributeKey } from './styles';
import TrueFit from '../trueFit/trueFit.component';
import { printBreadCrumb } from '../../utils/breadCrumb';
import { isMoreThanXExist, ofSizeType, prepareAttributesToRender, ofImageType, createNewProductItemFromNextSelected } from './helpers';
import Select from '../select/select.component';

const Divider = styled('div')`
  height: 1px;
  min-height: 1px;
  max-height: 1px;
  background-color: #ccc;
`;

class ProductAttributesAndSizes extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickSwatchLogGA = this.onClickSwatchLogGA.bind(this);
    this.onClickSeeMoreColorsLogGA = this.onClickSeeMoreColorsLogGA.bind(this);
    this.onClickSizeChartLogGa = this.onClickSizeChartLogGa.bind(this);
    this.createHandleSwatchClick = this.createHandleSwatchClick.bind(this);
    this.createOnSeeMoreColorsClick = this.createOnSeeMoreColorsClick.bind(this);
  }

  onEnterFireOnClick(onClick) {
    return e => {
      if (onClick && e.nativeEvent.keyCode === 13) {
        onClick(e);
      }
    };
  }

  onClickSwatchLogGA(product, selectedItem) {
    const { identifier } = selectedItem;
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: `pdp|attribute|${identifier.key}|${selectedItem.text}`.toLowerCase(),
      eventLabel: `${product.breadCrumb ? printBreadCrumb(product.breadCrumb) : 'academy'} > ${product.name}`.toLowerCase()
    });
  }

  onClickSeeMoreColorsLogGA(product) {
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'see colors',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }

  onClickSizeChartLogGa(product) {
    this.props.gtmDataLayer.push({
      event: 'downloadContent',
      eventCategory: 'download',
      eventAction: 'pdp|size chart',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }

  getIdentifierMapForSize = identifierMap => identifierMap[COLOR] || identifierMap[PATTERN];

  getSelectAttributeOption = listItem => {
    const { text, sellable } = listItem;
    return {
      value: text,
      label: text,
      secondaryLabel: !sellable && ' -  Sold Out',
      ...listItem,
      disabled: !sellable,
      className: !sellable && SoldOutText,
      disabledSelectable: true
    };
  };

  getSelectAttributeOptions = list => list.map(listItem => this.getSelectAttributeOption(listItem));

  getAttributePaddingStyles = isMoreThanOneAttributeExist => (isMoreThanOneAttributeExist ? 'mb-2 mb-md-3' : 'mb-1');

  getClearanceStyle = showImageThumbnail => (showImageThumbnail ? 'mt-half' : '');

  createOnSeeMoreColorsClick(onClickLogGA) {
    return () => {
      const { productItem } = this.props;
      if (productItem) {
        onClickLogGA(productItem);
        if (ExecutionEnvironment.canUseDOM) {
          window.location = `${productItem.seoURL}`;
        }
      }
    };
  }

  createHandleSwatchClick(onClickLogGA) {
    return selectedItem => {
      const { identifier } = selectedItem;
      const { productItem, updateProductItem } = this.props;
      const { productAttributeGroups, selectedIdentifier } = productItem;

      const nextSelectedIndetifiers = {};
      productAttributeGroups.forEach(key => {
        nextSelectedIndetifiers[key] = identifier.key === key ? identifier.value : selectedIdentifier[key];
      });

      const newProductItem = createNewProductItemFromNextSelected(productItem, nextSelectedIndetifiers);
      updateProductItem(newProductItem);
      onClickLogGA(productItem, selectedItem);
    };
  }

  renderAttributeName = (attributeName, attributes) =>
    attributes.map((attribute, index) => (
      <span key={`${attributeName}-${attribute}`}>
        {attribute} {index === attributes.length && '/'}
      </span>
    ));

  renderAttribute(key, partNumber, attributeName, sizeChartURL) {
    const { disableSizeChart, productItem, messages = {} } = this.props;
    return (
      <Fragment>
        {ofSizeType(key) &&
          this.props.trueFit &&
          messages[IS_TRUEFIT_ENABLED] !== 'false' && (
            <div className="pb-half">
              <TrueFit
                partNumber={partNumber}
                productItem={productItem}
                fnUpdateProduct={createNewProductItemFromNextSelected}
                fnSaveProduct={this.props.updateProductItem}
              />
            </div>
          )}
        <AttributeWrapper data-auid={`PDP_${key}_heading`}>
          <div className="o-copy__14reg">
            <AttributeKey className="o-copy__14bold mt-2">{key}:</AttributeKey> {this.renderAttributeName(key, [attributeName])}
          </div>
          {!disableSizeChart &&
            ofSizeType(key) &&
            sizeChartURL && (
              <SizeChart className="o-copy__14reg">
                <a
                  data-auid="sizeChart"
                  href={sizeChartURL}
                  onClick={() => {
                    this.onClickSizeChartLogGa(productItem);
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i role="presentation" aria-label="facets" className="academyicon icon-information filter-icon--blue mr-half pr-0 pr-md-quarter" />
                  <span>{SIZE_CHART}</span>
                </a>
              </SizeChart>
            )}
        </AttributeWrapper>
      </Fragment>
    );
  }

  renderImageAttribute = (key, partNumber, sizeChartURL, swatchList, swatchProps) => {
    const clearanceItems = swatchList.filter(item => item.isClearance);
    const imageItems = swatchList.filter(item => !item.isClearance);
    const { tabIndex, handleSwatchClick, default: defaultItem } = swatchProps;
    const swatchObj = {
      tabIndex,
      handleSwatchClick,
      default: defaultItem
    };
    let showImageThumbnail = false;
    let showClearanceThumbnail = false;

    const swatchImageTypeProps = {
      ...swatchObj,
      cms: { swatchList: imageItems }
    };

    const swatchClearanceTypeProps = {
      ...swatchObj,
      cms: { swatchList: clearanceItems }
    };

    // Case to handle more than one image items
    if (isMoreThanXExist(imageItems, 1)) {
      showImageThumbnail = true;
    }

    // Case to handle more than one clearance items or more than one image items and one or more clearance items
    if (isMoreThanXExist(clearanceItems, 1) || (isMoreThanXExist(imageItems, 1) && isMoreThanXExist(clearanceItems, 0))) {
      showClearanceThumbnail = true;
    }

    // Case to handle one or more image and clearance items.
    if (imageItems.length >= 1 && clearanceItems.length >= 1) {
      showImageThumbnail = true;
      showClearanceThumbnail = true;
    }

    return (
      <div className={this.getAttributePaddingStyles(showImageThumbnail || showClearanceThumbnail)} data-auid={`PDP_${key}_Attribute`} key={key}>
        {this.renderAttribute(key, partNumber, defaultItem.text, sizeChartURL)}
        {showImageThumbnail && <Swatches {...swatchImageTypeProps} />}
        {showClearanceThumbnail && (
          <div className={this.getClearanceStyle(showImageThumbnail)}>
            {this.renderAttribute(CLEARANCE, partNumber, '', sizeChartURL)}
            <Swatches {...swatchClearanceTypeProps} />
          </div>
        )}
      </div>
    );
  };

  renderDivider = preparedAttributes => preparedAttributes && preparedAttributes.length > 0 && <Divider className="mb-2" />;

  render() {
    const { onClickSwatchLogGA = this.onClickSwatchLogGA, onClickSeeMoreColorsLogGA = this.onClickSeeMoreColorsLogGA, labels = {} } = this.props;
    const { productItem } = this.props;
    if (!productItem) {
      return null;
    }
    const { partNumber, sizeChartURL } = productItem;
    // const descriptionLink = productItem.bulkGiftcardSeoUrl ? SINGLE_SKU_LINK : MULTI_SKU_LINK;
    const descriptionMessage = productItem.bulkGiftcardSeoUrl ? SINGLE_SKU_MESSAGE : MULTI_SKU_MESSAGE;
    let moveToUrl = '';
    const { isGiftCard, bulkGiftcardSeoUrl, standardGiftcardSeoUrl } = productItem;
    if (isGiftCard) {
      moveToUrl = isGiftCard && bulkGiftcardSeoUrl ? bulkGiftcardSeoUrl : standardGiftcardSeoUrl;
    }
    const handleSwatchClick = this.createHandleSwatchClick(onClickSwatchLogGA);
    const preparedAttributes = prepareAttributesToRender(productItem, handleSwatchClick);
    const onClick = this.createOnSeeMoreColorsClick(onClickSeeMoreColorsLogGA);
    return (
      <ProductAttributeWrapper>
        {productItem &&
          productItem.isGiftCard === 'Y' && (
            <div className="col-12 p-0">
              <p>
                {descriptionMessage} <a href={moveToUrl}>{SKU_LINK}</a>
              </p>
            </div>
          )}
        {preparedAttributes &&
          preparedAttributes.map(preparedAttribute => {
            const { swatchProps, key, defaultItem } = preparedAttribute;
            const {
              cms: { swatchList }
            } = swatchProps;
            if (this.props.attributesOnly) {
              return this.renderAttribute(key, partNumber, defaultItem.text, sizeChartURL);
            }
            if (ofImageType(key)) {
              if (this.props.quickView) {
                swatchProps.cms.swatchList = swatchProps.cms.swatchList.slice(0, 12);
                const isMoreThanOneExit = isMoreThanXExist(swatchList, 1);
                return (
                  <div data-auid={`PDP_${key}_Attribute`} className={this.getAttributePaddingStyles(isMoreThanOneExit)} key={key}>
                    {this.renderAttribute(key, partNumber, defaultItem.text, sizeChartURL)}
                    {isMoreThanOneExit && <Swatches {...swatchProps} />}
                    {isMoreThanXExist(swatchList, 12) && (
                      <LinkSpan onClick={onClick} onKeyPress={this.onEnterFireOnClick(onClick)} role="link" tabIndex="0" data-auid="seeMoreColors">
                        <span> {labels.SEE_MORE_COLORS || 'See More Colors'} </span>
                        <span className={cx('academyicon', 'icon-chevron-right', smallIconlink)} />
                      </LinkSpan>
                    )}
                  </div>
                );
              }
              return this.renderImageAttribute(key, partNumber, sizeChartURL, swatchList, swatchProps);
            } else if (ofSizeType(key) || swatchList.length <= SWATCH_TO_DROPDOWN_SIZE) {
              const isMoreThanOneExit = isMoreThanXExist(swatchList, 1);
              return (
                <div data-auid={`PDP_${key}_Attribute`} className={this.getAttributePaddingStyles(isMoreThanOneExit)} key={key}>
                  {this.renderAttribute(key, partNumber, defaultItem.text, sizeChartURL)}
                  {isMoreThanOneExit && <Swatches {...swatchProps} />}
                </div>
              );
            }

            return (
              <div data-auid={`PDP_${key}_Attribute`} className="mb-2 mb-md-3" key={key}>
                {this.renderAttribute(key, partNumber, defaultItem.text, sizeChartURL)}
                <Select onSelect={handleSwatchClick} options={this.getSelectAttributeOptions(swatchList)} />
              </div>
            );
          })}
        {this.renderDivider(preparedAttributes)}
      </ProductAttributeWrapper>
    );
  }
}

ProductAttributesAndSizes.propTypes = {
  trueFit: PropTypes.bool,
  productItem: PropTypes.object,
  quickView: PropTypes.bool,
  attributesOnly: PropTypes.bool,
  productAttributesAndSizes: PropTypes.object,
  onClickSwatchLogGA: PropTypes.func,
  onClickSeeMoreColorsLogGA: PropTypes.func,
  updateProductItem: PropTypes.func,
  gtmDataLayer: PropTypes.array,
  labels: PropTypes.object,
  disableSizeChart: PropTypes.bool,
  messages: PropTypes.object
};

ProductAttributesAndSizes.defaultProps = {
  trueFit: true,
  quickView: false,
  disableSizeChart: false
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

export default connect(mapStateToProps)(ProductAttributesAndSizes);
