import { css } from 'react-emotion';
const rowStyle = css`
  box-shadow: 0 0.25rem 0.75rem 0 rgba(0, 0, 0, 0.08), 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.04), 0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.12);
  @media screen and (max-width: 576px) {
    max-width: 100%;
  }
`;
const heading = css`
  font-size: 2rem;
  letter-spacing: 0;
  line-height: 2rem;
`;
const orderSummary = css`
  width: 100%;
`;
const orderTextStyle = css`
  margin-left: 2.5rem;
`;
const tableColStyle = css`
  position: inherit;
`;
const totalComponent = css`
  display: flex;
  justify-content: space-between;
  margin-right: 2.375rem;
  margin-bottom: 2rem;
`;
const promoDiv = css`
  color: #008800;
`;
const divider = css`
  border: none;
  border-top: thin solid #cccccc;
  margin: 0px;
`;

const overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

const modal = css`
  box-sizing: border-box;
  position: relative;
  width: 540px;
  overflow: auto;
  background-color: #fff;

  @media screen and (max-width: 576px) {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const shippingModalOption = css`
  display: block;
  text-align: center;
`;

const zipcodeBtn = css`
  background: none;
  border: none;
  color: #0055a6;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const clsBtn = css`
  background: #fff;
  border: none;
  cursor: pointer;
  i {
    font-size: 22px;
  }
`;

const errMsg = css`
  color: red;
`;

const displayBlock = css`
  display: block;
`;

const calcShippingBtn = css`
  min-width: 160px;
`;

const disableClicks = css`
  pointer-events: none;
`;

export { errMsg, clsBtn, overlay, modal, zipcodeBtn, shippingModalOption, rowStyle, orderTextStyle, tableColStyle, orderSummary, totalComponent, promoDiv, divider, displayBlock, calcShippingBtn, heading, disableClicks };
