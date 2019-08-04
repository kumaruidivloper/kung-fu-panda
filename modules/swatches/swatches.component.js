import PropTypes from 'prop-types';
import React from 'react';
import { cx } from 'react-emotion';
import { IMAGE, TEXT, MIN_TO_TEXT_TYPE } from './constants';
import { swatchStyle, flexDirection, StyledButton, textAttributeStyle, ItemText, Image } from './styles';

class Swatches extends React.PureComponent {
  state = {
    selectedItem: this.props.default
  };

  componentWillReceiveProps(nextProps) {
    const defaultValue = nextProps.default;
    this.setState({ selectedItem: defaultValue });
  }

  /**
   * Get column style based on attribute type
   */
  getColumnStyle = (text, item, inline, props, swatchLength, textType) => {
    const columnStyle = swatchStyle(props);
    if (inline) {
      return columnStyle;
    } else if (textType && !this.isThumbnailDisplay(item)) {
      return cx('col-4', columnStyle, textAttributeStyle);
    }
    return cx('col-3 col-sm-2', columnStyle);
  };

  /**
   * Method to check whether swatchlist of type text (one or more of text type)
   */
  isTextType = swatchList => {
    let swatchTypeTextCounter = 0;
    swatchList.forEach(rowItem => {
      const { text } = rowItem;
      if (text.length >= MIN_TO_TEXT_TYPE) {
        swatchTypeTextCounter += 1;
      }
    });
    return swatchTypeTextCounter >= 1;
  };

  /**
   * to handle swatch button click
   */
  handleOnClick = selectedItem => {
    const { handleSwatchClick } = this.props;
    this.setState({
      selectedItem
    });
    if (handleSwatchClick) {
      handleSwatchClick(selectedItem);
    }
  };

  isThumbnailDisplay = item => item.thumbnail;

  isSwatchDisplay = type => type === TEXT || type === IMAGE;

  /**
   * To test given text as inches
   */
  isInches = text => /\d"/.test(text);

  /**
   * Only contains special numbers till the end
   * examples: $40, $40.00, 34, 24.00
   */
  hasOnlyNumber = text => /^[\\$\d.]+$/.test(text);

  /**
   * Render swatch type thumbnail/text
   */
  renderSwatchType = item => {
    if (this.isThumbnailDisplay(item)) {
      return <Image src={item.thumbnail} alt={item.text} />;
    }

    return <ItemText>{item.text}</ItemText>;
  };

  render() {
    const { cms, inline, type, boxSize } = this.props;
    const { swatchList } = cms;
    const { selectedItem } = this.state;
    const swatchLength = swatchList ? swatchList.length : 0;
    const textType = this.isTextType(swatchList);
    return (
      <div className={cx('row m-0', flexDirection(inline))}>
        {swatchLength > 0 &&
          this.isSwatchDisplay(type) &&
          swatchList.map(item => {
            const { itemId, text, sellable } = item;
            const selected = selectedItem.itemId === itemId || selectedItem === itemId;
            const props = {
              selected,
              boxSize,
              sellable
            };
            return (
              <button
                role="radio"
                aria-checked={selected}
                className={cx(this.getColumnStyle(text, item, inline, props, swatchLength, textType), StyledButton)}
                onClick={() => this.handleOnClick(item)}
                onKeyPress={() => this.handleOnClick(item)}
                tabIndex="0"
                data-auid={`swatchButton-${type}-${itemId}`}
                key={item.itemId}
                aria-label={text}
              >
                {this.renderSwatchType(item)}
                {!sellable && (
                  <svg
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      top: '0',
                      zIndex: '3'
                    }}
                  >
                    <line x1="0" y1="100%" x2="100%" y2="0" style={{ stroke: 'rgb(204, 204, 204)', strokeWidth: '1' }} />
                  </svg>
                )}
              </button>
            );
          })}
      </div>
    );
  }
}
Swatches.propTypes = {
  cms: PropTypes.object.isRequired,
  inline: PropTypes.bool, // true for vertical alignment,
  type: PropTypes.string, // Image or Text Renderer
  handleSwatchClick: PropTypes.func,
  default: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  boxSize: PropTypes.number // in pixels
};

Swatches.defaultProps = {
  type: IMAGE
};

export default Swatches;
