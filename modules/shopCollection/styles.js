import styled, { css } from 'react-emotion';
import media from '../../utils/media';
export const collectionNameDiv = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  min-width: 18.125rem;
  height: 4.375rem;
  width: auto;
  background-color: ${props => props.collectionNameBackgroundColor};
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 4px 0 rgba(0, 0, 0, 0.08), 0 3px 8px 0 rgba(0, 0, 0, 0.1);
  ${media.md`
  min-width: 14.0625rem;
  height: 3.125rem;
  `};
`;

/**
 *
 * used to generate css text color styles according to property
 * @param {string} textColor color of text in hexacode.
 */
export const collectionNameText = textColor => css`
  color: ${textColor};
  text-align: center;
  ${media.md`
    font-size: 0.875rem;
    letter-spacing: normal;
  `};
`;

export const brandCollectionNameText = css`
  color: #ffffff;
  text-align: center;
  margin-top: 2.375rem;
  ${media.sm`
  font-family: 'Mallory-Medium';
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.33;
  letter-spacing: 1px;
  margin-top: 2rem;
  `};
`;

export const horizontalRule = css`
  border: 0;
  width: 5%;
  background-color: #ffffff;
  height: 2px;
  margin: 1rem auto;
  border-radius: 15px;
  width: 30px;
  @media (min-width: 768px) {
    width: 5%;
    height: 4px;
  }
  @media (min-width: 992px) {
    margin-top: 26px;
    margin-bottom: 24px;
  }
`;

export const calloutText = css`
  text-align: center;
  color: #ffffff;
  ${media.sm`
  font-size: 2rem;
  letter-spacing: 0;
  line-height: 2rem;
  `};
`;

export const buttonContainer = css`
  border: none;
  min-width: 128px;
  min-height: 50px;
  margin-top: 1rem;
  margin-bottom: 3.5rem;
  padding: 1rem 1.2rem;

  @media (min-width: 768px) {
    min-width: 150px;
    min-height: 60px;
    padding: 1.2rem 1.6rem;
  }
`;

export const ipadBtn = css`
  ${media.md`
    font-size: 0.875rem;
    letter-spacing: 0.4;
    line-height: 1.125rem;
    min-height: 3.125rem;
    padding: 1rem 1.5rem;
  `};
`;

export const buttonText = css`
  font-size: 0.875rem;
  letter-spacing: 0.4px;
  line-height: 1.125rem;
  text-align: center;
  @media (min-width: 768px) {
    font-size: 16px;
    letter-spacing: 0.5px;
    line-height: 1.375rem;
  }
`;

export const productGrid = css`
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  & > div {
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 5px;
    flex: 0 0 auto;
  }
  & .product-card {
    max-width: 400px;
  }
  @media (max-width: 576px) {
    margin-left: 12px;
    & > div {
      margin-right: 4px;
      margin-left: 4px;
    }
  }
`;

export const getBackgroundStyles = image => css`
  margin-top: 20px;
  position: absolute;
  background-image: url(${image.mobile});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 50%;
  z-index: -1;
  @media screen\0 {
    left: 0;
  }
  @media (min-width: 992px) {
    background-image: url(${image.desktop});
  }
`;

const RootContainer = css`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  align-items: center;
  position: relative;
`;

export const mobileCollection = css`
  .slick-list {
    padding: 0 20% 0 0;
  }
  .slick-slide {
    width: 213.33333px;
  }
`;

export const mobileScroll = css`
  ${media.md`
    max-width:100vw;
    overflow-y: hidden;
    overflow-x: scroll;
     ::-webkit-scrollbar {
    width: 50%;
    }
  `} ${media.sm`
    /* to overwrite bootstarp right margin */
    max-width:100vw;
    margin-right:0;
    margin-left: auto;
    width:100%;
  `} 
  @media screen\0 {
    width: 100%;
    overflow-y: hidden;
  }
`;

export const mobileContainer = css`
  .swiper-container {
    @media screen and (min-width: 320px) and (max-width: 523px) {
      padding-left: calc(4px + (100vw - 320px) / 2);
      padding-right: calc(4px + (100vw - 320px) / 2);
    }
    @media screen and (min-width: 524px) and (max-width: 767px) {
      padding-left: calc(4px + (100vw - 524px) / 2);
      padding-right: calc(4px + (100vw - 524px) / 2);
    }
  }
`;
export const marginLeftOffset = css`
  margin-left: calc((100vw - 320px) / 2);
`;
export const getPaddings = (topPadding, bottomPadding) => {
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
export default RootContainer;
