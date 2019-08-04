import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
/**
 * insert bazaar voice dom element
 * render bazaar voice ratings and reviews
 *
 * @class BazaarVoice
 * @extends {React.PureComponent}
 */
class BazaarVoice extends React.PureComponent {
  onEnterFireOnClick(onClick) {
    return e => {
      if (onClick && e.nativeEvent.keyCode === 13) {
        onClick(e);
      }
    };
  }

  render() {
    const { type, ExternalId, onClick } = this.props;
    if (onClick) {
      return (
        <div
          data-bv-show={type}
          data-bv-productid={ExternalId}
          role="button"
          tabIndex="-1"
          onClick={onClick}
          onKeyPress={this.onEnterFireOnClick(onClick)}
        />
      );
    }
    return <div data-bv-show={type} data-bv-productid={ExternalId} role="button" aria-label={type} />;
  }
}
BazaarVoice.propTypes = {
  type: PropTypes.string.isRequired,
  ExternalId: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<BazaarVoice {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default BazaarVoice;
