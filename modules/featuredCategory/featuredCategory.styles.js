import styled, { css } from 'react-emotion';
import media from '../../utils/media';
// import media from '../../utils/media';

const WrapperDiv = styled('div')`
  background-image: url(${props => props.backgroundDesktopImage});
  padding: 0;
`;

const HeadlineConst = css`
  width: 100%;
`;

const Headline = styled('h3')`
  ${HeadlineConst}
  text-align: ${props => props.headlineAlignment};
`;

const MobileHeadline = styled('h4')`
  ${HeadlineConst}
  text-align: ${props => props.headlineAlignment};
`;

const contentText = css`
  text-align: center;
  margin-top: 0.625rem;
`;

const categoryTile = css`
  padding-top: 7px;
  padding-bottom: 7px;
  @media screen\0 {
    padding: 4px 9px !important;
  }
`;

const categoryTileMobile = css`
  padding: 0.5rem 0.25rem 0;
`;

const categoryCard = css`
  background-color: #fff;
  list-style-type: none;
  display: inline-block;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    color: $academy-gray;
    text-decoration: none;
  }
  ${categoryImgContainer} @media (min-width: 425px) {
    height: auto;
  }
  @media (min-width: 768px) and (max-width: 992px) {
    height: 100%;
  }
`;

const categoryImgContainer = css`
  height: 69.565%;
  padding: 5%;
  min-height: 160px;
  ${imageSize} @media (min-width: 768px) and (max-width: 992px) {
    min-height: auto;
  }
`;

const imageSize = css`
  width: 100%;
`;

const parentContainer = css`
  @media (min-width: 768px) and (max-width: 992px) {
    width: 87%;
  }
`;
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

const labelStyle = css`
  width: 100%;
  font-weight: bold;
  line-height: 1.43;
`;

const errorStyles = css`
  color: red;
`;

export {
  WrapperDiv,
  Headline,
  MobileHeadline,
  contentText,
  categoryCard,
  categoryTile,
  categoryTileMobile,
  categoryImgContainer,
  imageSize,
  parentContainer,
  getPaddings,
  labelStyle,
  errorStyles
};
