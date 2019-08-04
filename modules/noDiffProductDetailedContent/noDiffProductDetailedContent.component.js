import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styled, { css } from 'react-emotion';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Responsive from 'react-responsive';
import Details from './Details';
// import Details from './../detailsAndSpecs/detailsAndSpecs.component';
import Accordion from './accordion';
import { SKU, DETAILS_AND_SPECS } from './constants';
import { printBreadCrumb } from '../../utils/breadCrumb';

const tabs = css`
  display: flex;
  list-style: none;
  padding-left: 0;
`;

const tabItem = css`
  margin-right: 4.375rem;
  cursor: pointer;
}`;

const active = css`
  border-bottom: 3px solid #0556a4;
  border-radius: 1.5px;
`;

const ruleStyle = css`
  width: 100%;
  height: 0.0625rem;
  background-color: #d8d8d8;
  margin: 1.25rem 0 0.625rem;
`;

const itemDetails = css`
  margin: 0 0.75rem 1rem;
`;
const accordionText = css`
  color: #4c4c4c;
  cursor: pointer;
`;

const Divider = styled('div')`
  height: 1px;
  min-height: 1px;
  max-height: 1px;
  background-color: #ccc;
`;
class NoDiffProductDetailedContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toggleAccordian = this.toggleAccordian.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.onClickTabLogGA = this.onClickTabLogGA.bind(this);
  }

  state = {
    detailsTab: false,
    expand: false
  };

  onClickTabLogGA(product, tab) {
    this.props.gtmDataLayer.push({
      event: 'pdpTabbedContent',
      eventCategory: 'pdp interactions',
      eventAction: `pdp|${tab}`.toLowerCase(),
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase(),
      readquestions: tab === 'Q&A' ? '1' : '0',
      readreview: tab === 'Reviews' ? '1' : '0'
    });
  }

  toggleExpanded() {
    this.setState({
      expand: !this.state.expand
    });
  }

  toggleAccordian(isOpen) {
    this.setState({
      detailsTab: isOpen
    });
  }

  render() {
    const { productItem, labels = {} } = this.props;
    const { detailsTab } = this.state;

    if (!productItem) {
      return null;
    }

    const { productSpecifications, longDescription, skuId } = productItem;

    return (
      <Fragment>
        <Responsive minWidth={768}>
          <div className="product-details-content">
            <Tabs selectedIndex={this.state.selectedTabIndex}>
              <p>
                <span className="pr-0">{labels.SKU || SKU}</span> <span className="pr-3"> {skuId || 'N/A'}</span>
              </p>
              <div className={ruleStyle}> </div>
              <TabList className={tabs}>
                <Tab
                  selectedClassName={active}
                  className={tabItem}
                  tabIndex="0"
                  onClick={() => this.onClickTabLogGA(productItem, labels.DETAILS_AND_SPECS || DETAILS_AND_SPECS)}
                >
                  {labels.DETAILS_AND_SPECS || DETAILS_AND_SPECS}
                </Tab>
              </TabList>

              <TabPanel>
                <Details productSpecifications={productSpecifications} description={longDescription} showExpanded={this.state.expand} />
              </TabPanel>
            </Tabs>
          </div>
        </Responsive>
        <Responsive maxWidth={767}>
          <div className="mx-0 px-0">
            <div className="mt-3 mb-3">
              <Divider />
            </div>
            <div className={itemDetails}>
              <span>
                <b>{labels.SKU || SKU}</b>
              </span>{' '}
              <span className="pr-3">{skuId || 'N/A'}</span>
            </div>
          </div>
          <div className="product-details-content">
            <Accordion
              className={accordionText}
              title={labels.DETAILS_AND_SPECS || DETAILS_AND_SPECS}
              isOpen={detailsTab}
              toggleAccordian={this.toggleAccordian}
            >
              <Details productSpecifications={productSpecifications} description={longDescription} />
            </Accordion>
          </div>
        </Responsive>
      </Fragment>
    );
  }
}

NoDiffProductDetailedContent.propTypes = {
  productItem: PropTypes.object,
  labels: PropTypes.object,
  gtmDataLayer: PropTypes.array
};

NoDiffProductDetailedContent.defaultProps = {
  gtmDataLayer: []
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

export default connect(mapStateToProps)(NoDiffProductDetailedContent);
