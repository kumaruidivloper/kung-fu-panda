import { css } from 'react-emotion';
import { sizes } from '../../utils/media';

const StyledPromoContainer = css`
  @media (max-width: 768px) {
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const PromoBannerMobileImage = mobileImage =>
  css`
    @media (max-width: ${sizes}px) {
      background-image: url(${mobileImage});
    }
  `;

const PromoBanner = css`
  flex: 0 0 auto;
  @media (max-width: ${sizes}px) {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    min-height: 250px;
    max-width: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
`;

const PromoImage = css`
  min-height: 194px;
  @media (max-width: ${sizes}px) {
    display: none;
  }
`;

const PromoHeadline = css`
  @media screen\0 {
    width: inherit;
    flex-grow: 9;
  }
`;

const PromoDescription = css`
  @media screen\0 {
    width: inherit;
  }
`;
const detailsContainer = containerHeight => css`
  height: auto;
  @media (min-width: 524px) {
    height: ${containerHeight};
  }
`;

const AnchorLinkDiv = css`
  font-size: 1rem;
  .caret-color {
    color: #0055a6;
  }
  &:hover {
    text-decoration: none;
  }
  @media (min-width: 524px) {
    padding: 0 8px;
  }
`;

export { StyledPromoContainer, AnchorLinkDiv, PromoBannerMobileImage, PromoBanner, PromoImage, PromoHeadline, PromoDescription, detailsContainer };
