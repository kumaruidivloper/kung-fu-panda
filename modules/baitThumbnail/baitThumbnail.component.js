import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import Responsive from 'react-responsive';
import styled, { css } from 'react-emotion';
import Modal from '@academysports/fusion-components/dist/Modal';
import { THUMBNAIL_PRESET, MAGNIFIER_CONFIG_DESKTOP, MAGNIFIER_CONFIG_MOBILE, DEVICE_DEFAULT, DEVICE_MOBILE } from './constants';
import { UERY_ZOOM_PRESET, UERY_ZOOM_PRESET_MOBILE } from '../../utils/dynamicMediaUtils';

const ImageWrapper = styled('div')``;

const modalContentOverrideMobile = css`
  max-height: 100% !important;
`;
class BaitThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false
    };
    this.toggleHandler = this.toggleHandler.bind(this);
  }
  toggleHandler() {
    this.setState({ isClicked: !this.state.isClicked });
  }

  render() {
    const { isClicked } = this.state;
    const { imageURL } = this.props;
    const { smallImage, largeImage, ...rest } = MAGNIFIER_CONFIG_DESKTOP;
    const magnifierConfigDesktop = {
      smallImage: {
        ...smallImage,
        src: `${imageURL}${THUMBNAIL_PRESET}`
      },
      largeImage: {
        ...largeImage,
        src: `${imageURL}${UERY_ZOOM_PRESET}`
      },
      ...rest
    };
    const { msmallImage, mlargeImage } = MAGNIFIER_CONFIG_MOBILE;
    const magnifierConfigMobile = {
      smallImage: {
        ...msmallImage,
        src: `${imageURL}${THUMBNAIL_PRESET}`
      },
      largeImage: {
        ...mlargeImage,
        src: `${imageURL}${UERY_ZOOM_PRESET_MOBILE}`
      }
    };
    return (
      <Fragment>
        <Responsive minWidth={DEVICE_DEFAULT}>
          <ReactImageMagnify {...magnifierConfigDesktop} />
        </Responsive>
        <Responsive maxWidth={DEVICE_MOBILE}>
          <ImageWrapper onClick={this.toggleHandler}>
            <ReactImageMagnify {...magnifierConfigMobile} />
            <Modal role="dialog" modalContentClassName={modalContentOverrideMobile} handleClose={this.toggleHandler} isOpen={isClicked}>
              <ReactImageMagnify {...magnifierConfigMobile} toggleHandler={isClicked} />
            </Modal>
          </ImageWrapper>
        </Responsive>
      </Fragment>
    );
  }
}

BaitThumbnail.propTypes = {
  imageURL: PropTypes.string,
  isModalOpen: PropTypes.bool
};

export default BaitThumbnail;
