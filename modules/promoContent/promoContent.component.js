import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, connect } from 'react-redux';

import Link from '@academysports/fusion-components/dist/Link';
// import PubSub from '../../utils/PubSub';
import {
  StyledPromoContainer,
  AnchorLinkDiv,
  PromoBanner,
  PromoImage,
  PromoBannerMobileImage,
  PromoHeadline,
  PromoDescription,
  detailsContainer
} from './style';

import { NODE_TO_MOUNT, DATA_COMP_ID, PROMO_BUTTON, PROMO_ANCHOR, PROMO_IMAGE } from './constants';
import { enhancedAnalyticsPromoClick } from '../../utils/analytics';
/**
 * render promoContent component
 * @class PromoContent
 * @extends {React.PureComponent}
 */
class PromoContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getHeight = this.getHeight.bind(this);
    this.heightArr = [];
    this.impressed = false;
    const { facet } = this.props.pageInfo || {};
    this.state = {
      maxHeight: 'auto',
      hasFacets: !!facet
    };
    // this.handleWindowScroll = this.handleWindowScroll.bind(this);
    // this.elementInViewport = this.elementInViewport.bind(this);
  }
  /**
   * get the the max height among all detailsContainer
   * @memberof PromoContent
   */
  componentDidMount() {
    const { maxHeight } = this.state;
    if (maxHeight === 'auto') {
      this.getMaxHeight();
    }
  }
  /**
   * push the analytics on click of promo link
   * redirect to the target url
   * @param {object} e - the event object
   * @param {string} headline - headline of the each promo card
   * @param {string} link - target path of each promo card
   * @memberof PromoContent
   */
  onClickGoTo(e, headline, link) {
    e.preventDefault();
    const { cms, gtmDataLayer } = this.props;
    const { label, url } = link;
    if (gtmDataLayer) {
      const eventURL = link && link.url && link.url.split('?')[0];
      enhancedAnalyticsPromoClick(gtmDataLayer, cms, eventURL.toLowerCase());
      gtmDataLayer.push({
        event: 'promoActions',
        eventCategory: 'promo actions',
        eventAction: (label ? `click-${label}` : 'click').toLowerCase(),
        eventLabel: (headline ? `${headline}` : eventURL || 'n/a').toLowerCase()
      });
    }
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = `${url}`;
    }
  }
  /**
   * get the height of the refrenced dom element
   * pushing the height of the referenced dom element in an array
   * @param {domelement} ele - referenced dom element
   * @memberof PromoContent
   */
  getHeight(ele) {
    if (ele) {
      const rect = ele.getBoundingClientRect();
      this.heightArr.push(rect.height);
    }
  }
  /**
   * calculate the max height
   * @memberof PromoContent
   */
  getMaxHeight() {
    this.setState({
      maxHeight: `${Math.max(...this.heightArr)}px`
    });
  }

  // /**
  //  * Function to check whether the specific element is in the view port
  //  * @param {object} el - HTML element
  //  */
  // elementInViewport(el) {
  //   let element = el;
  //   let top = element.offsetTop;
  //   let left = element.offsetLeft;
  //   const width = element.offsetWidth;
  //   const height = element.offsetHeight;

  //   while (element.offsetParent) {
  //     element = element.offsetParent;
  //     top += element.offsetTop;
  //     left += element.offsetLeft;
  //   }

  //   return (
  //     top < window.pageYOffset + window.innerHeight &&
  //     left < window.pageXOffset + window.innerWidth &&
  //     top + height > window.pageYOffset &&
  //     left + width > window.pageXOffset
  //   );
  // }

  /**
   * Handler for listening the scroll event
   */
  // handleWindowScroll() {
  //   const { gtmDataLayer, cms } = this.props;
  //   const compEle = document.getElementsByClassName('promo-content');
  //   const elementInViewport = this.elementInViewport(compEle[0]);
  //   if (elementInViewport && gtmDataLayer && !this.impressed) {
  //     enhancedAnalyticsPromoImpression(gtmDataLayer, cms);
  //     this.impressed = true;
  //   } else if (!elementInViewport && this.impressed) {
  //     this.impressed = false;
  //   }
  // }
  /**
   * push analytics on promo image click
   * redirect to the target path
   * @param {object} e - the event object
   * @param {string} link - target url of promo image
   * @memberof PromoContent
   */
  clickableImage(e, headline, link) {
    e.preventDefault();
    const { cms, gtmDataLayer } = this.props;
    const eventURL = link && link.imageUrl && link.imageUrl.split('?')[0];
    if (gtmDataLayer) {
      enhancedAnalyticsPromoClick(gtmDataLayer, cms, eventURL.toLowerCase());
      gtmDataLayer.push({
        event: 'PromoContent',
        eventCategory: 'promo image click',
        eventAction: 'click',
        eventLabel: (headline ? `${headline}` : eventURL || 'n/a').toLowerCase()
      });
    }
    if (ExecutionEnvironment.canUseDOM) {
      window.location = `${link.imageUrl}`;
    }
  }

  render() {
    const { cms } = this.props;
    const { promoContent } = cms;
    const { maxHeight } = this.state;
    const spacingClass = cms.padding === 'yes' ? '' : 'px-0';
    const ctaLength = promoContent.length;
    const colClass = `col-lg-${12 / ctaLength}`;
    if (this.state.hasFacets) {
      return null;
    }
    return (
      <div className={`container mb-half mb-md-3 ${StyledPromoContainer}`}>
        <div className="c-promo-impression-tracking row promo-content" data-auid={cms.auid}>
          {promoContent.map((promo, id) => {
            const { desktopImage, mobileImage, headline, subText, imageAltText, cta } = promo;
            return (
              <div
                key={promo}
                data-auid={`${PROMO_IMAGE}-${id}`}
                className={`d-flex flex-column text-center promo-content-wrapper pb-2 pb-md-0 col-xs-12 col-sm-6 ${colClass} ${spacingClass}`}
              >
                <a
                  href={promo.imageUrl}
                  className={`${PromoBanner} ${PromoBannerMobileImage(mobileImage)}`}
                  aria-label={`${PROMO_IMAGE} ${id}`}
                  onClick={e => this.clickableImage(e, headline, promo)}
                >
                  <img src={desktopImage} alt={imageAltText} className={`w-100 ${PromoImage}`} />
                </a>
                <div className="content d-flex flex-column flex-grow-1 w-100 align-items-center pt-1 px-0">
                  <div ref={div => this.getHeight(div)} className={`w-100 ${detailsContainer(maxHeight)}`}>
                    <h6 aria-level="6" className={`${PromoHeadline} text-uppercase`}>
                      {headline}
                    </h6>
                    <div className={`${PromoDescription} d-flex o-copy__16reg pb-2 justify-content-center`}>{subText}</div>
                  </div>
                  <div
                    className={`d-flex ${ctaLength === 4 ? 'flex-column justify-content-start' : 'w-100 flex-row justify-content-center'} flex-wrap`}
                  >
                    {cta.map(
                      (link, index) =>
                        link.type === 'button' ? (
                          <Link
                            href={link.url}
                            key={link}
                            size="S"
                            auid={`${PROMO_BUTTON}-${id}-${index}`}
                            onClick={e => this.onClickGoTo(e, headline, link)}
                            btntype="secondary"
                            btnvariant="secondary"
                            className="d-flex justify-content-center align-items-center mb-1 mx-half"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-auid={`${PROMO_ANCHOR}-${id}-${index}`}
                            atype="icontext"
                            className={`${AnchorLinkDiv} o-copy__14reg d-flex justify-content-center align-items-center mx-half mb-1`}
                          >
                            <span className="align-middle mr-half">{link.label}</span>
                            <span>
                              <span className="caret-color align-middle academyicon icon-chevron-right" />
                            </span>
                          </a>
                        )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
PromoContent.propTypes = {
  cms: PropTypes.object,
  pageInfo: PropTypes.object,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const PromoContentContainer = connect(mapStateToProps)(PromoContent);
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <PromoContentContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default PromoContentContainer;
