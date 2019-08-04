import PropTypes from 'prop-types';
import React from 'react';

class BvSpotlight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: this.props.pageInfo ? this.props.pageInfo.categoryId : this.props.cmsPageInfo && this.props.cmsPageInfo.previewId
    };
  }

  render() {
    const { categoryId } = this.state;
    return (
      <div className="container bvSpotlight pb-3 text-center position-relative">
        <div data-bv-show="spotlights" data-bv-subject-id={`SL-${categoryId}`} data-bv-site-id="Spotlights" />
      </div>
    );
  }
}
BvSpotlight.propTypes = {
  // cms: PropTypes.object.isRequired
  pageInfo: PropTypes.object,
  cmsPageInfo: PropTypes.object
};

export default BvSpotlight;
