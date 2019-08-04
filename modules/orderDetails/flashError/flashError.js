import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';

import { analyticsContent } from '../../analyticsWrapper/utils';
import { errorWrapper } from '../orderDetails.styles';

const logAnalyticsError = (errorMessage = '') => {
  analyticsContent({
    event: 'errormessage',
    eventCategory: 'error message',
    eventAction: 'order details error',
    eventLabel: errorMessage.toLowerCase()
  });
};

class FlashError extends React.PureComponent {
  componentDidMount() {
    const { errorMessage } = this.props;
    logAnalyticsError(errorMessage);
  }

  componentDidUpdate(prevProps) {
    const { errorMessage: prevErrorMessage } = prevProps;
    const { errorMessage, didErrorMessageChange } = this.props;
    if (didErrorMessageChange(prevErrorMessage, errorMessage)) {
      logAnalyticsError(errorMessage);
    }
  }

  render() {
    const { errorMessage, wrapperClassName } = this.props;
    return (
      <section className={cx(errorWrapper, wrapperClassName)}>
        <p className="o-copy__14reg mb-0">{errorMessage}</p>
      </section>
    );
  }
}

FlashError.propTypes = {
  errorMessage: PropTypes.string,
  didErrorMessageChange: PropTypes.func,
  wrapperClassName: PropTypes.string
};

FlashError.defaultProps = {
  didErrorMessageChange: (prevErrorMessage, errorMessage) => prevErrorMessage !== errorMessage
};

export default FlashError;
