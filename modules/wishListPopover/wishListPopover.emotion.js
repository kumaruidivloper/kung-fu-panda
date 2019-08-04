import { css } from 'emotion';
import { sizes } from '../../utils/media';

export const button = css`
  display: table;
  height: 24px;
`;

export const ctaText = css`
  border: none;
  background: none;
  vertical-align: middle;
  cursor: pointer;
  padding-left: 0px !important;
  padding-right: 0px !important;
  &:hover {
    color: #0055a6;
    text-decoration: underline;
  }
`;

export const ctaIcon = css`
  display: inline;
  margin-right: 5px;
  height: 24px;
  width: 24px;
  line-height: normal;
  overflow: hidden;
  line-height: normal;
  vertical-align: middle;
  font-size: 24px;
  line-height: 1.5;
  cursor: pointer;
  color: #0055a6;

  .path1:before,
  .path2:before,
  .path3:before,
  .path4:before,
  .path5:before {
    color: #0055a6;
  }

  @media screen and (min-width: ${sizes.md}px) and (max-width: ${sizes.lg}px) {
    font-size: 22px;
  }
`;

export const createWrapperStyle = (open, mobileTextAlign = 'left') => css`
  white-space: normal;
  text-align: center;

  @media (max-width: 767px) {
    text-align: ${mobileTextAlign};
    ${open && mobileTextAlign === 'left' ? mobileWrapperStyleOnOpen : ''};
  }
  position: relative;
  z-index: ${open ? '6' : '5'};
`;

const mobileWrapperStyleOnOpen = css`
  width: 100%;
  > div {
    width: 100%;
  }
`;

export const loaderWrapper = css`
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  position: relative;
  overflow: hidden;
`;
