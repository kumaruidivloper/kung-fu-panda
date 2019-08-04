import { css } from 'react-emotion';

const bgNone = css`
  background-color: #ffffff;
  border: none;
`;

const invalidInput = css`
  border: solid 1px #ee0000;
`;

const errMsg = css`
  display: none;
`;

const blueIcon = css`
  color: #0055a6;
`;
const errorWrapper = css`
 border-radius: 4px;
 border: solid 1px #e30300;
 background-color: rgba(224, 0, 0, 0.03);
`;
const invalid = css`
  border: solid 1px #ee0000;
  border-radius: 4px;
  height: 40px;
`;
const errorMsgDisp = css`
  font-size: 0.75rem;
  color: #ee0000;
`;
const inputBorder = css`
border-radius: 4px;
border : 1px solid rgba(150,150,150,0.5);
height: 40px;
`;

export { invalidInput, bgNone, errMsg, blueIcon, errorWrapper, errorMsgDisp, invalid, inputBorder };
