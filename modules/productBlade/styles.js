import { css, keyframes } from 'react-emotion';
import { sizesMax } from './../../utils/media';

const hide = css`
  display: none !important;
`;

const displayBlock = css`
  display: block;
`;

const imageContainer = css`
  position: relative;
  display: inherit;
  .ofs {
    position: absolute;
    left: 0px;
  }
`;

const blade = css`
  background-color: #ffffff;
  border-radius: 4px;
  justify-content: space-around;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  @media screen and (max-width: 576px) {
    max-width: 100%;
  }
`;

// For giving padding in Tablet device.
const bladeBody = css`
  @media screen and (max-width: 768px) and (min-width: 576px) {
    padding-top: 20px !important;
  }
`;

const cssAnimation = keyframes`
  to {
    width: 0;
    height: 0;
    overflow: hidden;
    display: none;
    padding: 0;
  }
`;

const hideMsg = css`
  animation: ${cssAnimation} 0s ease-in 5s forwards;
  animation-fill-mode: forwards;
`;

const bladeErrMsg = css`
  display: block;
  > div {
    color: #ee0000;
    border-radius: 4px;
    background-color: rgba(224, 0, 0, 0.03);
    border: solid 1px #e30300;
    position: relative;
  }
`;

const oosWishlist = css`
  position: relative;
  top: 3px;
  .wishListTitle {
    color: #0055a6;
  }
  @media screen and (max-width: ${sizesMax.xsMax}px) {
    top: 0px;
    button + div[direction] {
      left: 100%;
      > div::after, 
      > div::before {
        left: 30%;
      }
    }
  }
`;

const options = css`
  float: right;
  > button {
    color: #0055a6;
  }
  @media screen and (max-width: ${sizesMax.mdMax}px) {
    float: none;
    display: block;
  }
`;

const msg = css`
  border-radius: 4px;
  background-color: rgba(0, 85, 166, 0.03);
  border: solid 1px #0055a6;
  position: relative;
  .undoBtn {
    color: #0056b3;
    cursor: pointer;
  }
  .closeBtn {
    color: #0055a6;
  }
  button {
    position: absolute;
    right: 15px;
    top: 14px;
    background: none;
    box-shadow: none;
    float: right;
    border: none;
    cursor: pointer;
  }
`;

const productDetails = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const thumbnail = css`
  img {
    object-fit: contain;
    position: relative;
    top: 5px;
    width: 3.125rem;
    max-height: 3.125rem;
  }
  cursor: pointer;
  @media screen and (max-width: 768px) {
    img {
      width: 3.125rem;
      max-height: 3.125rem;
    }
  }
  @media screen and (min-width: 864px) {
    img {
      width: 6.25rem;
      max-height: 6.25rem;
      max-width: 100%;
    }
  }
`;

const qtycontainer = css`
  position: relative;
`;

const qtyField = css`
  position: relative;
  width: 4.3125rem;
  height: 2.5625rem;
  text-align: center;
  border-radius: 4px;
  border: solid 1px #cccccc;
  /* For Firefox */
  -moz-appearance: textfield;
  /* Webkit browsers like Safari and Chrome */
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const loaderDesktop = css`
  @media screen and (max-width: 576px) {
    display: none;
  }
`;

const qtyMobile = css`
  width: 5.3125rem;
  height: 3rem;
  display: none;
  text-align: center;
  input {
    height: 2.2rem;
  }

  @media screen and (max-width: 576px) {
    display: flex;
    align-items: center;
  }
`;

const linkIcon = css`
  position: relative;
  top: 2px;
  :before {
    margin-left: 0rem !important;
    color: #0055a6 !important;
  }
`;

const links = css`
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  span:hover {
    color: #0055a6;
    text-decoration: underline;
  }
`;

const qtyAndLinks = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: space-between;
  @media screen and (max-width: 767px) {
    flex-direction: column-reverse;
  }
`;

const price = css`
  position: absolute;
  right: 0;
  bottom: 0;

  @media screen and (min-width: 524px) {
    right: 1rem;
  }

  @media screen and (min-width: 768px) {
    top: 0;
    bottom: auto;
  }

  @media screen and (min-width: 864px) {
    right: 2.5rem;
  }
`;

const discountedPrice = css`
  color: #ec1c24;
`;

const originalPrice = css`
  color: #767676;
  text-decoration: line-through;
  float: right;
`;

const promotionalMsg = css`
  color: #008800;
`;

const storeInfo = css`
  > span {
    display: block;
  }
  width: 200px;
`;

const bundleInfo = css`
  position: relative;
  background: #f6f6f6;
  .pull-right {
    float: right;
  }
  img {
    width: 50px;
    max-height: 50px;
  }
  .arrow-up {
    position: absolute;
    width: 0;
    height: 0;
    top: -12px;
    left: 100px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #f6f6f6;
  }
  @media screen and (max-width: 576px) {
    .attrib {
      display: block;
    }
    .arrow-up {
      left: 40px;
    }
  }
`;

const freeGiftTitle = css`
  color: #008800;
`;

const freeGiftPrice = css`
  text-align: right;
  .price {
    display: block;
  }
  .discount {
    color: #008800;
  }
`;

const overlay = css`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  z-index: 99;
`;

const modal = css`
  width: 100%;
  height: 100%;
  position: static;
  transform: none;
  margin: 0;
  background-color: #fff;
  overflow: auto;

  @media screen and (min-width: 768px) {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    margin-top: 70px;
    height: auto;
  }
`;

const changeLocationBtn = css`
  border: none;
  background: none;
  cursor: pointer;
  color: #0055a6;
  :hover {
    text-decoration: underline;
  }
`;

const storeName = css`
  display: block;
`;

const closeBtnModal = css`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  font-size: 22px;
  border: none;
  color: #585858;
  cursor: pointer;
`;

const unavailableModal = css`
  .header,
  .subHeader {
    display: block;
    text-align: center;
  }
  .item {
    border-bottom: 1px solid #9b9b9b;
  }
  .productInfo {
    img {
      max-height: 7rem;
      max-width: 100%;
      object-fit: contain;
    }
    .imageBlock,
    .productInfoBlock,
    .qtyInfo {
      display: inline-block;
      overflow: auto;
      span {
        vertical-align: top;
      }
    }
    .imageBlock {
      overflow: inherit;
    }
    .price {
      float: right;
    }
  }
  .submit {
    text-align: right;
  }
  @media screen and (max-width: ${sizesMax.mdMax}px) {
    .productInfo {
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  @media screen and (max-width: ${sizesMax.xsMax}px) {
    .submit {
      button {
        width: 100%;
      }
    }
  }
`;

const modalErrMsg = css`
  width: 100%;
  text-align: center;
  color: #ee0000;
  border-radius: 4px;
  background-color: rgba(224, 0, 0, 0.03);
  border: solid 1px #e30300;
`;

const rotateLoader = keyframes`
  0%{
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100%{
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`;

const tootipIcon = css`
  position: relative;
  top: 2px;
  font-size: 16px;
  margin: 0;
  padding: 0;
  background: transparent;
  color: #333;
  border: none;
`;

export const spinner = css`
  position: absolute;
  margin-left: 10px;
  margin-top: 10px;
  &::before {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    border: 3px solid #0055a6;
    border-bottom-color: #ccc;
    animation: ${rotateLoader} 1s infinite;
    animation-timing-function: cubic-bezier(0, 0, 1, 1);
  }
  @media screen and (max-width: 567px) {
    position: relative;
    margin-left: 10px;
    top: 10px;
  }
`;

const displayFlex = css`
  display: flex;
`;

const readMore = css`
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0px;
`;

const disclaimerMessaging = css`
  .hide {
    height: 40px;
    overflow: hidden;
  }
  p {
    border-top: 1px solid #ccc;
  }
  i {
    top: 2px;
    position: relative;
    color: #0055a6;
  }
`;

const selectStore = css`
  border: none;
  background: none;
  display: block;
  color: #0055a6;
  padding: 0px;
  margin-top: 4px;
`;

const closeBtnMob = css`
  @media screen and (max-width: 576px) {
    display: flex;
  }
`;

const clsBtn = css`
  background: #fff;
  background: none;
  float: right;
  border: none;
  height: 22px;
  width: 22px;
  color: #ee0000;
  cursor: pointer;
`;

const bladeActions = css`
  white-space: nowrap;
  .wishListPopoverChildren,
  .wishListWrapper {
    text-align: left;
  }
  .wishListTitle {
    padding-left: 0px;
    :hover {
      text-decoration: underline;
    }
  }
  .icon-list-view {
    font-size: 16px;
    color: #0055a6;
  }
`;

const discountContainer = css`
  color: #008800;
`;

const priceContainer = css`
  text-align: right;
`;

const qtyFiledCon = css`
  position: relative;
  @media screen and (max-width: 567px) {
    padding-left: 0px;
  }
`;

const radioButtonLabel = css`
  display: block;
  &:focus-within {
    outline: -webkit-focus-ring-color auto 5px;
  }
  @media screen and (max-width: 768px) {
    display: flex;
    > span {
      top: -1px;
    }
  }
  > label {
    margin-bottom: 0px;
  }
`;

const hideRadioBtn = css`
  label {
    ::after,
    ::before {
      display: none;
    }
  }
`;

const unavailableIcon = css`
  height: 0.875rem;
  width: 0.875rem;
  color: #9b9b9b;
  position: relative;
  top: 2px;
  :after {
    content: '';
    position: absolute;
    border-bottom: 1.5px solid #c00000;
    width: 1rem;
    transform: rotate(-45deg);
    -ms-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    top: 13px;
    left: 1px;
  }
`;

const shippingMode = css`
  margin-left: 12px;
`;

const productName = css`
  word-break: break-word;
`;

const displayInlineBlock = css`
  display: inline-block;
`;

const promoMessageMobile = css`
  display: block;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const promoMessage = css`
  display: none;
  @media screen and (min-width: 768px) {
    display: block;
  }
`;

export {
  displayBlock,
  changeLocationBtn,
  blade,
  bladeBody,
  oosWishlist,
  options,
  productDetails,
  thumbnail,
  price,
  qtyField,
  linkIcon,
  links,
  qtyAndLinks,
  discountedPrice,
  originalPrice,
  qtyMobile,
  bladeErrMsg,
  hideMsg,
  hide,
  msg,
  promotionalMsg,
  loaderDesktop,
  imageContainer,
  bundleInfo,
  freeGiftTitle,
  freeGiftPrice,
  overlay,
  modal,
  storeInfo,
  unavailableModal,
  modalErrMsg,
  closeBtnModal,
  storeName,
  qtycontainer,
  displayFlex,
  readMore,
  disclaimerMessaging,
  clsBtn,
  closeBtnMob,
  tootipIcon,
  bladeActions,
  discountContainer,
  priceContainer,
  qtyFiledCon,
  selectStore,
  radioButtonLabel,
  unavailableIcon,
  shippingMode,
  productName,
  displayInlineBlock,
  promoMessageMobile,
  promoMessage,
  hideRadioBtn
};
