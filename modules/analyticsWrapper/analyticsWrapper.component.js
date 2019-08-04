import React from 'react';
import PropTypes from 'prop-types';
import { analyticsContent } from './utils';

export const AnalyticsWrapper = WrappedComponent => {
  class Analytics extends React.PureComponent {
    constructor(props) {
      super(props);
      this.analyticsContent = analyticsContent.bind(this);
    }

    render() {
      return <WrappedComponent {...this.props} analyticsContent={this.analyticsContent} />;
    }
  }
  AnalyticsWrapper.propTypes = {
    analyticsWrapper: PropTypes.func
  };

  return Analytics;
};

export default AnalyticsWrapper;
