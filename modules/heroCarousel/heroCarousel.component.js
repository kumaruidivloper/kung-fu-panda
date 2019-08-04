import Swiper from 'react-id-swiper';
import { css } from 'react-emotion';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Provider, connect } from 'react-redux';

import HeroImage from '../heroImage/heroImage.component';
// import HigherOrder from '../higherOrder/higherOrder.component';

import { NODE_TO_MOUNT, DATA_COMP_ID, ARROW_RIGHT, ARROW_LEFT } from './constants';
import media from '../../utils/media';

const sliderContainer = css`
  min-width: 100px;
  min-height: 100px;
  background-color: black;
  position: relative;
  .dark {
    .swiper-pagination-bullet {
      padding: 5px;
      opacity: 0.5;
      color: #ffffff;
      background: #fff;
      margin: 0 10px;
    }
    .swiper-pagination-bullet-active {
      opacity: 1;
      color: #ffffff;
    }
  }
  .slick-dots {
    bottom: 24px;
    li {
      button:before {
        color: #ffffff;
      }
      &.slick-active button:before {
        color: #ffffff;
      }
    }
  }
`;

function onEnterFireOnClick(onClick) {
  return e => {
    if (e.keyCode === 13) {
      onClick();
    }
  };
}

const arrowBase = css`
  display: none;

  @media (min-width: 992px) {
    width: 60px;
    height: 70px;
    background-color: rgba(0, 0, 0, 0.1);
    font-size: 0;
    line-height: 0;
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    transform: translate(0, -50%);
    cursor: pointer;
  }
`;
const arrowBaseNext = css`
  right: 0px;
  left: auto;
`;
const arrowBasePrev = css`
  left: 0px;
  z-index: 1;
`;
const arrowNext = css`
  width: 23px;
  height: 23px;
  transform: rotate(-315deg);
  border-right: solid 2px #ffffff;
  border-top: solid 2px #ffffff;
`;

const arrowPrev = css`
  width: 23px;
  height: 23px;
  transform: rotate(-315deg);
  border-left: solid 2px #ffffff;
  border-bottom: solid 2px #ffffff;
`;

const PrevArrow = (props = {}) => {
  const { onClick } = props;
  return (
    <button
      aria-label="heroCarousel-left-arrow"
      className={classNames(arrowBase, arrowBasePrev, 'swiper-button-prev')}
      tabIndex={0}
      onFocus={() => {}}
      onClick={onClick}
      onKeyPress={onEnterFireOnClick(onClick)}
      data-auid="heroCarousel-left"
    >
      <div className={arrowPrev} />
    </button>
  );
};

const getPaddings = (topPadding, bottomPadding) => {
  let cssValue;
  if (bottomPadding) {
    cssValue = css`
      margin-top: ${topPadding}px;
      margin-bottom: ${bottomPadding}px;
      ${media.sm`
        margin-top: ${topPadding / 2}px;
        margin-bottom: ${bottomPadding / 2}px;
      `};
    `;
  } else {
    cssValue = css`
      margin-top: auto;
      margin-bottom: auto;
    `;
  }
  return cssValue;
};

PrevArrow.propTypes = {
  onClick: PropTypes.func
};

const NextArrow = (props = {}) => {
  const { onClick } = props;
  return (
    <button
      aria-label="heroCarousel-right-arrow"
      className={classNames(arrowBase, arrowBaseNext, 'swiper-button-next')}
      tabIndex={0}
      onFocus={() => {}}
      onClick={onClick}
      onKeyPress={onEnterFireOnClick(onClick)}
      data-auid="heroCarousel-right"
    >
      <div className={arrowNext} />
    </button>
  );
};

NextArrow.propTypes = {
  onClick: PropTypes.func
};

// @HigherOrder('herocarouselTarget')
class HeroCarousel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.swiper = React.createRef();
    this.heroPanelList = this.heroPanelList.bind(this);
    this.onClickAnalytics = this.onClickAnalytics.bind(this);
    this.handleSliderFocus = this.handleSliderFocus.bind(this);
    this.handleSliderBlur = this.handleSliderBlur.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goPrev = this.goPrev.bind(this);
  }

  componentDidMount() {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    const heroCarouselContainer = document.getElementsByClassName('swiper-container-hero-carousel')[0];
    if (heroCarouselContainer) {
      heroCarouselContainer.addEventListener('focusin', this.handleSliderFocus);
      heroCarouselContainer.addEventListener('focusout', this.handleSliderBlur);
      heroCarouselContainer.addEventListener('mouseenter', this.handleSliderFocus);
      heroCarouselContainer.addEventListener('mouseleave', this.handleSliderBlur);
    }
  }
  componentWillUnmount() {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    const heroCarouselContainer = document.getElementsByClassName('swiper-container-hero-carousel')[0];
    if (heroCarouselContainer) {
      heroCarouselContainer.removeEventListener('focusin', this.handleSliderFocus);
      heroCarouselContainer.removeEventListener('focusout', this.handleSliderBlur);
      heroCarouselContainer.removeEventListener('mouseenter', this.handleSliderFocus);
      heroCarouselContainer.removeEventListener('mouseleave', this.handleSliderBlur);
    }
  }

  /**
   * updating analytics
   * @param  {} evtAction The event name
   * @param  {} evtLabel The label name
   */

  onClickAnalytics(evtAction, evtLabel) {
    this.props.gtmDataLayer.push({
      event: 'heroBannerActions',
      eventCategory: 'hero banner',
      eventAction: `${evtAction && evtAction.toLowerCase()}`,
      eventLabel: `${evtLabel && evtLabel.toLowerCase()}`
    });
  }

  /**
   * Trigger next slide call
   * @param {string} next - Next label
   * @param {string} heading - Product label
   */
  goNext() {
    const { swiper } = this.swiper.current;
    const { carouselPanel } = this.props.cms;

    const index = swiper.activeIndex < carouselPanel.length ? swiper.activeIndex : swiper.activeIndex % carouselPanel.length;
    this.onClickAnalytics(`${ARROW_RIGHT}`, carouselPanel[index].headline);
    if (swiper) swiper.slideNext();
  }

  /**
   * Trigger previous slide call
   * @param {string} prev - Previous label
   * @param {string} heading - Product label
   */
  goPrev() {
    const { swiper } = this.swiper.current;
    const { carouselPanel } = this.props.cms;

    let index;

    if (carouselPanel.length === 3) {
      index = (swiper.activeIndex + 1) % 3;
    } else if (carouselPanel.length === 4) {
      index = (swiper.activeIndex + 2) % 4;
    } else {
      index = swiper.activeIndex % carouselPanel.length;
    }

    this.onClickAnalytics(`${ARROW_LEFT}`, carouselPanel[index].headline);
    if (swiper) swiper.slidePrev();
  }

  heroPanelList() {
    const { cms } = this.props;
    const { dimension83, name, id, position, creative, height } = cms;
    return cms.carouselPanel.map((heroPanel, index) => {
      const auid = `HP_HC_A_${index}`;
      const heroPanelProps = {
        auid,
        carousel: true
      };
      const enhancedEcomProps = { id, name, dimension83, position, creative };
      heroPanelProps.cms = {
        ...{ enhancedEcomProps },
        ...heroPanel,
        ...{ height },
        isAuthoring: this.props.cms.isAuthoring
      };
      return (
        <div className="swiper-slide">
          <HeroImage key={new Date().getTime()} {...heroPanelProps} />
        </div>
      );
    });
  }

  // Focus event handler for carousel
  handleSliderFocus() {
    this.swiper.current.swiper.autoplay.stop();
  }

  /**
   * Handles component blur
   * @param {object} e - Event object
   */
  handleSliderBlur(e) {
    const { currentTarget } = e;

    // Wait to complete any react events
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.swiper.current.swiper.autoplay.start();
      }
    }, 0);
  }

  render() {
    const settings = {
      spaceBetween: 0,
      slidesPerView: 1,
      containerClass: 'swiper-container swiper-container-hero-carousel',
      loop: true,
      speed: 500,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      on: {
        paginationRender: () => {
          const elems = [...document.querySelectorAll('.swiper-container-hero-carousel .swiper-pagination-bullet')];
          elems.forEach((elem, index) => {
            elem.addEventListener(
              'click',
              () => {
                this.onClickAnalytics(`carousel indicator ${index + 1}`, this.props.cms.carouselPanel[index].headline);
              },
              { passive: true }
            );
          });
        }
      },
      pagination: {
        el: '.swiper-pagination.dark',
        clickable: true
      }
    };

    const { bottomPadding, topPadding } = this.props.cms;
    const componentPaddings = getPaddings(topPadding, bottomPadding);
    return (
      <div className={classNames(sliderContainer, 'heroCarouselContainer', 'c-promo-impression-tracking', `${componentPaddings}`)}>
        <Swiper {...settings} ref={this.swiper}>
          {this.heroPanelList()}
        </Swiper>
        <NextArrow onClick={this.goNext} />
        <PrevArrow onClick={this.goPrev} />
      </div>
    );
  }
}

HeroCarousel.propTypes = {
  cms: PropTypes.shape({
    carouselPanel: PropTypes.array,
    heading: PropTypes.string,
    isAuthoring: PropTypes.string,
    height: PropTypes.string,
    bottomPadding: PropTypes.string,
    topPadding: PropTypes.string
  }),
  gtmDataLayer: PropTypes.array
};
const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});
const HeroCarouselContainer = connect(mapStateToProps)(HeroCarousel);
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <HeroCarouselContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default HeroCarouselContainer;
