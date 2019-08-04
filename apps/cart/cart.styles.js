import { css } from 'react-emotion';

const cartBody = css`
  @media screen and (max-width: 576px) {
    padding: 0px;
    margin-left: 0;
    margin-right: 0;
    max-width: 100%;
    .cartHeaderLeft {
      padding: 0px;
    }
  }
`;

const cartHeaderRight = css`
  padding: 2.1875rem 0px 0px 0px;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const optionMobileView = css`
  display: none;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  @media screen and (max-width: 576px) {
    display: block;
    position: fixed;
    width: 100%;
    bottom: -5px;
    background: #fff;
    z-index: 1000;
  }
`;

const message = css`
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
  div {
    word-wrap: break-word;
  }
`;
// TODO - move this to vendor.css
const minHeight = css`
  height: calc(100vh - 452px);
  @media screen and (min-width: 768px) {
    height: calc(100vh - 365px);
  }
`;

export { cartBody, cartHeaderRight, optionMobileView, message, minHeight };
