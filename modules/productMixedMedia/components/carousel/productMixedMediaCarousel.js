import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'react-responsive-carousel';
import ReactImageMagnify from 'react-image-magnify';
import { CarousalWrapper, ImageWrapper } from './styles';
import { MOBILE_MIXED_MEDIA_DIMENSION_PRESET } from '../../constants';

const ProductMixedMediaCarousel = props => {
  const { productList } = props;
  const showDots = productList && productList.length > 1;
  return (
    <CarousalWrapper>
      <Carousel showArrows={false} showThumbs={false} showStatus={false} showIndicators={showDots}>
        {productList.map(product => (
          <ImageWrapper onClick={props.imageClickHandler} data-auid="PDP_ProductImage_m">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: 'Hover/Click to enlarge',
                  isFluidWidth: true,
                  src: `${product.imageURL}${MOBILE_MIXED_MEDIA_DIMENSION_PRESET}`
                },
                largeImage: {
                  alt: 'Enlarged Image View',
                  src: `${product.imageURL}${MOBILE_MIXED_MEDIA_DIMENSION_PRESET}`,
                  width: 1000,
                  height: 1000
                }
              }}
            />
          </ImageWrapper>
        ))}
      </Carousel>
    </CarousalWrapper>
  );
};

ProductMixedMediaCarousel.propTypes = {
  productList: PropTypes.array,
  imageClickHandler: PropTypes.func
};

export default ProductMixedMediaCarousel;
