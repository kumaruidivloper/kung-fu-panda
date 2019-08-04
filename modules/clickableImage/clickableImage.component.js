import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { css } from 'react-emotion';
import classNames from 'classnames';
import Item from './lib/clickableImageItem';
import * as util from './lib/util';
import * as clickableStyles from './lib/css';
import media from '../../utils/media';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

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

class ClickableImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.uid = Math.floor(Math.random() * 1e16);
  }

  determineImageSize(itemsArray = []) {
    return itemsArray.length <= 3 ? 3 : itemsArray.slice(0, 5).length;
  }

  renderItems(mobileBackgroundColor, backgroundMobileImage, items = []) {
    const itemsSubset = items.slice(0, 5);
    const imageSize = this.determineImageSize(itemsSubset);
    const { dimension83, name, id, position, creative } = this.props.cms;
    const itemElements = itemsSubset.map((item, index) => (
      <Item
        key={item.ctaLink}
        imageSize={imageSize}
        index={index}
        mobileBackgroundColor={mobileBackgroundColor}
        backgroundMobileImage={backgroundMobileImage}
        uidModifier={this.uid}
        cms={{ dimension83, name, id, position, creative }}
        textColor={this.props.cms.textColor}
        {...item}
      >
        {item.name}
      </Item>
    ));
    return itemElements;
  }

  renderClassName(cssClass, mobileBackgroundColor, backgroundMobileImage) {
    const { textColor } = this.props.cms;
    let result = cssClass;
    const colorPairs = util.getColorPairs(backgroundMobileImage, mobileBackgroundColor, textColor);
    if (backgroundMobileImage) {
      result = clickableStyles.appendMobileStyles(result, `background-image: url(${backgroundMobileImage});`);
    }
    return clickableStyles.appendMobileStyles(
      result,
      `background-color: ${colorPairs.color}; border-color: ${colorPairs.complement}; color: ${colorPairs.complement};`
    );
  }

  renderHeaderClassName(className, mobileBackgroundColor, backgroundMobileImage) {
    const { textColor } = this.props.cms;
    const colorPairs = util.getColorPairs(backgroundMobileImage, mobileBackgroundColor, textColor);
    return clickableStyles.appendMobileStyles(className, `color: ${colorPairs.complement};`);
  }

  render() {
    const { cms, ...remainingProps } = this.props;
    const myProps = { ...remainingProps, ...cms };
    const { bottomPadding, topPadding } = this.props.cms;
    const componentPaddings = getPaddings(topPadding, bottomPadding);
    const { headlineCopy = 'clickableImage', backgroundMobileImage, mobileBackgroundColor, image } = myProps; // eslint-disable-line object-curly-newline

    return (
      <div className={classNames('c-promo-impression-tracking', 'clickableImage', `${componentPaddings}`)}>
        <div className={`pb-3 pt-3 ${this.renderClassName(clickableStyles.container, mobileBackgroundColor, backgroundMobileImage)}`}>
          <div className="container">
            <h3 className={`mb-5 ${this.renderHeaderClassName(clickableStyles.header, mobileBackgroundColor, backgroundMobileImage)}`}>
              {headlineCopy}
            </h3>
            <clickableStyles.Row totalImages={image}>{this.renderItems(mobileBackgroundColor, backgroundMobileImage, image)}</clickableStyles.Row>
          </div>
        </div>
      </div>
    );
  }
}

ClickableImage.propTypes = {
  cms: PropTypes.object.isRequired,
  gtmDataLayer: PropTypes.array
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ClickableImage {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default ClickableImage;
