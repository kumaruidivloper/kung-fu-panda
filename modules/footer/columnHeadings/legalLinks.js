import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import '../footer.component.scss';
import { lineSeparator, mbtm10, containerPadding, legalLinkContainer } from '../styles';

class LegalLinks extends React.PureComponent {
  constructor(props) {
    super(props);

    this.analyticsData = this.analyticsData.bind(this);
  }

  analyticsData(e, column) {
    e.preventDefault();

    this.props.gtmDataLayer.push({
      event: 'footerClicks',
      eventCategory: 'footer',
      eventAction: column.label.toLowerCase(),
      eventLabel: `${window.location.pathname}`
    });
    if (ExecutionEnvironment.canUseDOM) {
      window.location = `${column.url}`;
    }
  }

  render() {
    const { legalLinks, fontClass } = this.props;
    return (
      <div className={`${legalLinkContainer} d-flex flex-wrap ${containerPadding}`}>
        {legalLinks.map((column, index) => (
          <div key={column.label} className={mbtm10}>
            {column.icon && <span className={`academyicon ${column.icon}`} />}
            {column.label && (
              <a
                key={`cols-item ${column.label}`}
                href={`${column.url}`}
                className={fontClass}
                data-auid={`FOOTER_LINK_${index}_${column.label}`}
                onClick={e => this.analyticsData(e, column)}
              >
                {column.label}
              </a>
            )}
            {legalLinks.length - 1 !== index && <span className={`${fontClass} ${lineSeparator}`}> | </span>}
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

LegalLinks.propTypes = {
  legalLinks: PropTypes.array,
  gtmDataLayer: PropTypes.array,
  fontClass: PropTypes.string
};
export default connect(mapStateToProps)(LegalLinks);
