import { css } from 'react-emotion';

const imageBanner = url => css`
  background-image: url('${url}');
  height: 28rem;
  background-size: cover;
  background-position: bottom;
`;
const confirmationBannerHeading = css`
  font-size: 2.6rem;
  font-weight: 900;
  font-style: normal;
  font-stretch: condensed;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #333333;
`;
const confirmationBannerSubHeading = css`
  font-size: 1rem;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: center;
  color: #333333;
`;
const orderNumber = css`
  font-size: 2.24rem;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 0;
  text-align: center;
  color: #333333;
`;
const orderNumberTitle = css`
  line-height: 2rem;
`;
const confirmationLinks = css`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;
const confirmationLinksText = css`
  color: black;
`;
const iconSize = css`
  font-size: 24px;
  line-height: 0.9;
`;
export {
  confirmationLinksText,
  imageBanner,
  iconSize,
  confirmationBannerHeading,
  confirmationBannerSubHeading,
  orderNumber,
  orderNumberTitle,
  confirmationLinks
};
