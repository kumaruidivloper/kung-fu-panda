import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import Badge from '@academysports/fusion-components/dist/Badge';
import BazaarVoice from './../bazaarVoice/bazaarVoice.component';
import { ProductDetailsWrapperStyle, BadgeWrapper, ProductName, BVRRSummaryContainer } from './styles';
import OfferSchema from './OfferSchema';

const calcElementScrollHeightOffset = el => (!el ? 0 : el.offsetTop + calcElementScrollHeightOffset(el.offsetParent));

const ProductDetailsWrapper = props => {
  const { children, ...rest } = props;
  return (
    <div className={ProductDetailsWrapperStyle} itemScope itemType="http://schema.org/Product" {...rest}>
      {children}
    </div>
  );
};
ProductDetailsWrapper.propTypes = { children: PropTypes.node };
class ProductDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onRatingClick = this.onRatingClick.bind(this);
    this.renderOfferMetaTags = this.renderOfferMetaTags.bind(this);
  }

  onRatingClick() {
    this.scrollToReviews();
  }

  redirectToPdpRatings() {
    const { seoURL } = this.props.productItem || {};
    if (ExecutionEnvironment.canUseDOM && seoURL && seoURL.length > 0) {
      const delimiter = seoURL.indexOf('?') > -1 ? '&' : '?';
      window.location = `${this.props.productItem.seoURL}${delimiter}scrollTo=reviews`;
    }
  }

  scrollToReviews() {
    if (document) {
      const scrollPosition = calcElementScrollHeightOffset(document.querySelector('.product-details-content'));
      const target = document.querySelector('.target-toggle-details-reviews');
      if (scrollPosition) {
        setTimeout(() => target.click(), 1);
        this.props.onRequestScrollToReviews();
        window.scrollTo(0, scrollPosition);
      }
    }
  }

  renderOfferMetaTags(productItem) {
    if (this.props.isNoDiffBundle) {
      const { productPrice } = productItem;
      if (!productPrice) {
        return null;
      }
      const rawPrice = productPrice.salePrice && productPrice.salePrice.length > 0 ? productPrice.salePrice : productPrice.listPrice;
      const price = rawPrice.replace(/[^\d\.]/gi, ''); // eslint-disable-line no-useless-escape
      return (
        <div key="serp-offers" itemProp="offers" itemScope itemType="http://schema.org/Offer">
          <meta itemProp="priceCurrency" content="USD" />
          <meta itemProp="price" content={price} />
        </div>
      );
    }

    return <OfferSchema inventory={productItem.inventory && productItem.inventory.online} skus={productItem.sKUs} />;
  }

  renderAllImages(productItem) {
    const { productAttrGroups } = productItem;
    if (productAttrGroups) {
      const products = productAttrGroups.filter(attr => Object.keys(attr)[0].toLowerCase() === 'color');
      return products.length ? Object.values(products[0])[0].map(({ imageURL }) => <meta key={imageURL} itemProp="image" content={imageURL} />) : '';
    }
    return '';
  }

  renderMetaTags(productItem) {
    return [
      <meta key="serp-brand" itemProp="brand" content={productItem.manufacturer} />,
      <meta key="serp-name" itemProp="name" content={productItem.name} />,
      <meta key="serp-image" itemProp="image" content={productItem.imageURL} />,
      this.renderAllImages(productItem),
      <meta key="serp-sku" itemProp="sku" content={productItem.defaultSku} />,
      this.renderOfferMetaTags(productItem)
    ];
  }

  render() {
    const { productItem, auid, disableBizaarVoice } = this.props;
    if (!productItem) {
      return null;
    }
    const { name, partNumber, adBug, forceHideAdBug } = productItem;
    return (
      <ProductDetailsWrapper data-auid={auid}>
        {this.renderMetaTags(productItem)}
        {!forceHideAdBug &&
          adBug && (
            <BadgeWrapper>
              <Badge text={adBug[0]} data-auid="PDP_AdBug" disableAbsolutePositioning />
            </BadgeWrapper>
          )}
        <ProductName aria-level="1" data-auid="PDP_ProductName">
          {name}
        </ProductName>
        {productItem && productItem.isGiftCard === 'Y' && <div className="col-12 pt-0 pt-md-half" />}
        {!disableBizaarVoice && (
          <BVRRSummaryContainer data-auid="Rating Stars">
            {partNumber && <BazaarVoice type="rating_summary" ExternalId={partNumber} onClick={this.onRatingClick} />}
          </BVRRSummaryContainer>
        )}
      </ProductDetailsWrapper>
    );
  }
}

ProductDetails.propTypes = {
  auid: PropTypes.string,
  productItem: PropTypes.object,
  isNoDiffBundle: PropTypes.bool,
  onRequestScrollToReviews: PropTypes.func,
  disableBizaarVoice: PropTypes.bool
};

ProductDetails.defaultProps = {
  disableBizaarVoice: false,
  onRequestScrollToReviews: () => null,
  productItem: {
    inventory: {}
  }
};

// ProductDetails.defaultProps = {
// };

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

export default connect(mapStateToProps)(ProductDetails);
