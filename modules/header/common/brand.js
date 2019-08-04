import React from 'react';
import PropTypes from 'prop-types';
import { updateAnalytics } from '../helpers';
/* ******* Display Brand Logo ******* */
const Brand = props => {
  const { url, src, alt, gtmDataLayer, breadList } = props;
  return (
    <div className="brand-logo">
      <a
        href={url}
        aria-label="Academy Sports & Outdoors"
        onClick={e => updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', 'brand logo', breadList, '/')}
      >
        <img src={src} alt={alt} />
      </a>
    </div>
  );
};

Brand.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  url: PropTypes.string,
  breadList: PropTypes.string,
  gtmDataLayer: PropTypes.array
};

export default Brand;
