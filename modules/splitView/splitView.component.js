import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import styled, { cx, css } from 'react-emotion';
import Responsive from 'react-responsive';
import Link from '@academysports/fusion-components/dist/Link';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import media from '../../utils/media';
import * as cNames from './splitView.emotion';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { enhancedAnalyticsPromoClick } from '../../utils/analytics';

const getBackgroundImageMobileProperty = path => media.sm(`background-image: url(${path})`);

const StyledImage = styled('div')`
  ${cNames.columnImage};
  ${cNames.backgroundImageBase};
  background-image: url(${props => props.desktopImage});
  ${props => getBackgroundImageMobileProperty(props.mobileImage)};
`;

class SplitView extends React.PureComponent {
  /**
   * @description pushes analytics data on cta button click
   * @param {event} e - passing event parameter
   * @param {string} ctaText - text to show on button
   * @param {string} ctaPath - on click url
   * @memberof SplitView
   */
  analyticsData(e, ctaText, ctaPath) {
    e.preventDefault();
    const { cms, gtmDataLayer } = this.props;
    if (gtmDataLayer) {
      const eventURL = ctaPath && ctaPath.toLowerCase();
      enhancedAnalyticsPromoClick(gtmDataLayer, cms, eventURL);
      gtmDataLayer.push({
        event: 'splitViewClicks',
        eventCategory: 'split view clicks',
        eventAction: `${ctaText && ctaText.toLowerCase()}`,
        eventLabel: `${ctaPath}`
      });
    }
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = `${ctaPath}`;
    }
  }

  computeContainerStyles(padding) {
    return padding === 'yes' ? cx(cNames.columnContainer, 'my-3') : cNames.columnContainer;
  }

  computeTextStyles(defaultClass, color) {
    return color === 'white'
      ? defaultClass
      : cx(
          defaultClass,
          css`
            color: white;
          `
        );
  }

  renderRightColumnStyle(color = 'default') {
    switch (color) {
      case 'gray':
        return cNames.columnActionsGrayTheme;
      case 'grey':
        return cNames.columnActionsGrayTheme;
      case 'white':
        return cNames.columnActionsWhiteTheme;
      default:
        return cNames.columnActionsDefault;
    }
  }
  /**
   * @description render links styled as button
   * @param{array} ctas- an array of object
   * @memberof SplitView
   */
  renderButtons = ctas =>
    ctas.map((cta, idx) => (
      <div className={cNames.buttonWrapper} key={cta.ctaText}>
        <Link
          href={cta.ctaPath}
          key={cta}
          auid={`HP_SV_BUTTON_${idx}`}
          btntype="secondary"
          btnvariant="secondary"
          className={cNames.buttonOverrides}
          onClick={e => this.analyticsData(e, cta.ctaText, cta.ctaPath)}
          size="S"
        >
          {cta.ctaText}
        </Link>
      </div>
    ));

  renderImageColumn(desktopImage, mobileImage, imageAltText) {
    return <StyledImage desktopImage={desktopImage} mobileImage={mobileImage} alt={imageAltText} />;
  }

  renderButtonsColumn(headlineText, headlineSubText, cta, color) {
    return (
      <div className={`${this.renderRightColumnStyle(color)} column-style`}>
        <div className={cNames.content}>
          <Responsive maxWidth={767}>
            <h6 aria-level="6" className={this.computeTextStyles(cNames.headerText, color)}>
              {headlineText}
            </h6>
            {headlineSubText && <div className={this.computeTextStyles(cx(cNames.subHeaderText, 'o-copy__16reg'), color)}>{headlineSubText}</div>}
            <div className={cNames.buttonContainer}>{this.renderButtons(cta)}</div>
          </Responsive>
          <Responsive minWidth={768}>
            <h5 className={this.computeTextStyles(cNames.headerText, color)}>{headlineText}</h5>
            {headlineSubText && <div className={this.computeTextStyles(cx(cNames.subHeaderText, 'o-copy__16reg'), color)}>{headlineSubText}</div>}
            <div className={cNames.buttonContainer}>{this.renderButtons(cta)}</div>
          </Responsive>
        </div>
      </div>
    );
  }

  render() {
    const { cms } = this.props;
    const {
      headlineText,
      headlineSubText,
      cta,
      desktopImage,
      mobileImage,
      imageAltText,
      color = 'white',
      imagePosition = 'left',
      padding = 'no'
    } = cms; // eslint-disable-line
    return (
      <div className={`${this.computeContainerStyles(padding)} c-promo-impression-tracking split-view`}>
        <Responsive maxWidth={767}>
          {this.renderImageColumn(desktopImage, mobileImage, imageAltText)}
          {this.renderButtonsColumn(headlineText, headlineSubText, cta, color)}
        </Responsive>
        <Responsive minWidth={768}>
          {imagePosition === 'left' && (
            <Fragment>
              {[this.renderImageColumn(desktopImage, mobileImage, imageAltText), this.renderButtonsColumn(headlineText, headlineSubText, cta, color)]}
            </Fragment>
          )}
          {imagePosition === 'right' && (
            <Fragment>
              {[this.renderButtonsColumn(headlineText, headlineSubText, cta, color), this.renderImageColumn(desktopImage, mobileImage, imageAltText)]}
            </Fragment>
          )}
        </Responsive>
      </div>
    );
  }
}
SplitView.propTypes = {
  cms: PropTypes.shape({
    headlineText: PropTypes.string.isRequired,
    headlineSubText: PropTypes.string,
    cta: PropTypes.array.isRequired,
    desktopImage: PropTypes.string.isRequired,
    mobileImage: PropTypes.string.isRequired,
    color: PropTypes.string,
    imageAltText: PropTypes.string,
    imagePosition: PropTypes.oneOf(['left', 'right']),
    padding: PropTypes.oneOf(['yes', 'no'])
  }).isRequired,
  gtmDataLayer: PropTypes.array
};

SplitView.defaultProps = {};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});
const withConnect = connect(mapStateToProps);
if (ExecutionEnvironment.canUseDOM) {
  const SplitViewContainer = compose(withConnect)(SplitView);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <SplitViewContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default connect(mapStateToProps)(SplitView);
