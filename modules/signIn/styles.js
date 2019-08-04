import { css } from 'react-emotion';

export const clsBtn = css`
  background: #fff;
  border: none;
  height: 22px;
  width: 22px;
`;

export const inputBorder = css`
  border-radius: 4px;
  border: 1px solid rgba(150, 150, 150, 0.5);
  height: 40px;
`;

export const submit = css`
  @media screen and (max-width: 768px) {
    min-height: 40px;
  }
`;
export const invalid = css`
  border: solid 1px #c00000 !important;
  border-radius: 4px;
  height: 40px;
`;
export const errMsg = css`
  display: none;
`;

export const errorMsgDisp = css`
  font-size: 0.75rem;
  color: #ee0000;
`;
export const margin = css`
  margin: 0px;
`;
export const onHover = css`
  a {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
export const errorText = css`
  color: #ee0000;
`;
export const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

export const Btn = css`
  color: #0055a6;
  border: none;
  background: none;
  padding-left: 0;
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
`;
