import { css } from 'react-emotion';
import media from '../../utils/media';

const hotMarketCta = css`
  height: 50px;
  border-radius: 35px;
  background-color: #0055a6;
  color: #fff;
  font-size: 0.875rem;
  text-transform: uppercase;
`;
const hotMarketMobileDropdown = css`
  outline: none;
  font-family: Mallory;
  appearance: none;
  -moz-appearance: none;
  -ms-progress-appearance: none;
  -webkit-appearance: none;
  ::-ms-expand {
    display: none; /* hide the default arrow in ie10 and ie11 */
  }
  -webkit-scrollbar {
    width: 0 !important;
  }
  > option {
    font-family: Mallory;
    font-size: 10px;
  }
`;

const mobileBorderBottom = css`
  ${media.md`
  border-bottom:1px solid #ccc;
    `};
`;
const hotMarketMobileSpaces = css`
  @media screen and (min-width: 320px) and (max-width: 524px) {
    padding-left: calc(4px + (100vw - 320px) / 2);
    padding-right: calc(4px + (100vw - 320px) / 2);
  }
  @media screen and (min-width: 524px) and (max-width: 767px) {
    padding-left: calc(4px + (100vw - 524px) / 2);
    padding-right: calc(4px + (100vw - 524px) / 2);
  }

  ${mobileBorderBottom};
`;

const mobileDropdownDiv = css`
  position: relative;
  > select {
    border: none;
    background-color: #fff;
  }

  & > i {
    color: #0055a6;
    vertical-align: middle;
  }
`;
const hotMarketMobileContainer = css`
  ${media.md`
  max-width:100vw;
  width:100%;
    `};
`;

export { hotMarketCta, hotMarketMobileDropdown, mobileDropdownDiv, hotMarketMobileContainer, hotMarketMobileSpaces };
