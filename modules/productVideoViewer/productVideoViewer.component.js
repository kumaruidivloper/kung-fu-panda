import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import {
  SCENE7_VIDEO_VIEWER_URL,
  SCENE7_VIDEO_CONTENT_URL,
  SCENE7_CONFIG,
  SCENE7_IMAGE_SERVER_URL,
  SCENE7_SKINS_SERVER_URL
} from '../../../endpoints';
import loadScriptTag from '../../utils/loadScriptTag';
import { VideoWrapper } from './style';

class ProductVideoViewer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.videoViewer = null;
    this.loadVideoViewer = this.loadVideoViewer.bind(this);
  }

  componentDidMount() {
    loadScriptTag(SCENE7_VIDEO_VIEWER_URL)
      .then(() => this.loadVideoViewer())
      .catch(error => {
        console.error('Error loading video media component from Adobe =>', error);
      });
  }

  loadVideoViewer = () => {
    const { assetName, autoPlay, videoUrl } = this.props;
    this.videoViewer = new window.s7viewers.VideoViewer();
    this.videoViewer.setContainerId('videoViewer');
    this.videoViewer.setParam('serverUrl', SCENE7_IMAGE_SERVER_URL);
    this.videoViewer.setParam('config', SCENE7_CONFIG);
    this.videoViewer.setParam('videoserverurl', SCENE7_VIDEO_CONTENT_URL);
    this.videoViewer.setParam('contenturl', SCENE7_SKINS_SERVER_URL);

    if (autoPlay) {
      this.videoViewer.setParam('VideoPlayer.autoplay', '1');
    }

    if (videoUrl) {
      this.videoViewer.setVideo(videoUrl);
    } else {
      this.videoViewer.setAsset(assetName);
    }

    this.videoViewer.setHandlers({
      trackEvent: (objID, compClass, instName, timeStamp, eventInfo) => {
        const evt = eventInfo.split(',');
        this.props.onChangeEvent(evt[0], evt[1]);
      }
    });
    this.videoViewer.init();
  };

  render() {
    return <VideoWrapper id="videoViewer" />;
  }
}

ProductVideoViewer.propTypes = {
  assetName: PropTypes.string,
  autoPlay: PropTypes.bool,
  videoUrl: PropTypes.string,
  onChangeEvent: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ProductVideoViewer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ProductVideoViewer;
