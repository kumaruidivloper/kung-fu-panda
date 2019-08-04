import styled, { css } from 'react-emotion';
import { LEFT, RIGHT } from './constants';

/**
 *
 *used to justify content accoding to bannerAlignment property
 * @param {string} bannerAlignment alignment of banner child elements
 * @returns {string} bootstrap class name
 */

const alignmentResolverClass = bannerAlignment => {
  switch (bannerAlignment) {
    case LEFT:
      return 'justify-content-start';
    case RIGHT:
      return 'justify-content-end';
    default:
      return 'justify-content-center';
  }
};

/**
 *
 *used to text alignment class accoding bannerAlignment property
 * @param {string} bannerAlignment alignment of banner child elements
 * @returns {string} bootstrap class name
 */

const textAlignmentClass = bannerAlignment => {
  switch (bannerAlignment) {
    case LEFT:
      return 'text-left';
    case RIGHT:
      return 'text-right';
    default:
      return 'text-center';
  }
};

export const getTextColor = textColor =>
  css`
    color: ${textColor && textColor !== '' ? textColor.toLowerCase() : '#ffffff'};
  `;

export const OverLay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1040;
`;

export const StyledModal = css`
  box-sizing: border-box;
  position: absolute;
  overflow-y: scroll;
  top: 10%;
  left: 15%;
  right: 15%;
  width: 70%;
  bottom: 10%;
  color: #000000;
  overflow: auto;
  background-color: #fff;
  @media screen and (max-width: 767px) {
    width: 100%;
    top: 0%;
    left: 0%;
    right: 0%;
    bottom: 0;
  }
`;

export const StyledButton = css`
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

export const ButtonContainer = css`
  position: absolute;
  top: 1rem;
  right: 1rem;
  line-height: 1;
  z-index: 99;
`;

const TitleTextCase = css`
  text-transform: uppercase;
`;

const colorBanner = bannerColor =>
  css`
    background-color: ${bannerColor};
  `;

const BannerStyle = css`
  padding: 0.6rem 1rem;
  display: flex;
  background-color: #003366;
  text-align: center;
  color: white;
  min-height: 4.0625rem;
  padding-left: 1.25rem;
  :hover {
    text-decoration: none;
    color: whitesmoke;
    cursor: pointer;
  }
  :focus {
    outline: 1px dotted #fff;
    outline-offset: -1px;
  }
`;

const TitleStyle = css`
  padding: 0px 5px;
  margin-right: 0.5rem;
  color: #ffffff;
  @media only screen and (max-width: 377px) {
    margin-right: 0;
    width: 100%;
  }
`;

const ModalStyle = css`
  position: fixed;
  top: 10%;
  left: 20%;
  right: 20%;
  bottom: 15%;
  background-color: rgba(255, 255, 255, 0.75);
`;
const ModalContainer = styled('Modal')`
  ${ModalStyle};
`;

const PageBannerButton = styled('button')`
  ${BannerStyle};
  align-items: center;
  outline: none;
  border: none;
  width: 100%;
  flex-flow: wrap;
  background-color: ${props => props.bannerColor};
`;

const PageBannerAnchor = styled('a')`
  ${BannerStyle};
  align-items: center;
  flex-flow: wrap;
  background-color: ${props => props.bannerColor};
`;

const SiteBannerButton = styled('button')`
  ${BannerStyle};
  align-items: center;
  outline: none;
  border: none;
  flex-flow: nowrap;
  flex-grow: 1;
  background-color: ${props => props.bannerColor};
`;
const SiteBannerAnchor = styled('a')`
  ${BannerStyle};
  align-items: center;
  flex-flow: nowrap;
  flex-grow: 1;
  background-color: ${props => props.bannerColor};
`;

const PageBannerTitleStyle = css`
  color: #ffffff;
  padding: 0.375rem;
  font-weight: bold;
  margin-left: 4px;
  margin-right: 0.5rem;
  ${TitleTextCase} @media only screen and (max-width: 377px) {
    padding-bottom: 1px;
    margin-right: 0;
  }
`;

const SiteBannerDetailStyle = css`
  color: #ffffff;
`;
const PageBannerDetailStyle = css`
  color: #ffffff;
`;

const hiddenDiv = css`
  display: none;
`;

const ShippingTruckIcon = css`
  font-size: 2rem;
`;

const ArrowIcon = css`
  font-size: 0.7rem;
  margin-top: 2px;
  padding-left: 0.5rem;
  color: #ffffff;
`;
const closeIcon = css`
  @media only screen and (max-width: 377px) {
    font-size: 0.8rem;
  }
`;
const CloseBtn = css`
  border-style: none;
  color: white;
  cursor: pointer;
  background-color: #0055a6;
  padding-top: 0.3125rem;
  :focus {
    outline: 1px dotted #fff;
    outline-offset: -1px;
  }
  @media only screen and (max-width: 377px) {
    padding-right: 0;
  }
`;

const SiteBannerContent = css`
  flex-grow: 1;
  @media only screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
`;
const bannerIconStyles = css`
  max-width: 24px;
  max-height: 24px;
  text-indent: -999px;
  width: 100%;
`;
const customStyles = {
  content: {
    top: '10%',
    left: '20%',
    right: 'auto',
    bottom: 'auto'
  }
};
const makeItLink = css`
  :hover {
    text-decoration: underline;
  }
`;

export {
  PageBannerButton,
  PageBannerAnchor,
  SiteBannerButton,
  SiteBannerAnchor,
  TitleStyle,
  ModalContainer,
  PageBannerDetailStyle,
  PageBannerTitleStyle,
  SiteBannerDetailStyle,
  ShippingTruckIcon,
  ArrowIcon,
  CloseBtn,
  SiteBannerContent,
  colorBanner,
  alignmentResolverClass,
  textAlignmentClass,
  bannerIconStyles,
  closeIcon,
  hiddenDiv,
  customStyles,
  makeItLink
};
