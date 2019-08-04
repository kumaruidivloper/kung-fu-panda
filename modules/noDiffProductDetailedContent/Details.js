import React from 'react';
import PropTypes from 'prop-types';

const DetailsAndSpecs = props => (
  <div>{props.productSpecifications && <p className="o-copy__14reg" dangerouslySetInnerHTML={{ __html: props.productSpecifications.value }} />}</div>
);

DetailsAndSpecs.propTypes = {
  // description: PropTypes.string,
  productSpecifications: PropTypes.object
};

DetailsAndSpecs.defaultProps = {
  productSpecifications: {}
};

export default DetailsAndSpecs;
