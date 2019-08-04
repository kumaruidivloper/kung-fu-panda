import React from 'react';
import PropTypes from 'prop-types';
import { SWATCH_DEFAULT_BOX_SIZE, SLIDER_GITTER } from '../../constants';
import {
  ImageSliderContainer,
  ImageContainer,
  SwatchesHolder,
  BtnScrollDown,
  BtnScrollUp,
  SliderWrapper,
  ImageElement,
  BtnScroll
} from './sliderStyles';
import Swatches from '../../../swatches/swatches.component';

class ProductMixedMediaSlider extends React.Component {
  constructor(props) {
    super(props);
    const { height, images, maxImage } = props;
    const maxHeight = height * maxImage;
    const maxSpacing = this.props.maxImage * SLIDER_GITTER;
    this.state = {
      images,
      image: {
        height: height + SLIDER_GITTER
      },
      slider: {
        height: maxHeight + maxSpacing,
        width: this.props.width
      },
      position: this.props.absPosition,
      absPosition: this.props.absPosition,
      maxImage: this.props.maxImage
    };
    this.slide = this.slide.bind(this);
    this.updateSliderPosition = this.updateSliderPosition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.absPosition === 0) {
      this.setState({ position: nextProps.absPosition });
    }
    this.setState({ absPosition: nextProps.absPosition, images: nextProps.images });
  }

  getPositionStyle() {
    return { transform: `translateY(${this.state.position * this.state.image.height}px)` };
  }

  slide(direction) {
    const { imageInterval, sliderPosition } = this.props;
    const { images, absPosition } = this.state;
    let counter = absPosition;
    let position = Math.abs(this.state.position);
    const keyPress = direction.target.classList && direction.target.classList[1];
    if (keyPress === 'icon-chevron-down') {
      position += imageInterval;
      counter += 1;
      if (counter > images.length - 1) {
        counter = images.length - 1;
      }
      const total = position + this.state.maxImage; // total = 1  + 6 = 7
      if (total >= this.state.images.length) {
        position = this.state.images.length - this.state.maxImage;
      } // position = 7 - 6
    } else {
      counter -= 1;
      if (counter <= 0) {
        counter = 0;
      }
      position -= imageInterval; // decrease the value by imageInterval (1)
      if (position <= 0) {
        position = 0;
      }
    }
    sliderPosition(images[counter], counter);
    this.setState({
      position: -Math.abs(position), // handling the negative values
      absPosition: counter
    });
  }

  updateSliderPosition(selected) {
    const { images, sliderPosition } = this.props;
    const position = images.findIndex(image => image.itemId === selected.itemId);
    sliderPosition(selected, position);
  }
  render() {
    const { swatchImgList, swatchProps, auid = 'SL' } = this.props;
    const { absPosition } = this.state;
    return (
      <SliderWrapper>
        <SwatchesHolder>
          <ImageElement className={`academyicon icon-chevron-up ${BtnScroll} ${BtnScrollUp}`} tabIndex="0" onClick={this.slide} auid={`${auid}_SL_IMG_UP`} />
          <ImageSliderContainer style={{ height: `${this.state.slider.height}px`, width: `${this.state.slider.width}px` }}>
            <ImageContainer style={this.getPositionStyle()}>
              {
                <Swatches
                  cms={swatchProps}
                  inline
                  boxSize={SWATCH_DEFAULT_BOX_SIZE}
                  handleSwatchClick={this.updateSliderPosition}
                  default={swatchImgList[absPosition]}
                  auid={`${auid}_SL_SW`}
                />
              }
            </ImageContainer>
          </ImageSliderContainer>
          <ImageElement className={`academyicon icon-chevron-down ${BtnScroll} ${BtnScrollDown}`} tabIndex="0" onClick={this.slide} auid={`${auid}_SL_IMG_DOWN`} />
        </SwatchesHolder>
      </SliderWrapper>
    );
  }
}
ProductMixedMediaSlider.propTypes = {
  imageInterval: PropTypes.number,
  images: PropTypes.array,
  height: PropTypes.number,
  maxImage: PropTypes.number,
  width: PropTypes.number,
  swatchProps: PropTypes.object,
  swatchImgList: PropTypes.array,
  absPosition: PropTypes.number,
  sliderPosition: PropTypes.func,
  auid: PropTypes.string
};
export default ProductMixedMediaSlider;
