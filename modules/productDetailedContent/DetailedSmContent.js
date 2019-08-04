import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cx, css } from 'react-emotion';
import { DETAILS_AND_SPECS, ITEM, Q_A, REVIEWS, SKU } from './constants';
import Accordion from './accordion';
import BazaarVoice from './../bazaarVoice/bazaarVoice.component';
import Details from './../detailsAndSpecs/detailsAndSpecs.component';

const accordionText = css`
  color: #4c4c4c;
  cursor: pointer;
`;

const ruleStyle = css`
  width: 100%;
  height: 0.0625rem;
  background-color: #d8d8d8;
`;

const DetailedSmContent = props => {
  const { productItem, labels = {}, toggleAccordian } = props;
  const { detailsTab, reviewsTab, qaTab } = props.state;
  const { productSpecifications, longDescription, itemId, mfItemId, partNumber } = productItem;

  const skuAndItem = () => (
    <div className="pb-2">
      <div className={cx(ruleStyle, 'mb-2')}> </div>
      <div className="d-flex">
        <span data-auid={`sku_${itemId || 'N/A'}_m`}>
          <b>{labels.SKU || SKU}</b>
        </span>{' '}
        <span className="pr-3">{itemId || 'N/A'}</span>
      </div>
      <div>
        <span data-auid={`item_${mfItemId || 'N/A'}_m`}>
          <b>{labels.ITEM || ITEM}</b>
        </span>{' '}
        <span className="pr-3">{mfItemId || 'N/A'}</span>
      </div>
    </div>
  );

  return (
    <Fragment>
      {!props.isBait && skuAndItem()}
      <div className="product-details-content" ref={props.aRef}>
        <Accordion
          className={cx(accordionText, 'target-toggle-details-details', 'body-16-regular')}
          title={labels.DETAILS_AND_SPECS || DETAILS_AND_SPECS}
          isOpen={detailsTab}
          accordianName="details"
          auid="Detais and Specs_m"
          toggleAccordian={toggleAccordian}
        >
          <Details productSpecifications={productSpecifications} labels={labels} description={longDescription} />
        </Accordion>
        <Accordion
          className={cx(accordionText, 'target-toggle-details-reviews', 'body-16-regular')}
          title={labels.REVIEWS || REVIEWS}
          isOpen={reviewsTab}
          auid="Reviews_m"
          accordianName="reviews"
          toggleAccordian={toggleAccordian}
        >
          <BazaarVoice type="reviews" ExternalId={partNumber} />
        </Accordion>
        <Accordion
          className={cx(accordionText, 'target-toggle-details-q-a', 'body-16-regular')}
          title={labels.Q_A || Q_A}
          isOpen={qaTab}
          accordianName="qa"
          auid="qa_m"
          toggleAccordian={toggleAccordian}
        >
          <BazaarVoice type="questions" ExternalId={partNumber} />
        </Accordion>
      </div>
    </Fragment>
  );
};

DetailedSmContent.propTypes = {
  productItem: PropTypes.object,
  labels: PropTypes.object,
  isBait: PropTypes.bool,
  state: PropTypes.object,
  toggleAccordian: PropTypes.func,
  aRef: PropTypes.object
};

export default DetailedSmContent;
