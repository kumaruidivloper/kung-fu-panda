import React from 'react';
import PropTypes from 'prop-types';
import { cx, css } from 'react-emotion';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Details from './../detailsAndSpecs/detailsAndSpecs.component';
import { DETAILS_AND_SPECS, ITEM, Q_A, REVIEWS, SKU } from './constants';
import BazaarVoice from './../bazaarVoice/bazaarVoice.component';

const tabs = css`
  display: flex;
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
`;

const tabsWrapper = css`
  list-style: none;
  font-size: 0.875rem;
`;

const tabItem = css`
  margin-right: 4.375rem;
  cursor: pointer;
`;

const active = css`
  border-bottom: 3px solid #0556a4;
  border-radius: 1.5px;
`;

const ruleStyle = css`
  width: 100%;
  height: 0.0625rem;
  background-color: #d8d8d8;
`;

const reactTabs = css`
  & .react-tabs__tab-panel {
    display: none;
    &.react-tabs__tab-panel--selected {
      display: block;
    }
  }
`;

const DetailedLgContent = props => {
  const forceRender = true;
  const { productItem, labels = {} } = props;
  const { productSpecifications, longDescription, itemId, mfItemId, partNumber } = productItem;

  const skuAndItem = () => (
    <div className="d-flex">
      <span className="o-copy__14bold" data-auid={`sku_${itemId || 'N/A'}`}>
        {labels.SKU || SKU}
      </span>
      <span className="o-copy__14reg pr-3"> {itemId || 'N/A'}</span>
      <span className="o-copy__14bold" data-auid={`item_${mfItemId || 'N/A'}`}>
        {labels.ITEM || ITEM}
      </span>
      <span className="o-copy__14reg pr-3"> {mfItemId || 'N/A'}</span>
    </div>
  );

  return (
    <div className={`product-details-content ${reactTabs}`}>
      <Tabs
        className={tabsWrapper}
        selectedIndex={props.state.selectedTabIndex == null ? props.defaultOption : props.state.selectedTabIndex}
        onSelect={selectedTabIndex => props.updateTabIndex({ selectedTabIndex })}
      >
        {!props.isBait && skuAndItem()}
        <div className={cx(ruleStyle, 'my-2')}> </div>
        <TabList className={tabs}>
          <Tab
            selectedClassName={active}
            className={cx(tabItem, 'target-toggle-details-details', 'pb-1')}
            tabIndex="0"
            data-auid="PDP_DetailsAndSpecs"
            onClick={() => props.onClickTabLogGA(props.productItem, 'Details and Specs')}
          >
            {labels.DETAILS_AND_SPECS || DETAILS_AND_SPECS}
          </Tab>
          <Tab
            selectedClassName={active}
            className={cx(tabItem, 'target-toggle-details-reviews', 'pb-1')}
            tabIndex="0"
            data-auid="PDP_Reviews"
            onClick={() => props.onClickTabLogGA(props.productItem, 'Reviews')}
          >
            {labels.REVIEWS || REVIEWS}
          </Tab>
          <Tab
            selectedClassName={active}
            className={cx(tabItem, 'target-toggle-details-q-a', 'pb-1')}
            tabIndex="0"
            data-auid="PDP_Q&A"
            onClick={() => props.onClickTabLogGA(props.productItem, 'Q&A')}
          >
            {labels.Q_A || Q_A}
          </Tab>
        </TabList>

        <TabPanel>
          <Details productSpecifications={productSpecifications} labels={labels} description={longDescription} showExpanded={props.state.expand} />
        </TabPanel>
        <TabPanel forceRender={forceRender}>
          <BazaarVoice type="reviews" ExternalId={partNumber} />
        </TabPanel>
        <TabPanel forceRender={forceRender}>
          <BazaarVoice type="questions" ExternalId={partNumber} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

DetailedLgContent.propTypes = {
  isBait: PropTypes.bool,
  productItem: PropTypes.object,
  labels: PropTypes.object,
  state: PropTypes.object,
  updateTabIndex: PropTypes.func,
  onClickTabLogGA: PropTypes.func,
  defaultOption: PropTypes.number
};

export default DetailedLgContent;
