import styled, { css } from 'react-emotion';

export const letterSpacing = css`
  letter-spacing: 0;
`;

export const breakWord = css`
  word-wrap: break-word;
`;

export const OverLay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  overflow: scroll;
`;

export const Modal = css`
  box-sizing: border-box;
  position: absolute;
  left: 23%;
  right: 23%;
  margin-top: 10%;
  margin-bottom: 10%;
  width: 56%;
  overflow: auto;
  background-color: #fff;

  @media screen and (max-width: 767px) {
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export const modalBox = css`
  padding: 10.74% 8.4% 0;
`;

export const CloseButton = styled('button')`
  position: absolute;
  right: 17px;
  top: 17px;
  height: 22px;
  width: 22px;
  padding: 0;
  border: 0;
  border-color: transparent;
  background-color: white;
  color: #585858;
  line-height: 0;
  cursor: pointer;
`;

export const CloseIcon = styled('span')`
  font-size: 1.33rem;
`;

export const mbtm15 = css`
  margin-bottom: 15px;
  @media screen and (max-width: 767px) {
    margin-bottom: 3px;
  }
`;

export const mbtm35 = css`
  margin-bottom: 35px;
`;

export const invalid = css`
  border: solid 1px #ee0000;
`;

export const errMsg = css`
  display: none;
`;

export const errorMsgDisp = css`
  font-size: 0.75rem;
  color: #ee0000;
`;

export const submit = css`
  width: 60%;
  height: 70px;
  margin: 45px 20% 60px;
  color: #ffffff;
  border-radius: 40px;

  @media screen and (max-width: 767px) {
    width: 100%;
    min-height: 40px;
    height: 40px;
    line-height: 0px;
    margin: 30px 0;
  }
`;

export const setSvg = css`
  padding: 130px 0 40px;
  justify-content: center;

  @media screen and (max-width: 767px) {
    padding: 145px 0 20px;
  }
`;

export const svgStatus = css`
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

export const set = css`
  text-transform: uppercase;
  letter-spacing: 0;
`;

export const deal = css`
  margin-bottom: 130px;

  @media screen and (max-width: 767px) {
    margin-bottom: 145px;
  }
`;

export const placeholder = css`
  text-align: left;
  padding: 10px 16px;
  color: rgba(0, 0, 0, 0.6);
`;
