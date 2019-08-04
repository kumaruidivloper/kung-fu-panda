import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'react-emotion';

import GMap from './initMap';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

const mapContainer = css`
  height: 100%;
`;

class GoogleMaps extends React.PureComponent {
  getZoom() {
    return 10;
  }
  render() {
    const { markers, centerPoint, draggable, iconUrl } = this.props;

    return (
      <div className={`${mapContainer}`} >
        <GMap markers={markers} center={centerPoint} zoom={this.getZoom()} draggable={draggable} iconUrl={iconUrl} />
      </div>
    );
  }
}

GoogleMaps.propTypes = {
  markers: PropTypes.array,
  centerPoint: PropTypes.object.isRequired,
  draggable: PropTypes.bool,
  iconUrl: PropTypes.string
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<GoogleMaps {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default GoogleMaps;
