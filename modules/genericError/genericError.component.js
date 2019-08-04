import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { NODE_TO_MOUNT, DATA_COMP_ID, CMS_DEFAULT_ERROR } from './constants';
import AlertComponent from './components/alertComponent';

class GenericError extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidMount() {
    this.props.errorTracking();
  }
  componentDidCatch() {
    // Display fallback UI
    this.setState({ hasError: true });
  }
  getErrorMessage(errorMap) {
    const { cmsErrorLabels } = this.props;
    return cmsErrorLabels && typeof cmsErrorLabels[errorMap.errorKey] !== typeof undefined
      ? cmsErrorLabels[errorMap.errorKey]
      : cmsErrorLabels[CMS_DEFAULT_ERROR];
  }
  render() {
    const { apiErrorList, auid, cmsErrorLabels } = this.props;
    if (this.state.hasError) {
      return <AlertComponent auid={auid} message={cmsErrorLabels[CMS_DEFAULT_ERROR]} />;
    }
    return (
      <Fragment>
        {Array.isArray(apiErrorList) ? (
          apiErrorList.map(errorMap => <AlertComponent className="generic-error-alert" key={`${errorMap.errorKey}`} auid={auid} message={this.getErrorMessage(errorMap)} />)
        ) : (
          <AlertComponent className="generic-error-alert" auid={auid} message={cmsErrorLabels[CMS_DEFAULT_ERROR]} />
        )}
      </Fragment>
    );
  }
}
GenericError.defaultProps = {
  errorTracking: () => {}
};

GenericError.propTypes = {
  cmsErrorLabels: PropTypes.object.isRequired,
  apiErrorList: PropTypes.array,
  auid: PropTypes.string,
  errorTracking: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<GenericError {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default GenericError;
