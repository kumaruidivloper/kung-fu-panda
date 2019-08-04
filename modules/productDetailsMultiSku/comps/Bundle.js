import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Spinner from '@academysports/fusion-components/dist/Spinner';
import Products from './Products';
import { getInitialState, getSpecification } from './helpers';
import AddToCart from './addToCart';
import DetailsAndSpecs from './DetailsAndSpecs';
import Header from './Header';
import { bundle } from './style';
import { printBreadCrumb } from '../../../utils/breadCrumb';

class Bundle extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialState(props);
    this.state.showDetails = false;
    this.state.bundleClickLabel = this.props.productinfo && `${printBreadCrumb(this.props.productinfo.breadCrumb)} > ${this.props.productinfo.name}`;

    if (props.productinfo.bundleSpecifications && props.productinfo.bundleSpecifications.length > 0) {
      this.detailedSpecs = getSpecification(props.productinfo.bundleSpecifications, 'bundleDetailsSpecs');
    }

    this.scrollRef = React.createRef();

    this.updateSelectedSku = this.updateSelectedSku.bind(this);
    this.editSelection = this.editSelection.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  editSelection(product) {
    this.setState({
      expanded: product
    });
    const { gtmDataLayer } = this.props;
    const { bundleClickLabel } = this.state;
    if (gtmDataLayer) {
      gtmDataLayer.push({
        event: 'pdpDetailClick',
        eventCategory: 'pdp interactions',
        eventAction: 'pdp| edit',
        eventLabel: bundleClickLabel && bundleClickLabel.toLowerCase()
      });
    }
  }

  toggleDetails(accordianName, isOpen) {
    this.setState({
      showDetails: isOpen
    });
  }

  updateSelectedSku(product, sku, isOos) {
    const { selectedSkus, products } = this.state;
    selectedSkus[product] = isOos ? null : sku;

    const index = products.indexOf(product);

    this.setState({
      expanded: index >= 0 && index < products.length - 1 ? products[index + 1] : products[products.length - 1],
      selectedSkus,
      timestamp: new Date().getTime()
    });
  }

  render() {
    return (
      <Fragment>
        <Header {...this.props} s={this.state} />
        {!this.props.inventoryAPIDone && <Spinner />}
        {this.props.inventoryAPIDone && (
          <Fragment>
            {ExecutionEnvironment.canUseDOM && (
              <div className={this.props.noStock ? bundle.hidden : bundle.visible}>
                <Products
                  {...this.props}
                  dref={this.scrollRef}
                  s={this.state}
                  updateSelectedSku={this.updateSelectedSku}
                  editSelection={this.editSelection}
                  bundleClickLabel={this.state.bundleClickLabel}
                />
                <AddToCart
                  {...this.state}
                  dref={this.scrollRef}
                  gtmDataLayer={this.props.gtmDataLayer}
                  seoURL={this.props.productinfo.seoURL}
                  id={this.props.productinfo.partNumber}
                  name={this.props.productinfo.name}
                  productinfo={this.props.productinfo}
                  bundleId={this.props.productinfo.id}
                  labels={this.props.labels}
                />
              </div>
            )}
            <DetailsAndSpecs {...this.props} specs={this.detailedSpecs} showDetails={this.state.showDetails} toggleDetails={this.toggleDetails} />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

Bundle.propTypes = {
  productinfo: PropTypes.object,
  noStock: PropTypes.bool,
  authMsgs: PropTypes.object,
  inventoryAPIDone: PropTypes.bool,
  gtmDataLayer: PropTypes.array,
  labels: PropTypes.object
};

Bundle.defaultProps = {};

export default Bundle;
