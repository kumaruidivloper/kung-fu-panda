import { css } from 'react-emotion';

export const card = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;
export const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

export const errMsg = css`
  display: none;
`;

export const errorMsgDisp = css`
  font-size: 0.75rem;
  color: #ee0000;
`;
export const inputBorder = css`
  border-radius: 4px;
  border: 1px solid rgba(150, 150, 150, 0.5);
  height: 40px;
`;
export const invalid = css`
  border: 1px solid #c00000 !important;
  border-radius: 4px;
  height: 40px;
`;
export const buttonHover = css`
  min-height: 40px !important;
  height: 40px !imporatnt;
  padding: 0 !important;
  white-space: nowrap;
  outline: none;
`;
