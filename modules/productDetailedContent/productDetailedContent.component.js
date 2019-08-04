import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Responsive from 'react-responsive';
import { printBreadCrumb } from '../../utils/breadCrumb';
import DetailedSmContent from './DetailedSmContent';
import DetailedLgContent from './DetailedLgContent';
import { GaLabels } from './constants';
import { scrollIntoView } from '../../utils/scroll';

class ProductDetailedContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detailsTab: false,
      reviewsTab: false,
      qaTab: false,
      selectedTabIndex: null,
      expand: false
    };

    this.aRef = React.createRef();

    this.toggleAccordian = this.toggleAccordian.bind(this);
    this.onRatingClicked = this.onRatingClicked.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.onClickTabLogGA = this.onClickTabLogGA.bind(this);
  }

  onRatingClicked() {
    this.toggleAccordian('reviews', true);
  }

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

  toggleAccordian(accordianName, isOpen) {
    let detailsTab = false;
    let reviewsTab = false;
    let qaTab = false;
    let selectedTabIndex = 0;

    if (accordianName === 'reviews') {
      reviewsTab = isOpen;
      selectedTabIndex = 1;
    } else if (accordianName === 'qa') {
      qaTab = isOpen;
      selectedTabIndex = 2;
    } else {
      detailsTab = isOpen;
    }

    this.setState({
      detailsTab,
      reviewsTab,
      qaTab,
      selectedTabIndex
    });

    scrollIntoView(this.aRef.current);
    this.onClickTabLogGA(this.props.productItem, GaLabels[accordianName]);
  }
  render() {
    const { productItem } = this.props;

    if (!productItem) {
      return null;
    }

    return (
      <Fragment>
        <Responsive minWidth={768}>
          <DetailedLgContent
            {...this.props}
            state={{ ...this.state }}
            updateTabIndex={state => {
              this.setState(state);
            }}
            onClickTabLogGA={this.onClickTabLogGA}
          />
        </Responsive>
        <Responsive maxWidth={767}>
          <DetailedSmContent
            aRef={this.aRef}
            {...this.props}
            defaultOption={this.props.defaultOption}
            state={{ ...this.state }}
            toggleAccordian={this.toggleAccordian}
          />
        </Responsive>
      </Fragment>
    );
  }
}
ProductDetailedContent.propTypes = {
  productItem: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  labels: PropTypes.object,
  isBait: PropTypes.bool,
  defaultOption: PropTypes.number
};

ProductDetailedContent.defaultProps = {
  defaultOption: 0
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

export default connect(mapStateToProps)(ProductDetailedContent);
