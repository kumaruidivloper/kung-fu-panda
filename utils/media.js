// these sizes are arbitrary and you can set them to whatever you wish
import { css } from 'react-emotion';

export const sizes = {
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
  xs: 376
};

export const sizesMax = {
  lgMax: 1199,
  mdMax: 991,
  smMax: 767,
  xsMax: 575
};

// iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((accumulator, label) => {
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16;
  // eslint-disable-next-line
  accumulator[label] = (...args) => css`
    @media (max-width: ${emSize}em) {
      ${css(...args)};
    }
  `;
  return accumulator;
}, {});

export default media;
