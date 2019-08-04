import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { NODE_TO_MOUNT, DATA_COMP_ID, PLAY, PAUSE, STOP, START, END, MILESTONE, METADATA } from './constants';
import { SCENE7_VIDEO_VIEWER_URL } from '../../../endpoints';
import loadScriptTag from '../../utils/loadScriptTag';
import { VideoWrapper } from './style';

// regex to check if url is from youtube
const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/; // eslint-disable-line
// const API_KEY = 'AIzaSyBf9egclAW1LLA5N9wdAywnjjHSGVsKyzY';

class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.player = null;
    this.trackPauseEvents = true;
    this.videoViewer = null;
    this.loadVideoViewer = this.loadVideoViewer.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
  }

  componentDidMount() {
    const { cms } = this.props;
    const { videoImage, videoUrl } = cms;
    if (this.checkIfYouTubeLink(videoUrl)) {
      loadScriptTag('//www.youtube.com/iframe_api')
        .then(() => this.onYouTubePlayerAPIReady())
        .catch(error => {
          console.error('Error loading video media component from Adobe =>', error);
        });
    }

    /* Do not Load Scene 7 video player scripts if the Url is from youTube */
    if (!this.checkIfYouTubeLink(videoUrl)) {
      loadScriptTag(SCENE7_VIDEO_VIEWER_URL)
        .then(() => this.loadVideoViewer(videoImage, videoUrl))
        .catch(error => {
          console.error('Error loading video media component from Adobe =>', error);
        });
    }
  }
  onYouTubePlayerAPIReady = () => {
    const { YT } = window;
    if (YT.loaded) {
      this.player = new YT.Player('player', {
        events: {
          onStateChange: this.onPlayerStateChange,
          onReady: () => console.log('im ready')
        }
      });
    } else {
      setTimeout(() => {
        this.onYouTubePlayerAPIReady();
      }, 10);
    }
  };

  onPlayerStateChange = event => {
    const { videoUrl } = this.props.cms || {};
    // track when user clicks to Play
    if (event.data === window.YT.PlayerState.PLAYING) {
      this.trackPauseEvents = true;
      let playerPrecentage = Math.floor((event.target.getCurrentTime() / event.target.getDuration()) * 100);
      if (playerPrecentage < 25) {
        this.pushYoutubeAnalytics(videoUrl, START);
      } else {
        playerPrecentage = Math.floor(((event.target.getCurrentTime() / event.target.getDuration()) * 100) / 25) * 25;
        this.pushYoutubeAnalytics(videoUrl, `${playerPrecentage}% complete`);
      }

      // track when user clicks to Pause
    } else if (event.data === window.YT.PlayerState.PAUSED && this.trackPauseEvents) {
      this.trackPauseEvents = false;
      this.pushYoutubeAnalytics(videoUrl, PAUSE);

      // track when video ends
    } else if (event.data === window.YT.PlayerState.ENDED) {
      this.pushYoutubeAnalytics(videoUrl, END);
      this.player.stopVideo();
    }
  };
  /** You tube analytics begins */
  pushYoutubeAnalytics(videoUrl, eventAction) {
    let videoSplitName = videoUrl.split('/');
    let videoName = '';
    if (this.player) {
      videoName = this.player.getVideoData ? this.player.getVideoData().title : videoSplitName[videoSplitName.length - 1].split('=')[0];
    } else {
      videoSplitName = videoSplitName[videoSplitName.length - 1];
      [videoName] = videoSplitName.split('=');
    }
    this.props.gtmDataLayer.push({
      event: 'videoEvents',
      eventCategory: 'video',
      eventAction,
      eventLabel: videoName.toLowerCase()
    });
  }
  /** You tube analytics ends */

  /**
   * Analytics for  Scene 7 video viewer
   * @param {string} event - the videoviewer event
   * @param {string} value - completion value of the video
   * @param {string} videoUrl - url of the video
   * @memberof VideoPlayer
   */
  sendAnalytics = (event, value, videoUrl) => {
    const { cms = {} } = this.props;
    const { videoName } = cms;

    if (!event) {
      return;
    }
    let evt = event.toLowerCase();
    if (evt === METADATA || !value || value === 100) {
      return;
    }

    if (evt === PLAY) {
      evt = START;
    } else if (evt === STOP) {
      evt = END;
    }
    const videoFileName = videoUrl.split('/').pop() || 'n/a';
    const computedVideoName = videoName || videoFileName;
    const eventAction = evt === MILESTONE ? `${value}% complete` : evt;
    this.props.gtmDataLayer.push({
      event: 'videoEvents',
      eventCategory: 'video',
      eventAction,
      eventLabel: computedVideoName.toLowerCase()
    });
  };
  /**
   * Analytics for   Scene 7 video viewer ends
   */

  /**
   * Intialize video viewer once the video viewer script is loaded
   */
  loadVideoViewer = (videoImage, videoUrl) => {
    this.videoViewer = new window.s7viewers.VideoViewer();
    this.videoViewer.setContainerId('videoPlayer');
    this.videoViewer.setVideo(videoUrl, {
      posterimage: videoImage
    });
    this.videoViewer.setHandlers({
      trackEvent: (objID, compClass, instName, timeStamp, eventInfo) => {
        const evt = eventInfo.split(',');
        this.sendAnalytics(evt[0], evt[1], videoUrl);
      }
    });
    this.videoViewer.init();
  };

  /* To check if URL is a youtube URL */
  checkIfYouTubeLink(url) {
    return url.match(regExp);
  }

  /* If youtube URL,
  * then we need to change URL to match https://www.youtube.com/v/{videoId} in order to play it in <object />
  */

  changeYouTubeUrl(match) {
    if (match && match[7].length === 11) {
      return `https://www.youtube.com/embed/${match[7]}`;
    }
    return '';
  }

  render() {
    const { cms } = this.props;
    let { videoUrl } = cms;

    if (!videoUrl) {
      return null;
    }

    const isYouTubeUrl = this.checkIfYouTubeLink(videoUrl);

    if (isYouTubeUrl) {
      videoUrl = this.changeYouTubeUrl(isYouTubeUrl);
    }

    /* If its a Scene 7 url, use scene 7 player,
      * otherwise, <object />
    */
    return !isYouTubeUrl ? (
      <VideoWrapper id="videoPlayer" className="pb-3" />
    ) : (
      <VideoWrapper className="pb-3">
        <iframe title="videoPlayer" id="player" src={`${videoUrl}?enablejsapi=1`} frameBorder="0" allow="encrypted-media" allowFullScreen />
      </VideoWrapper>
    );
  }
}

VideoPlayer.propTypes = {
  cms: PropTypes.object,
  // onChangeEvent: PropTypes.func,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const VideoPlayerContainer = connect(mapStateToProps)(VideoPlayer);
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <VideoPlayerContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default VideoPlayerContainer;
