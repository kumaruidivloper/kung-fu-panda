import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import ProductVideoViewer from '../../../productVideoViewer/productVideoViewer.component';
import { CloseIcon, contentOverrideStyle, overlayStyleOverrides } from './styles';

const VideoViewerOverlay = ({ openPlayer, handleClose, videoAssetName, onChangeEvent }) => (
  <Modal isOpen={openPlayer} overlayClassName={overlayStyleOverrides} className={contentOverrideStyle} handleClose={handleClose}>
    <CloseIcon onClick={handleClose}>
      <span className="academyicon icon-x-circle" />
    </CloseIcon>
    <ProductVideoViewer onChangeEvent={onChangeEvent} autoPlay assetName={videoAssetName} />
  </Modal>
);

VideoViewerOverlay.propTypes = {
  openPlayer: PropTypes.bool,
  handleClose: PropTypes.func,
  onChangeEvent: PropTypes.func,
  videoAssetName: PropTypes.string
};

export default VideoViewerOverlay;
