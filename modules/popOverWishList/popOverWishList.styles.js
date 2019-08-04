import { css } from 'react-emotion';
import { sizes } from '../../utils/media';

const rightAlign = css`
  float: right;
`;
const popoverWidth = css`
  .css-1rjorz4 {
    @media only screen and (max-width: 576px) {
      width: 100%;
    }
    float: right;
    position: static;
  }
`;
const popoverModal = css`
  .css-1ebrjtl {
    margin-top: 1rem;
  }
  .css-bn4it8 {
    padding: 0px;
  }
  .css-x9mnr0:before, .css-x9mnr0:after {
    display: none;
    @media only screen and (min-width: 575px) {
      display: block;
    }
  }
`;
const popoverModalCreateList = css`
  .css-1ebrjtl {
    margin-top: 1rem;
    left: -25%;
  }
  .css-bn4it8 {
    padding: 0px;
  }
  .css-1rjorz4 {
    @media only screen and (max-width: 876px) {
      .css-x9mnr0:before, .css-x9mnr0:after {
        left: 80%;
      }
      .css-1d4xv11 {
        left: 30%;
      }
    }
    @media only screen and (min-width: ${sizes.lg}px) and (max-width: 1024px) {
      .css-x9mnr0:before, .css-x9mnr0:after {
        left: 73%;
      }
    }
  }
  }
`;
const iconStyle = css`
  font-size: 1rem;
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 0;
  border: none;
  box-shadow: none;
  background: white;
  outline: none;
  :active {
    outline: none;
    border: none;
    background-color: none;
  }
  :hover {
    background-color: none;
    outline: none;
  }
`;
const Btn = css`
  border: none;
  font-size: 0.825rem;
  white-space: nowrap;
  box-shadow: none;
  background: white;
  outline: none;
  cursor: pointer;
  :active {
    border: none;
    background-color: none;
  }
  :hover {
    background-color: none;
  }
  :focus {
    background-color: none;
  }
`;

const iconStyleSpan = css`
  border: none;
`;

const btnMinHeight = css`
  min-height: 2.5rem;
`;
const popStateModal = css`
  width: 18.75rem;
  @media only screen and (max-width: 576px) {
    width: 17rem;
  }
`;
const iconPlus = css`
  color: #0055a6;
`;
const focusText = css`
  cursor: pointer;
  :hover {
    text-decoration: underline;
    color: #0055a6;
  }
`;

const renameList = css`
  color: #0055a6;
  curser: pointer;
`;

const fullDivWidthInput = css`
  width: 100%;
  border-color: #c00000;
`;
const redColor = css`
  color: #c00000;
`;
const linkStyle = css`
  :hover {
    text-decoration: underline;
  }
`;
const createPopover = css`
  transform: translateX(-65%);
  @media only screen and (min-width: 1112px) {
    transform: translateX(-10%);
  }
`;
const renameListPopover = css`
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;

  @media only screen and (min-width: 575px) {
    position: relative;
    left: auto;
    right: auto;
  }
`;

export {
  popoverWidth,
  popoverModal,
  iconStyle,
  iconStyleSpan,
  rightAlign,
  Btn,
  focusText,
  btnMinHeight,
  popStateModal,
  popoverModalCreateList,
  iconPlus,
  renameList,
  fullDivWidthInput,
  redColor,
  linkStyle,
  createPopover,
  renameListPopover
};
