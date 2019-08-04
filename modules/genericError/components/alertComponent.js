import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import * as styles from './../styles';
import { scrollIntoView } from '../../../utils/scroll';
import { analyticsContent } from '../../analyticsWrapper/utils';

const logAnalyticsError = (errorMessage = '') => {
  analyticsContent({
    event: 'errormessage',
    eventCategory: 'error message',
    eventAction: 'order details error',
    eventLabel: errorMessage.toLowerCase()
  });
};

class AlertComp extends PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.scrollIntoView();
    this.logError();
  }

  componentDidUpdate(prevProps) {
    const { message: prevMessage } = prevProps;
    const { message, didErrorMessageChange } = this.props;
    if (didErrorMessageChange(prevMessage, message)) {
      this.logError();
    }
  }

  logError() {
    const { message, errorTracking: externalErrorTracking, enableAutoErrorLogging } = this.props;
    if (enableAutoErrorLogging) {
      logAnalyticsError(message);
    } else {
      externalErrorTracking();
    }
  }

  /**
   * Scroll the element to the view
   */
  scrollIntoView() {
    const { scrollTopOffset } = this.props;
    const el = this.wrapperRef.current;
    if (el) {
      scrollIntoView(el, { offset: scrollTopOffset });
    }
  }
  render() {
    const { message, auid, link, linkLabel } = this.props;
    return (
      <section role="alert" aria-atomic="true" ref={this.wrapperRef} className={`${styles.errorWrapper} d-flex flex-column p-1 generic-error-alert"`}>
        <p data-auid={auid} className={`o-copy__14reg mb-0 ${styles.errorText}`}>
          {message} {link ? <a href={link}>{linkLabel}</a> : null}
        </p>
      </section>
    );
  }
}

AlertComp.propTypes = {
  auid: PropTypes.string,
  message: PropTypes.string,
  link: PropTypes.string,
  linkLabel: PropTypes.string,
  errorTracking: PropTypes.func,
  scrollTopOffset: PropTypes.number,
  didErrorMessageChange: PropTypes.func,
  enableAutoErrorLogging: PropTypes.bool
};

AlertComp.defaultProps = {
  errorTracking: () => {},
  scrollTopOffset: -20,
  didErrorMessageChange: (prevErrorMessage, errorMessage) => prevErrorMessage !== errorMessage,
  enableAutoErrorLogging: false
};

export default AlertComp;
