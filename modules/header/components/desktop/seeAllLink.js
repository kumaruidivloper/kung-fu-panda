import React from 'react';
import PropTypes from 'prop-types';
import { updateAnalytics } from '../../helpers';
/* *** Show See All Link if the L2 Menu Items length is > 6 or 8 *** */
class SeeAllLink extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { label, url, gtmDataLayer, analyticsLbl, breadList } = this.props;
    return (
      <div className="a-see-all border-top py-half">
        <a
          onClick={e =>
            updateAnalytics(
              e,
              gtmDataLayer,
              'globalNavigationLinks',
              'navigation',
              `${analyticsLbl}_see all`,
              breadList,
              `${url}`,
              `${label}`,
              'top navigation'
            )
          }
          className="o-copy__14reg"
          data-auid="seeAllLink"
          href={url}
          aria-label="see all link"
        >
          <span className="pr-half align-middle">{label}</span>
          <span className="academyicon icon-chevron-right font-12 align-middle c-0055a6" aria-hidden="true" />
        </a>
      </div>
    );
  }
}

SeeAllLink.propTypes = {
  label: PropTypes.string,
  url: PropTypes.string,
  analyticsLbl: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  breadList: PropTypes.string
};

SeeAllLink.defaultProps = {
  label: '',
  url: '',
  analyticsLbl: '',
  gtmDataLayer: [],
  breadList: ''
};

export default SeeAllLink;
