import { css, cx } from 'react-emotion';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { generatePDPLink, hasSkuId } from '../../utils/productDetailsUtils';
import { QUICK_VIEW_PRESET } from '../../utils/dynamicMediaUtils';
// import { printBreadCrumb } from '../../utils/breadCrumb';

const link = css`
  color: #0055a6;
`;

const linkDiv = css`
  text-align: center;
`;

const thumbnail = css`
  width: 100%;
  height: auto;
`;

class ProductThumbnail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickProductDetailsLogGA = this.onClickProductDetailsLogGA.bind(this);
    this.createOnClickProductDetails = this.createOnClickProductDetails.bind(this);
  }

  onEnterFireOnClick(onClick) {
    return e => {
      if (onClick && e.nativeEvent.keyCode === 13) {
        onClick(e);
      }
    };
  }

  onClickProductDetailsLogGA(product) {
    console.log(product);
    // PubSub.publish('gtm:dataLayer', {
    //   event: 'plpPageClicks',
    //   eventCategory: 'PLP Page Clicks',
    //   eventAction: `${product.name} > See details`,
    //   eventLabel: printBreadCrumb(product.breadCrumb)
    // });
  }

  getProductImageURL() {
    const { productItem = {} } = this.props;
    const { swatchImgList = [] } = productItem;
    if (!hasSkuId(productItem) && swatchImgList.length > 0) {
      return `${swatchImgList[0].imageURL}${QUICK_VIEW_PRESET}`;
    }
    return `${productItem.imageURL}${QUICK_VIEW_PRESET}`;
  }

  createOnClickProductDetails(onClickLogGA, productItem) {
    return () => {
      if (productItem) {
        onClickLogGA(productItem);
      }
    };
  }

  render() {
    const { productItem = {}, onClickProductDetailsLogGA = this.onClickProductDetailsLogGA, labels = {} } = this.props;
    if (!Object.keys(productItem).length) {
      return null;
    }
    const onClick = this.createOnClickProductDetails(onClickProductDetailsLogGA, productItem);

    return (
      <div>
        <img src={this.getProductImageURL()} alt="product" className={thumbnail} />
        <div className={cx(linkDiv, 'mt-2')}>
          <a
            href={generatePDPLink(productItem)}
            onClick={onClick}
            onKeyPress={this.onEnterFireOnClick(onClick)}
            className={cx(link, 'o-copy__14reg')}
          >
            {labels.SEE_FULL_PRODUCT_DETAILS || 'See Full Product Details'}
          </a>
        </div>
      </div>
    );
  }
}

ProductThumbnail.propTypes = {
  onClickProductDetailsLogGA: PropTypes.func,
  productItem: PropTypes.object,
  labels: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ProductThumbnail {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ProductThumbnail;
