import { css } from 'react-emotion';

const normalizeStyles = css`
  * :focus {
    outline: none !important;
  }
  a,
  button {
    cursor: pointer;
  }
  button {
    &:focus {
      outline: 1px dotted #333 !important;
    }
  }
  ul,
  li,
  ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  button,
  input {
    border-radius: 0;
    border: 0;
    box-shadow: none;
    background: transparent;
    padding: 0;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  .border-bottom-blue {
    border-bottom: 3px solid #0556a4;
  }
  .text-decoration-none {
    text-decoration: none !important;
  }
  .box-shadow {
    box-shadow: 0 0.5px 1.5px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.04), 0 0 1px 0 rgba(0, 0, 0, 0.1);
  }
  .h-100 {
    height: 100%;
  }
  .word-break {
    word-break: break-word;
  }
  .mh-62 {
    min-height: 62px;
  }
  .box-shadow-inset {
    box-shadow: 1px 0 0 0 #ccc, 0 1px 0 0 #ccc, 1px 1px 0 0 #ccc, 0px 0 0 0 #ccc inset, 0 1px 0 0 #ccc inset;
  }
  .margin-18 {
    margin: 0 -18px;
  }
  .padding-18 {
    padding: 0 18px;
  }
  .font-16 a {
    font-size: 16px !important;
  }
  .font-12 {
    font-size: 12px !important;
  }
  .c-0055a6 {
    color: #0055a6 !important;
  }
  .expand-search-button span {
    font-size: 1.3rem;
    color: #585858;
    vertical-align: middle;
  }
  .column-right-absolute {
    position: absolute;
    top: 0;
    background: #fff;
    min-width: 800px;
    left: 250px;
  }
  .mh-230 {
    min-height: 230px;
  }
  .mh-180 {
    min-height: 180px;
  }
  .mh-90 {
    min-height: 90px;
  }
  .mh-152 {
    min-height: 152px;
  }
  .mh-82 {
    min-height: 82px;
  }
  .bg-none {
    background: none !important;
  }
  .mh-80 {
    min-height: 80px;
  }
  .linkClass {
    a {
      color: #333333;
    }
    &:hover {
      color: #0055a6 !important;
    }
  }
`;

const mediaQueries = css`
  @media (max-width: 1023px) {
    .desktop-layout {
      display: none;
    }
    .mobile-layout {
      display: block;
    }
  }
  @media (min-width: 1024px) {
    .desktop-layout {
      display: block;
    }
    .mobile-layout {
      display: none;
    }
    a:hover,
    a:focus {
      text-decoration: underline;
    }
  }
  @media (max-width: 1065px) {
    .desktop-layout {
      .column-left {
        margin-right: 30px;
      }
      .container-1052 {
        padding-right: 12px;
        padding-left: 12px;
      }
      .column-right-absolute {
        min-width: 772px;
        left: 230px;
      }
    }
  }
`;
const MiniCartStyles = css`
  .mini-cart {
    &:hover {
      text-decoration: none;
      outline: none !important;
    }
    span {
      font-size: 1.5rem;
      color: #585858;
      &.mini-cart-count {
        width: 19px;
        height: 19px;
        display: inline-block;
        position: absolute;
        top: -7px;
        right: -6px;
        color: #fff !important;
        text-align: center;
        line-height: 19px;
        font-size: 9px !important;
        background: #e00;
        border-radius: 50%;
        &.mini-cart-error {
          width: 14px;
          height: 14px;
          top: -5px;
          right: -3px;
        }
      }
    }
  }
`;
const MegaMenuFlyOutStyles = css`
  .mega-menu-flyout {
    width: 100%;
    top: 100%;
    left: 0;
    background: #fff;
    z-index: 15;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.1), 1px 2px 2px 0 rgba(0, 0, 0, 0.04), 1px 0 2px 0 rgba(0, 0, 0, 0.1);
    & .column-left a {
      border-left: 3px solid #fff;
      padding-left: 14px;
      &.active {
        border-left: 3px solid #0556a4;
        text-decoration: none !important;
      }
    }
    & .column-right-absolute a {
      border-left: 0;
      padding-left: 0;
      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
    & .trending-container a img {
      max-width: 190px;
      max-height: 128px;
    }
    & .category-deals-container img {
      max-width: 150px;
      max-height: 150px;
    }
  }
`;
const searchStyles = css`
  .search-bar-container {
    @keyframes animateBG {
      from {
        background-color: #fff;
      }
      to {
        background-color: rgb(88, 88, 88);
      }
    }
    border: 1px solid #e6e6e6;
    border-radius: 25.5px;
    background-color: #f6f6f6;
    min-width: 335px;
    margin-left: 8px;
    &.focused {
      border: 1px solid #333;
      & .search-submit {
        background-color: rgb(88, 88, 88);
        animation-name: animateBG;
        animation-duration: 0.5s;
        animation-iteration-count: 1;
        span {
          color: #fff;
        }
      }
    }
    & input {
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
      padding: 8px 15px;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
    & .search-button {
      text-align: center;
      padding: 4px 13px 7px;
      &.search-submit {
        border-radius: 0;
        border-top-right-radius: 25.5px;
        border-bottom-right-radius: 25.5px;
      }
      &.search-clear {
        padding-right: 8px;
        span {
          font-size: 12px;
        }
      }
      span {
        color: #585858;
        font-size: 16px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    & .search-term-wrap {
      word-wrap: break-word;
    }
    & .search-flyout {
      position: absolute;
      top: 100%;
      width: 100%;
      z-index: 5;
      a {
        color: #767676;
      }
      &.search-small-flyout {
        margin-top: 13px;
        padding: 15px;
        background: #fff;
        box-shadow: 0 0.5px 1.5px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.04), 0 0 0px 0 rgba(0, 0, 0, 0.1);
      }
      &.search-mega-flyout {
        left: 0;
        & .search-left-column {
          width: 500px;
        }
        & .search-right-column {
          width: 374px;
          padding: 0 28px;
          margin-left: 26px;
        }
        & .search-visual-guided-suggestions {
          li {
            width: 148px;
            height: 175px;
            overflow: hidden;
            a:focus {
              outline: 1px dotted #333 !important;
            }
            img {
              max-width: 80px;
              max-height: 80px;
            }
            figcaption {
              text-align: left;
              height: 40px;
              overflow: hidden;
              display: flex;
              align-items: center;
              &.search-price {
                > div {
                  div:last-child {
                    display: none;
                  }
                  div.c-price-compare,
                  div.c-price-in-cart {
                    display: block;
                  }
                }
              }
              &.hasSalePrice {
                & .c-price__sub {
                  & * {
                    color: #ee0000;
                  }
                }
              }
              .c-price__sub {
                & * {
                  font-family: Mallory-Condensed-Black !important;
                }
                font-size: 18px;
                line-height: inherit;
                .c-price__super {
                  top: -1px;
                  font-size: 11px;
                }
              }
              .c-price-in-cart {
                font-size: 14px !important;
                margin-bottom: 2px !important;
                line-height: inherit;
                > div {
                  display: none;
                }
              }
              .c-price-compare {
                font-size: 11px !important;
                margin-bottom: 0 !important;
                line-height: inherit;
              }
              .list-price {
                * {
                  color: #757575 !important;
                  font-family: Mallory-Condensed-Medium !important;
                }
              }
            }
          }
        }
      }
    }
  }
`;
const findStoreStyles = css`
  position: relative;
  .icon-text {
    color: #333333;
  }
  &:focus span {
    text-decoration: underline !important;
    &.academyicon {
      text-decoration: none !important;
    }
  }
  .icon-location-pin,
  .change-text {
    color: #0055a6 !important;
  }
  &:hover + span.mystore-name-hover {
    display: none !important;
  }
  & .find-store-hover {
    &:hover,
    &:focus {
      text-decoration: underline !important;
      color: #0055a6 !important;
    }
    &:hover + span.change-store {
      display: flex;
      text-decoration: none !important;
    }
  }
  & .change-store {
    display: none;
    padding-left: 0.625rem;
    position: absolute;
    background: #fff;
    left: 0px;
    padding-right: 150px;
    .academyicon {
      color: #0055a6 !important;
      padding-top: 2px;
    }
    &:hover {
      display: flex;
      .change-text {
        text-decoration: underline !important;
        color: #0055a6 !important;
      }
    }
    &.academyicon:hover {
      display: flex;
    }
  }
`;
const desktopStyles = css`
  .desktop-layout {
    height: 100px;
    background-color: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
    ${MiniCartStyles};
    ${MegaMenuFlyOutStyles};
    & .container-1052 {
      max-width: 1052px;
      margin: 0 auto;
      height: inherit;
      padding: 14px 0;
    }
    & .column-left {
      min-width: 200px;
      max-width: 200px;
      margin-right: 51px;
    }
    & .top-nav * {
      color: #333333;
      line-height: 1.33;
    }
    & .bottom-nav {
      & .menu-items .level1-items {
        margin-right: 57px;
      }
      & .mini-cart {
        // margin-left: 30px;
      }
      & .brand-logo a {
        outline: none !important;
      }
      & .brand-img {
        max-width: 70px;
        max-height: 70px;
      }
      & .active {
        color: #0556a4;
      }
      & .daily-deals {
        :hover {
          text-decoration: none;
        }
        img {
          max-width: 75px;
          max-height: 75px;
        }
        p {
          height: 72px;
          overflow: hidden;
        }
        .c-price__sub {
          & * {
            font-size: 2rem;
          }
          & sup {
            font-size: 0.875rem;
          }
        }
        & .list-price {
          * {
            font-size: 1.5rem;
            font-family: 'Mallory-Condensed-Medium';
          }
          sup {
            font-size: 0.6rem;
          }
        }
      }
    }
    ${searchStyles};
    & .top-nav .account-popover {
      position: absolute;
      top: 100%;
      left: -100%;
      margin-top: 1rem;
      z-index: 2;
      display: block;
      width: 190px;
      word-wrap: break-word;
      background-color: #fff;
      filter: drop-shadow(0 0 6px rgba(51, 51, 51, 0.4));
      & .arrow {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 10px 10px;
        border-color: transparent transparent rgba(255, 255, 255, 0.9) transparent;
        position: absolute;
        top: -0.6em;
        margin-left: -1.5rem;
        left: 70%;
      }
      ul.myAccLinks li {
        cursor: pointer;
      }
      ul.myAccLinks li a {
        display: block;
        padding: 3px 0;
      }
    }
  }
`;

const mobileStyles = css`
  .mobile-layout {
    padding-top: 82px;
    &.pt-135 {
      padding-top: 135px;
    }
    ${searchStyles} ${MiniCartStyles} 
    .search-mega-flyout .search-left-column {
      display: none !important;
    }
    .search-bar-container.position-relative {
      position: static !important;
      & .search-small-flyout {
        margin-top: 0;
        left: 0;
        padding: 20px !important;
      }
    }
    .search-mega-flyout .search-right-column {
      width: 100% !important;
      padding: 0 !important;
      margin-left: 0 !important;
    }
    .search-bar-container {
      width: 100% !important;
      margin: 0;
      min-width: 100% !important;
    }
    .search-wrapper {
      margin: 0 20px 0 0;
      .search-button {
        outline: none;
        cursor: pointer;
        .icon-search {
          height: 24px;
          width: 24px;
          display: block;
          font-size: 24px;
          padding-top: 5px;
        }
      }
    }
    .container-1052 {
      padding: 20px 0 !important;
      & .addBorder {
        ul {
          padding: 0 24px !important;
          &:nth-child(2),
          &:nth-child(3) {
            border-top: 1px solid #e6e6e6;
            margin-top: 10px;
          }
        }
      }
    }
    .fixed-container {
      position: fixed;
      right: 0;
      top: 0;
      left: 0;
      width: 100%;
      min-height: 82px;
      z-index: 12;
      & .menu-icon span {
        color: #585858;
        font-size: 14px;
        vertical-align: middle;
      }
      & .mini-cart span {
        vertical-align: middle;
      }
      & .brand-logo {
        max-width: 150px;
        & a {
          outline: none !important;
        }
      }
    }
    .search-flyout {
      background: #fff;
      display: block;
    }
    .menu-icon {
      padding: 1rem;
      margin-left: -1rem;
    }
  }
`;
const backdrop = css`
  position: fixed;
  top: 0;
  left: 0px;
  right: 0px;
  bottom: 0px;
`;
const ModalStyles = {
  backdrop: css`
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 14;
    ${backdrop};
  `,
  transparentBackdrop: css`
    background: none !important;
    z-index: 0 !important;
    ${backdrop};
  `,
  container: css`
    position: absolute;
    background: #fff;
    height: 100%;
    border: 0;
    box-shadow: none;
    border-right: 1px solid #ccc;
    transition: transform 0.5s;
    width: 85%;
    margin-right: auto;
    overflow-y: scroll;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    z-index: 14;
    padding-bottom: 20px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    & a {
      text-decoration: none !important;
    }
    &.l0-modal {
      transform: translateX(-100%);
      will-change: transform;
      opacity: 0;
    }
    &.l0-modal.ReactModal__Content--after-open {
      transform: translateX(0%);
      z-index: 16;
      opacity: 1;
    }
    &.l0-modal.ReactModal__Content--before-close {
      transform: translateX(-100%);
      opacity: 0;
      z-index: 0;
    }
    & .mobile-open-hours,
    .mystore-name-hover {
      position: relative !important;
      margin: 0 !important;
      padding-left: 38px !important;
      margin-top: -18px !important;
      padding-bottom: 1rem;
    }
  `
};

ModalStyles.mobileContainer = css`
  ${ModalStyles.container};
  overflow: hidden;
  padding: 0;
`;

ModalStyles.scrollable = css`
  height: 100%;
  padding-bottom: 20px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;

const screenReaderStyles = {
  default: css`
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    width: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    &skip {
      display: block;
      &:focus {
        position: relative;
        margin-bottom: 20px;
      }
    }
    &:focus {
      clip: auto;
      height: auto;
      overflow: visible;
      position: static;
      white-space: normal;
      width: auto;
    }
  `,
  hidden: css`
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    width: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
  `
};
const bodyOverrides = css`
  overflow: hidden;
  .search-flyout {
    position: fixed !important;
    top: 135px !important;
    left: 0 !important;
    right: 0 !important;
    height: 100% !important;
    z-index: 5;
  }
  .mobile-layout .search-flyout .container-1052 {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 100%;
    overflow-y: scroll;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    z-index: 5;
    padding-bottom: 300px !important;
  }
`;

const accountlist = css`
  border-left: 3px solid transparent;
  &:hover {
    border-left: 3px solid rgb(5, 86, 164);
    background-color: rgb(5, 86, 164, 0.3);
  }
`;
const menuActive = css`
  border-left: 3px solid rgb(5, 86, 164);
  > a {
    color: #0055a6 !important;
  }
`;

const selectedStore = css`
  position: ablosute;
  margin-left: 1rem;
  @media (min-width: 1112px) {
    margin-left: 0.625rem;
  }
`;
const Styles = css`
  ${normalizeStyles}
  ${desktopStyles}
  ${mobileStyles}
  ${mediaQueries}
`;
const disableClicks = css`
  pointer-events: none;
`;
export {
  Styles,
  normalizeStyles,
  ModalStyles,
  findStoreStyles,
  screenReaderStyles,
  bodyOverrides,
  accountlist,
  menuActive,
  selectedStore,
  disableClicks
};
