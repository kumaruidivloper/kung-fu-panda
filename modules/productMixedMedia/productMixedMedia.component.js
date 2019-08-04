import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Responsive from 'react-responsive';
import ReactImageMagnify from 'react-image-magnify';
import { Link, Element } from 'react-scroll';
import { connect } from 'react-redux';
import Modal from '@academysports/fusion-components/dist/Modal';
import ProductMixedMediaCarousel from './components/carousel/productMixedMediaCarousel';
import ProductMixedMediaSlider from './components/slider/productMixedMediaSlider';
import { printBreadCrumb } from '../../utils/breadCrumb';
import Swatches from '../swatches/swatches.component';
import {
  ProductMediaContainer,
  ProductMixedMediaStyle,
  AbsolutePosDiv,
  ImageContainerDiv,
  ImageContainerDivModal,
  ImageDiv,
  PlayButton,
  PlayIcon,
  modalContentOverride,
  modalContentOverrideMobile,
  CloseIcon,
  ModalHeader,
  ModalContent,
  ModalWrapper,
  BackIcon,
  HeaderText,
  zoomModal,
  scrollContainer,
  FixedPositioned,
  swatchStyle,
  swatchActiveStyle,
  swatchStyleMin
} from './style';
import VideoOverlayViewer from './components/videoOverlayViewer';
import {
  MAGNIFIER_CONFIG,
  SWATCH_MIN_DISPLAY,
  SWATCH_MODAL_MAX_DISPLAY,
  SWATCH_SLIDER_MIN,
  DEVICE_MOBILE,
  SWATCH_DEFAULT_BOX_SIZE,
  SLIDER_HEIGHT,
  SLIDER_WIDTH,
  SLIDE_INTERVAL,
  DEVICE_DEFAULT,
  SWATCH_EXIST,
  SCROLL_OFFSET
} from './constants';
import { UERY_ZOOM_PRESET, DEFAULT_PRESET, ZOOM_MODAL_PRESET } from '../../utils/dynamicMediaUtils';

class ProductMixedMedia extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: this.props.swatchImgList && this.props.swatchImgList[0],
      isClicked: false,
      absPosition: 0,
      enableScrollSpy: true
    };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.imageClickHandler = this.imageClickHandler.bind(this);
    this.closeIconHandler = this.closeIconHandler.bind(this);
    this.sliderPosition = this.sliderPosition.bind(this);
    this.onClickMixedmediaThumbnailGA = this.onClickMixedmediaThumbnailGA.bind(this);
    this.onClickMixedmediaVideoGA = this.onClickMixedmediaVideoGA.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.attachWindowResizeEvent = this.attachWindowResizeEvent.bind(this);
    this.removeWindowResizeEvent = this.removeWindowResizeEvent.bind(this);
  }

  componentDidMount() {
    this.attachWindowResizeEvent();
  }

  componentWillReceiveProps(nextProps) {
    // if we have swatchImgList in nextProps but none for this.props then we'll use nextProps
    if (nextProps.swatchImgList && nextProps.swatchImgList[0].imageURL && !this.props.swatchImgList) {
      return this.setState({
        selectedItem: nextProps.swatchImgList[0]
      });
    }
    if (nextProps.swatchImgList && nextProps.swatchImgList[0].imageURL !== this.props.swatchImgList[0] && this.props.swatchImgList[0].imageURL) {
      return this.setState({
        selectedItem: nextProps.swatchImgList[0]
      });
    }
    return null;
  }

  componentWillUnmount() {
    this.removeWindowResizeEvent();
  }

  /**
   * Main Image click handler
   * Open modal if it's not of gift card type
   */
  /** Analytics for MixedMedia Thumbnail begins */
  onClickMixedmediaThumbnailGA(product) {
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|mixed media|thumbnail pic',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }
  /** Analytics for MixedMedia Thumbnail ends */
  /** Analytics for MixedMedia VideoPlayerclick  begins */
  onClickMixedmediaVideoGA(product) {
    this.props.gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|mixed media|thumbnail video',
      eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
    });
  }
  /** Analytics for MixedMedia VideoPlayer click ends */
  onEnterFireOnClick(onClick) {
    return e => {
      if (e.nativeEvent.keyCode === 13) {
        onClick();
      }
    };
  }

  /* **** On window resize kill the scroll spy ***** */
  onWindowResize() {
    this.temporarilyKillScrollSpy();
  }
  /* **** Attaching window resize event ***** */
  attachWindowResizeEvent() {
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('resize', this.onWindowResize);
    }
  }
  /* **** Detaching window resize event ***** */
  removeWindowResizeEvent() {
    if (ExecutionEnvironment.canUseDOM) {
      window.removeEventListener('resize', this.onWindowResize);
    }
  }
  /* **** Killing the scroll spy event ***** */
  temporarilyKillScrollSpy() {
    const token = Math.floor(Math.random() * 1e16);
    this.renableScrollSpyToken = token;
    this.setState({ enableScrollSpy: false }, () => {
      setTimeout(() => {
        if (ExecutionEnvironment.canUseDOM && window.innerWidth >= DEVICE_DEFAULT && this.renableScrollSpyToken === token) {
          // re-enable scroll spy
          this.setState({ enableScrollSpy: true });
        }
      }, 200);
    });
  }

  imageClickHandler() {
    const { isGiftCard } = this.props;
    if (isGiftCard !== 'Y') {
      this.setState({ isClicked: true });
    }
  }
  closeIconHandler() {
    const { swatchImgList } = this.props;
    this.setState({ isClicked: false, absPosition: 0, selectedItem: swatchImgList[0] });
  }
  /* Analytics for Video Viewer begins */
  sendAnalytics = (event, value) => {
    const { gtmDataLayer, videoAssetName } = this.props;
    const eventAction = event === 'MILESTONE' ? `${value}% complete` : event.toLowerCase();
    gtmDataLayer.push({
      event: 'videoEvents',
      eventCategory: 'video',
      eventAction,
      eventLabel: videoAssetName
    });
  };
  /* Analytics for Video Viewer ends */
  handleOnClick(selected) {
    const { productItem } = this.props;
    this.setState({ selectedItem: selected });
    this.onClickMixedmediaThumbnailGA(productItem);
  }

  sliderPosition(selectedItem, position) {
    this.setState({ selectedItem, absPosition: position });
  }

  playVideo = () => {
    const { productItem } = this.props;
    this.setState({ playVideo: true });
    this.onClickMixedmediaVideoGA(productItem);
  };

  closeVideoPlayer = () => this.setState({ playVideo: false });

  isSwatchesLengthGreaterThan = n => this.props.swatchImgList && this.props.swatchImgList.length > n;

  renderVideoModal = () => {
    const { videoAssetName } = this.props;
    const { playVideo } = this.state;
    return (
      <Fragment>
        {videoAssetName && (
          <Fragment>
            <PlayButton role="button" tabIndex="0" onClick={this.playVideo} onKeyDown={this.playVideo} data-auid="HVB_heroVideoComponent">
              <PlayIcon>
                <svg width="24px" height="24px" viewBox="0 0 160 160" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <path
                      d="M61.5777973,37.8267406 L122.085709,79.1978208 C122.541615,79.5095379 122.658504,80.1318199 122.346787,80.5877266 C122.276718,80.6902071 122.188179,80.7787446 122.085698,80.8488123 L61.5792769,122.217713 C61.1233662,122.529424 60.5010857,122.412527 60.1893746,121.956616 C60.075699,121.790354 60.0148776,121.59364 60.014874,121.392231 L60.0133836,38.6522507 C60.0133736,38.0999659 60.4610808,37.6522426 61.0133656,37.6522326 C61.2147908,37.652229 61.4115223,37.7130534 61.5777973,37.8267406 Z M80,149.333333 C41.7706667,149.333333 10.6666667,118.229333 10.6666667,80 C10.6666667,41.7706667 41.7706667,10.6666667 80,10.6666667 C118.229333,10.6666667 149.333333,41.7706667 149.333333,80 C149.333333,118.229333 118.229333,149.333333 80,149.333333 M80,0 C35.8186667,0 0,35.8186667 0,80 C0,124.181333 35.8186667,160 80,160 C124.192,160 160,124.181333 160,80 C160,35.8186667 124.192,0 80,0"
                      id="path-1"
                    />
                  </defs>
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Icon/UI/Video/Outlined">
                      <g id="color/gray">
                        <mask id="mask-2" fill="white">
                          <use xlinkHref="#path-1" />
                        </mask>
                        <use id="Mask" fill="#0055a6" xlinkHref="#path-1" />
                        <g id="color/white/white" mask="url(#mask-2)">
                          <g transform="translate(-86.666667, -86.666667)" id="BG">
                            <rect x="0" y="0" width="333" height="333" />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </PlayIcon>
              <span>See it in Action</span>
            </PlayButton>
            <VideoOverlayViewer
              onChangeEvent={this.sendAnalytics}
              handleClose={this.closeVideoPlayer}
              openPlayer={playVideo}
              videoAssetName={videoAssetName}
            />
          </Fragment>
        )}
      </Fragment>
    );
  };
  renderDesktopFullScreenImgView = () => {
    const { auid = 'PDP_PMM', swatchImgList, name } = this.props;
    const { absPosition, isClicked, selectedItem } = this.state;
    const swatchProps = {
      swatchList: swatchImgList
    };
    const { imageURL } = selectedItem;
    const { smallImage, largeImage, ...rest } = MAGNIFIER_CONFIG;
    const magnifierConfig = {
      smallImage: {
        ...smallImage,
        src: `${imageURL}${DEFAULT_PRESET}`
      },
      largeImage: {
        ...largeImage,
        src: `${imageURL}${UERY_ZOOM_PRESET}`
      },
      ...rest
    };
    return (
      <Responsive minWidth={DEVICE_DEFAULT}>
        {!isClicked && (
          <AbsolutePosDiv>
            {this.isSwatchesLengthGreaterThan(SWATCH_MIN_DISPLAY) && this.isSwatchesLengthGreaterThan(SWATCH_SLIDER_MIN) ? (
              <ProductMixedMediaSlider
                swatchProps={swatchProps}
                swatchImgList={swatchImgList}
                height={SLIDER_HEIGHT}
                images={swatchImgList}
                width={SLIDER_WIDTH}
                imageInterval={SLIDE_INTERVAL}
                maxImage={SWATCH_SLIDER_MIN}
                absPosition={absPosition}
                sliderPosition={this.sliderPosition}
              />
            ) : (
              this.isSwatchesLengthGreaterThan(SWATCH_MIN_DISPLAY) && (
                <Swatches
                  cms={swatchProps}
                  inline
                  boxSize={SWATCH_DEFAULT_BOX_SIZE}
                  handleSwatchClick={this.handleOnClick}
                  default={selectedItem}
                  aria-label={selectedItem}
                  auid={`${auid}_SW`}
                />
              )
            )}
            <ImageContainerDiv
              onClick={this.imageClickHandler}
              role="button"
              tabIndex="0"
              onKeyPress={this.onEnterFireOnClick(this.imageClickHandler)}
              data-auid="PDP_MediaClick"
              aria-label={name}
            >
              <ReactImageMagnify {...magnifierConfig} />
            </ImageContainerDiv>
          </AbsolutePosDiv>
        )}
        <Modal modalContentClassName={modalContentOverride} closeIcon={false} isOpen={isClicked} handleClose={this.closeIconHandler}>
          <ModalWrapper>
            <ModalHeader>
              <BackIcon className="academyicon icon-chevron-left" onClick={this.closeIconHandler} data-auid="PDP_Modal_backIcon" />
              <HeaderText data-auid="PDP_headerText">{name}</HeaderText>
            </ModalHeader>
            <ModalContent>
              {!!this.state.enableScrollSpy && (
                <Fragment>
                  {this.isSwatchesLengthGreaterThan(SWATCH_MIN_DISPLAY) && this.isSwatchesLengthGreaterThan(SWATCH_MODAL_MAX_DISPLAY) ? (
                    <FixedPositioned className="col-md-2 p-0">
                      {swatchImgList.map(item => (
                        <Link
                          href={item.imageURL}
                          className={`mb-1 ${swatchStyleMin}`}
                          activeClass={swatchActiveStyle}
                          to={`scrollableLink-${item.itemId}`}
                          offset={SCROLL_OFFSET}
                          spy={this.state.enableScrollSpy}
                          smooth
                          duration={250}
                          containerId="scrollableImageContainer"
                          key={item.imageURL}
                        >
                          <img src={item.thumbnail} alt={item.text} />
                        </Link>
                      ))}
                    </FixedPositioned>
                  ) : (
                    this.isSwatchesLengthGreaterThan(SWATCH_MIN_DISPLAY) && (
                      <FixedPositioned className="col-md-2 p-0">
                        {swatchImgList.map(item => (
                          <Link
                            href={item.imageURL}
                            className={`mb-2 ${swatchStyle}`}
                            activeClass={swatchActiveStyle}
                            to={`scrollableLink-${item.itemId}`}
                            offset={SCROLL_OFFSET}
                            spy={this.state.enableScrollSpy}
                            smooth
                            duration={250}
                            containerId="scrollableImageContainer"
                            key={item.imageURL}
                          >
                            <img src={item.thumbnail} alt={item.text} />
                          </Link>
                        ))}
                      </FixedPositioned>
                    )
                  )}
                </Fragment>
              )}

              <CloseIcon onClick={this.closeIconHandler} data-auid="PDP_Modal_closeIcon">
                <span className={`academyicon icon-close ${zoomModal}`} />
              </CloseIcon>
              <Element name="scrollableImageContainer" className={`col-md-10 p-0 ${scrollContainer}`} id="scrollableImageContainer">
                {swatchImgList.map(item => (
                  <Element name={`scrollableLink-${item.itemId}`}>
                    <ImageDiv onClick={this.closeIconHandler} key={item.imageURL} className="col-10">
                      <ImageContainerDivModal src={`${item.imageURL}${ZOOM_MODAL_PRESET}`} alt={name} data-auid="PDP_Media_Modal" />
                    </ImageDiv>
                  </Element>
                ))}
              </Element>
            </ModalContent>
          </ModalWrapper>
        </Modal>
      </Responsive>
    );
  };
  renderMobileFullScreenImgView = () => {
    const { swatchImgList } = this.props;
    const { isClicked } = this.state;
    return (
      <Responsive maxWidth={DEVICE_MOBILE}>
        <ProductMediaContainer>
          {this.isSwatchesLengthGreaterThan(SWATCH_EXIST) && (
            <ProductMixedMediaCarousel productList={swatchImgList} imageMobile={this.imageMobile} imageClickHandler={this.imageClickHandler} />
          )}
          <Modal modalContentClassName={modalContentOverrideMobile} handleClose={this.closeIconHandler} isOpen={isClicked}>
            <ProductMixedMediaCarousel
              productList={swatchImgList}
              imageClickHandler={this.imageClickHandler}
              closeIconHandler={this.closeIconHandler}
            />
          </Modal>
        </ProductMediaContainer>
      </Responsive>
    );
  };
  render() {
    const { swatchImgList } = this.props;
    if (!swatchImgList) {
      return null;
    }
    return (
      <ProductMixedMediaStyle>
        {this.renderDesktopFullScreenImgView()}
        {this.renderMobileFullScreenImgView()}
        {this.renderVideoModal()}
      </ProductMixedMediaStyle>
    );
  }
}

ProductMixedMedia.propTypes = {
  auid: PropTypes.string,
  productItem: PropTypes.object,
  swatchImgList: PropTypes.array,
  videoAssetName: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  isGiftCard: PropTypes.string,
  name: PropTypes.string
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

export default connect(mapStateToProps)(ProductMixedMedia);
