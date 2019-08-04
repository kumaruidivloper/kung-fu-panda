import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import { product, atc } from './style';
import { productLabels } from './constants';
import Accordion from '../../productDetailedContent/accordion';

const DetailsAndSpecs = props => (
  <div className="container">
    <div className={`${atc.hr} mt-3`}>&#160;</div>

    <div className={product.showDesktop}>
      <div className="row">
        <span className={product.detailsSpecs}>{productLabels.DETAILSANDSPECS}</span>
      </div>
      {props.specs && (
        <div className="row">
          <div className="col-lg-12">
            <p className="mt-2 o-copy__14reg" dangerouslySetInnerHTML={{ __html: props.specs.value }} />
          </div>
        </div>
      )}
    </div>

    <div className={product.showMobile}>
      <Accordion
        className={cx(product.accordionText, 'target-toggle-details-details', 'body-16-regular')}
        title={productLabels.DETAILSANDSPECS}
        isOpen={props.showDetails}
        accordianName="details"
        auid="Detais and Specs_m"
        toggleAccordian={props.toggleDetails}
      >
        {props.specs && (
          <div className="row">
            <div className="col-lg-12">
              <p className="mt-2 o-copy__14reg" dangerouslySetInnerHTML={{ __html: props.specs.value }} />
            </div>
          </div>
        )}
      </Accordion>
    </div>
  </div>
);

DetailsAndSpecs.propTypes = {
  specs: PropTypes.object,
  showDetails: PropTypes.bool,
  toggleDetails: PropTypes.func
};

export default DetailsAndSpecs;
