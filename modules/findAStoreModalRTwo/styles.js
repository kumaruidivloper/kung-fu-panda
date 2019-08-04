import { css } from 'react-emotion';
import { sizes } from '../../utils/media';

const Color = {
  Blue: '#0055a6',
  Opaque: 'rgba(0, 0, 0, 0.4)',
  White: '#fff',
  Black: '#000',
  Green: '#008800',
  Red: '#cc0000',
  c_ccc: '#ccc',
  c_585858: '#585858',
  c_333: '#333',
  c_e8e8e8: '#e8e8e8',
  c_e6e6e6: '#e6e6e6',
  c_464646: '#464646',
  c_00bb11: '#00bb11'
};

const FontVarient = {
  Bold: 'bold',
  Normal: 'normal',
  SemiBold: '500',
  Light: '100'
};

const TypographyVariation = {
  T_14: '0.875rem',
  T_16: '1rem',
  T_20: '1.25rem',
  T_22: '1.375rem',
  T_32: '2rem',
  T_42: '2.625rem'
};

const FontFamily = {
  font_base: 'Mallory-Book',
  font_bold: 'Mallory-Bold',
  font_light: 'Mallory-Light',
  font_cond_black: 'Mallory-Condensed-Black',
  font_cond_medium: 'Mallory-Condensed-Medium',
  font_medium: 'Mallory-Medium'
};

const btn = css`
  padding: 12px 23px;
  // font: ${FontVarient.Bold} ${TypographyVariation.T_14} / ${TypographyVariation.T_20} 'Mallory-Book', 'Helvetica Neue', sans-serif;
  font-size: ${TypographyVariation.T_14};
  margin-top: 25px;
  border: 3px solid ${Color.Blue};
  background: ${Color.White};
  color: ${Color.Blue};
  min-height: auto;
  cursor: pointer;
  width: 90%;
  &:hover,
  &:active,
  &:focus {
    color: ${Color.White};
    background: ${Color.Blue};
  }
  @media screen and (min-width: 768px) {
    width: auto;  
  }
`;

export const container = css`
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;
  @media screen and (min-width: 768px) {
    margin-top: 48px;
    margin-bottom: 24px;
  }
`;

export const mapContainer = css`
  margin-top: 8px;
  position: relative;
  @media screen and (min-width: 768px) {
    margin-top: 24px;
  }
`;
export const OverLay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${Color.Opaque};
  overflow-y: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  z-index: 99;
`;

export const mainGoogleMap = css`
  height: 300px;
`;

export const closeSearchBtn = css`
  position: absolute;
  color: #333;
  right: 67px;
  top: 12px;
  &:hover {
    text-decoration: none;
  }
`;
export const Modal = css`
  color: ${Color.Black};
  background-color: ${Color.White};
  position: static;
  transform: none;
  margin: 0;
  padding: 50px 0 !important;

  @media screen and (min-width: 768px) {
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    margin-top: 70px;
    padding: 0 40px !important;
    position: absolute;
    left: 50%;
  }
`;

export const closebtn = css`
  font-size: ${TypographyVariation.T_22};
  color: ${Color.c_333};
  border: none;
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  cursor: pointer;
`;

export const clostestStoreText = css`
  color: ${Color.c_333};
  font-weight: ${FontVarient.Normal};
  margin-bottom: 20px;
`;
export const resultBg = css`
  background-color: ${Color.c_e8e8e8};
  width: 100%;
`;

export const headerStyle = css`
  text-align: center;
  font: ${TypographyVariation.T_32} ${FontFamily.font_cond_black};
  @media screen and (min-width: 768px) {
    font: ${TypographyVariation.T_42} ${FontFamily.font_cond_black};
  }
`;

export const resultBoxBg = css`
  background-color: ${Color.White};
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 16px 20px;
`;

export const inputclass = css`
  border-radius: 2rem;
  border: 0.5px solid ${Color.c_e6e6e6};
  padding: 11px 45px 10px 20px;
  color: ${Color.c_333};
  width: 100%;
  &:focus {
    border: 1px solid ${Color.Black};
    outline: none;
  }
  &:focus + a span.icon-search {
    background: #464646;
    color: ${Color.White};
    border-radius: 2.1875rem;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &::-ms-clear {
    display: none;
    width: 0;
    height: 0;
  }
  &:focus::-webkit-input-placeholder {
    color: transparent !important;
  }
  &:focus::-moz-placeholder {
    color: transparent !important;
  }
  &:focus:-moz-placeholder {
    color: transparent !important;
  }
`;

export const iconclass = css`
  position: absolute;
  color: ${Color.c_464646};
  text-align: center;
  right: 0;
  font-size: 21px;
  height: 100%;
  width: 57px;
  padding: 10px 0 11px 0;
`;

export const myStoreIcon = css`
  font-size: ${TypographyVariation.T_24};
  background-color: ${Color.c_00bb11};
  color: ${Color.White};
  border: 2px solid ${Color.Black};
  border-radius: 25px;
`;

export const storeLink = css`
  color: ${Color.Blue};
`;

export const storeBtn = css`
  ${btn};
`;

export const closeLinkBtn = css`
  ${btn};
`;

export const myStoreBtn = css`
  ${btn}
  color: ${Color.White};
  background: ${Color.Blue};
  padding: 12px 29px;
  margin-bottom:10px;
  font-family:${FontFamily.font_bold};
  &:hover, &:active,&:focus {
    background: ${Color.White};
    color: ${Color.Blue};
  }
  width:100%;
  @media screen and (min-width: 768px) {
    width: auto;
  }
`;

export const Days = css`
  font-family: ${FontFamily.font_bold};
`;
export const AvailableItem = css`
  color: ${Color.Green};
`;

export const NotAvailableItem = css`
  color: ${Color.Red};
`;

/** CSS re-write  */
export const searchContainer = css`
  top: 0;
  width: 100%;
`;

export const accordPanel = css`
  background-color: ${Color.White};
  padding: 21px 25px 21px;
  border-top: 0;
  min-height: auto;
  font-size: ${TypographyVariation.T_14};
  &:focus {
    outline: none;
  }
  @media screen and (min-width: 768px) {
    padding: 21px 25px;
  }
`;

export const accordWrapper = css`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  border-radius: 0;
  &:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }
  @media screen and (min-width: 768px) {
    margin-top: 10px;
    border-radius: 4px;
  }
`;
export const storeBodyStyle = css`
  padding: 0 25px;
`;

export const yourStoreWrapper = css`
  padding: 0px 0px;
  @media screen and (min-width: ${sizes.md}) {
    padding: 0px 25px;
  }
`;

export const storeTag = css`
  background: ${Color.Blue};
  color: ${Color.White};
  padding: 3px 14px;
  display: inline-block;
  font: 10px ${FontFamily.font_bold};
`;

export const detailsPanel = css`
  background: ${Color.White} !important;
  padding: 13px 0;
  border-top: 1px solid ${Color.c_ccc};
  margin-top: 15px;
  &:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }
  @media screen and (min-width: 768px) {
    border-top: 0;
    margin-top: 0;
  }
`;

export const drawerFocus = css`
  &:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }
`;

export const iconChat = css`
  color: ${Color.Blue};
  margin: 0 8px 12px 0;
`;

export const iconNav = css`
  color: ${Color.Blue};
  margin: 0 12px 0 2px;
`;

export const drivingDir = css`
  color: ${Color.c_333};
`;

export const storeAvailibility = css`
  color: ${Color.Green};
`;

export const inventroyRow = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
`;
export const inventroyThumb = css`
  width: 50px;
  height: 50px;
  border: 1px solid ${Color.c_ccc};
  margin: 14px 14px 3px 0;
  position: relative;
  img {
    width: 100%;
    height: auto;
  }
`;

export const inventoryLabels = css`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

export const distanceDiv = css`
  text-align: right;
  min-width: 80px;
`;
