import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import ProductHeadline from './product/ProductHeadline';
import ProductSummary from './product/ProductSummary';
import ProductImage from './product/ProductImage';
import ProductAttributes from './product/ProductAttributes';
import { product, atc } from './style';

class Product extends React.Component {
  constructor(props) {
    super(props);

    const defaultSku = props.selectedSku ? props.selectedSku : props.sKUs.filter(sku => sku.skuId === props.rep_child_catid)[0];

    this.updateSku = this.updateSku.bind(this);
    this.getProductDetails = this.getProductDetails.bind(this);
    this.isOutOfStock = this.isOutOfStock.bind(this);
    this.nextStepClickHander = this.nextStepClickHander.bind(this);

    const isOos = this.isOutOfStock(defaultSku);
    const selected = props.selectedSku !== null;

    this.state = {
      defaultSku,
      selected,
      disabled: isOos || !selected
    };
  }

  componentDidUpdate(prevProps) {
    const { defaultSku = {} } = this.state;
    /* eslint-disable */
    if (this.props.expanded && this.props.isLast && !this.state.selected && !this.props.selectedSku) {
      const isoos = this.isOutOfStock(defaultSku);
      this.props.updateSelectedSku(this.props.uniqueID, defaultSku, isoos);
      this.setState({
        selected: true,
        disabled: isoos
      });
    }
    if (prevProps.selectedSku === null && !this.state.selected && this.props.selectedSku) {
      this.setState({
        defaultSku: this.props.selectedSku,
        selected: true
      });
    }

    if (!this.props.isFirst && this.props.dref && this.props.dref.current && ExecutionEnvironment.canUseDOM) {
      window.scrollTo(0, this.props.dref.current.offsetTop - 75);
    }
    /* eslint-enable */
  }

  getProductDetails() {
    const { uniqueID, name, isLast } = this.props;
    const { selected, defaultSku = {} } = this.state;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4">
            <ProductImage {...this.state} />
          </div>
          <div className="col-lg-7 offset-1 product-description pdx-16">
            <div className="row o-copy__20reg">{name}</div>
            <ProductAttributes {...this.props} {...this.state} updateSku={this.updateSku} />
            <div className="row mt-1">
              <div className={`o-copy__12reg ${selected ? '' : product.inVisible}`}>SKU: {selected ? defaultSku.skuId : ''}</div>
            </div>
          </div>
        </div>
        <div className="row mt-2 pdx-16 add-to-cart-btn">
          {!isLast && (
            <div className="col-lg-4 offset-8 m-no-offset">
              <Button
                disabled={this.state.disabled}
                className={product.button}
                onClick={() => this.nextStepClickHander(uniqueID, defaultSku)}
                auid="step"
              >
                Next Step
              </Button>
            </div>
          )}
          &#160;
        </div>
      </React.Fragment>
    );
  }

  isOutOfStock(sku) {
    return (
      this.props.inventory &&
      this.props.inventory.length > 0 &&
      this.props.inventory.filter(inv => inv.skuId === sku.skuId)[0].inventoryStatus !== 'IN_STOCK'
    );
  }

  nextStepClickHander(uniqueID, defaultSku) {
    this.props.updateSelectedSku(uniqueID, defaultSku);
    const { gtmDataLayer, bundleClickLabel } = this.props;
    if (gtmDataLayer) {
      gtmDataLayer.push({
        event: 'pdpDetailClick',
        eventCategory: 'pdp interactions',
        eventAction: 'pdp|nextstep',
        eventLabel: bundleClickLabel && bundleClickLabel.toLowerCase()
      });
    }
  }

  updateSku(sku, isOos) {
    if (this.props.isLast) {
      this.props.updateSelectedSku(this.props.uniqueID, sku, isOos);
    }
    this.setState({
      defaultSku: sku,
      selected: true,
      disabled: isOos
    });
  }

  render() {
    const { expanded, name, uniqueID, edit, dref, isLast } = this.props;

    return (
      <div className="container mb-2 mt-2 product-container" ref={dref} data-id={uniqueID}>
        <div className="row">
          <div className="col-lg-4">
            <ProductHeadline expanded={expanded} headline={this.props.headline} />
          </div>
          {!expanded && this.state.selected && <ProductSummary {...this.state} name={name} edit={() => edit(uniqueID)} />}
        </div>
        {expanded && this.getProductDetails()}
        {!isLast && (
          <div className={`row ${product.showDesktop}`}>
            <div className="col-lg-12">
              <div className={`${atc.hr} mb-2`}>&#160;</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

Product.propTypes = {
  selectedSku: PropTypes.object,
  rep_child_catid: PropTypes.string,
  sKUs: PropTypes.array,
  uniqueID: PropTypes.string,
  name: PropTypes.string,
  headline: PropTypes.string,
  expanded: PropTypes.bool,
  edit: PropTypes.func,
  updateSelectedSku: PropTypes.func,
  inventory: PropTypes.array,
  isLast: PropTypes.bool,
  dref: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  buundleClickLabel: PropTypes.string
};

Product.defaultProps = {
  inventory: []
};

export default Product;
