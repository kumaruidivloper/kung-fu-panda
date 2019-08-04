import { css } from 'react-emotion';
import media from '../../utils/media';

export const marginLeftOffset = css`
  margin-left: calc((100vw - 320px) / 2);
`;

export const carouselTitleBox = (bgColor, textColor) => css`
  padding: 1rem 1.5rem;
  background-color: ${bgColor || '#0055a6'};
  color: ${textColor || '#ffffff'};
  text-transform: uppercase;
  font-family: Mallory-Bold;
  font-size: 0.875rem;
  letter-spacing: 0;
  line-height: 1.125rem;
  position: relative;
  top: 13px;
  min-width: 14.0625rem;
  z-index: 1;
  height: 3.125rem;
  width: auto;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 4px 0 rgba(0, 0, 0, 0.08), 0 3px 8px 0 rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 23px 0;
    font-size: 1.25rem;
    line-height: 1.5rem;
    min-width: 18.125rem;
    height: 4.375rem;
    top: 50px;
    display: inline-block;
  }
`;
export const backgroundColor = desktopImgUrl => css`
background-color: #f5f3f3;
@media (min-width: 992px) {
  background-image: url('${desktopImgUrl}');
  overflow: hidden;
}
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
