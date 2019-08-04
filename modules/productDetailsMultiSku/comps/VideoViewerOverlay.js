import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@academysports/fusion-components/dist/Modal';
import VideoPlayer from '../../videoPlayer/videoPlayer.component';
import { CloseIcon, contentOverrideStyle } from '../../productMixedMedia/style';

const VideoViewerOverlay = ({ openPlayer, handleClose, videoUrl }) => (
  <Modal
    isOpen={openPlayer}
    modalContentClassName={contentOverrideStyle}
    handleClose={handleClose}
    closeIcon={
      <CloseIcon onClick={handleClose}>
        <span className="academyicon icon-x-circle" />
      </CloseIcon>
    }
  >
    <VideoPlayer
      cms={{
        videoUrl
      }}
    />
  </Modal>
);

VideoViewerOverlay.propTypes = {
  openPlayer: PropTypes.bool,
  handleClose: PropTypes.func,
  videoUrl: PropTypes.string
};

export default VideoViewerOverlay;
