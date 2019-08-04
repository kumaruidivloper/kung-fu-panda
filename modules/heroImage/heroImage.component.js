import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'emotion';
import { withErrorBoundary } from '@react-nitro/error-boundary';
import Link from '@academysports/fusion-components/dist/Link';
// import { compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { enhancedAnalyticsPromoClick } from '../../utils/analytics';
import HigherOrder from '../higherOrder/higherOrder.component';

import {
  getHeight,
  heroDiv,
  getBoxPosition,
  getTextAlignment,
  getWidth,
  eyebrowStyles,
  headlineStyle,
  subtext,
  legalText,
  legalLinkPosition,
  legalLinkStyles,
  AnchorStyles,
  ctabtn,
  ctalist,
  ctaBtnAlign,
  getFontSize,
  imageAnchorStyles,
  withoutCtaTextColor,
  getPaddings
} from './styles';

class HeroImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.analyticsData = this.analyticsData.bind(this);
    const { facet } = this.props.pageInfo || {};
    this.state = {
      hasFacets: !!facet
    };
  }
  /**
   * hero banner Analytics on Error page load
   * @memberof HeroImage
   */
  componentDidMount() {
    /* hero banner Analytics on Error page load */
    const { cms } = this.props;
    const pageLocation = ExecutionEnvironment.canUseDOM ? window.location.pathname : '';
    if (cms && (cms.isErrorPage || cms.isErrorPage === 'true')) {
      this.props.gtmDataLayer.push({
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: `page load error|${pageLocation}`,
        eventLabel: cms.headline && cms.headline.toLowerCase()
      });
    }
  }
  /**
   * legal link showing on heroImage Banner
   *
   * @param { string } text - text to be shown as legal link
   * @returns dom content for legallink
   * @memberof HeroImage
   */
  getLegaltext(text) {
    return <div className={`${cx('o-copy__12reg', `${legalText(this.props.cms.textColor)}`)}`}>{text}</div>;
  }

  isBackgroundImageCover() {
    const { backgroundImageCover, cms } = this.props;
    const { backgroundImageCover: cmsBackgroundImageCover } = cms || {};
    const hasCmsBackgroundImageCover = cmsBackgroundImageCover !== undefined && cmsBackgroundImageCover !== null;
    return hasCmsBackgroundImageCover ? cmsBackgroundImageCover : backgroundImageCover;
  }
  /**
   * buttons /link appears on heroImage banner
   * @returns returns button/anchor element
   * @memberof HeroImage
   */
  ctaButtonList() {
    const { cta, height, isErrorPage, ctaAlignment, headline, textColor } = this.props.cms;
    const ctaAlignmentLowerCase = ctaAlignment && ctaAlignment.toLowerCase();
    const auid = this.props.auid || 'HP_HI_A';
    const buttonSize = height === 'full' ? 'L' : 'M';
    if (Array.isArray(cta)) {
      return cta.map((ctaList, index) => {
        const anchorProps = {};
        if (ctaList.ctaTarget === '_blank') {
          anchorProps.rel = 'noopener noreferrer';
        }
        return ctaList.ctaPath && ctaList.ctaPath.length > 0 ? (
          <Fragment>
            {height === 'quarter' ? (
              <a
                className={`${cx('o-copy__14reg my-0 mb-1', `${AnchorStyles(textColor)}`, `${ctaBtnAlign(ctaAlignmentLowerCase)}`)}`}
                href={ctaList.ctaPath}
                target={ctaList.ctaTarget}
                key={ctaList.ctaText}
                onClick={e => this.analyticsData(e, ctaList, headline)}
                data-auid={`${auid}_${index}`}
                {...anchorProps}
              >
                {ctaList.ctaText} <span className="academyicon icon-chevron-right ml-half align-middle" />
              </a>
            ) : (
              <Link
                auid={`${auid}_${index}`}
                btnvariant="tertiary"
                size={buttonSize}
                btntype={isErrorPage && (isErrorPage === 'true' || isErrorPage === true) ? 'secondary' : 'primary'}
                className={`${cx('o-copy__16reg px-2 px-sm-3 mb-1', `${ctabtn}`, `${ctaBtnAlign(ctaAlignmentLowerCase)}`)}`}
                onClick={e => this.analyticsData(e, ctaList, headline)}
                href={ctaList.ctaPath}
                targt={ctaList.ctaTarget === '_blank' ? ctaList.ctaTarget : 'parent'}
                {...anchorProps}
              >
                {ctaList.ctaText}
              </Link>
            )}
          </Fragment>
        ) : (
          <Fragment>
            {height === 'quarter' ? (
              <span className={`o-copy__14reg my-0 mb-1 ${withoutCtaTextColor(textColor)} ${ctaBtnAlign(ctaAlignmentLowerCase)}`}>
                {ctaList.ctaText} <span className="academyicon icon-chevron-right ml-half align-middle" />
              </span>
            ) : (
              <Link
                auid={`${auid}_${index}`}
                btnvariant="tertiary"
                size={buttonSize}
                btntype={isErrorPage && (isErrorPage === 'true' || isErrorPage === true) ? 'secondary' : 'primary'}
                className={`${cx('o-copy__16reg px-2 px-sm-3 mb-1', `${ctabtn}`, `${ctaBtnAlign(ctaAlignmentLowerCase)}`)}`}
                onClick={e => this.analyticsData(e, ctaList, headline)}
                href={ctaList.ctaPath}
                targt={ctaList.ctaTarget === '_blank' ? ctaList.ctaTarget : 'parent'}
                {...anchorProps}
              >
                {ctaList.ctaText}
              </Link>
            )}
          </Fragment>
        );
      });
    }
    return null;
  }

  /**
   * pushes analytics data on ctaButton/ctalink click
   * navigates to target url on button/link click
   * @param { object } e
   * @param { string } ctaText
   * @param { string } ctaPath
   * @param { string } headlines
   * @param { string } ctaTarget
   * @memberof HeroImage
   */
  analyticsData(e, ctaDetails, headlines, isClickReq = true) {
    const { cms, gtmDataLayer } = this.props;
    const { ctaText, ctaPath, ctaTarget } = ctaDetails;
    /* istanbul ignore next */
    e.preventDefault();
    /* istanbul ignore next */
    const eventURL = ctaPath && ctaPath.toLowerCase();
    enhancedAnalyticsPromoClick(gtmDataLayer, cms, eventURL);
    /* hero banner Analytics on cta button click */
    gtmDataLayer.push({
      event: 'heroBannerActions',
      eventCategory: 'hero banner',
      eventAction: isClickReq ? `click - ${ctaText}`.toLowerCase() : ctaText.toLowerCase(),
      eventLabel: headlines ? `${headlines.toLowerCase()}` : (eventURL ? decodeURIComponent(eventURL).split('?')[0] : 'n/a').toLowerCase()
    });
    /* istanbul ignore next */
    if (ExecutionEnvironment.canUseDOM) {
      if (cms.isErrorPage) {
        const { referrer, location } = document;
        const relocateToUrl = referrer !== '' && referrer.indexOf(location.hostname) ? referrer : location.origin;
        window.location.href = relocateToUrl;
      } else if (ctaTarget && ctaTarget === '_blank') {
        const newWin = window.open(ctaPath, ctaTarget);
        newWin.opener = null;
      } else {
        window.location = `${ctaPath}`;
      }
    }
  }
  /**
   * checks if islink is coming from cms
   *
   * @param { object } cms - content coming from AEM data
   * @returns { boolean } islink
   * @memberof HeroImage
   */
  isanyctalink(cms) {
    let islink = false;
    if (cms && cms.cta && cms.cta.length > 0) {
      cms.cta.forEach(item => {
        if (item.ctaPath) {
          islink = true;
        }
      });
    }
    return islink;
  }
  /**
   * HeroImage main banner
   *
   * @param {Object} cms The content coming from AEM data
   * @returns Returns dom content for hero image
   * @memberof HeroImage
   */
  renderHeroImage(cms) {
    const {
      height,
      desktopImage,
      mobileImage,
      isAuthoring,
      textPosition,
      textAlignment,
      ctaAlignment,
      eyebrow,
      headline,
      isH1,
      subcopy,
      textColor,
      legalCopy,
      legalLink,
      cta,
      bottomPadding,
      topPadding
    } = cms;
    const ctaAlignmentLowerCase = ctaAlignment && ctaAlignment.toLowerCase();
    const textPositionLowerCase = textPosition && textPosition.toLowerCase();
    const containerWidth = getWidth(textPositionLowerCase);
    const containerTextAlignment = getTextAlignment(textAlignment && textAlignment.toLowerCase());
    // const bottomSpace = this.props.carousel || !(height && desktopImage && mobileImage) ? '' : 'mb-3';
    const componentPaddings = getPaddings(topPadding, bottomPadding);
    const analyticsTracking = this.props.carousel ? '' : 'c-promo-impression-tracking';
    return (
      <div
        className={`${analyticsTracking} hero-image ${componentPaddings} d-flex w-100 ${getHeight(height, isAuthoring)} ${heroDiv(
          desktopImage,
          mobileImage,
          this.isBackgroundImageCover()
        )}`}
      >
        <div className="container">
          <div className={`row h-100 position-relative ${getBoxPosition(textPositionLowerCase)}`}>
            <div className={`${containerWidth}`}>
              <div className={`d-flex w-100 flex-column flex-wrap my-0 ${containerTextAlignment}`}>
                {eyebrow && <div className={`${cx('o-copy__16bold px-1', `${eyebrowStyles(cms)}`)}`}>{eyebrow.toUpperCase()}</div>}
                {headline && (
                  <Fragment>
                    {isH1 && (
                      <h1 aria-level="1" className={`mt-1 ${getFontSize(height, headline.length)} ${headlineStyle(textColor)}`}>
                        {headline}
                      </h1>
                    )}
                    {!isH1 && (
                      <h2 aria-level="2" className={`mt-1 ${getFontSize(height, headline.length)} ${headlineStyle(textColor)}`}>
                        {headline}
                      </h2>
                    )}
                  </Fragment>
                )}
                {subcopy &&
                  height !== 'quarter' && (
                    <div
                      className={`${cx(
                        { 'o-copy__24light': height === 'full' },
                        { 'o-copy__20light': !(height === 'full') },
                        `mb-half ${subtext(textColor)}`
                      )}`}
                    >
                      {subcopy}
                    </div>
                  )}
                {cta && <div className={`w-100 d-flex flex-wrap ${ctalist(ctaAlignmentLowerCase)}`}>{this.ctaButtonList()}</div>}
              </div>
            </div>
            {legalCopy &&
              height !== 'quarter' && (
                <div className={`${legalLinkPosition} ${containerWidth} ${containerTextAlignment}`}>
                  {(legalLink && (
                    <a className={legalLinkStyles} href={legalLink}>
                      {this.getLegaltext(legalCopy)}
                    </a>
                  )) ||
                    this.getLegaltext(legalCopy)}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { cms } = this.props;
    if (this.state.hasFacets) {
      return null;
    }
    if (this.isanyctalink(cms) || cms.legalLink || !cms.imageUrl) {
      return this.renderHeroImage(cms);
    }
    return (
      <a
        href={cms.imageUrl}
        className={imageAnchorStyles}
        onClick={e => this.analyticsData(e, { ctaText: 'image click', ctaPath: cms.imageUrl }, cms.headline, false)}
      >
        {this.renderHeroImage(cms)}
      </a>
    );
  }
}
HeroImage.propTypes = {
  cms: PropTypes.object.isRequired,
  auid: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  backgroundImageCover: PropTypes.bool,
  carousel: PropTypes.bool
};

HeroImage.defaultProps = {
  backgroundImageCover: true
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const withConnect = connect(mapStateToProps);

// const withConnect = connect(mapStateToProps);
/* istanbul ignore if */
if (ExecutionEnvironment.canUseDOM) {
  // const HeroImageContainer = compose(withConnect)(HeroImage);
  const HeroImageWrapped = withErrorBoundary(HigherOrder(withConnect(HeroImage)), null, 'HeroImage');
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <HeroImageWrapped {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(HeroImage);
