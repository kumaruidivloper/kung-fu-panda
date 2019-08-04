import React from 'react';
import PropTypes from 'prop-types';
import { updateAnalytics } from '../helpers';
/* ******* Display Weekly Ads ******* */
class WeeklyAds extends React.PureComponent {
  render() {
    const { label, url, gtmDataLayer, breadList, cssClass } = this.props;
    return (
      <a
        href={url}
        aria-label={label}
        className={`o-copy__12reg ${cssClass}`}
        onClick={e => updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${label}`, breadList, url)}
      >
        {label}
      </a>
    );
  }
}
WeeklyAds.propTypes = {
  label: PropTypes.string,
  url: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  breadList: PropTypes.string,
  cssClass: PropTypes.string
};

export default WeeklyAds;
