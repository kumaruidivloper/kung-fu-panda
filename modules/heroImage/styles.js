import { css } from 'react-emotion';
import media from '../../utils/media';
import {
  HERO_IMAGE_QUARTER,
  HERO_IMAGE_HALF,
  HERO_IMAGE_3Q,
  HERO_IMAGE_FULL,
  LEFT,
  RIGHT,
  CENTER,
  LEFT_TOP,
  LEFT_BOTTOM,
  RIGHT_TOP,
  RIGHT_BOTTOM,
  CENTER_TOP,
  CENTER_BOTTOM,
  SHORT_HEADLINE_MAX_LENGTH,
  MEDIUM_HEADLINE_MAX_LENGTH
} from './constants';
/**
 *
 *function used to generate css styles according to height property
 * @param { string } height height of the heroImage
 * @returns css styles
 */
const getHeight = height => {
  switch (height) {
    case HERO_IMAGE_3Q:
      return css`
        height: 540px;
      `;
    case HERO_IMAGE_HALF:
      return css`
        height: 360px;
      `;
    case HERO_IMAGE_QUARTER:
      return css`
        height: 180px;
      `;
    case HERO_IMAGE_FULL: // KER-8971
      return css`
        height: 720px;
        ${media.md`
        height: 568px;
        `};
      `;
    default:
      return css`
        height: auto;
      `;
  }
};
/**
 *
 * used to generate styles according to properities
 * @param {string} desktopImage url of background image for desktop
 * @param {string} mobileImage url of background image for mobile
 */
const heroDiv = (desktopImage, mobileImage, isBackgroundImageCover) => css`
  background-blend-mode: multiply;
  background-size: ${isBackgroundImageCover ? 'cover' : 'contain'};
  border: none;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url('${mobileImage}');
  @media (min-width: 576px) {
    background-image: url('${mobileImage}');
  }
  @media (min-width: 768px) {
    background-image: url('${mobileImage}');
  }
  @media (min-width: 992px) {
    background-image: url('${desktopImage}');
  }
  @media (min-width: 1200px) {
    background-image: url('${desktopImage}');
  }
`;
/**
 *
 *
 * @param { string } textPosition position of content box.
 * @returns {string} string of bootstrap classes
 */
const getWidth = textPosition => {
  switch (textPosition) {
    case LEFT:
    case LEFT_TOP:
    case LEFT_BOTTOM:
      return `col-12 col-md-6 ${minHeight}`;
    case RIGHT:
    case RIGHT_TOP:
    case RIGHT_BOTTOM:
      return `col-12 col-md-6 ${minHeight}`;
    default:
      return `col-12 ${minHeight}`;
  }
};

const minHeight = css`
  min-height: 0px;
`;
/**
 *function used to position the content box.
 *
 * @param { string } textPosition position of content box.
 * @returns { string } string of styles
 */
const getBoxPosition = textPosition => {
  switch (textPosition) {
    case LEFT:
      return css`
        justify-content: flex-start;
        align-items: center;
      `;
    case RIGHT:
      return css`
        justify-content: flex-end;
        align-items: center;
      `;
    case CENTER_TOP:
      return css`
        justify-content: center;
        align-items: flex-start;
      `;
    case CENTER_BOTTOM:
      return css`
        justify-content: center;
        align-items: flex-end;
      `;
    case LEFT_TOP:
      return css`
        justify-content: flex-start;
        align-items: flex-start;
      `;
    case LEFT_BOTTOM:
      return css`
        justify-content: flex-start;
        align-items: flex-end;
      `;
    case RIGHT_TOP:
      return css`
        justify-content: flex-end;
        align-items: flex-start;
      `;
    case RIGHT_BOTTOM:
      return css`
        justify-content: flex-end;
        align-items: flex-end;
      `;
    default:
      return css`
        justify-content: center;
        align-items: center;
      `;
  }
};
/**
 *function used to generate styles acoording to textAlign element.
 *
 * @param {string} textAlign alignment of text inside the box.
 * @returns { string } string of styles
 */
const getTextAlignment = textAlign => {
  switch (textAlign) {
    case LEFT:
      return css`
        align-items: flex-start;
        text-align: left;
        justify-content: flex-start;
      `;
    case RIGHT:
      return css`
        align-items: flex-end;
        text-align: right;
        justify-content: flex-end;
      `;
    default:
      return css`
        align-items: center;
        text-align: center;
        justify-content: center;
      `;
  }
};
/**
 *
 * function used to generate styles acoording to properities
 *
 * @param {object} cms object having all authored properties
 */
const eyebrowStyles = cms =>
  css`
    white-space: nowrap;
    display: ${cms.eyebrow ? 'inline-block' : 'none'};
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: max-content;
    color: #ffffff;
    padding: 0.6rem 0;
    background-color: ${cms.eyebrowColor && cms.eyebrowColor !== '' ? cms.eyebrowColor.toLowerCase() : '#ee0000'};
    //IE-fix
    @media screen\0 {
      width: auto !important;
    }
  `;

const headlineStyle = textColor => css`
  color: ${textColor && textColor !== '' ? textColor.toLowerCase() : '#ffffff'};
  text-transform: uppercase;
  letter-spacing: 0;
  margin-bottom: 0;
  line-height: 4.5rem;
  /* IE-fix */
  @media screen\0 {
    width: inherit !important;
  }
`;

const subtext = textColor =>
  css`
    color: ${textColor && textColor !== '' ? textColor.toLowerCase() : '#ffffff'};
    ${media.md`
      font-size: 1rem;
      line-height: 1.25rem;
    `};
  `;

const legalText = textColor =>
  css`
    color: ${textColor && textColor !== '' ? textColor.toLowerCase() : '#ffffff'};
  `;

const legalLinkPosition = css`
  position: absolute;
  bottom: 0;
`;
const legalLinkStyles = css`
  &:hover {
    text-decoration: none;
  }
`;

const AnchorStyles = textColor =>
  css`
    color: ${textColor && textColor !== '' ? textColor.toLowerCase() : '#ffffff'};
    outline: none;
    &:hover {
      color: ${textColor && textColor !== '' ? textColor.toLowerCase() : '#ffffff'};
      text-decoration: none;
    }
    &:focus {
      text-decoration: none;
      outline: 1px dotted #fff;
    }
  `;
const withoutCtaTextColor = textColor =>
  css`
    color: ${textColor && textColor !== '' ? textColor.toLowerCase() : '#ffffff'};
  `;
const ctabtn = css`
  ${media.md`
    font-size: 0.875rem;
    letter-spacing: 0.4;
    line-height: 1.125rem;
    min-height: 3.125rem;
    padding: 1rem 1.5rem;
  `};
`;
/**
 *it is used to generate css styles for short headlines
 *
 * @param {string} height height of heroImage component
 * @returns css styles
 */
const shortHeadline = height => {
  switch (height) {
    case HERO_IMAGE_QUARTER:
      return css`
        font-size: 32px;
        line-height: 1;
        @media screen and (min-width: 1112px) {
          font-size: 54px;
        }
      `;
    case HERO_IMAGE_HALF:
      return css`
        font-size: 54px;
        line-height: 1;
        ${media.md`
      font-size: 32px;
      line-height: 1;
      `};
      `;
    case HERO_IMAGE_3Q:
      return css`
        font-size: 72px;
        ${media.md`
      font-size: 54px;
      line-height: 1;
      `};
      `;
    default:
      return css`
        ${media.md`
      font-size: 54px;
      line-height: 1;
      letter-spacing: normal;
      `};
      `;
  }
};
/**
 *it is used to generate css styles for medium headlines
 *
 * @param {string} height height of heroImage component
 * @returns css styles
 */
const mediumHeadline = height => {
  switch (height) {
    case HERO_IMAGE_QUARTER:
      return css`
        font-size: 32px;
        line-height: 1;
        @media screen and (min-width: 1112px) {
          font-size: 54px;
        }
      `;
    case HERO_IMAGE_HALF:
      return css`
        font-size: 42px;
        line-height: 1;
        ${media.md`
      font-size: 32px;
      line-height: 1;
      `};
      `;
    case HERO_IMAGE_3Q:
      return css`
        font-size: 54px;
        ${media.md`
      font-size: 42px;
      line-height: 1;
      `};
      `;
    default:
      return css`
        font-size: 72px;
        ${media.md`
      font-size: 42px;
      line-height: 1;
      letter-spacing: normal;
      `};
      `;
  }
};
/**
 *it is used to generate css styles for long headlines
 *
 * @param {string} height height of heroImage component
 * @returns css styles
 */
const longHeadline = height => {
  switch (height) {
    case HERO_IMAGE_QUARTER:
    case HERO_IMAGE_HALF:
      return css`
        font-size: 32px;
        line-height: 1;
        ${media.md`
      font-size: 24px;
      line-height: 1;
      `};
      `;
    case HERO_IMAGE_3Q:
      return css`
        font-size: 42px;
        ${media.md`
      font-size: 32px;
      line-height: 1;
      `};
      `;
    default:
      return css`
        font-size: 54px;
        ${media.md`
      font-size: 32px;
      line-height: 1;
      letter-spacing: normal;
      `};
      `;
  }
};

/**
 * function used to generate font styles according to height and length of string headline
 *
 * @param {string} height height of heroImage
 * @param {number} stringLength number of characters of headline text
 * @returns { string } string of styles
 */
const getFontSize = (height, stringLength) => {
  let fontProperities;
  if (stringLength < SHORT_HEADLINE_MAX_LENGTH) {
    fontProperities = shortHeadline(height);
  } else if (stringLength < MEDIUM_HEADLINE_MAX_LENGTH) {
    fontProperities = mediumHeadline(height);
  } else {
    fontProperities = longHeadline(height);
  }
  return fontProperities;
};
const imageAnchorStyles = css`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;
/**
 *
 *
 * @param {string} ctaAlign
 * @returns margin for cta according to alignment
 */
const ctaBtnAlign = ctaAlign => {
  switch (ctaAlign) {
    case LEFT: {
      return css`
        margin-right: 1rem;
      `;
    }
    case RIGHT: {
      return css`
        margin-left: 1rem;
      `;
    }
    default: {
      return css`
        margin: 0.5rem 0.25rem;
      `;
    }
  }
};

const ctalist = ctaAlignment => {
  switch (ctaAlignment) {
    case CENTER:
      return css`
        margin-top: 0.5rem;
        justify-content: center;
      `;
    case RIGHT:
      return css`
        margin-top: 0.5rem;
        justify-content: flex-end;
      `;
    default:
      return css`
        justify-content: flex-start;
        margin-top: 0.5rem;
      `;
  }
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

export {
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
};
