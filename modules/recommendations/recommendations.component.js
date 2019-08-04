import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class Recommendations extends React.PureComponent {
  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM && window.Evergage) {
      window.Evergage.init();
    }
  }

  render() {
    return <div id={this.props.cms.propertyId} />;
  }
}

Recommendations.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<Recommendations {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default Recommendations;
