import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import { hydrate } from 'emotion';
import PropTypes from 'prop-types';
import { BackgroundImage, MiddleImage, ForegroundImage, BoxWithText } from './comps';
import { NODE_TO_MOUNT, DATA_COMP_ID, VIEW_BREAK_WIDTH, DEFAULT_FOREGROUND_POSITION } from './constants';

class HeroImageVariant extends React.PureComponent {
  constructor() {
    super();
    // fix for super call coverage.
    /* istanbul ignore next */
    this.state = {
      viewWidth: ExecutionEnvironment.canUseDOM ? window.innerWidth : 500
    };
  }

  componentWillMount() {
    /* istanbul ignore else */
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('resize', this.handleWindowSizeChange);
    }
  }

  componentWillUnmount() {
    /* istanbul ignore else */
    if (ExecutionEnvironment.canUseDOM) {
      window.removeEventListener('resize', this.handleWindowSizeChange);
    }
  }

  // TODO: add debounce.
  handleWindowSizeChange = () => {
    /* istanbul ignore else */
    if (ExecutionEnvironment.canUseDOM) {
      this.setState({ viewWidth: window.innerWidth });
    }
  };

  render() {
    const { cms } = this.props;
    const { dimension83, name, id, position, creative } = cms;
    const { viewWidth } = this.state;
    const isMobile = viewWidth <= VIEW_BREAK_WIDTH;
    return (
      <BackgroundImage
        src={isMobile ? cms.mobileBackgroundImage : cms.desktopBackgroundImage}
        className="mb-3 mb-md-5 c-promo-impression-tracking hero-image-varient"
      >
        <MiddleImage
          src={isMobile ? cms.mobileMiddleImage : cms.desktopMiddleImage}
          position={cms.middleImagePosition}
          viewWidth={this.state.viewWidth}
        />
        <BoxWithText
          bgColor={cms.boxColor}
          eyebrow={cms.boxCategoryHeadline}
          position={cms.boxPosition}
          textColor={cms.textColor}
          headline={cms.boxValueMessagingHeadline}
          isH1={cms.isH1}
          messaging={cms.boxSubtext}
          ctaLabel={cms.ctaLabel}
          ctaTarget={cms.ctaTarget}
          enhancedEcomm={{ dimension83, name, id, position, creative }}
        />
        <ForegroundImage
          src={isMobile ? cms.mobileForegroundImage : cms.desktopForegroundImage}
          position={isMobile ? cms.mobileForegroundImagePosition : DEFAULT_FOREGROUND_POSITION}
          orientation={cms.foregroundImageOrientation}
        />
      </BackgroundImage>
    );
  }
}
HeroImageVariant.propTypes = {
  cms: PropTypes.object.isRequired
};
const withConnect = connect();
/* istanbul ignore if */
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    const compId = el.getAttribute(`${DATA_COMP_ID}`);
    const props = window.ASOData[compId];
    if (props.emotion) {
      hydrate(props.emotion);
    }
    const HeroImageVariantContainer = compose(withConnect)(HeroImageVariant);
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <HeroImageVariantContainer {...props} />
      </Provider>,
      el
    );
  });
}

export default withConnect(HeroImageVariant);
