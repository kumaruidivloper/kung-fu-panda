import { css } from 'react-emotion';

const btnStyles = css`
  button {
    border: 0;
    box-shadow: 0;
    outline: none;
    padding: 0;
    margin: 0;
    &:focus {
      outline: 0.5px dotted #333;
    }
    &.a-close-icon span {
      color: #585858;
    }
  }
`;
const ModalStyles = {
  backdrop: css`
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 14;
    position: fixed;
    top: 0;
    left: 0px;
    right: 0px;
    bottom: 0px;
    overflow-y: scroll;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    @media (max-width: 820px) {
      background-color: #fff;
    }
  `,
  container: css`
    background: #fff;
    position: absolute;
    top: 14%;
    left: 33%;
    right: 33%;
    overflow: hidden;
    width: 400px;
    background: #fff;
    min-height: 200px;
    @media (max-width: 820px) {
      width: 100%;
      left: 0;
      right: 0;
      top: 0;
    }
  `
};
const fasSearchStyles = css`
  .fas-form-container {
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
    &.focused {
      border: 1px solid #333;
      & .fas-search-submit {
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
      border: 0;
      box-shadow: none;
      background: none;
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
    & .fas-search-button {
      border: 0;
      box-shadow: none;
      background: none;
      text-align: center;
      padding: 4px 13px 7px;
      &.fas-search-submit {
        border-radius: 0;
        border-top-right-radius: 25.5px;
        border-bottom-right-radius: 25.5px;
      }
      &.fas-search-clear {
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
  }
  .selected-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    color: #fff;
    background: #0b1;
    border-radius: 100%;
    font-size: 10px;
    line-height: 14px;
    vertical-align: middle;
    padding: 3px;
    &.bg-red {
      background: #d60000;
    }
    &.mini-icon {
      width: 14px;
      height: 14px;
      line-height: 12px;
      font-size: 7px;
      margin-right: 3px;
      padding: 1px 2px;
    }
  }
  .c-0556a4 {
    color: #0556a4;
  }
  .lds-ring {
    position: relative;
    width: 40px;
    height: 40px;
    margin: 0 auto;
    margin-top: 10px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 30px;
    height: 30px;
    margin: 6px;
    border: 2px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #0055a6 transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const resultBg = css`
  .bg-grey {
    background-color: #e8e8e8;
    width: 100%;
  }
`;
const makeStoreBtn = css`
  .make-store-btn {
    button {
      min-height: 0;
      padding: 0.5rem 0;
      font-size: 12px;
      min-width: 100%;
    }
    &.see-more-stores {
      margin-bottom: -1rem;
      button {
        border: 1px solid #0055a6;
        color: #0055a6;
      }
    }
  }
`;
const fasStyles = css`
  ${btnStyles};
  ${fasSearchStyles};
  ${resultBg};
  ${makeStoreBtn};
`;

export { fasStyles, ModalStyles };
