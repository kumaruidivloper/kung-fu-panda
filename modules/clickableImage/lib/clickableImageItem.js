import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as css from './css';
import * as util from './util';
import { enhancedAnalyticsPromoClick } from '../../../utils/analytics';
class ClickableImageItem extends PureComponent {
  onClickGoTo(e, url, ctaCopy) {
    e.preventDefault();

    const eventURL = ctaCopy && ctaCopy.toLowerCase();
    const { gtmDataLayer, cms } = this.props;

    enhancedAnalyticsPromoClick(gtmDataLayer, cms, eventURL);
    this.props.gtmDataLayer.push({
      event: 'imageComponentClicks',
      eventCategory: 'image component',
      eventAction: `image click|${eventURL}`,
      eventLabel: eventURL
    });
    if (ExecutionEnvironment.canUseDOM) {
      window.location = url;
    }
  }

  onEnterFireOnClick(onClick) {
    return e => {
      if (e.nativeEvent.keyCode === 13) {
        onClick(e);
      }
    };
  }

  renderItemClassName() {
    const { imageSize, mobileBackgroundColor, backgroundMobileImage, textColor } = this.props;
    let result = css.itemSize5;
    switch (imageSize) {
      case 3:
        result = css.itemSize3;
        break;
      case 4:
        result = css.itemSize4;
        break;
      default:
        break;
    }

    const colorPairs = util.getColorPairs(backgroundMobileImage, mobileBackgroundColor, textColor);
    result = css.appendMobileStyles(
      result,
      `border-bottom: 1px solid ${colorPairs.complement}; border-top: 1px solid ${colorPairs.complement}; margin-bottom: -1px; color: ${
        colorPairs.complement
      }`
    );

    return result;
  }

  renderLabelClassName(mobileColor) {
    let result = css.label;
    if (mobileColor) {
      result = css.appendMobileStyles(result, `color: ${mobileColor};`);
    }
    return result;
  }

  render() {
    const { uidModifier, desktopImage, ctaLink, ctaCopy, index, textColor } = this.props;
    const { onClick = e => this.onClickGoTo(e, ctaLink, ctaCopy), imageAltText = `Category ${ctaCopy}` } = this.props;
    const onKeyPress = this.onEnterFireOnClick(onClick);
    const ariaLabelledById = `${uidModifier}-clickable-image-text-${index}`;
    return (
      <div className={this.renderItemClassName()}>
        <a
          href={ctaLink}
          className={css.linkStyles}
          data-auid={`clickable_image_${index}`}
          tabIndex={0}
          aria-labelledby={ariaLabelledById}
          onKeyPress={onKeyPress}
          onClick={onClick}
        >
          <img
            src={desktopImage}
            alt={`Click to see ${imageAltText} products`}
            aria-label={imageAltText}
            className={css.image}
            data-auid={`HP_CI_${index}`}
          />
          <div id={ariaLabelledById} className={`o-copy__16bold ${css.label(textColor)}`}>
            {ctaCopy}
          </div>
        </a>
      </div>
    );
  }
}

ClickableImageItem.propTypes = {
  imageSize: PropTypes.number.isRequired,
  ctaLink: PropTypes.string,
  ctaCopy: PropTypes.string,
  onClick: PropTypes.func,
  imageAltText: PropTypes.string,
  desktopImage: PropTypes.string,
  mobileBackgroundColor: PropTypes.string,
  backgroundMobileImage: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  cms: PropTypes.object,
  uidModifier: PropTypes.number,
  index: PropTypes.number,
  textColor: PropTypes.string
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

export default connect(mapStateToProps)(ClickableImageItem);
